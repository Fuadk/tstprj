

import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {  templateDetail , componentConfigDef } from '@modeldir/model';

const createFormGroup = (dataItem:any) => new FormGroup({
  // must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen wont work
  'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME  , Validators.required) ,
  'WO_TYPE' : new FormControl(dataItem.ORDER_TYPE , Validators.required) ,
  'SEQUENCE_NAME' : new FormControl(dataItem.SEQUENCE_NAME ) ,
  'TEMPLATE_ORDER' : new FormControl(dataItem.TEMPLATE_ORDER ) ,
  'DEPENDANT_ORDER_TYPE' : new FormControl(dataItem.DEPENDANT_ORDER_TYPE ) ,
  'DIV' : new FormControl(dataItem.DIVS ) ,
  'DEPT' : new FormControl(dataItem.DEPT ) ,
  'ASSIGNEE_TYPE' : new FormControl(dataItem.ASSIGNEE_TYPE ) ,
  'ASSIGNEE' : new FormControl(dataItem.ASSIGNEE ) ,
  'DURATION' : new FormControl(dataItem.DURATION ) ,
  'FORM_PAGES_NO' : new FormControl(dataItem.FORM_PAGES_NO ) ,
  'APPROVE_SEQ' : new FormControl(dataItem.APPROVE_SEQ ) ,
  'REJECT_SEQ' : new FormControl(dataItem.REJECT_SEQ ) ,
  'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
  'LOGNAME' : new FormControl(dataItem.LOGNAME )
});



const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1:any):any;


@Component({
  selector: 'app-dsp-template-detail',
  templateUrl: './dsp-template-detail.component.html',
  styleUrls: ['./dsp-template-detail.component.css'
//  , './pdf-styles.css'
],
  
  styles: [
    `.button-notification {
          padding: 10px 5px;
          font-size: 1em;
          color: #313536;
      }
      .kendo-pdf-export {
        font-family: "DejaVu Sans", "Arial", sans-serif;
        font-size: 12px;
      }
      `
    ]
})

export class DspTemplateDetailComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid!: GridComponent;
 
 //@Input()    
 public showToolBar = true;
  
  public groups: GroupDescriptor[] = [];
  public view!: any[];
  public formGroup!: FormGroup; 
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public isChild: boolean  = false;
  
  public  istemplateDetailEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;
  
  private masterKey ="";
  public masterKeyName ="TEMPLATE_NAME";

  private insertCMD = "INSERT_DSP_TEMPLATE_DETAIL";
  private updateCMD = "UPDATE_DSP_TEMPLATE_DETAIL";
  private deleteCMD =   "DELETE_DSP_TEMPLATE_DETAIL";
  private getCMD = "GET_DSP_TEMPLATE_DETAIL_QUERY";

  public  executeQueryresult:any;
  public title = "Template details";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public gridHeight = 500;
  public paramConfig;


  private Body:any =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices, private renderer: Renderer2) { 
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    
    this.starServices.fetchLookups(this, this.lookupArrDef);
  }
    public ngOnDestroy(): void {
        this.docClickSubscription();
    }
//Next part for filtering
   public state: State = {
  };
  
    public dataStateChange(state: DataStateChangeEvent): void {
      if (this.paramConfig.DEBUG_FLAG) console.log("dataStateChange");
      this.state = state;
      var out = process(this.executeQueryresult.data , this.state);
      if (this.paramConfig.DEBUG_FLAG) console.log(out);
      this.grid.data = out;
      if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
  }

  /*
  @Input() public set triggersaveChanges_Input(masterSaved: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("in triggersaveChanges_Input: " + masterSaved);
    if ( masterSaved != null)
      this.saveChanges(this.grid);
  }
  */
  @Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.TEMPLATE_NAME :' + grid.TEMPLATE_NAME);
    if (grid.TEMPLATE_NAME != "")
    {
      
      this.masterKey = grid.TEMPLATE_NAME ;
      //this.istemplateDetailEnable = false;
      this.isSearch = true;
      this.executeQuery(grid);
      this.isChild = true;
      //this.showToolBar = false;
    }
    else
    {
      
      if (typeof this.grid != "undefined")
      {
        
        //this.isChild = false;
        this.grid.data = [];
        this.masterKey = "";
        this.istemplateDetailEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues:any = new templateDetail();   

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
    if (this.paramConfig.DEBUG_FLAG) console.log('this.Body : '  + JSON.stringify(this.Body));
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
        this.saveCurrent();
    }
  }
  

  public addHandler(): void {
      if (this.isChild == true){
      if (this.masterKey == ""){
        this.starServices.showOkMsg(this,this.starServices.saveMasterMsg,"Error");
        return;
      }
    }
    this.saveCurrent();
    this.gridInitialValues.TEMPLATE_NAME = this.masterKey;
        this.closeEditor();
        this.formGroup = createFormGroup(
          this.gridInitialValues
        );
      this.isNew = true;
      this.grid.addRow(this.formGroup);
  }

 public cellClickHandler( event:any ): void {
    if (event.isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }
    if (this.isNew) {
        event.rowIndex += 1;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(event.dataItem);
    this.editedRowIndex = event.rowIndex;
    this.grid.editRow(event.rowIndex, this.formGroup);
}


  public enterQuery (grid : any): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : any): void{
    if (this.paramConfig.DEBUG_FLAG) console.log ('executeQuery grid:');
    if (this.paramConfig.DEBUG_FLAG) console.log (grid);
    this.starServices.executeQuery_grid( grid,this);
  } 
  
  public saveChanges(grid: any): void {
    this.starServices.saveChanges_grid( grid,this);
  }

  public cancelHandler(): void {
    this.starServices.cancelHandler_grid( this);
  }

  private closeEditor(): void {
    this.starServices.closeEditor_grid( this);
  }

  private saveCurrent(): void {
    this.starServices.saveCurrent_grid( this);
  }

  public removeHandler(sender:any ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
        this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      if ( ComponentConfig.showToolBar != null)
        this.showToolBar = ComponentConfig.showToolBar;
      if ( ComponentConfig.masterSaved != null)
      {
        this.saveChanges(this.grid);
        ComponentConfig.masterSaved  =null;
      }
    }

  }

  public userLang = "EN" ; 
  public lookupArrDef:any =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrWO_TYPE"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrDEPT"},
    {"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrDIV"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrASSIGNEE_TYPE"},
        {"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS  FROM ADM_TEAM  ",
        "lkpArrName":"lkpArrASSIGNEE_TEAMS"},
    {"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS FROM ADM_USER_INFORMATION  ",
        "lkpArrName":"lkpArrASSIGNEE_PERSON"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='EXCH_SYST' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
        "lkpArrName":"lkpArrASSIGNEE_NETWORK"},  
      ];
  
  public lkpArrWO_TYPE = [];
  
  
  public lkpArrDEPT = [];
  public lkpArrDIV = [];
  public lkpArrASSIGNEE_TYPE = [];
  
  public lkpArrASSIGNEE_TEAMS = [];
 public lkpArrASSIGNEE_PERSON = [];
  public lkpArrASSIGNEE_NETWORK = [];

  
  
  public lkpArrGetWO_TYPE(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrWO_TYPE.find((x:any) => x.CODE === CODE);
  return rec;
  }

  public lkpArrGetDEPT(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrDEPT.find((x:any) => x.CODE === CODE);
  return rec;
  }
  public lkpArrGetDIV(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrDIV.find((x:any) => x.CODE === CODE);
    return rec;
    }
    
  public lkpArrGetASSIGNEE_TYPE(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrASSIGNEE_TYPE.find((x:any) => x.CODE === CODE);
  return rec;
  }
  
  public lkpArrGetASSIGNEE(CODE: any, TYPE_NAME: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    if (TYPE_NAME == "TEAM")
      var rec = this.lkpArrASSIGNEE_TEAMS.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "PERSON")
      var rec = this.lkpArrASSIGNEE_PERSON.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "NETWORK")
      var rec = this.lkpArrASSIGNEE_NETWORK.find((x:any) => x.CODE === CODE);

      return rec;
    }

  
  public valueChangeDEPT(value: any): void {
    /*if (this.paramConfig.DEBUG_FLAG) console.log("in valueChangeDEPT");
    if (this.paramConfig.DEBUG_FLAG) console.log(value);

    this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'   and CODEVALUE_LANG = '" + value + "' order by CODETEXT_LANG ",
      "lkpArrName":"lkpArrDIV"}];
     this.starServices.fetchLookups(this, this.lookupArrDef);
    */
  }
  public getlkpArrDIV() {
    var newlkpArrDIV =[];
    var recVal = this.formGroup.value;
    var DEPT = recVal.DEPT;
    for(var i=0;i< this.lkpArrDIV.length; i++){
      if (this.lkpArrDIV[i].CODEVALUE_LANG == DEPT)
        newlkpArrDIV.push(this.lkpArrDIV[i])
    }
    return newlkpArrDIV;
  }
  public getlkpArrASSIGNEE(){
    var newlkpArrASSIGNEE =[];
    var recVal = this.formGroup.value;
    var ASSIGNEE_TYPE = recVal.ASSIGNEE_TYPE;
    var team = this.paramConfig.USER_INFO.TEAM;

    if (ASSIGNEE_TYPE == "TEAM"){
      var DEPT = recVal.DEPT;
      var DIV = recVal.DIVS;
      for(var i=0;i< this.lkpArrASSIGNEE_TEAMS.length; i++){
        //if ( (this.lkpArrASSIGNEE_TEAMS[i].DEPT == DEPT) && (this.lkpArrASSIGNEE_TEAMS[i].DIV == DIV) )
        newlkpArrASSIGNEE.push(this.lkpArrASSIGNEE_TEAMS[i])
      }
    }
    else if (ASSIGNEE_TYPE == "PERSON")
    {
      var DEPT = recVal.DEPT;
      var DIV = recVal.DIVS;
      for(var i=0;i< this.lkpArrASSIGNEE_PERSON.length; i++){
        if ( (this.lkpArrASSIGNEE_PERSON[i].TEAM == team))
        newlkpArrASSIGNEE.push(this.lkpArrASSIGNEE_PERSON[i])
      }
    }
    else if (ASSIGNEE_TYPE == "NETWORK")
    newlkpArrASSIGNEE = this.lkpArrASSIGNEE_NETWORK;

     return newlkpArrASSIGNEE;
  }

  public valueChangeDIV(value: any): void {

  }
  public valueChangeASSIGNEE_TYPE(value: any): void {
 
  }
  
}


