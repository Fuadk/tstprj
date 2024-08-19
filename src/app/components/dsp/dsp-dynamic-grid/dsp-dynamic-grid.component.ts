import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';
import {  dynamic, sampleProducts , componentConfigDef } from '@modeldir/model';
const createFormGroup = (dataItem:any) => new FormGroup({
    
  });
////////////////////////////////
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  lookup?:string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
}
////////////////////////////////

const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
//declare function grid_enterQuery(var1):any;
declare function getParamConfig():any;


@Component({
  selector: 'app-dsp-dynamic-grid',
  templateUrl: './dsp-dynamic-grid.component.html',
  styleUrls: ['./dsp-dynamic-grid.component.css'],
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
export class DspDynamicGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid!: GridComponent;
 public formGroup!: FormGroup; 
 private docClickSubscription: any;
 public  isFilterable : boolean = false;
 public  isColumnMenu : boolean = false;
 public  executeQueryresult:any;
 public paramConfig;
      public createFormGroupGrid = createFormGroup;
 public componentConfig: componentConfigDef;
 private isNew!: boolean;
 private editedRowIndex!: number;
 public queryable: boolean = true;
  public insertable: boolean = true;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isDYNAMIC_FIELDEnable : boolean = true; 
  public showToolBar = true;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="QUERY_ID";
  public formattedWhere:any = null;
  public title ="report";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";


 private Body:any =[];

////////////////////////////////////
  public gridData: any[] ; //= sampleProducts;
  public columns: ColumnSetting[] ;/*= [
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
////////////////////////////////
  
  
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) { 
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.ORDER_NO :' + grid.ORDER_NO);
    if ( (grid.DYNAMIC_FIELD != "") &&   (grid.DYNAMIC_FIELD != "undefined"))
    {
      
      //this.executeQuery(grid);
      //this.isChild = true;
      //this.showToolBar = false;
    }
    else
    {
      
      if (typeof this.grid != "undefined")
      {
        
        ////this.isChild = false;
        this.grid.data = [];
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
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
          if (this.paramConfig.DEBUG_FLAG) console.log("onDocumentClick")
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

 public cellClickHandler( event:any ): void {
    if (event.isEdited || (this.formGroup && !this.formGroup.valid)) {
        return;
    }
    if (this.isNew) {
        event.rowIndex += 1;
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler")
    this.saveCurrent();
    this.formGroup = createFormGroup(event.dataItem);
    this.editedRowIndex = event.rowIndex;
    this.grid.editRow(event.rowIndex, this.formGroup);
    //this.readCompletedOutput.emit(this.formGroup.value);
}


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : GridComponent): void{
    this.starServices.executeQuery_grid( grid,this);
  } 

  public saveChanges(grid: GridComponent): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("saveChanges")
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

public userLang = "EN" ; 
public lookupArrDef:any =[];	

	
public lkpArrGetfield(fieldName,row: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec;
  if (this.paramConfig.DEBUG_FLAG) console.log ("lkpArrGetfield:field" , fieldName, row[fieldName])
  var CODE = row[fieldName];
  
  var lkpArrName = "lkpArr" + fieldName;
  if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
  rec ={
    CODE: CODE,
    CODETEXT_LANG : CODE
  };
  if (fieldName != "ASSIGNEE"){
    if ( (typeof this[lkpArrName] !== "undefined")  && (this[lkpArrName].length > 0) ) {
      rec = this[lkpArrName].find((x:any) => x.CODE === CODE);
    }
  }
  return rec;
}

public getData(NewVal){
  this.grid.loading = true;
  this.gridData  =[];
  this.Body =[];

  this.addToBody(NewVal);
 if (this.paramConfig.DEBUG_FLAG) console.log("this.Body:",this.Body)
  var Page ="";
  Page = encodeURI(Page);
  this.starServices.post(this, Page,this.Body).subscribe(result => {
    if (result != null)
    {
      if (this.paramConfig.DEBUG_FLAG) console.log("------result::",result.data[0].data);
      //if (this.paramConfig.DEBUG_FLAG) console.log(result.data[0].data);
      var columns = result.data[0].data[0];
      if (this.paramConfig.DEBUG_FLAG) console.log ("columns:",columns)
      var columnsDef = [];
      for (var key in columns) {
        if (this.paramConfig.DEBUG_FLAG) console.log(key);
        if (this.paramConfig.DEBUG_FLAG) console.log(columns[key]);
        var fieldName = key;
        var fieldType = "text";
        var fieldFormat ={} ;
        var fieldLookup = true;

        var n = fieldName.toUpperCase().search("_DATE");
        var fieldWidth =50;
        if (n != -1){
          fieldType = "date"
          fieldWidth = 250
          fieldFormat= "{0:d}";
          fieldLookup = false;
        }

        var fieldNameCaps = this.starServices.CapitalizeTitle(fieldName);

        var field = {
          field: fieldName,
          title: fieldNameCaps ,
          type: fieldType,
          width : fieldWidth,
          style :"width:50px;",
          format :fieldFormat,
          lookup: fieldLookup
        }
        columnsDef.push(field)
        var lkpDef = this.starServices.prepareLookup(fieldName, this.paramConfig);
        this.lookupArrDef.push(lkpDef);


      }
      if (this.paramConfig.DEBUG_FLAG) console.log("columnsDef:", columnsDef)
      this.columns = columnsDef;
      this.starServices.fetchLookups(this, this.lookupArrDef);


      //for (var i=0; i < result.data[0].data.length;i++)
        //result.data[0].data[i] = this.starServices.parseToDate(result.data[0].data[i]);
      for (var i=0; i < result.data[0].data.length;i++)
        result.data[0].data[i] = this.starServices.dateYYYYMMDD(this, result.data[0].data[i]);

      this.gridData  = result.data[0].data;
      this.grid.loading = false;
    }
  },
  err => {
    this.grid.loading = false;
    this.grid.data = [];
    if (this.paramConfig.DEBUG_FLAG) console.log("err:",err.error)
    this.starServices.showNotification ("error","error:" + err.error.error);
  });
  
  
}
public ngAfterContentChecked() {
  this.starServices.setRTL();
}
  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
  if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:",ComponentConfig);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.showToolBar != null)
          this.showToolBar = ComponentConfig.showToolBar;
      if (ComponentConfig.queryable != null)
          this.queryable = ComponentConfig.queryable;
      if (ComponentConfig.insertable != null)
          this.insertable = ComponentConfig.insertable;



      if (ComponentConfig.masterSaved != null) {
          this.saveChanges(this.grid);
          ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {
          this.isDYNAMIC_FIELDEnable = false;
          this.masterKey = ComponentConfig.masterKey;
      }
      if (ComponentConfig.masterKeyArr != null) {
          this.masterKeyArr = ComponentConfig.masterKeyArr;
      }
      if (ComponentConfig.masterKeyNameArr != null) {
          this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
      }

      if (ComponentConfig.isChild == true) {
          this.isChild = true;
      }
      if (ComponentConfig.clearComponent == true) {
          this.cancelHandler();
          this.grid.cancel;
          this.grid.data = [];
          this.Body = [];
      }
      if (ComponentConfig.formattedWhere != null) {
          this.formattedWhere = ComponentConfig.formattedWhere;
          this.isSearch = true;
          this.executeQuery(this.grid)

      }
      if (ComponentConfig.masterParams != null) {
        if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig.masterParams.reportTitle:", ComponentConfig.masterParams.reportTitle)
          this.title = ComponentConfig.masterParams.reportTitle;
          var NewVal = ComponentConfig.masterParams.body;
          this.getData(NewVal);
      }


  }

}
}
