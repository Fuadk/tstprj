import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   dashboardDetail , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'DASHBOARD_ID' : new FormControl(dataItem.DASHBOARD_ID  , Validators.required ) ,
'CHART_ID' : new FormControl(dataItem.CHART_ID  , Validators.required ) ,
'CHART_ORDER' : new FormControl(dataItem.CHART_ORDER ) ,
'QUERY_ID' : new FormControl(dataItem.QUERY_ID , Validators.required) ,
'CHART_TITLE' : new FormControl(dataItem.CHART_TITLE ) ,
'CHART_TYPE' : new FormControl(dataItem.CHART_TYPE ) ,
'CHART_WIDTH' : new FormControl(dataItem.CHART_WIDTH ) ,
'CHART_HEIGHT' : new FormControl(dataItem.CHART_HEIGHT ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;

@Component({
  selector: 'app-adm-dashboard-detail-grid',
  templateUrl: './adm-dashboard-detail-grid.component.html',
  styleUrls: ['./adm-dashboard-detail-grid.component.css'
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

export class AdmDashboardDetailGridComponent implements OnInit,OnDestroy {
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
  	public  isDASHBOARD_IDEnable : boolean = true; 

  //		public  isDASHBOARD_IDEnable : boolean = true; 
public  isCHART_IDEnable : boolean = false; 

  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;
  
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="DASHBOARD_ID";
  private insertCMD = "INSERT_ADM_DASHBOARD_DETAIL";
  private updateCMD = "UPDATE_ADM_DASHBOARD_DETAIL";
  private deleteCMD =   "DELETE_ADM_DASHBOARD_DETAIL";
  private getCMD = "GET_ADM_DASHBOARD_DETAIL_QUERY";

  public  executeQueryresult:any;
  public title = "Dashboard Detail";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere = null;
  public primarKeyReadOnlyArr = {isDASHBOARD_IDreadOnly : false , isCHART_IDreadOnly : false};    
  public paramConfig;
  public createFormGroupGrid = createFormGroup;
  public Module = 'PROVISION';

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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input AdmDashboardDetailGrid grid.DASHBOARD_ID :' + grid.DASHBOARD_ID);
    if ( (grid.DASHBOARD_ID != "") &&   (typeof grid.DASHBOARD_ID != "undefined"))
    {
      this.masterKey = grid.DASHBOARD_ID;
      this.isDASHBOARD_IDEnable = false;
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
        this.isDASHBOARD_IDEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues = new dashboardDetail();   

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
    this.saveCurrent();
    /* this.gridInitialValues.DASHBOARD_ID = this.masterKey;*/
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
    if (this.isSearch != true){
      var chartOrder = 0;
      var chartId = 0;
      if (this.paramConfig.DEBUG_FLAG) console.log("this.grid.data:" , this.grid.data )
      var gridData ;
      gridData = this.grid.data;
      var gridVal = gridData.data
      if (this.paramConfig.DEBUG_FLAG) console.log("gridVal:",gridVal)

      
      if (typeof gridVal !== "undefined"){
        for (var i=0; i< gridVal.length; i++){
          if (this.paramConfig.DEBUG_FLAG) console.log("chartOder:" + gridVal[i].CHART_ORDER )
          if (gridVal[i].CHART_ORDER > chartOrder)
            chartOrder = gridVal[i].CHART_ORDER;
          if (gridVal[i].CHART_ID > chartId)
            chartId = gridVal[i].CHART_ID;

          }
      }
      
      chartOrder++;
      chartId++;
      
      this.gridInitialValues.CHART_ORDER =  chartOrder.toString() ;
      this.gridInitialValues.CHART_ID =  chartId.toString() ;
      this.gridInitialValues.CHART_HEIGHT = "400";
      this.gridInitialValues.CHART_WIDTH = "400";
      this.gridInitialValues.CHART_TYPE = "column";
      this.gridInitialValues.CHART_TITLE = "Title";
    }
    
        this.closeEditor();
        this.formGroup = createFormGroup(
          this.gridInitialValues
        );
      this.isNew = true;
      this.grid.addRow(this.formGroup);
      this.gridInitialValues = new dashboardDetail();
  }

 public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
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
    this.readCompletedOutput.emit(this.formGroup.value);
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
public lookupArrDef =[	{"statment":"SELECT QUERY_ID CODE, QUERY_NAME CODETEXT_LANG "
              +  " FROM ADM_QUERY_DEF WHERE  MODULE = '" + this.Module + "' order by CODETEXT_LANG",
"lkpArrName":"lkpArrQUERY_ID"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='CHART_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrCHART_TYPE"}];

public lkpArrQUERY_ID = [];

public lkpArrCHART_TYPE = [];

public lkpArrGetQUERY_ID(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrQUERY_ID.find(x => x.CODE === CODE);
return rec;
}

public lkpArrGetCHART_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrCHART_TYPE.find(x => x.CODE === CODE);
return rec;
}

public valueChangeQUERY_ID(value: any): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}
public valueChangeCHART_TYPE(value: any): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
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
	      this.isDASHBOARD_IDEnable = false;
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
	      this.isDASHBOARD_IDEnable = false;
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


