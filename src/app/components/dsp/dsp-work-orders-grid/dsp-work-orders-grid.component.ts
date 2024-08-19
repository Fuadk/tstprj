import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   workOrders , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = (dataItem:any) => new FormGroup({
'WO_TYPE' : new FormControl(dataItem.WO_TYPE ) ,
'WO_ORDER_NO' : new FormControl(dataItem.WO_ORDER_NO  , Validators.required ) ,
'SUBNO' : new FormControl(dataItem.SUBNO ) ,
'WO_STATUS' : new FormControl(dataItem.WO_STATUS ) ,
'DIV' : new FormControl(dataItem.DIV ) ,
'DEPT' : new FormControl(dataItem.DEPT ) ,
'ASSIGNEE_TYPE' : new FormControl(dataItem.ASSIGNEE_TYPE ) ,
'ASSIGNEE' : new FormControl(dataItem.ASSIGNEE ) ,
'PROMISED_DATE' : new FormControl(dataItem.PROMISED_DATE ) ,
'ORDERED_DATE' : new FormControl(dataItem.ORDERED_DATE) ,
'COMPLETION_DATE' : new FormControl(dataItem.COMPLETION_DATE ) ,
'NOTES' : new FormControl(dataItem.NOTES ) ,
'PARENT_WO_ORDER_NO' : new FormControl(dataItem.PARENT_WO_ORDER_NO ) ,
'ORDER_NO' : new FormControl(dataItem.ORDER_NO  , Validators.required ) ,
'ACTUAL_START_DATE' : new FormControl(dataItem.ACTUAL_START_DATE ) ,
'ACTUAL_END_DATE' : new FormControl(dataItem.ACTUAL_END_DATE ) ,
'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME ) ,
'TEMPLATE_ORDER' : new FormControl(dataItem.TEMPLATE_ORDER ) ,
'ATTACHMENTS' : new FormControl(dataItem.ATTACHMENTS ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) 

});



const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
//declare function grid_enterQuery(var1):any;
declare function getParamConfig():any;

@Component({
  selector: 'app-dsp-work-orders-grid',
  templateUrl: './dsp-work-orders-grid.component.html',
  styleUrls: ['./dsp-work-orders-grid.component.css'
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

export class DspWorkOrdersGridComponent implements OnInit,OnDestroy {
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
  public queryable: boolean = true;
  public insertable: boolean = true;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isORDER_NOEnable : boolean = true;
  public  isWO_ORDER_NOEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  private masterKey ="";
  public masterKeyName ="ORDER_NO";
  private insertCMD = "INSERT_DSP_WORK_ORDERS";
  private updateCMD = "UPDATE_DSP_WORK_ORDERS";
  private deleteCMD =   "DELETE_DSP_WORK_ORDERS";
  private getCMD = "GET_DSP_WORK_ORDERS_QUERY";

  public  executeQueryresult:any;
  public title = "Work Orders";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public  DSP_WORK_ORDERFormConfig : componentConfigDef;
  public app_dsp_diagram_wrapConfig:componentConfigDef;
  
  public gridHeight = 500;
  public paramConfig;
  public createFormGroupGrid = createFormGroup;
  public formattedWhere:any = null;
  public GridData;
  public  workOrderOpened : boolean = false; 
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
    this.starServices.actOnParamConfig(this, 'PRVORDERE' );
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
  public  ORDER_FIELDS;
  @Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.ORDER_NO :' + grid.ORDER_NO);
    if ( (grid.ORDER_NO != "") && (typeof grid.ORDER_NO != "undefined" ) )
    {
      
      this.masterKey = grid.ORDER_NO;
      this.isORDER_NOEnable = false;
      this.isWO_ORDER_NOEnable = false;
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
        this.isORDER_NOEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues:any = new workOrders();   

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
    if (this.paramConfig.DEBUG_FLAG) console.log("check:addToBody:NewVal:", NewVal," this.Body:",this.Body )
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
          if (this.paramConfig.DEBUG_FLAG) console.log("onDocumentClick")
        this.saveCurrent();
    }
  }
  

  public addHandler(): void {
    if (this.paramConfig.DEBUG_FLAG) console.log(" in addHandler")
      if (this.isChild == true){
      if (this.masterKey == ""){
        this.starServices.showOkMsg(this,this.starServices.saveMasterMsg,"Error");
        return;
      }
    }
  this.saveCurrent();
    this.gridInitialValues.ORDER_NO = this.masterKey;
        this.closeEditor();
        this.formGroup = createFormGroup(
          this.gridInitialValues
        );
        if (this.paramConfig.DEBUG_FLAG) console.log("object.formGroup:", this.formGroup)
      this.isNew = true;
      this.grid.addRow(this.formGroup);
  }
  
  public async getsendWOs(ORDER_NO){
    let whereClause = " ORDER_NO = '" + ORDER_NO + "'";
    let body = [
      {
        "_QUERY": "GET_DSP_WORK_ORDERS_QUERY",
        "_WHERE": whereClause
      },
      {
        "_QUERY": "GET_DSP_ORDERS_QUERY",
        "_WHERE": whereClause
      }
    ]
  
    let workOrders;
    let Orders;
    let data = await this.starServices.execSQLBody(this, body, "");
    workOrders = data[0].data;
    Orders = data[1].data;
    console.log("testx post execSQLBody:", workOrders);
    if (workOrders.length != 0) {

      let whereClause = " TEMPLATE_NAME = '" + workOrders[0].TEMPLATE_NAME + "'";
      let body = [
        {
          "_QUERY": "GET_ADM_RULE_DEF_QUERY",
          "_WHERE": whereClause
        }
      ]
    

      let data = await this.starServices.execSQLBody(this, body, "");
      let rulesDef = data[0].data;
      this.app_dsp_diagram_wrapConfig = new componentConfigDef();
      this.app_dsp_diagram_wrapConfig.masterParams = {
        action:"build",
        workOrders: workOrders,
        Orders: Orders,
        useModeler: true,
        showDiagram: this.showDiagram,
        rulesDef:rulesDef
      }
  
      
      
    }
    
  
  }
 public cellClickHandler({ isEdited, dataItem, rowIndex } ): void {
  this.getsendWOs(dataItem.ORDER_NO);
    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
        return;
    }
    if (this.isNew) {
        rowIndex += 1;
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler")
    this.saveCurrent();
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    //this.readCompletedOutput.emit(this.formGroup.value);
}


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
  public callBackFunction(data:any){
    if (this.paramConfig.DEBUG_FLAG) console.log("inside work orders callBackFunction")
    if (this.paramConfig.DEBUG_FLAG) console.log(data.data);
    this.GridData = Object.assign([],data.data)
  }

  public executeQuery (grid : GridComponent): void{
    this.getsendWOs(grid['ORDER_NO']);
    this.starServices.executeQuery_grid( grid,this);
  } 

  public dispatchWorkOrder(grid){

    function setChildren(object, PARENT_WO_ORDER_NO, newGridData, paramConfig){
      var GridData ;  
      var i =0;
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridData:",newGridData )
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridData.data.length:",newGridData.data.length )
      for  (var i = 0; i < newGridData.data.length; i++){
        if (this.paramConfig.DEBUG_FLAG) console.log("Disp:WO_ORDER_NO:",newGridData.data[i].PARENT_WO_ORDER_NO , PARENT_WO_ORDER_NO )
        if (newGridData.data[i].PARENT_WO_ORDER_NO == PARENT_WO_ORDER_NO ) {
          if (newGridData.data[i].WO_STATUS  == paramConfig.CREATED ) {
            newGridData.data[i].WO_STATUS = paramConfig.ON_HAND;
            var NewVal = {
              "WO_STATUS" : paramConfig.ON_HAND, 
              "WO_ORDER_NO" : newGridData.data[i].WO_ORDER_NO,
              "_QUERY" : "UPDATE_DSP_WORK_ORDERS_DISPATCH"
            };
            object.addToBody(NewVal);
           if (this.paramConfig.DEBUG_FLAG) console.log("Disp:NewVal:",NewVal )
           


          }
          
          
        }
       
      }
      return newGridData;
    }
    function getOriginalStatus(WO_ORDER_NO, orgGridData){
      var GridData ;  
      var i =0;
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:orgGridData:",orgGridData )
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:orgGridData.length:",orgGridData.length )
      while (i < orgGridData.length){
        if (this.paramConfig.DEBUG_FLAG) console.log("Disp:WO_ORDER_NO:",orgGridData[i].WO_ORDER_NO , WO_ORDER_NO )
        if (orgGridData[i].WO_ORDER_NO == WO_ORDER_NO ) {
          GridData = orgGridData[i];
          break;
        }
        i++;
      }
      return GridData;
    }
    
    var newGridData = Object.assign([],grid);
    if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridData:",newGridData )
    var newGridDataData = Object.assign([],grid.data);
    if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridDataData:",newGridDataData )
    if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridDataData.length:",newGridDataData.length )
    for (var i =0; i< newGridDataData.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:newGridDataData:",i,newGridDataData[i])
      if (this.paramConfig.DEBUG_FLAG) console.log("Disp:WO_STATUS:",i,newGridDataData[i].WO_STATUS , this.paramConfig.COMPLETED )
      if (newGridDataData[i].WO_STATUS == this.paramConfig.COMPLETED)
      {
        if (this.paramConfig.DEBUG_FLAG) console.log("Disp:Found WO_STATUS:",newGridDataData[i].WO_STATUS , this.paramConfig.COMPLETED )
        var GridData = getOriginalStatus(newGridDataData[i].WO_ORDER_NO, this.GridData);
        if (this.paramConfig.DEBUG_FLAG) console.log("Disp:GridData:",GridData )
        if (typeof GridData !== "undefined"){
          if (GridData.WO_STATUS != this.paramConfig.COMPLETED){
            setChildren(this, newGridDataData[i].WO_ORDER_NO, newGridData, this.paramConfig);
          }
        }
      }
    }
    this.grid.data = newGridData;
    //if (this.paramConfig.DEBUG_FLAG) console.log("Disp:test:", this.grid.data, " newGridData1:", newGridData1)
  }

  public saveChanges(grid): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("Disp:saveChanges:", this.GridData, " grid:", grid.data)
      
     this.saveCurrent();
    
     if (this.paramConfig.DEBUG_FLAG) console.log("Disp:saveChanges: grid:", grid.data, grid.data.total)
     let j = 0;
     while (j < grid.data.total) {
       grid.data.data[j]['ORDER_FIELDS'] = this.ORDER_FIELDS;
       console.log("grid.data.data[j]:", grid.data.data[j])
       j++;
     }
    if (this.paramConfig.DEBUG_FLAG) console.log("Disp:saveChanges:", this.GridData, " grid:", grid.data)
   // this.dispatchWorkOrder(grid.data);
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
  public editHandler({dataItem}) {
    if (this.paramConfig.DEBUG_FLAG) console.log("dataItem.WO_ORDER_NO:", dataItem.WO_ORDER_NO);
    
    var whereClause =   "WO_ORDER_NO  = '" + dataItem.WO_ORDER_NO + "' ";
    if (this.paramConfig.DEBUG_FLAG) console.log("whereClause:" + whereClause)
    whereClause = encodeURIComponent(whereClause);
    var Page =  "&_WHERE=" + whereClause;
    
  
    this.DSP_WORK_ORDERFormConfig = new componentConfigDef();
    this.DSP_WORK_ORDERFormConfig.formattedWhere = Page;
   

  
      this.workOrderOpened = true;
}
public workOrderClose(){
  this.workOrderOpened = false; 
}
public userLang = "EN" ; 
public lookupArrDef:any =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrWO_TYPE"},
	{"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_STATUS' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrWO_STATUS"},
	{"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrDEPT"},
  {"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrDIV"},
  {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrASSIGNEE_TYPE"},
      {"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS  FROM ADM_TEAM  ",
      "lkpArrName":"lkpArrASSIGNEE_TEAMS"},
  {"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG, DEPT, DIVS, TEAM FROM ADM_USER_INFORMATION  ",
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
	{"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='TEMPLATE_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrTEMPLATE_NAME"}];

public lkpArrWO_TYPE = [];

public lkpArrWO_STATUS = [];

public lkpArrDEPT = [];
public lkpArrDIV = [];

public lkpArrASSIGNEE_TYPE = [];

public lkpArrASSIGNEE_TEAMS = [];
public lkpArrASSIGNEE_PERSON = [];
public lkpArrASSIGNEE_NETWORK = [];
public lkpArrASSIGNEE_API = [];
public lkpArrASSIGNEE_URL = [];
public lkpArrASSIGNEE_NAVIGATE = [];

public lkpArrTEMPLATE_NAME = [];

public lkpArrGetWO_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrWO_TYPE.find((x:any) => x.CODE === CODE);
return rec;
}

public lkpArrGetWO_STATUS(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrWO_STATUS.find((x:any) => x.CODE === CODE);
//console.log("STATUS HF = ",rec);
return rec;
}

public lkpArrGetDEPT(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrDEPT.find((x:any) => x.CODE === CODE);
return rec;
}

public lkpArrGetASSIGNEE_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrASSIGNEE_TYPE.find((x:any) => x.CODE === CODE);
return rec;
}
public lkpArrGetDIV(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrDIV.find((x:any) => x.CODE === CODE);
  return rec;
  }
  public lkpArrGetASSIGNEE(CODE: any, TYPE_NAME: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    //if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrGetASSIGNEE:CODE", CODE, "TYPE_NAME:", TYPE_NAME)
    if (TYPE_NAME == "TEAM")
      var rec = this.lkpArrASSIGNEE_TEAMS.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "PERSON")
      var rec = this.lkpArrASSIGNEE_PERSON.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "NETWORK")
      var rec = this.lkpArrASSIGNEE_NETWORK.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "URL")
      var rec = this.lkpArrASSIGNEE_URL.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "API")
      var rec = this.lkpArrASSIGNEE_API.find((x:any) => x.CODE === CODE);
    else if (TYPE_NAME == "NAVIGATE")
      var rec = this.lkpArrASSIGNEE_NAVIGATE.find((x:any) => x.CODE === CODE);
      
      return rec;
    }


public lkpArrGetTEMPLATE_NAME(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrTEMPLATE_NAME.find((x:any) => x.CODE === CODE);
return rec;
}

public valueChangeDEPT(value: any): void {
  /*
  if (this.paramConfig.DEBUG_FLAG) console.log("in valueChangeDEPT");
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
  //if (this.paramConfig.DEBUG_FLAG) console.log("getlkpArrASSIGNEE:ASSIGNEE_TYPE:", ASSIGNEE_TYPE)
  if (ASSIGNEE_TYPE == "TEAM"){
    var DEPT = recVal.DEPT;
    var DIV = recVal.DIV;
    for(var i=0;i< this.lkpArrASSIGNEE_TEAMS.length; i++){
      //if ( (this.lkpArrASSIGNEE_TEAMS[i].DEPT == DEPT) && (this.lkpArrASSIGNEE_TEAMS[i].DIV == DIV) )
      newlkpArrASSIGNEE.push(this.lkpArrASSIGNEE_TEAMS[i])
    }
  }
  else if (ASSIGNEE_TYPE == "PERSON")
  {
    var DEPT = recVal.DEPT;
    var DIV = recVal.DIV;
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
public valueChangeDIV(value: any): void {

}
public valueChangeASSIGNEE_TYPE(value: any): void {


}


  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){
      if (this.paramConfig.DEBUG_FLAG) console.log("work orders ComponentConfig:", ComponentConfig);
      if (this.paramConfig.DEBUG_FLAG) console.log(this.grid);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
	    if ( ComponentConfig.showToolBar != null)
	      this.showToolBar = ComponentConfig.showToolBar;
      if ( ComponentConfig.queryable != null)
	      this.queryable = ComponentConfig.queryable;
      if ( ComponentConfig.insertable != null)
	      this.insertable = ComponentConfig.insertable;
	   
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
        this.isORDER_NOEnable = false;
	      this.masterKey = ComponentConfig.masterKey;
	    }
      if ( ComponentConfig.masterParams != null)
        {
          this.isORDER_NOEnable = false;
          this.ORDER_FIELDS = ComponentConfig.masterParams.ORDER_FIELDS;
        }
 
      if ( ComponentConfig.isChild == true)
      {
        this.isChild = true;
        this.isORDER_NOEnable = false;
        
      }
	    if ( ComponentConfig.clearComponent == true)
	    {
        this.cancelHandler();
        this.grid.cancel;
        this.grid.data = [];
        this.Body =[];
      }
	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      this.executeQuery(this.grid)
		
	    }

    }

  }

}


