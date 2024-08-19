import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';
import { dynamic, sampleProducts, componentConfigDef } from '@modeldir/model';
import { formatDate } from '@angular/common';
import { isNumber } from '@angular-package/type';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
/*
const createFormGroup = dataItem => new FormGroup({
'DYNAMIC_FIELD' : new FormControl(dataItem.DYNAMIC_FIELD  , Validators.required )
});
*/

////////////////////////////////
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  numericboxfield?:string;
  emailboxfield?:string;
  numericSpinner?:boolean;
  numericStep?:number;
  numericMin?:number;
  numericMax?:number;
  dateInputfield?:string;
  checkboxfield?:string;
  passwordfield?:string;
  datefield?:string;
  lookup?:string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
}
////////////////////////////////

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig(): any;
declare function setParamConfig(var1): any;

@Component({
  selector: 'app-dsp-dynamic-rw-grid',
  templateUrl: './dsp-dynamic-rw-grid.component.html',
  styleUrls: ['./dsp-dynamic-rw-grid.component.css'
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

export class DspDynamicRwGridComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)

  public grid: GridComponent;

  //@Input()
  public showToolBar = true;

  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup;//: FormGroup;
  private editedRowIndex: number;
  private docClickSubscription: any;
  private isNew: boolean;
  public queryable: boolean = true;
  public insertable: boolean = true;

  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isDYNAMIC_FIELDEnable: boolean = true;


  public isFilterable: boolean = false;
  public isColumnMenu: boolean = false;

  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey = "";
  private masterKeyName = "";
  private insertCMD = "INSERT_DSP_DYNAMIC_RW";
  private updateCMD = "UPDATE_DSP_DYNAMIC_RW";
  private deleteCMD = "DELETE_DSP_DYNAMIC_RW";
  private getCMD = "GET_DSP_DYNAMIC_RW_QUERY";

  public executeQueryresult: any;
  public title = "Dynamic Rw";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere = null;
  public paramConfig;
  public createFormGroupGrid = this.createFormGroup;
  public templateFields;
  public pageNo = 0;
  public areaNo = 0;
  public areaTitle = "";
  public areaDataName = "";
  public areaType = "";
  public areaProtected = 0;
  public areaHelp = "";
  public formType = "";

  private Body = [];
  ////////////////////////////////////
  public gridData: any[]; //= sampleProducts;
  ////////////////////////////////////

  public columns: ColumnSetting[];/*= [
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
 //public legend_color = "background-color: #0D2445;color:#ffffff";
// public header_style = {  'color' :'#ffffff'  }
public legend_color = "";
public header_style = {  }

//public header_style = { 'background-color': '#0D2445', 'color' :'#ffffff'  }

  ////////////////////////////////
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
    this.componentConfig.gridHeight = "500";
    this.componentConfig.showTitle = true;
  }


  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // this.starServices.fetchLookups(this, this.lookupArrDef);
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
    var out = process(this.executeQueryresult.data, this.state);
    if (this.paramConfig.DEBUG_FLAG) console.log(out);
    this.grid.data = out;
    if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
  }

  @Input() public set detail_Input(grid: any) {

    if ((typeof this.grid != "undefined") && (grid.DYNAMIC_FIELD != "") && (typeof grid.DYNAMIC_FIELD != "undefined")) {
      if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input DspDynamicRwGrid grid.DYNAMIC_FIELD :' + grid.DYNAMIC_FIELD);
      this.masterKey = grid.DYNAMIC_FIELD;
      this.isDYNAMIC_FIELDEnable = false;
      this.isSearch = true;
      this.executeQuery(grid);
      this.isChild = true;
      //this.showToolBar = false;
    }
    else {

      if (typeof this.grid != "undefined") {
        //this.isChild = false;
        this.grid.data = [];
        this.masterKey = "";
        this.isDYNAMIC_FIELDEnable = true;
      }
    }
  }
  /*
  const createFormGroup = dataItem => new FormGroup({
  'DYNAMIC_FIELD' : new FormControl(dataItem.DYNAMIC_FIELD  , Validators.required )
  });
  */
  private getFieldsRec(fieldID, templateFields) {
    var i = 0;
    var templateFieldsRec = null;
    while (i < templateFields.length) {
      //    if (this.paramConfig.DEBUG_FLAG) console.log("test:fieldID:", fieldID, " templateFields[i].FIELD_ID:", templateFields[i].FIELD_ID)
      if (fieldID == templateFields[i].FIELD_ID) {
        templateFieldsRec = templateFields[i];
        break;
      }
      i++;
    }
    return templateFieldsRec;
  }

  private createFormGroup(fields: any = {}) {
    if (this.paramConfig.DEBUG_FLAG) console.log("test4:fields:", fields, " this.templateFields:", this.templateFields)
    var Rec = {}

    for (var key in fields) {
      if (this.paramConfig.DEBUG_FLAG) console.log(key);
      var val = fields[key];
      if (this.paramConfig.DEBUG_FLAG) console.log(fields[key]);

      var formControl = new FormControl(val, Validators.required);
      var templateFieldsRec = this.getFieldsRec(key, this.templateFields);
      if (templateFieldsRec != null) {
        if (templateFieldsRec.FIELD_TYPE == "DATE") {
          if ((val == "") || (val == null))
            val = null;
          else {
            val = formatDate(val, this.paramConfig.DateFormat, this.paramConfig.dateLocale)
            val = new Date(val);
          }


        }
        if (templateFieldsRec != null) {
          if (templateFieldsRec.FIELD_REQUIRED == true)
            var formControl = new FormControl(val, Validators.required);
          else
            var formControl = new FormControl(val);
          Rec[key] = formControl;
        }
      }
    }

    if (this.paramConfig.DEBUG_FLAG) console.log("test4:Rec:", Rec)
    var rec1 = new FormGroup(Rec);

    return rec1;
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }


  public gridInitialValues = {};// = new dynamic();

  private addToBody(NewVal) {
    this.Body.push(NewVal);
  }
  private onDocumentClick(e: any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("onDocumentClick:")
    if (this.formGroup && this.formGroup.valid &&
      !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
      this.saveCurrent();
    }
  }


  public addHandler(): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("addHandler")
    this.starServices.addHandler_grid(this)
  }

  public cellClickHandler({ column, isEdited, dataItem, rowIndex }): void {
    //if (this.paramConfig.DEBUG_FLAG) console.log("test:isEdited", isEdited, " this.formGroup:", this.formGroup, " his.formGroup.valid:", this.formGroup.valid)
    if (isEdited || (this.formGroup && !this.formGroup.valid) || this.areaProtected == 1) {
      return;
    }

    if (this.paramConfig.DEBUG_FLAG) console.log("test:this.isNew", this.isNew);
    if (this.isNew) {
      rowIndex += 1;
    }
    this.saveCurrent();
    this.formGroup = this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);

    var rec = {
      "pageNo": this.pageNo,
      "areaNo": this.areaNo,
      "areaTitle": this.areaTitle,
      "areaDataName": this.areaDataName,
      "areaType": this.areaType,
      "data": this.formGroup.value

    }
    if (this.paramConfig.DEBUG_FLAG) console.log("test:rec:2:", rec)
    this.readCompletedOutput.emit(rec);
  }


  public enterQuery(grid: GridComponent): void {
    this.starServices.enterQuery_grid(grid, this);
  }


  public executeQuery(grid: GridComponent): void {
    this.starServices.executeQuery_grid(grid, this);
  }

  public saveChanges(grid: GridComponent): void {
    //this.starServices.saveChanges_grid( grid,this);
  }

  public cancelHandler(): void {
    this.starServices.cancelHandler_grid(this);
  }

  private closeEditor(): void {
    function getData(data) {
      return data.data;
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("test:closeEditor:this.grid.data:", this.grid.data)
    var gridData = getData(this.grid.data);
    var gridData1 = JSON.parse(JSON.stringify(gridData));
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:gridData:", gridData)
    var rec = {
      "pageNo": this.pageNo,
      "areaNo": this.areaNo,
      "areaTitle": this.areaTitle,
      "areaDataName": this.areaDataName,
      "areaType": this.areaType,
      "data": gridData1

    }
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:rec:1:", rec)
    this.saveCompletedOutput.emit(rec);
    this.starServices.closeEditor_grid(this);
  }

  private saveCurrent(): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("saveCurrent")
    this.starServices.saveCurrent_grid(this);
  }

  public removeHandler(sender) {
    if (this.paramConfig.DEBUG_FLAG) console.log("removing:sender", sender)
    this.starServices.removeHandler_grid(sender, this);

  }
  public removeButton(grid) {
    if (this.paramConfig.DEBUG_FLAG) console.log(" removeButton:", grid)
    this.starServices.removeHandler_grid(null, this);
  }

  public userLang = "EN";
  public lookupArrDef = [];


  public lkpArrGetfield(fieldName, row: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec;
    //  if (this.paramConfig.DEBUG_FLAG) console.log ("lkpArrGetfield:field" , fieldName, row[fieldName])
    var CODE = row[fieldName];
    var templateFieldsRec = this.getFieldsRec(fieldName, this.templateFields);
    var lkpArrName = "lkpArr" + templateFieldsRec.FIELD_LOOKUP;

    //if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
    rec = {
      CODE: CODE,
      CODETEXT_LANG: CODE
    };
    if ((typeof this[lkpArrName] !== "undefined") && (this[lkpArrName].length > 0)) {
      rec = this[lkpArrName].find(x => x.CODE === CODE);
    }
    return rec;
  }

  public getlkpArrField(fieldName) {
    var lkpArrName;
    var templateFieldsRec = this.getFieldsRec(fieldName, this.templateFields);
    if (templateFieldsRec != null) {
      lkpArrName = "lkpArr" + templateFieldsRec.FIELD_LOOKUP;
    }


    return this[lkpArrName];
  }

  public showGridData(jsonData, templateFields) {

    this.grid.loading = true;
    this.grid.data = [];

    function getProp(fieldFormat, key) {
      return (fieldFormat[key]);
    }




    if (this.paramConfig.DEBUG_FLAG) console.log("------result::", jsonData);
    //if (this.paramConfig.DEBUG_FLAG) console.log(rjsonData);
    if (this.paramConfig.DEBUG_FLAG) console.log("templateFields:", templateFields)
    var columnsDef = [];
    for (var i = 0; i < templateFields.length; i++) {
      var fieldName = templateFields[i].FIELD_ID;
      var fieldNameCaps = templateFields[i].FIELD_NAME;
      fieldNameCaps = this.starServices.getNLS([],templateFields[i].FIELD_ID, fieldNameCaps);
        var fieldFormat = ""; //{} ;
      var fieldWidth = 50;
      var fieldType = templateFields[i].FIELD_TYPE.toLowerCase();
      var fieldDate = false;
      var fieldLookup = false;
      var fieldCheckBox = false;
      var fieldPassword = false;
      var fieldEmailBox = false;
      var fieldNumericBox = false;
      var fieldDateInput = false;

      var numericSpinner = "false";
      var numericStep = 1;
      var numericMin = -100000000000000;
      var numericMax = 1000000000000000;

      if (fieldType == "date") {
        fieldWidth = 250
        fieldFormat = this.paramConfig.DateFormat//"{0:d}";
        fieldLookup = false;
        fieldDate = true;
      }

      if (templateFields[i].FIELD_LOOKUP != "") {
        var fieldLookup = true;

      }

      if (templateFields[i].FIELD_TYPE == "CHECKBOX") {
        fieldCheckBox = true;
        fieldType = "boolean";
      }
      if (templateFields[i].FIELD_TYPE == "PASSWORD") {
        fieldPassword = true;
        fieldType = "text";
      }
      if (templateFields[i].FIELD_TYPE == "EMAIL") {
        fieldEmailBox = true;
        fieldType = "text";
      }
      if (templateFields[i].FIELD_TYPE == "DATE_INPUT") {
        fieldWidth = 250
        fieldFormat = this.templateFields[i].FIELD_FORMAT;
        fieldLookup = false;
        fieldDateInput = true;
        fieldType = "date";
      }

      if (templateFields[i].FIELD_TYPE == "NUMERIC") {
        fieldNumericBox = true;
        //fieldType = "number";
        fieldFormat = this.templateFields[i].FIELD_FORMAT;
        if (this.paramConfig.DEBUG_FLAG) console.log("fieldFormat:", fieldFormat)
        if ((fieldFormat == "") || (fieldFormat == null)) {
          fieldFormat = "n2";
        }
        else {
          if (fieldFormat[0] == "{") {
            fieldFormat = JSON.parse(fieldFormat);
            //{"style": "currency","currency": "KWD ","currencyDisplay": "code","minimumFractionDigits":0, "min":0, "max":5, "spinners":true,"step":1, "maximumFractionDigits":1}

            numericSpinner = getProp(fieldFormat, "spinners")
            numericStep = getProp(fieldFormat, "step")
            numericMin = getProp(fieldFormat, "min")
            numericMax = getProp(fieldFormat, "max")
            if (this.paramConfig.DEBUG_FLAG) console.log("fieldFormat:", fieldFormat)
          }
        }

      }
      /*
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
*/
      var field = {
        field: fieldName,
        title: fieldNameCaps,
        type: fieldType,
        width: fieldWidth,
        style: "width:50px;",
        format: fieldFormat,
        lookup: fieldLookup,

        numericSpinner: numericSpinner,
        numericStep: numericStep,
        numericMin: numericMin,
        numericMax: numericMax,

        datefield: fieldDate,
        passwordfield: fieldPassword,
        emailboxfield: fieldEmailBox,
        numericboxfield: fieldNumericBox,
        dateInputfield: fieldDateInput,
      }
      columnsDef.push(field)
      this.gridInitialValues[fieldName] = templateFields[i].FIELD_DEFAULT;

      var lkpDef = this.starServices.prepareLookup(templateFields[i].FIELD_LOOKUP, this.paramConfig);
      this.lookupArrDef.push(lkpDef);


    }
    if (this.paramConfig.DEBUG_FLAG) console.log("test4:columnsDef:", columnsDef);
    if (this.paramConfig.DEBUG_FLAG) console.log("test4:gridInitialValues:", this.gridInitialValues)
    this.columns = columnsDef;
    this.starServices.fetchLookups(this, this.lookupArrDef);

    if (jsonData != null) {

      for (var i = 0; i < jsonData.length; i++) {
        for (var key in jsonData[i]) {
          if (this.paramConfig.DEBUG_FLAG) console.log(key);
          var val = jsonData[i][key];
          var valStr:string = jsonData[i][key];
          if (this.paramConfig.DEBUG_FLAG) console.log(jsonData[i][key]);

          var templateFieldsRec = this.getFieldsRec(key, this.templateFields);
          if (templateFieldsRec != null) {
            if ((templateFieldsRec.FIELD_TYPE == "DATE") || (templateFieldsRec.FIELD_TYPE == "DATE_INPUT")) {
              if ((val == "") || (val == null)) {
                //val = new  Date();
                val = null;
              }
              else
                val = new Date(val);
              if (this.paramConfig.DEBUG_FLAG) console.log("test:val:", val)
              jsonData[i][key] = val;

            }
            else if (templateFieldsRec.FIELD_TYPE == "NUMERIC") {
              let valNum = 0;
              if(isNumber(valStr))
                valNum = parseInt(valStr);
         
              jsonData[i][key] = valNum;
            }


          }
        }
      }
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("result:jsonData:", jsonData, " this.columns:", this.columns)
    this.gridData = jsonData;
    this.grid.loading = false;



  }
  public ngAfterContentChecked() {
    this.starServices.setRTL();
  }
  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:", ComponentConfig);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (this.paramConfig.DEBUG_FLAG) console.log("this.ComponentConfig:", this.componentConfig);
      if (ComponentConfig.showToolBar != null)
        this.showToolBar = ComponentConfig.showToolBar;
      if (ComponentConfig.queryable != null)
        this.queryable = ComponentConfig.queryable;
      if (ComponentConfig.insertable != null)
        this.insertable = ComponentConfig.insertable;



      if (ComponentConfig.masterSaved != null) {
        this.saveCurrent();
        this.closeEditor();
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
      if (ComponentConfig.title != null) {
        this.title = ComponentConfig.title;
      }

      if (ComponentConfig.masterParams != null) {
        if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig.masterParams:", ComponentConfig.masterParams)

        this.templateFields = ComponentConfig.masterParams.templateFields;
        if (this.paramConfig.DEBUG_FLAG) console.log("this.templateFields:", this.templateFields);
        if (ComponentConfig.masterParams.orderFields == "") {
          ComponentConfig.masterParams.orderFields = null;
        }
        this.pageNo = ComponentConfig.masterParams.pageNo;
        this.areaNo = ComponentConfig.masterParams.areaNo;
        this.areaTitle = ComponentConfig.masterParams.areaTitle;
        this.areaDataName = ComponentConfig.masterParams.areaDataName;
        this.areaType = ComponentConfig.masterParams.areaType;
        this.areaProtected = ComponentConfig.masterParams.areaProtected;
        
        this.componentConfig.showToolBar = !this.areaProtected;

        this.areaHelp = ComponentConfig.masterParams.areaHelp;
        this.formType = ComponentConfig.masterParams.formType

        var orderFields = JSON.parse(ComponentConfig.masterParams.orderFields);
        this.showGridData(orderFields,
          ComponentConfig.masterParams.templateFields);
      }


    }

  }

  @Input() public set setLanguageChanged(lang:any) {
    //TODO: Implement getNLS for translation in component
  }
}
