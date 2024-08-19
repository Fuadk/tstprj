import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   ruleAction , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'MODULE' : new FormControl(dataItem.MODULE  , Validators.required ) ,
'RULE_ID' : new FormControl(dataItem.RULE_ID  , Validators.required ) ,
'ACTION_ID' : new FormControl(dataItem.ACTION_ID  , Validators.required ) ,
'ACTION_ORDER' : new FormControl(dataItem.ACTION_ORDER, Validators.required ) ,
'ACTION_CODE' : new FormControl(dataItem.ACTION_CODE ) ,
'SEND_TO' : new FormControl(dataItem.SEND_TO ) ,
'MAP_ID' : new FormControl(dataItem.MAP_ID ) ,
'BODY_DATA' : new FormControl(dataItem.BODY_DATA ) ,
'PARAMETER_DATA' : new FormControl(dataItem.PARAMETER_DATA ) ,
'EXTRA_DATA' : new FormControl(dataItem.EXTRA_DATA ) ,
'DISABLED' : new FormControl(dataItem.DISABLED)  ,
'RULE_ACTION_AND' : new FormControl(dataItem.RULE_ACTION_AND ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE )
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;

@Component({
  selector: 'app-adm-rule-action-grid',
  templateUrl: './adm-rule-action-grid.component.html',
  styleUrls: ['./adm-rule-action-grid.component.css'
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

export class AdmRuleActionGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid: GridComponent;
 
 //@Input()    
 public showToolBar = true;
 public showText =  true;
 public  showKeys : boolean = false; 
 
  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup: FormGroup; 
  private editedRowIndex: number;
  private docClickSubscription: any;
  private isNew: boolean;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
public  isMODULEEnable : boolean = true; 
public  isRULE_IDEnable : boolean = true; 
public  editorFormOpened : boolean = false;
private selectedRowIndex: number;
private selectedfieldName;

//public  isMODULEEnable : boolean = true; 
//public  isRULE_IDEnable : boolean = true; 
public  isACTION_IDEnable : boolean = true; 

  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;
  
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="MODULE";
  private insertCMD = "INSERT_ADM_RULE_ACTION";
  private updateCMD = "UPDATE_ADM_RULE_ACTION";
  private deleteCMD =   "DELETE_ADM_RULE_ACTION";
  private getCMD = "GET_ADM_RULE_ACTION_QUERY";

  public  executeQueryresult:any;
  public title = "Rule Action";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public DSP_EDITORFormConfig : componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere = null;
  public paramConfig;
  public primarKeyReadOnlyArr = {isMODULEreadOnly : false , isRULE_IDreadOnly : false , isACTION_IDreadOnly : false};  
  public createFormGroupGrid = createFormGroup;

  private Body =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) { 
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef(); 
      if (this.paramConfig.showFlowKeys == true)
      this.showKeys =  true;
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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input AdmRuleActionGrid grid.MODULE :' + grid.MODULE);
    if ( (grid.MODULE != "") &&   (typeof grid.MODULE != "undefined"))
    {
      this.masterKey = grid.MODULE;
      this.isMODULEEnable = false;
      this.isRULE_IDEnable = false;
      grid.RULE_ACTION_AND = "";
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
        this.isMODULEEnable = true;
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

  
  private gridInitialValues = new ruleAction();   

  private addToBody(NewVal){
    this.Body.push(NewVal);
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
        this.saveCurrent();
    }
  }
  

  public getNextItem(gridData){
    var item = 10;
    if (this.paramConfig.DEBUG_FLAG) console.log("gridData:", gridData.data, gridData.data.length)
    for (var i = 0; i< gridData.data.length; i++)
    {
      item = item + 10;
      if (this.paramConfig.DEBUG_FLAG) console.log("gridData:item:", item)
    }
    return item;
  }

    
  public addHandler(): void {
    if (this.isChild == true){
    if (this.masterKey == ""){
      this.starServices.showOkMsg(this,this.starServices.saveMasterMsg,"Error");
      return;
    }
  }
  this.showText = false;

this.saveCurrent();
  /* this.gridInitialValues.LGC_MODULE = this.masterKey;*/
  if (this.paramConfig.DEBUG_FLAG) console.log("this.masterKeyNameArr:", this.masterKeyNameArr, "this.masterKeyNameArr.length",this.masterKeyNameArr.length)
  if (this.masterKeyNameArr.length != 0)
  {
    for (var i = 0; i< this.masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyNameArr[i] + ":" + this.masterKeyArr[i])
      this.gridInitialValues[this.masterKeyNameArr[i]] = this.masterKeyArr[i];
    }
  }
  else
  {
    if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyName + this.masterKey)
    this.gridInitialValues[this.masterKeyName] = this.masterKey;
  }
   var item = this.getNextItem(this.grid.data);

  this.gridInitialValues.ACTION_ID = item + "";

  this.gridInitialValues.RULE_ACTION_AND = "";
 

    if (this.paramConfig.DEBUG_FLAG) console.log("this.gridInitialValues:",this.gridInitialValues);
      this.closeEditor();
      this.formGroup = createFormGroup(
        this.gridInitialValues
      );
    this.isNew = true;
    this.grid.addRow(this.formGroup);
}


  public addButton (){
    this.starServices.addHandler_grid(this)
  }
  
 public cellClickHandler({ column, isEdited, dataItem, rowIndex }): void {
  if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler",column.field ,column, dataItem)
  var val = dataItem[column.field];
  var fieldName = column.field;
  var fieldType = column.filter;
  if (this.paramConfig.DEBUG_FLAG) console.log ("val:" , val , " fieldType:", fieldType, " fieldName:", fieldName, " dataItem:", dataItem);
  if ( (fieldName == "PARAMETER_DATA")  || (fieldName == "BODY_DATA") ) {
    var editorType = "TEXT_AREA";
    if ( (fieldName == "BODY_DATA") && (dataItem.ACTION_CODE == "EMAIL"))
      editorType = "HTML";

    var masterParams={
      "val" : val,
      "editorType" : editorType
    };
    this.DSP_EDITORFormConfig = new componentConfigDef();
    this.DSP_EDITORFormConfig.masterParams = masterParams;
    this.DSP_EDITORFormConfig.title = "Default Value";
     this.editorFormOpened =  true;
     if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_EDITORFormConfig:", this.DSP_EDITORFormConfig);
  }

    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
        return;
    }
    if (this.isNew) {
        rowIndex += 1;
    }
    this.saveCurrent();
    if (this.showText)
  this.showText = false;
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.selectedRowIndex = rowIndex;
    this.selectedfieldName = fieldName;
    this.grid.editRow(rowIndex, this.formGroup);
    this.readCompletedOutput.emit(this.formGroup.value);
}


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : any): void{
    grid.RULE_ACTION_AND = "";
   
    this.starServices.executeQuery_grid( grid,this);
  } 

  public saveChanges(grid: GridComponent): void {
    this.starServices.saveChanges_grid( grid,this);
  }

  public cancelHandler(): void {
    this.showText = true;
    this.starServices.cancelHandler_grid( this);
    this.callBackFunction(this.grid.data );
   }

  private closeEditor(): void {
    this.starServices.closeEditor_grid( this);
  }

  public lkpArrFIELD = [];

  public lkpArrGetFIELD(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFIELD.find(x => x.CODE === CODE);
    return rec;
    }


  public buildStr(gridVal){
    
    var str = "";

    var rec = this.lkpArrGetFIELD(gridVal.ACTION_CODE);
    var rec1 =  this.lkpArrGetACTION_CODE(gridVal.ACTION_CODE);
    var fieldName = "";
    if (typeof rec1 !== "undefined")
       fieldName = rec1.CODETEXT_LANG;
    
      
 
    if (this.paramConfig.DEBUG_FLAG) console.log("gridVal.FIELD:" + gridVal.ACTION_CODE)
   
        str =  fieldName ;
        if(gridVal.SEND_TO != "" && gridVal.SEND_TO != null)
        str = str + "  ...... TO ......    " +  gridVal.SEND_TO ;
        if(gridVal.MAP_ID != "" && gridVal.MAP_ID != null)
        str = str + "  ...... MAP_ID ......    " +  gridVal.MAP_ID ;
        if(gridVal.BODY_DATA != "" && gridVal.BODY_DATA != null)
            str  = str  + "....... BODY: .......  " + gridVal.BODY_DATA;
        if(gridVal.PARAMETER_DATA != "" && gridVal.PARAMETER_DATA != null)
            str  = str  + "....... PARAMETERS: .......  " + gridVal.PARAMETER_DATA;
   
      return str;
  }



  private saveCurrent(): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("saveCurrent: this.formGroup:" , this.formGroup);
    if  (this.formGroup) {
      var gridVal ;
      gridVal = this.formGroup.value;
      if (this.paramConfig.DEBUG_FLAG) console.log('HFthis.formGroup.dirty :' + this.formGroup.dirty +  " gridVal: " ,gridVal);
      if (this.formGroup.dirty === true)
      {
       
        var andStr = gridVal.RULE_ACTION_AND ;
        var str = this.buildStr(gridVal); 

        gridVal.RULE_ACTION_AND = andStr;
       
        this.formGroup.setValue(gridVal);

        //this.showText = true;
        
      }
    }

    this.starServices.saveCurrent_grid( this);
  }

  public removeHandler(sender ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }
  public removeButton (grid){
    if (this.paramConfig.DEBUG_FLAG) console.log(" removeButton:", grid)
    this.starServices.removeHandler_grid(null, this);
  }
  public editorFormClose(){
    this.editorFormOpened = false; 
  }
  public saveFormCompletedHandler( form_DSP_EDITOR) {
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: form_DSP_EDITOR:", form_DSP_EDITOR, " this.selectedRowIndex:", this.selectedRowIndex);
    var NewVal ;
    var grid_data = JSON.parse(JSON.stringify(this.grid.data));
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: grid_data:", grid_data);
    NewVal = grid_data.data[this.selectedRowIndex];
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: NewVal:", NewVal);
    if (typeof NewVal !== "undefined"){
      NewVal[this.selectedfieldName] = form_DSP_EDITOR;
      if (this.paramConfig.DEBUG_FLAG) console.log("test1: NewVal:", NewVal);
      this.formGroup = createFormGroup(NewVal);
      this.editedRowIndex = this.selectedRowIndex;
      if (this.paramConfig.DEBUG_FLAG) console.log("test1:", this.selectedRowIndex,this.formGroup) 
      this.grid.editRow(this.selectedRowIndex, this.formGroup);
      this.formGroup.markAsDirty();
  
    }
    this.editorFormOpened = false;
  }
 
  public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ACTION_CODE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
      "lkpArrName":"lkpArrACTION_CODE"},
            {"statment":"SELECT HOST_ID CODE, HOST_ID CODETEXT_LANG  FROM ADM_RULE_HOST order by CODETEXT_LANG",
            "lkpArrName":"lkpArrSEND_TO"},
            {"statment":"SELECT MAP_ID CODE, MAP_NAME CODETEXT_LANG , HOST_ID FROM ADM_RULE_HOST_MAP order by CODETEXT_LANG",
            "lkpArrName":"lkpArrMAP_ID"}];

public lkpArrACTION_CODE = [];
public lkpArrSEND_TO = [];
public lkpArrMAP_ID = [];

public lkpArrGetACTION_CODE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrACTION_CODE.find(x => x.CODE === CODE);
return rec;
}
public lkpArrGetSEND_TO(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrSEND_TO.find(x => x.CODE === CODE);
  return rec;
  }
  public lkpArrGetMAP_ID(CODE: any, sendTO): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    
    var rec = this.lkpArrMAP_ID.find( (x => ( x.CODE === CODE ) &&  (x.HOST_ID === sendTO) ) );
    if (this.paramConfig.DEBUG_FLAG) console.log("rec:", rec)
    if (this.paramConfig.DEBUG_FLAG) console.log("rec:", rec, "CODE:", CODE, " this.lkpArrMAP_ID:",this.lkpArrMAP_ID)
    return rec;
    }
  
public valueChangeACTION_CODE(value: any): void {
  //this.lookupArrDef =[];
  //this.starServices.fetchLookups(this, this.lookupArrDef);
  }
public valueChangeSEND_TO(value: any): void {
  //this.lookupArrDef =[];
  //this.starServices.fetchLookups(this, this.lookupArrDef);
  }  
public valueChangeMAP_ID(value: any): void {
  //this.lookupArrDef =[];
  //this.starServices.fetchLookups(this, this.lookupArrDef);
  }      
  public getlkpArrMAP_ID(){
    var newlkpMAP_ID =[];
    var recVal = this.formGroup.value;

    var SEND_TO = recVal.SEND_TO;
    for(var i=0;i< this.lkpArrMAP_ID.length; i++){
      if ( (this.lkpArrMAP_ID[i].HOST_ID == SEND_TO) || ( this.lkpArrMAP_ID[i].HOST_ID == ""))
      newlkpMAP_ID.push(this.lkpArrMAP_ID[i])
    }
  
   return newlkpMAP_ID;

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
	      this.isMODULEEnable = false;
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
	      this.isMODULEEnable = false;
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


  public callBackFunction(data){
    
    if (this.paramConfig.DEBUG_FLAG) console.log("inside callBackFunction")
    if (this.paramConfig.DEBUG_FLAG) console.log(data);
    //this.gridLgcHead = data[0].data;
    
  ///////////////////////    
    var detailsData = data.data ;
    
    var andStr = "IF ";
    var str = "";
    if (this.paramConfig.DEBUG_FLAG) console.log("detailsData.length:" + detailsData.length)
    for (var i=0;i<detailsData.length; i++)
    {
      //if (this.paramConfig.DEBUG_FLAG) console.log(detailsData[i].LGC_FUNCTION);
      var gridVal = detailsData[i];
      if ((i == 0) && (gridVal.ACTION_CODE == "")) {}
      else
        str = this.buildStr(gridVal);
  
     
        gridVal.RULE_ACTION_AND = str;
      
  
  //      lgcDetailArr.push(lgcDetailElm);
      if (this.paramConfig.DEBUG_FLAG) console.log("detail str:" + str);
  
    }
    var len:number = detailsData.length;
    var result = {data: detailsData,
      total: len}
      if (this.paramConfig.DEBUG_FLAG) console.log("detail result:",result)
    this.grid.data = result;
    
  
  
  
  }


}


