import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import { formFields, componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
const createFormGroup = dataItem => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
  'PAGE_NO': new FormControl(dataItem.PAGE_NO),
  'AREA_NO': new FormControl(dataItem.AREA_NO),
  'FIELD_ID': new FormControl(dataItem.FIELD_ID, Validators.required),
  'FIELD_ROW': new FormControl(dataItem.FIELD_ROW),
  'FIELD_ORDER': new FormControl(dataItem.FIELD_ORDER),
  'FIELD_NAME': new FormControl(dataItem.FIELD_NAME),
  'FIELD_TYPE': new FormControl(dataItem.FIELD_TYPE),
  'FIELD_LOOKUP': new FormControl(dataItem.FIELD_LOOKUP),
  'FIELD_DEFAULT': new FormControl(dataItem.FIELD_DEFAULT),
  'FIELD_REQUIRED': new FormControl(dataItem.FIELD_REQUIRED),
  'FIELD_FORMAT': new FormControl(dataItem.FIELD_FORMAT),
  'FIELD_HELP': new FormControl(dataItem.FIELD_HELP),
  'FIELD_PROTECTED': new FormControl(dataItem.FIELD_PROTECTED),
  'FIELD_SHOW_IF': new FormControl(dataItem.FIELD_SHOW_IF),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig(): any;
declare function setParamConfig(var1): any;

@Component({
  selector: 'app-dsp-form-fields-grid',
  templateUrl: './dsp-form-fields-grid.component.html',
  styleUrls: ['./dsp-form-fields-grid.component.css'
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

export class DspFormFieldsGridComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)

  public grid: GridComponent;

  //@Input()
  public showToolBar = true;

  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private selectedRowIndex: number;
  private selectedfieldName;
  private docClickSubscription: any;
  private isNew: boolean;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isFORM_NAMEEnable: boolean = true;
  public isPAGE_NOEnable: boolean = true;
  public isAREA_NOEnable: boolean = true;

  public isFIELD_IDEnable: boolean = true;

  public isFilterable: boolean = false;
  public isColumnMenu: boolean = false;
  public editorFormOpened: boolean = false;
  public areaType;

  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey = "";
  private masterKeyName = "FORM_NAME";
  private insertCMD = "INSERT_DSP_FORM_FIELDS";
  private updateCMD = "UPDATE_DSP_FORM_FIELDS";
  private deleteCMD = "DELETE_DSP_FORM_FIELDS";
  private getCMD = "GET_DSP_FORM_FIELDS_QUERY";

  public executeQueryresult: any;
  public title = "Form Fields";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public DSP_EDITORFormConfig: componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere = null;
  public primarKeyReadOnlyArr = { isFORM_NAMEreadOnly: false, isPAGE_NOreadOnly: false, isAREA_NOreadOnly: false, isFIELD_IDreadOnly: false };
  public paramConfig;
  public createFormGroupGrid = createFormGroup;

  private Body = [];
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
    this.componentConfig.gridHeight = "500";
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
    var out = process(this.executeQueryresult.data, this.state);
    if (this.paramConfig.DEBUG_FLAG) console.log(out);
    this.grid.data = out;
    if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
  }

  @Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input DspFormFieldsGrid grid :', grid);
    if ((grid.FORM_NAME != "") && (typeof grid.FORM_NAME != "undefined")) {
      this.masterKey = grid.FORM_NAME;
      this.isFORM_NAMEEnable = false;
      this.isPAGE_NOEnable = false;
      this.isAREA_NOEnable = false;

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
        this.isFORM_NAMEEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }


  private gridInitialValues = new formFields();

  private addToBody(NewVal) {
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

  public cellClickHandler({ column, isEdited, dataItem, rowIndex }): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler", column.field, column, dataItem)
    var val = dataItem[column.field];
    var fieldName = column.field;
    var fieldType = column.filter;
    if (this.paramConfig.DEBUG_FLAG) console.log("val:", val, " fieldType:", fieldType, " fieldName:", fieldName, " dataItem:", dataItem);
    if ((fieldName == "FIELD_DEFAULT") && ((dataItem.FIELD_TYPE == "HTML") || (dataItem.FIELD_TYPE == "TEXT_AREA")) || (fieldName == "FIELD_HELP")) {
      const FIELD_TYPE = fieldName == "FIELD_HELP" ? "TEXT_AREA" : dataItem.FIELD_TYPE

      var masterParams = {
        "val": val,
        "editorType": FIELD_TYPE
      };
      this.DSP_EDITORFormConfig = new componentConfigDef();
      this.DSP_EDITORFormConfig.masterParams = masterParams;
      this.DSP_EDITORFormConfig.title = "Default Value";
      this.editorFormOpened = true;
      if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_EDITORFormConfig:", this.DSP_EDITORFormConfig);
    }

    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }
    if (this.isNew) {
      rowIndex += 1;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.selectedRowIndex = rowIndex;
    this.selectedfieldName = fieldName;
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:", rowIndex, this.formGroup);
    this.grid.editRow(rowIndex, this.formGroup);
    this.readCompletedOutput.emit(this.formGroup.value);
  }


  public enterQuery(grid: GridComponent): void {
    this.starServices.enterQuery_grid(grid, this);
  }


  public executeQuery(grid: GridComponent): void {
    this.starServices.executeQuery_grid(grid, this);
  }
  public checkFieldID(grid) {
    var gridData = grid.data;
    if (this.paramConfig.DEBUG_FLAG) console.log("gridData:", gridData)
    var i = 0;
    var valid = true;
    var oneRequired = 0;
    while (i < gridData.data.length) {
      if (this.paramConfig.DEBUG_FLAG) console.log("gridData.data[i].FIELD_REQUIRED :", gridData.data[i].FIELD_REQUIRED)
      if (gridData.data[i].FIELD_REQUIRED == 1) {
        oneRequired = 1;
      }
      var fieldID = gridData.data[i].FIELD_ID;
      valid = this.validateFieldID(fieldID);
      if (!valid)
        break;
      i++;
    }
    if (!oneRequired) {
      var errorMsg = "At least one field should be checked as required";
      var dialogStruc = {
        msg: errorMsg,
        title: "Error",
        info: null,
        object: this,
        action: this.starServices.OkActions,
        callback: null
      };
      this.starServices.showConfirmation(dialogStruc);
      return false;
    }

    return valid;
  }
  public saveChanges(grid: GridComponent): void {
    this.saveCurrent();
    var valid = true
    if (this.areaType == "GRID")
      valid = this.checkFieldID(grid);

    if (valid) {
      this.starServices.saveChanges_grid(grid, this);
    }
  }


  public cancelHandler(): void {
    this.starServices.cancelHandler_grid(this);
  }
  public validateFieldID(fieldID) {
    if ((fieldID != "") && (fieldID != null)) {
      var valid = fieldID.match(/^[0-9a-z_]+$/i);
      if (this.paramConfig.DEBUG_FLAG) console.log("test:valid1:", valid);
      if (valid != null) {
        var firstChar = fieldID[0];
        valid = firstChar.match(/^[a-z]+$/i);
        if (this.paramConfig.DEBUG_FLAG) console.log("test:valid1:", valid, " firstChar:", firstChar);
      }
      if (valid == null) {
        var errorMsg = "fieldID ID should be Alpha numeric and not starting with a number";
        var dialogStruc = {
          msg: errorMsg,
          title: "Error",
          info: null,
          object: this,
          action: this.starServices.OkActions,
          callback: null
        };
        this.starServices.showConfirmation(dialogStruc);
        return false;
      }
    }
    return true;
  }
  private closeEditor(): void {
    this.starServices.closeEditor_grid(this);
  }

  private saveCurrent(): void {
    this.starServices.saveCurrent_grid(this);
  }

  public removeHandler(sender) {

    this.starServices.removeHandler_grid(sender, this);

  }
  public editorFormClose() {
    this.editorFormOpened = false;
  }
  public saveFormCompletedHandler(form_DSP_EDITOR) {
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: form_DSP_EDITOR:", form_DSP_EDITOR, " this.selectedRowIndex:", this.selectedRowIndex);
    var NewVal;
    var grid_data = JSON.parse(JSON.stringify(this.grid.data));
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: grid_data:", grid_data);
    NewVal = grid_data.data[this.selectedRowIndex];
    if (this.paramConfig.DEBUG_FLAG) console.log("test1: NewVal:", NewVal);
    if (typeof NewVal !== "undefined") {
      NewVal[this.selectedfieldName] = form_DSP_EDITOR;
      if (this.paramConfig.DEBUG_FLAG) console.log("test1: NewVal:", NewVal);
      this.formGroup = createFormGroup(NewVal);
      this.editedRowIndex = this.selectedRowIndex;
      if (this.paramConfig.DEBUG_FLAG) console.log("test1:", this.selectedRowIndex, this.formGroup)
      this.grid.editRow(this.selectedRowIndex, this.formGroup);
      this.formGroup.markAsDirty();

    }
    this.editorFormOpened = false;
  }

  public userLang = "EN";
  public lookupArrDef = [{
    "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='FIELD_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName": "lkpArrFIELD_TYPE"
  },
  {
    "statment": "SELECT CODENAME CODE, CODETEXT CODETEXT_LANG FROM SOM_TABS_CODES_SPEC order by CODETEXT_LANG",
    "lkpArrName": "lkpArrFIELD_LOOKUP"
  }];

  public lkpArrFIELD_TYPE = [];

  public lkpArrFIELD_LOOKUP = [];

  public lkpArrGetFIELD_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFIELD_TYPE.find(x => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetFIELD_LOOKUP(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFIELD_LOOKUP.find(x => x.CODE === CODE);
    return rec;
  }

  public valueChangeFIELD_TYPE(value: any): void {
    //this.lookupArrDef =[];
    //this.starServices.fetchLookups(this, this.lookupArrDef);
  }
  public valueChangeFIELD_LOOKUP(value: any): void {
    //this.lookupArrDef =[];
    //this.starServices.fetchLookups(this, this.lookupArrDef);
  }

  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("detail ComponentConfig:", ComponentConfig);

    if (typeof ComponentConfig !== "undefined") {
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.showToolBar != null)
        this.showToolBar = ComponentConfig.showToolBar;

      if (ComponentConfig.isMaster == true) {
        this.isMaster = true;
      }
      if ((ComponentConfig.masterParams != null) && (typeof this.grid != "undefined")) {
        //this.grid.data = ComponentConfig.masterParams.result;
        this.areaType = ComponentConfig.masterParams.areaType;
      }

      if (ComponentConfig.masterSaved != null) {
        this.saveChanges(this.grid);
        ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {
        this.isFORM_NAMEEnable = false;
        this.isPAGE_NOEnable = false;
        this.isAREA_NOEnable = false;
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
        this.isFORM_NAMEEnable = false;
      }

      if (ComponentConfig.formattedWhere != null) {
        this.formattedWhere = ComponentConfig.formattedWhere;
        this.isSearch = true;
        if (typeof this.grid !== "undefined") {
          this.executeQuery(this.grid)
        }

      }
      if (ComponentConfig.clearComponent == true) {
        this.cancelHandler();
        this.grid.cancel;
        this.grid.data = [];
        this.Body = [];
      }
      if (ComponentConfig.clearScreen == true) {
        this.grid.data = [];
      }

    }

  }

}


