import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';
import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { addDays, addWeeks, addMonths, addYears, addDecades, addCenturies } from '@progress/kendo-date-math';
import {getDate} from '@progress/kendo-date-math';
import { Router, ActivatedRoute } from '@angular/router';

import { starServices } from 'starlib';

import {   templateDetail, orders, workOrders, componentConfigDef } from '@modeldir/model';
import { Observable } from 'rxjs';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = (dataItem:any) => new FormGroup({
'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME  , Validators.required ) ,
'WO_TYPE' : new FormControl(dataItem.WO_TYPE  , Validators.required ) ,
'SEQUENCE_NAME' : new FormControl(dataItem.SEQUENCE_NAME ) ,
'TEMPLATE_ORDER' : new FormControl(dataItem.TEMPLATE_ORDER ) ,
'DEPENDANT_WO_ORDER' : new FormControl(dataItem.DEPENDANT_WO_ORDER ) ,
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
//declare function grid_enterQuery(var1):any;
declare function getParamConfig():any;
declare function setParamConfig(var1:any):any;


@Component({
  selector: 'app-dsp-template-detail-grid',
  templateUrl: './dsp-template-detail-grid.component.html',
  styleUrls: ['./dsp-template-detail-grid.component.css'
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

export class DspTemplateDetailGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid!: GridComponent;
 
 //@Input()    
 public showToolBar = true;
 public showDiagram = true;
  
  public groups: GroupDescriptor[] = [];
  public view!: any[];
  public formGroup!: FormGroup; 
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public isChild: boolean  = false;
  public  isTEMPLATE_NAMEEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  public  multiStepFormOpened : boolean = false;
  public fieldGridHeight = 400;
  public formName;

  private masterKey ="";
  public masterKeyName ="TEMPLATE_NAME";
  private insertCMD = "INSERT_DSP_TEMPLATE_DETAIL";
  private updateCMD = "UPDATE_DSP_TEMPLATE_DETAIL";
  private deleteCMD =   "DELETE_DSP_TEMPLATE_DETAIL";
  private getCMD = "GET_DSP_TEMPLATE_DETAIL_QUERY";

  public  executeQueryresult:any;
  public title = "Template Detail";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public  DSP_MULTISTEPFormConfig : componentConfigDef;
  public app_dsp_diagram_wrapConfig:componentConfigDef;
  public gridHeight = 300;
  public primarKeyReadOnlyArr = {isTEMPLATE_NAMEreadOnly : false , isSEQUENCEreadOnly : false};  
  public paramConfig;
  public createFormGroupGrid = createFormGroup;
  private savingMode = null;


  private Body:any =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices, 
              private renderer: Renderer2,
              private router: Router) { 
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef(); 
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.gridHeight =  this.fieldGridHeight; 

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
    if (this.paramConfig.DEBUG_FLAG) console.log("in triggersaveChanges_Input: " + masterSaved + " this.savingMode:" + this.savingMode);
    if ( masterSaved != null){
      if (this.savingMode != "ORDERS")
        this.saveChanges(this.grid);
        else
        {
          this.saveOrders(this, masterSaved);
        }
    }
  }
  */
  @Input() public set detail_Input(grid: any) {
    if ( (typeof grid != "undefined") && (grid.TEMPLATE_NAME != "") && (typeof grid.TEMPLATE_NAME != "undefined") )
    {
      if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid :' + grid);
      this.formName = grid.FORM_NAME;
      grid.FORM_NAME = "";
      this.masterKey = grid.TEMPLATE_NAME;
      this.isTEMPLATE_NAMEEnable = false;
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
        this.isTEMPLATE_NAMEEnable = true;
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
    this.starServices.addHandler_grid(this);
      return;

  }

 public cellClickHandler( event:any ): void {
  if (this.savingMode == "ORDERS")
     return;
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


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public callBackFunction(data) {
    // if (data.total === 0)
    //    return;

    // else {
      this.app_dsp_diagram_wrapConfig = new componentConfigDef();
      this.app_dsp_diagram_wrapConfig.masterParams = {
        action:"build",
        workOrders: data.data,
        useModeler: true,
        showDiagram: this.showDiagram,
        rulesDef:[]
    //  }
  
      
      
    }

 }
  public executeQuery (grid : GridComponent): void{
    this.starServices.executeQuery_grid( grid,this);
  } 

  public saveChanges(grid: GridComponent): void {
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
    console.log("this.grid:", this.grid.data)
    this.app_dsp_diagram_wrapConfig = new componentConfigDef();
    let GridData;
    GridData = Object.assign([], this.grid.data);

    this.app_dsp_diagram_wrapConfig.masterParams = {
      action:"build",
      workOrders: GridData.data,
      useModeler: true,
      showDiagram: this.showDiagram,
      rulesDef:[]
    }
  }

  public removeHandler(sender:any ) {

    this.starServices.removeHandler_grid(sender, this);

  }
  public multiStepFormClose(){
    this.multiStepFormOpened = false; 
  }
  public showMultiStepForm(formName, formPagesNo){
  
    var orderFields = "[]";
    
    if ( (formName!= "") && ( (formPagesNo != 0) && (formPagesNo != "") && (formPagesNo != null))  ){
        var masterParams={
        "formName" : formName,
        "formPagesNo" : formPagesNo, 
        "orderFields" : orderFields
        };
        if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
        this.DSP_MULTISTEPFormConfig = new componentConfigDef();
        this.DSP_MULTISTEPFormConfig.masterParams = masterParams;
        this.multiStepFormOpened = true;
      }
  }
  public savemultiStepFormCompletedHandler(DSP_MULTISTEP){
  this.multiStepFormOpened = false; 
  }
  public editHandler({dataItem}) {
    if (this.paramConfig.DEBUG_FLAG) console.log("dataItem:", dataItem, " formName:", this.formName);
    var formPagesNo = dataItem.FORM_PAGES_NO;
    
    this.showMultiStepForm(this.formName, formPagesNo);
}
  public userLang = "EN" ; 
  public lookupArrDef:any =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrWO_TYPE"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrDEPT"},
    {"statment":"SELECT CODE, CODEVALUE_LANG , CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrDIV"},

    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrASSIGNEE_TYPE"},

    {"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS  FROM ADM_TEAM  order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrASSIGNEE_TEAMS"},
    {"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS, TEAM FROM ADM_USER_INFORMATION order by CODETEXT_LANG  ",
        "lkpArrName":"lkpArrASSIGNEE_PERSON"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='EXCH_SYST' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
        "lkpArrName":"lkpArrASSIGNEE_NETWORK"},        
    {"statment":"SELECT CODE, CODE CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='API' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName":"lkpArrASSIGNEE_API"},        
    {"statment":"SELECT CODE, CODE CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='URL' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
        "lkpArrName":"lkpArrASSIGNEE_URL"},        
    {
      "statment": "SELECT CODE, CODE CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='NAVIGATE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
      "lkpArrName": "lkpArrASSIGNEE_NAVIGATE"
    },
      ];
  
  public lkpArrWO_TYPE = [];
  
  
  public lkpArrDEPT = [];
  public lkpArrDIV = [];
  public lkpArrASSIGNEE_TYPE = [];
  
  public lkpArrASSIGNEE_TEAMS = [];
  public lkpArrASSIGNEE_PERSON = [];
  public lkpArrASSIGNEE_NETWORK = [];
  public lkpArrASSIGNEE_API = [];
  public lkpArrASSIGNEE_URL = [];
  public lkpArrASSIGNEE_NAVIGATE =[];
  
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
    else if (TYPE_NAME == "API")
      var rec = this.lkpArrASSIGNEE_API.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "URL")
      var rec = this.lkpArrASSIGNEE_URL.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "NAVIGATE")
      var rec = this.lkpArrASSIGNEE_NAVIGATE.find((x:any) => x.CODE === CODE);    
      
      return rec;
    }
  
  public valueChangeDEPT(value: any): void {
    
  }
  public valueChangeDIV(value: any): void {
/*    var recVal = this.formGroup.value;
    if (this.paramConfig.DEBUG_FLAG) console.log("recVal: value:" + value);
    if (this.paramConfig.DEBUG_FLAG) console.log(recVal);
    var value = recVal.ASSIGNEE_TYPE;
    this.valueChangeASSIGNEE_TYPE(value);*/
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
    if (this.paramConfig.DEBUG_FLAG) console.log ("test:recVal:", recVal)
    var ASSIGNEE_TYPE = recVal.ASSIGNEE_TYPE;
    var team = this.paramConfig.USER_INFO.TEAM;
    /*
    var rec ={
      CODE:"",
      CODETEXT_LANG:""
    }
    newlkpArrASSIGNEE.push(rec); //add empty record at begining of the array for the LOV for insert new record in a grid work properly
    */
    if (ASSIGNEE_TYPE == "TEAM"){
      var DEPT = recVal.DEPT;
      var DIV = recVal.DIVS;
      for(var i=0;i< this.lkpArrASSIGNEE_TEAMS.length; i++){
       // if ( (this.lkpArrASSIGNEE_TEAMS[i].DEPT == DEPT) && (this.lkpArrASSIGNEE_TEAMS[i].DIV == DIV) )
        newlkpArrASSIGNEE.push(this.lkpArrASSIGNEE_TEAMS[i])
      }
    }
    else if (ASSIGNEE_TYPE == "PERSON")
    {
      var DEPT = recVal.DEPT;
      var DIV = recVal.DIVS;
      var TEAM = recVal.TEAM;
      for(var i=0;i< this.lkpArrASSIGNEE_PERSON.length; i++){
        //if ( (this.lkpArrASSIGNEE_PERSON[i].DEPT == DEPT) && (this.lkpArrASSIGNEE_PERSON[i].DIV == DIV) )
        if (this.paramConfig.DEBUG_FLAG) console.log("test:this.lkpArrASSIGNEE_PERSON[i].TEAM:", this.lkpArrASSIGNEE_PERSON[i].TEAM , " team:)", team)
        if ( (this.lkpArrASSIGNEE_PERSON[i].TEAM == team))
          newlkpArrASSIGNEE.push(this.lkpArrASSIGNEE_PERSON[i])
      }
    }
    else if (ASSIGNEE_TYPE == "NETWORK")
      newlkpArrASSIGNEE = this.lkpArrASSIGNEE_NETWORK;
    else if (ASSIGNEE_TYPE == "API")
      newlkpArrASSIGNEE = this.lkpArrASSIGNEE_API;
    else if (ASSIGNEE_TYPE == "URL")
      newlkpArrASSIGNEE = this.lkpArrASSIGNEE_URL;
    else if (ASSIGNEE_TYPE == "NAVIGATE")
      newlkpArrASSIGNEE = this.lkpArrASSIGNEE_NAVIGATE;

      

     return newlkpArrASSIGNEE;
  }
  public valueChangeASSIGNEE_TYPE(value: any): void {
    var recVal = this.formGroup.value;
    if (this.paramConfig.DEBUG_FLAG) console.log("recVal assignee_type:");
    if (this.paramConfig.DEBUG_FLAG) console.log(recVal);

    if (value == "TEAM"){
      this.lookupArrDef =[	{"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG FROM ADM_TEAM WHERE DEPT = '" + recVal.DEPT + "'  and DIVS = '" + recVal.DIVS + "' ",
      "lkpArrName":"lkpArrASSIGNEE"}];
      this.starServices.fetchLookups(this, this.lookupArrDef);
    }
    else if (value == "PERSON"){
      this.lookupArrDef =[	{"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG FROM ADM_USER_INFORMATION WHERE DEPT = '" + recVal.DEPT + "'  and DIVS = '" + recVal.DIVS + "' ",
      "lkpArrName":"lkpArrASSIGNEE"}];
      this.starServices.fetchLookups(this, this.lookupArrDef);
    }
    if (this.paramConfig.DEBUG_FLAG) console.log(this.lookupArrDef);
  }
  



  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:", ComponentConfig);
      
        this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      if ( ComponentConfig.showToolBar != null)
      {
        this.showToolBar = ComponentConfig.showToolBar;
      }
      if ( ComponentConfig.savingMode != null)
      {
        this.savingMode = ComponentConfig.savingMode;
      }

      if ( ComponentConfig.masterSaved != null)
      {
        if (this.savingMode != "ORDERS")
          this.saveChanges(this.grid);
        else
        {
          this.saveOrders(this, ComponentConfig.masterSaved);
        }
        ComponentConfig.masterSaved  =null;
      }
      if ( ComponentConfig.masterKey != null)
	    {
	      this.isTEMPLATE_NAMEEnable = false;
	      this.masterKey = ComponentConfig.masterKey;
	    }

   }

  }
  
  public postOderActionsfn( target:any, object:any){
    var paramConfig = {
      "Name": "ORDER_NO",
      "Val": target.ORDER_NO
    };
    setParamConfig(paramConfig);
    object.router.navigate(['/PRVORDERE'], { skipLocationChange: true });

  }
  public saveOrders(object:any, masterSaved:any){
    this.Body = [];
    masterSaved.ORDER_STATUS = this.paramConfig.ORDER_STATUS_CREATED;
    masterSaved.PROMISED_DATE = getDate(masterSaved.PROMISED_DATE);
    masterSaved.ORDERED_DATE = getDate(masterSaved.ORDERED_DATE);
    
    
    masterSaved["_QUERY"] = "INSERT_DSP_ORDERS" ;
    if (this.paramConfig.DEBUG_FLAG) console.log(masterSaved);
    this.addToBody(masterSaved);

    if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
   
    if (this.paramConfig.DEBUG_FLAG) console.log ("length:" + object.grid.data.total);
    

   
    
    var promisedDate:Date = new Date();

    for (var i = 0; i < object.grid.data.total ; i++){
        var workOrder = new workOrders();   
        workOrder.WO_ORDER_NO = masterSaved.ORDER_NO + "-" + (i+1);
        workOrder.TEMPLATE_ORDER = "" + (i + 1);
        workOrder.TEMPLATE_NAME = masterSaved.TEMPLATE_NAME;
        workOrder.WO_TYPE =  object.grid.data.data[i].WO_TYPE ;
        workOrder.DEPT =  object.grid.data.data[i].DEPT ;
        workOrder.DIVS =  object.grid.data.data[i].DIVS ;
        workOrder.ASSIGNEE_TYPE =  object.grid.data.data[i].ASSIGNEE_TYPE ;
        workOrder.ASSIGNEE =  object.grid.data.data[i].ASSIGNEE ;
        workOrder.ORDER_NO =  masterSaved.ORDER_NO;
        workOrder.SUBNO =  masterSaved.SUBNO;
        workOrder.WO_STATUS = this.paramConfig.ORDER_STATUS_CREATED;
        workOrder.APPROVAL_FLAG = this.paramConfig.ORDER_STATUS_CREATED;
        workOrder.PARENT_WO_ORDER_NO = "";
        if (object.grid.data.data[i].DEPENDANT_WO_ORDER != "")
          workOrder.PARENT_WO_ORDER_NO = masterSaved.ORDER_NO + "-" + object.grid.data.data[i].DEPENDANT_WO_ORDER;
        


        workOrder.ACTUAL_START_DATE = null;
        workOrder.ACTUAL_END_DATE = null;
        workOrder.COMPLETION_DATE = null;

        let duration:number  = parseInt(object.grid.data.data[i].DURATION);
        promisedDate = addDays(promisedDate,  duration);
        workOrder.PROMISED_DATE  = getDate(promisedDate);
        workOrder.ORDERED_DATE  = getDate(new Date());
        
        if (this.paramConfig.DEBUG_FLAG) console.log("workOrder.PROMISED_DATE :" + workOrder.PROMISED_DATE )
        if (this.paramConfig.DEBUG_FLAG) console.log("workOrder.ORDERED_DATE :" + workOrder.ORDERED_DATE )
        if (this.paramConfig.DEBUG_FLAG) console.log(workOrder);

        if (workOrder.DEPT == ""){
          workOrder.DEPT = masterSaved.DEPT;
        }
        if (workOrder.DIVS == ""){
          workOrder.DIVS = masterSaved.DIV;
        }

        workOrder["_QUERY"] = "INSERT_DSP_WORK_ORDERS" ;
        this.addToBody(workOrder);
        if (this.paramConfig.DEBUG_FLAG) console.log(workOrder);
    }
    if (this.Body.length != 0)
    {
      var Page =  "&_trans=Y";
      this.starServices.post(this, Page,this.Body).subscribe(Page => {
        this.Body =[];
        var postOderActions = [
          { text: 'Create another order' , primary: false },
          { text: 'Go to the order', primary: true }
        ];
        var msg = "Order no :" + masterSaved.ORDER_NO + " is created. "
        msg = msg + "Please select one of the options below"
        var dialogStruc = { 
          msg: msg, 
          title : "Order Created",
          info: masterSaved, 
          object : object,
          action : postOderActions,
          callback: this.postOderActionsfn };
          this.starServices.showConfirmation(dialogStruc);

        this.starServices.showNotification ('success',"Data saved successfully");
      },
      err => {
        this.starServices.showNotification ("error","error:" + err.error.error.code);
      });
   }
    else
      this.starServices.showNotification ('warning',"No changes to save");

  //  
    
  }

  @Input() public set copiedTemplateOutput(data) {
    if (data) {
      data.emit(this.grid.data)
    }
  }
}


