import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import {  GridComponent } from '@progress/kendo-angular-grid';
//import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { toLocalDate } from '@progress/kendo-date-math'

import { starServices } from 'starlib';

import {   queryDef, dynamic ,sampleProducts, componentConfigDef } from '@modeldir/model';
import { formatDate } from '@angular/common';
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  lookup?:string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
}
// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = (dataItem:any) => new FormGroup({
'QUERY_ID' : new FormControl(dataItem.QUERY_ID  , Validators.required ) 
});
const createFormGroupDate = dataItem => new FormGroup({
  'DYNAMIC_FIELD' : new FormControl(dataItem.DYNAMIC_FIELD  ) 
  });


const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1:any):any;

@Component({
  selector: 'app-dsp-reports',
  templateUrl: './dsp-reports.component.html',
  styleUrls: ['./dsp-reports.component.css'],
//  , './pdf-styles.css'
  
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

export class DspReportsComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid!: GridComponent;
 public gridParams: GridComponent;

 //@Input()    
 public showToolBar = true;
 public  form!: FormGroup; 
 public formDate : FormGroup;
  public view!: any[];
  public formGroup!: FormGroup; 
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isQUERY_IDEnable : boolean = true; 


  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;
  
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="QUERY_ID";
  private insertCMD = "INSERT_DSP_DYNAMIC";
  private updateCMD = "UPDATE_DSP_DYNAMIC";
  private deleteCMD =   "DELETE_DSP_DYNAMIC";
  private getCMD = "GET_DSP_DYNAMIC_QUERY";

  public  executeQueryresult:any;
  public title = "Dynamic";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  
  //public gridHeight = "500";
  public formattedWhere:any = null;
  public paramConfig;
  public  ADM_QUERY_DEFGridConfig : componentConfigDef;
  public  DSP_DYNAMICGridConfig : componentConfigDef;
  private formInitialValues:any =   new queryDef();   
  private formDateInitialValues =   new dynamic(); 
  
  public lookupData =[];
  public  lookupOpened : boolean = false;
  public  dateOpened : boolean = false;
  public dialogTitle;
  public dialogDateTitle;
  public selectedField;
  public initialQUERY_ID ="";

  
  
  public  hideDynamicGrid : boolean = true;
  public reportTitle = "";
  public gridWidth = 150;
  public Module = 'PROVISION';
  
  public  showParams : boolean = false;
  public gridData: any[] ;//= sampleProducts;
  public columns: ColumnSetting[] ;
  /*= [
    {
      field: 'ProductName',
      title: 'Product Name',
      type: 'text'
    }, {
      field: 'UnitPrice',
      format: '{0:c}',
      title: 'Unit Price',
      type: 'numeric'
    }, {
      field: 'FirstOrderedOn',
      format: '{0:d}',
      title: 'First Ordered',
      type: 'date'
    }
  ];
*/
  private Body:any =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) { 
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef(); 
      this.componentConfig.gridHeight =  "500";
      //this.componentConfig.showTitle = true;
      
      this.DSP_DYNAMICGridConfig = new componentConfigDef();
      this.DSP_DYNAMICGridConfig.queryable = false;
      this.DSP_DYNAMICGridConfig.isChild = true;
      this.DSP_DYNAMICGridConfig.insertable = false
      
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
   // this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
   this.starServices.actOnParamConfig(this, 'PRVRPRT' );
   if (this.paramConfig.DEBUG_FLAG) console.log ("here1:this.lookupArrDef:",this.lookupArrDef)

    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form = createFormGroup(
      this.formInitialValues
    );
    this.formDate = createFormGroupDate(
      this.formDateInitialValues
    );

    this.onChanges();
    
    //this.title = this.Module + " Reports" 
    this.title =  " Reports" 



  }
    public ngOnDestroy(): void {
        //this.docClickSubscription();
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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input DspDynamicGrid grid.QUERY_ID :' + grid.QUERY_ID);
    if ( (grid.QUERY_ID != "") &&   (grid.QUERY_ID != "undefined"))
    {
      this.masterKey = grid.QUERY_ID;
      this.isQUERY_IDEnable = false;
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
        this.isQUERY_IDEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues:any = new dynamic();   

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }
  private onDocumentClick(e: any): void {
   // if (this.paramConfig.DEBUG_FLAG) console.log("onDocumentClick", this.formGroup)
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
    /* this.gridInitialValues.QUERY_ID = this.masterKey;*/
    if (this.masterKeyNameArr.length != 0)
    {
      for (var i = 0; i< this.masterKeyNameArr.length; i++){
        this.gridInitialValues[this.masterKeyNameArr[i]] = this.masterKeyArr[i];
      }
    }
    else
    {
      this.gridInitialValues[this.masterKeyName] = this.masterKey;
    }
        this.closeEditor();
        this.formGroup = createFormGroup(
          this.gridInitialValues
        );
      this.isNew = true;
      this.grid.addRow(this.formGroup);
  }

 public cellClickHandler({ column, isEdited, dataItem, rowIndex }): void {
   if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler",column.field ,column, dataItem)
   var val = dataItem[column.field];
   var fieldName = column.field;
   var fieldType = column.filter;
   if (this.paramConfig.DEBUG_FLAG) console.log ("val:" , val , " fieldType:", fieldType)
   this.selectedField = fieldName;
   
   if ( fieldType == "date")
   {
    var formVal = this.formDate.value;
    formVal.DYNAMIC_FIELD = new Date(val);
    this.formDate.reset(formVal);

    this.dialogDateTitle = this.starServices.CapitalizeTitle(fieldName) ;
    this.dateOpened = true;
   }
   else
   {
    
    var lkpArrName = "lkpArr" + fieldName;
    if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
    this.lookupData = this[lkpArrName];
    this.dialogTitle = this.starServices.CapitalizeTitle(fieldName) ;
    this.lookupOpened = true; 

   }

    
}
public cellClickHandlerLookup({ column, isEdited, dataItem, rowIndex }): void {
  if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandlerLookup",column.field ,column, dataItem)
  this.lookupOpened = false; 
  var val = dataItem["CODE"];
  this.gridData[0][this.selectedField] = val;

  if ( this.selectedField == "ASSIGNEE_TYPE"){
    this.lookupArrDef = [];
    var fieldName = "ASSIGNEE";
    var lkpArrName = "lkpArr" + fieldName;
    var selectStmt = this.starServices.getAssigneeSelect(this, val);
    var lkpDef =  	{"statment":selectStmt,
           "lkpArrName":lkpArrName, "fieldName": fieldName};
    this.lookupArrDef.push(lkpDef);
    this.starServices.fetchLookups(this, this.lookupArrDef);

  }

  return;
}
public valueChangeDYNAMIC_FIELDE(value: any): void {
  this.dateOpened = false; 
  var formVal = this.formDate.value;
  
  if (this.paramConfig.DEBUG_FLAG) console.log("formVal:",formVal)
  if (typeof formVal.DYNAMIC_FIELD != "undefined"){
    var DYNAMIC_FIELD = formVal.DYNAMIC_FIELD;
    //DYNAMIC_FIELD = formatDate(DYNAMIC_FIELD, this.paramConfig.DateFormat,this.paramConfig.dateLocale)

    this.gridData[0][this.selectedField] = DYNAMIC_FIELD;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.gridData:",this.gridData);
    
  }

  
}

  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : GridComponent): void{
   // this.starServices.executeQuery_grid( grid,this);
   this.runReport();
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

  public removeHandler(sender:any ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }
  public onCancel(e:any): void {
    this.starServices.onCancel_form ( e , this);
   this.ADM_QUERY_DEFGridConfig = new componentConfigDef();
   this.ADM_QUERY_DEFGridConfig.clearComponent = true;

   this.DSP_DYNAMICGridConfig = new componentConfigDef();
   this.DSP_DYNAMICGridConfig.clearComponent = true;

  }
  

  public fetchLookupsCallBack(){
    if ( this.selectedField == "ASSIGNEE_TYPE"){
      var fieldName = "ASSIGNEE"
      var lkpArrName = "lkpArr" + fieldName;
      var lkpRec ={
        "CODE" :"%",
        "CODETEXT_LANG" : "Any"
      }
      this[lkpArrName].unshift(lkpRec);
      if (this.paramConfig.DEBUG_FLAG) console.log("this.gridData:", this.gridData)

      return;
    }
    if (typeof this.columns !== "undefined"){
      var gridData = [];
      var gridRec ={};
  
      for (var i=0; i< this.columns.length; i++){
        var fieldName = this.columns[i].field;
        if (this.paramConfig.DEBUG_FLAG) console.log ("this.columns[i].type:", this.columns[i].type, this.columns[i].title)
        if (this.columns[i].type == "date"){
          var d = new Date();
          var dStr = formatDate(d, this.paramConfig.DateFormat,this.paramConfig.dateLocale)
          console .log(" d: before", d)
          //d = toLocalDate(d);
          //console .log(" d: after", d)
          //var CODE = d.toISOString();
          var CODE = dStr;
        

        }
        else
        {
          

          var lkpArrName = "lkpArr" + fieldName;
          var lkpRec ={
            "CODE" :"%",
            "CODETEXT_LANG" : "Any"
          }
          this[lkpArrName].unshift(lkpRec);
        

          if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
          var CODE = this[lkpArrName][0].CODE;
        }
        gridRec[fieldName] = CODE;
      }
      gridData.push(gridRec);
      if (this.paramConfig.DEBUG_FLAG) console.log("gridData:", gridData)
      this.gridData = gridData;
      this.showParams = true;
    }
    
    if (this.initialQUERY_ID != ""){
      var formVal = this.form.value;
      formVal.QUERY_ID = this.initialQUERY_ID;
      this.initialQUERY_ID = "";
      this.form.reset(formVal);

    }

  }
  public populateGrid (rec){
    this.showParams = false;
    this.hideDynamicGrid = true;

    this.lookupArrDef = [];
    var columnsDef = [];
    var gridData = [];
    if ( rec.WHERE_CLAUSE != null)
    {
      var array  = rec.WHERE_CLAUSE.split(":");
      for (var i=0; i< array.length; i++){
        var fieldDef = array[i];
        if (this.paramConfig.DEBUG_FLAG) console.log("fieldDef:", fieldDef)
        if (i != 0){
          var fieldName  = fieldDef.split(" ");

          var fieldType = "text";
          var fieldFormat = "" ;
          var fieldLookup = true;
          var n = fieldName[0].toUpperCase().search("_DATE");
          if (n != -1){
            fieldType = "date"
            //fieldFormat= "{0:d}";
            fieldFormat= this.paramConfig.DateFormat;
            fieldLookup = false;
          }
          else
          {
            var lkpDef = this.starServices.prepareLookup(fieldName[0], this.paramConfig);
            this.lookupArrDef.push(lkpDef);
            if (this.paramConfig.DEBUG_FLAG) console.log ("this.lookupArrDef:",this.lookupArrDef)
          }

          var fieldNameCaps = this.starServices.CapitalizeTitle(fieldName[0]);
          var field = {
            field: fieldName[0],
            title: fieldNameCaps ,
            format : fieldFormat,
            type: fieldType,
            lookup: fieldLookup
          }
          columnsDef.push(field)
        }
      }
      if (this.paramConfig.DEBUG_FLAG) console.log("columnsDef:", columnsDef)
      this.columns = columnsDef;
      this.starServices.fetchLookups(this, this.lookupArrDef);

    }


  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('QUERY_ID').valueChanges.subscribe(val => {
      this.selectedField = "";
      var rec = this.lkpArrGetQUERY_ID ( val);
      this.reportTitle = rec.CODETEXT_LANG;
      if (this.paramConfig.DEBUG_FLAG) console.log("rec:", rec);
      this.populateGrid(rec);

    //this.lookupArrDef =[];
    //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
}


public userLang = "EN" ; 
public lookupArrDef:any =[	{"statment":"SELECT QUERY_ID CODE, QUERY_NAME CODETEXT_LANG "
                         + "  , SELECT_CLAUSE,  FROM_CLAUSE, WHERE_CLAUSE, WHERE_MAND_CLAUSE, GROUP_ORDER_BY_CLAUSE "
                         +  " FROM ADM_QUERY_DEF WHERE QUERY_TYPE ='REPORT' AND MODULE = '" + this.Module + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrQUERY_ID"}];

public lkpArrQUERY_ID = [];

public lkpArrGetQUERY_ID( CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
if (this.paramConfig.DEBUG_FLAG) console.log( "  CODE:" , CODE)
var rec = this.lkpArrQUERY_ID.find((x:any) => x.CODE === CODE);
return rec;
}
private  getRec (CODE, fieldName){
  var rec;
  var lkpArrName = "lkpArr" + fieldName;
  if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
  rec ={
    CODE: CODE,
    CODETEXT_LANG : CODE
  };
  if ( (typeof this[lkpArrName] !== "undefined")  && (this[lkpArrName].length > 0) ) {
    rec = this[lkpArrName].find((x:any) => x.CODE === CODE);
  }
  return rec;

}
public lkpArrGetfield(fieldName,row: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec;
  if (this.paramConfig.DEBUG_FLAG) console.log ("lkpArrGetfield:field" , fieldName, row[fieldName])
  var CODE = row[fieldName];
  rec = this.getRec (CODE, fieldName);

  return rec;
  
}
public lkpArrGetfieldArr (fieldName){
  if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrGetfieldArr:", fieldName);

  //return this.lkpArrQUERY_ID;
  return "lkpArrQUERY_ID";
}
public valueChangeQUERY_ID(value: any): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}

public lookupClose(){
  this.lookupOpened = false; 
}
public dateClose(){
  this.dateOpened = false; 
}
public runReport(){
  var formVal = this.form.value;
  var rec = this.lkpArrGetQUERY_ID ( formVal.QUERY_ID);
  var  reportSqlParams = this.prepareReportSQLParams(rec);
 // NewVal["_QUERY"] = "GET_STMT";
  if (this.paramConfig.DEBUG_FLAG) console.log("this.gridData:",this.gridData)
  var masterParams={
    "body" : reportSqlParams.NewVal,
    "columns" : this.gridData,
    "reportTitle" : this.reportTitle + " : " + reportSqlParams.reportParams
    
  };
  if (this.paramConfig.DEBUG_FLAG) console.log("masterParams:", masterParams)

  this.DSP_DYNAMICGridConfig = new componentConfigDef();
  this.DSP_DYNAMICGridConfig.masterParams = masterParams;
  this.hideDynamicGrid = false
}

public prepareReportSQLParams(rec){
  var sql = "SELECT " + rec.SELECT_CLAUSE + " FROM " + rec.FROM_CLAUSE + " WHERE " + rec.WHERE_CLAUSE;
  if ( ( rec.GROUP_ORDER_BY_CLAUSE != "") && ( rec.GROUP_ORDER_BY_CLAUSE !== null ) ){
    sql = sql + " " + rec.GROUP_ORDER_BY_CLAUSE;
  }
    

  if (this.paramConfig.DEBUG_FLAG) console.log("this.gridData:",this.gridData)
  this.Body = [];
  var NewVal = {};
  NewVal["_QUERY"] = "GET_STMT";
  var reportParams = "";
  this.gridWidth = 0;

  for (var key in this.gridData[0]) {
    if (this.paramConfig.DEBUG_FLAG) console.log(key);
    if (this.paramConfig.DEBUG_FLAG) console.log(this.gridData[0][key]);
    var fieldName = key;
    var fieldVal = this.gridData[0][key];
    NewVal[fieldName] = fieldVal;


    
    var title  = fieldName;
    var type = "text";
    for (var i=0; i< this.columns.length; i++){
      if (fieldName == this.columns[i].field){
        title = this.columns[i].title;
        type = this.columns[i].type;
      }
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("type:", type)
    if (this.paramConfig.DEBUG_FLAG) console.log("this.columns:",this.columns)
    if (type == "date"){
      fieldVal = formatDate(fieldVal, this.paramConfig.DateFormat,this.paramConfig.dateLocale)
    }
    else{
      rec = this.getRec (fieldVal, fieldName);
      fieldVal = rec.CODETEXT_LANG;
    }

    if (reportParams != "")
      reportParams = reportParams + " , ";
    reportParams = reportParams + title + "=" + fieldVal;

    this.gridWidth = this.gridWidth  + 150;

  }
  NewVal["_STMT"] = sql;
  var reportSqlParams ={
    NewVal : NewVal,
    reportParams : reportParams
  }

  return reportSqlParams;
}

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
	    if (this.paramConfig.DEBUG_FLAG) console.log("reports ComponentConfig:" ,ComponentConfig);

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
	      this.isQUERY_IDEnable = false;
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
	      this.isQUERY_IDEnable = false;
	    }

	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      if (typeof this.grid !== "undefined"){
	         this.executeQuery(this.grid)
	      }
		
      }
      if ( ComponentConfig.masterParams != null)
	    {
        if (this.paramConfig.DEBUG_FLAG) console.log("here1:",this.form)
        
        this.initialQUERY_ID = ComponentConfig.masterParams.QUERY_ID;
        
        
        
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


