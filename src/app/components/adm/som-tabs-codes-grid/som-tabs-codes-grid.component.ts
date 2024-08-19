import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';
import { Starlib1 } from '../../Starlib1';
import { tabsCodes, componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
const createFormGroup = dataItem => new FormGroup({
  'CODENAME': new FormControl(dataItem.CODENAME, Validators.required),
  'CODE': new FormControl(dataItem.CODE, Validators.required),
  'PARTCODE': new FormControl(dataItem.PARTCODE),
  'LANGUAGE_NAME': new FormControl(dataItem.LANGUAGE_NAME, Validators.required),
  'CODETEXT_LANG': new FormControl(dataItem.CODETEXT_LANG),
  'CODEVALUE_LANG': new FormControl(dataItem.CODEVALUE_LANG),
  'LAST_UPDATE': new FormControl(dataItem.LAST_UPDATE),
  'FLEX_FLD1': new FormControl(dataItem.FLEX_FLD1),
  'FLEX_FLD2': new FormControl(dataItem.FLEX_FLD2),
  'FLEX_FLD3': new FormControl(dataItem.FLEX_FLD3),
  'FLEX_FLD4': new FormControl(dataItem.FLEX_FLD4),
  'FLEX_FLD5': new FormControl(dataItem.FLEX_FLD5)
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig(): any;
declare function setParamConfig(var1): any;



@Component({
  selector: 'app-som-tabs-codes-grid',
  templateUrl: './som-tabs-codes-grid.component.html',
  styleUrls: ['./som-tabs-codes-grid.component.css'
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

export class SomTabsCodesGridComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)

  public grid: GridComponent;
  public gridData = [];

  //@Input()    
  public showToolBar = true;
  public FORM_TRIGGER_FAILURE;
  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private docClickSubscription: any;
  private isNew: boolean;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isCODENAMEEnable: boolean = true;
  public isFilterable: boolean = false;
  public isColumnMenu: boolean = false;

  private masterKey = "";
  public masterKeyName = "CODENAME";
  private insertCMD = "INSERT_SOM_TABS_CODES";
  private updateCMD = "UPDATE_SOM_TABS_CODES";
  private deleteCMD = "DELETE_SOM_TABS_CODES";
  private getCMD = "GET_SOM_TABS_CODES_QUERY";

  public executeQueryresult: any;
  public title = "System Code Detail";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public gridHeight = 500;
  public paramConfig;
  public primarKeyReadOnlyArr = { isCODENAMEreadOnly: false, isCODEreadOnly: false };
  public createFormGroupGrid = createFormGroup;

  private Body = [];
  public showSave: boolean = false;

  dataItemToRemove

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices, private renderer: Renderer2 , private starlib1: Starlib1,) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
  }

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.starServices.fetchLookups(this, this.lookupArrDef);
    // this.readCompletedOutput.subscribe(data => {
    //   this.gridData = JSON.parse(JSON.stringify((this.grid.data as any).data))
    // })
    // this.saveCompletedOutput.subscribe(data => {
    //   let gridDataAfterDeletion: [] = JSON.parse(JSON.stringify((this.grid.data as any).data))

    //   let difference = this.gridData.filter(x => !gridDataAfterDeletion.some(z => z["CODE"] == x["CODE"]));

    //   difference.forEach(formData => {
    //     this.Body = []

    //     this.addToBody({
    //       "_QUERY": "DELETE_DSP_FORM_FIELDS",
    //       "FORM_NAME": formData["CODETEXT_LANG"],
    //       "PAGE_NO": "%",
    //       "AREA_NO": "%",
    //       "FIELD_ID": "%"
    //     })

    //     this.addToBody({
    //       "_QUERY": "DELETE_DSP_FORM_AREA",
    //       "FORM_NAME": formData["CODETEXT_LANG"],
    //       "PAGE_NO": "%",
    //       "AREA_NO": "%",
    //     })

    //     this.addToBody({
    //       "_QUERY": "DELETE_DSP_FORM_PAGE",
    //       "FORM_NAME": formData["CODETEXT_LANG"],
    //       "PAGE_NO": "%",
    //     })

    //     this.starServices.post(this, "&_trans=Y", this.Body);
    //   })

    //   this.gridData = JSON.parse(JSON.stringify(gridDataAfterDeletion))
    // })
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

    if ((typeof grid != "undefined") && (grid.CODENAME != "")) {
      if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input thisgrid:', this.grid, ' grid.CODENAME :', grid.CODENAME);
      if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.CODENAME :' + grid.CODENAME);
      this.masterKey = grid.CODENAME;
      this.isCODENAMEEnable = false;
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
        this.isCODENAMEEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }


  private gridInitialValues = new tabsCodes();

  private addToBody(NewVal) {
    this.Body.push(NewVal);
    if (this.paramConfig.DEBUG_FLAG) console.log('this.Body : ' + JSON.stringify(this.Body));
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
      !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
      if (this.paramConfig.DEBUG_FLAG) console.log("onDocumentClick")
      this.saveCurrent();
    }
  }


  public addHandler(): void {
    this.starServices.addHandler_grid(this);
    return;
    /* if (this.isChild == true){
     if (this.masterKey == ""){
       this.starServices.showOkMsg(this,this.starServices.saveMasterMsg,"Error");
       return;
     }
   }
   if (this.paramConfig.DEBUG_FLAG) console.log( "cellCliaddHandlerckHandler")
   this.saveCurrent();
   this.gridInitialValues.CODENAME = this.masterKey;
       this.closeEditor();
       this.formGroup = createFormGroup(
         this.gridInitialValues
       );
     this.isNew = true;
     this.grid.addRow(this.formGroup);*/
  }

  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    this.dataItemToRemove = dataItem

    if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler")
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
  }


  public enterQuery(grid: any): void {
    this.starServices.enterQuery_grid(grid, this);
  }


  public executeQuery(grid: any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log('executeQuery thisgrid:', this.grid);
    if (this.paramConfig.DEBUG_FLAG) console.log(grid);
    this.starServices.executeQuery_grid(grid, this);
  }

  public saveChanges(grid: any): void {
    this.starServices.saveChanges_grid(grid, this);
  }

  public cancelHandler(): void {
    this.starServices.cancelHandler_grid(this);
  }

  private closeEditor(): void {
    this.starServices.closeEditor_grid(this);
  }

  public saveCurrent() {
    if (typeof this.formGroup !== "undefined") {
      if (this.formGroup.valid == false) {
        let invalid = this.starlib1.getInvalidControls_grid(this);
        this.FORM_TRIGGER_FAILURE = true;
        //this.starServices.endTrans(this, false);
        return false;
      }
    }
  this.starServices.saveCurrent_grid( this);
  return true;
}

  public removeHandler(sender) {

    this.starServices.removeHandler_grid(sender, this);

  }
  public printScreen() {
    window.print();
  }
  async setData(masterParams)
  {
    
    this.masterKey = masterParams.CODENAME;
    
     this.addHandler();
     console.log("testx:this.grid.data:",this.grid.data)
    let rec  = new tabsCodes();
    //rec.CODENAME = masterParams.CODENAME;
    rec.CODE = masterParams.CODE;
    rec.CODETEXT_LANG = masterParams.CODETEXT_LANG;
    rec.LANGUAGE_NAME = 'EN';
    this.formGroup.patchValue(rec);
    await this.starServices.sleep(500);
    this.formGroup.patchValue({ 'CODENAME': masterParams.CODENAME });
    this.isChild = false;
    this.formGroup.markAsDirty();
    //this.formGroup.setValue( rec);
    console.log ("testx:this.formGroup.",this.formGroup.value);
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("componentConfig:",ComponentConfig);
    if (typeof ComponentConfig !== "undefined") {
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);

      if (ComponentConfig.showSave != null) {
        this.showSave = ComponentConfig.showSave;
      }

      if (ComponentConfig.masterSaved != null) {
        this.saveChanges(this.grid);
        ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {
        this.isCODENAMEEnable = false;
        this.masterKey = ComponentConfig.masterKey;
      }
      if (ComponentConfig.masterParams != null) {
        let masterParams = ComponentConfig.masterParams;
        if (masterParams.action == "ADD"){
          this.isChild = false;
          //this.setData(masterParams);
        }
      }

    }
  }

  onRemoveClicked() {
    let item = this.grid.data['data'].find(e => e["CODE"] == this.dataItemToRemove.CODE)

    let body = [{
      "_QUERY": "GET_DSP_TEMPLATE_QUERY",
      "_WHERE": `FORM_NAME = '${item["CODETEXT_LANG"]}'`
    }]

    this.starServices.post(this, "&_trans=Y", body).subscribe(res => {
      console.log("ELHAMY", res)
      if (res.data[0].data.length > 0) {
        this.starServices.showOkMsg(this, "There is one or more templates related to this form", "Warning");
      } else {
        let data = this.grid.data['data'].filter(e => e["CODE"] != this.dataItemToRemove.CODE)
        this.grid.data = {
          data: data,
          total: data.length
        }
      }
    })


  }
  public userLang = "EN" ; 

  public lookupArrDef = [{
    "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='LANGUAGE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrLANGUAGE_NAME"
  }];


public lkpArrLANGUAGE_NAME = [];

public lkpArrGetLANGUAGE_NAME(CODE : any): any {
var rec = this.lkpArrLANGUAGE_NAME.find(x => x.CODE === CODE);
return rec;
}

}


