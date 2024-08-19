import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   ruleLog , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'RULE_ID' : new FormControl(dataItem.RULE_ID  , Validators.required ) ,
'RULE_KEY' : new FormControl(dataItem.RULE_KEY  , Validators.required ) ,
'ACTION_ID' : new FormControl(dataItem.ACTION_ID ) ,
'STATUS' : new FormControl(dataItem.STATUS ) ,
'MSG_RESPONSE' : new FormControl(dataItem.MSG_RESPONSE ) ,
'MODULE' : new FormControl(dataItem.MODULE ) ,
'SENT_DATE' : new FormControl(dataItem.SENT_DATE   ) ,
'MSG_RECEIVED' : new FormControl(dataItem.MSG_RECEIVED ) ,
'PARAMETER_SENT' : new FormControl(dataItem.PARAMETER_SENT ) ,
'BODY_SENT' : new FormControl(dataItem.BODY_SENT ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) 
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;

@Component({
  selector: 'app-adm-rule-log-grid',
  templateUrl: './adm-rule-log-grid.component.html',
  styleUrls: ['./adm-rule-log-grid.component.css'
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

export class AdmRuleLogGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid: GridComponent;
 
 //@Input()    
 public showToolBar = true;
  
  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup: FormGroup; 
  private editedRowIndex: number;
  private docClickSubscription: any;
  private isNew: boolean;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isRULE_IDEnable : boolean = true; 

  public  isRULE_KEYEnable : boolean = true; 
//public  isRULE_IDEnable : boolean = true; 
public  isSENT_DATEEnable : boolean = true; 

  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;
  
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="RULE_ID";
  private insertCMD = "INSERT_ADM_RULE_LOG";
  private updateCMD = "UPDATE_ADM_RULE_LOG";
  private deleteCMD =   "DELETE_ADM_RULE_LOG";
  private getCMD = "GET_ADM_RULE_LOG_QUERY";

  public  executeQueryresult:any;
  public title = "Rule Log";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere = null;
  public insertable: boolean = false;
  public paramConfig;
  public createFormGroupGrid = createFormGroup;
  public logOpened: boolean = false;
  public form_adm_rule_log:componentConfigDef;

  private Body =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) { 
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef(); 
      this.componentConfig.gridHeight =  "500";
      this.componentConfig.showTitle = true;
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

  @Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input AdmRuleLogGrid grid.RULE_ID :' + grid.RULE_ID);
    if ( (grid.RULE_ID != "") &&   (typeof grid.RULE_ID != "undefined"))
    {
      this.masterKey = grid.RULE_ID;
      this.isRULE_IDEnable = false;
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
        this.isRULE_IDEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues = new ruleLog();   

  private addToBody(NewVal){
    this.Body.push(NewVal);
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
        this.saveCurrent();
    }
  }
  

  public addHandler(): void {
    this.starServices.addHandler_grid(this)
  }

 public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
   if (this.paramConfig.DEBUG_FLAG) console.log("dataItem:", dataItem)
   this.logOpen(dataItem);
   return;
   /*if (!this.insertable)
    return;
    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
        return;
    }
    if (this.isNew) {
        rowIndex += 1;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    this.readCompletedOutput.emit(this.formGroup.value);*/
}


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
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
  }

  public removeHandler(sender ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }

public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='RULE_ID' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrRULE_ID"}];

public lkpArrRULE_ID = [];

public lkpArrGetRULE_ID(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrRULE_ID.find(x => x.CODE === CODE);
return rec;
}

public valueChangeRULE_ID(value: any): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}

public logOpen(dataItem){
  var masterParams={
    "dataItem" : dataItem
  };
  if (this.paramConfig.DEBUG_FLAG) console.log("masterParams:", masterParams)
  this.logOpened = true; 
  this.form_adm_rule_log = new componentConfigDef();
  this.form_adm_rule_log.masterParams = masterParams;
}

public logClose(){
  if (this.paramConfig.DEBUG_FLAG) console.log("logClose: this.logOpened:", this.logOpened)
  this.logOpened = false; 
}

public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
	    if (this.paramConfig.DEBUG_FLAG) console.log("detail ComponentConfig:" ,ComponentConfig);

      if (typeof ComponentConfig !== "undefined"){
	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
	    if ( ComponentConfig.showToolBar != null)
	      this.showToolBar = ComponentConfig.showToolBar;
	   
	    if (ComponentConfig.isMaster == true)
	    {
	     this.isMaster = true;
	    }
	

	    if ( ComponentConfig.masterSaved != null)
	    {
	      this.saveChanges(this.grid);
	      ComponentConfig.masterSaved  = null;
	    }
	    if ( ComponentConfig.masterKey != null)
	    {
	      this.isRULE_IDEnable = false;
	      this.masterKey = ComponentConfig.masterKey;
	    }
	    if ( ComponentConfig.masterKeyArr != null)
	    {
	      this.masterKeyArr = ComponentConfig.masterKeyArr;
	    }
	    if ( ComponentConfig.masterKeyNameArr != null)
	    {
	      this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
	    }
      
	    if ( ComponentConfig.isChild == true)
	    {
	      this.isChild = true;
	      this.isRULE_IDEnable = false;
	    }

	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      if (typeof this.grid !== "undefined"){
	         this.executeQuery(this.grid)
	      }
		
	    }
	    if ( ComponentConfig.clearComponent == true)
	    {
        this.cancelHandler();
        this.grid.cancel;
        this.grid.data = [];
        this.Body =[];
	    }
	      if (ComponentConfig.clearScreen == true)
	      {
	      	this.grid.data = [];
	      }

    }

  }

}


