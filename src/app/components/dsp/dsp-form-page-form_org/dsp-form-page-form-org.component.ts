import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { starServices } from 'starlib';
import { formPage, tabsCodes, componentConfigDef } from '@modeldir/model';


const createFormGroup = (dataItem:any) => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME),
  'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
  'PAGE_ORDER': new FormControl(dataItem.PAGE_ORDER),
  'PAGE_HELP': new FormControl(dataItem.PAGE_HELP),
  'PAGE_TYPE': new FormControl(dataItem.PAGE_TYPE),
  'PAGE_TITLE': new FormControl(dataItem.PAGE_TITLE),
  'PAGE_ICON': new FormControl(dataItem.PAGE_ICON),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
});

declare function getParamConfig(): any;

@Component({
  selector: 'app-dsp-form-page-form-org',
  templateUrl: './dsp-form-page-form-org.component.html',
  styleUrls: ['./dsp-form-page-form-org.component.css']
})


export class DspFormPageFormOrgComponent {
  public title = "Form Page";
  private insertCMD = "INSERT_DSP_FORM_PAGE";
  private updateCMD = "UPDATE_DSP_FORM_PAGE";
  private deleteCMD = "DELETE_DSP_FORM_PAGE";
  private getCMD = "GET_DSP_FORM_PAGE_QUERY";
  public multiStepFormOpened: boolean = false;
  public fieldGridHeight = 400;

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public form: FormGroup;
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  public SOM_TABS_CODESGridConfig: componentConfigDef;
  public DSP_MULTISTEPFormConfig: componentConfigDef;

  private CurrentRec = 0;
  public executeQueryresult: any;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isTEMPLATE_NAMEEnable: boolean = true;
  private Body:any = [];
  private isNew!: boolean;
  public primarKeyReadOnlyArr = { isPAGE_NOreadOnly: false };
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public masterKey = "";
  public masterKeyName = "TEMPLATE_NAME";
  public formattedWhere:any = null;
  public submitted = false;
  public formDefOpened: boolean = false;
  public grid_som_tabs_codes: tabsCodes;

  //@Input()
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {
    this.componentConfig = new componentConfigDef();
    this.paramConfig = getParamConfig();
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = this.fieldGridHeight;

  }

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
  public ngOnInit(): void {
    this.form = createFormGroup(
      this.formInitialValues
    );
    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

  }

  private formInitialValues:any = new formPage();

  @Input() public set executeQueryInput(form: any) {
    if ((typeof form != "undefined") && (typeof form.TEMPLATE_NAME != "undefined") && (form.TEMPLATE_NAME != "")) {
      this.isTEMPLATE_NAMEEnable = false;
      this.isSearch = true;
      this.executeQuery(form);
      this.isChild = true;
      //this.showToolBar = false;
    }
    else {

      if (typeof this.form != "undefined") {
        //this.isChild = false;
        this.form.reset();
        this.masterKey = "";
      }
    }
  }

  get f():any { return this.form.controls; }
  public executeQuery(form: any): void {
    this.starServices.executeQuery_form(form, this);
  }

  private addToBody(NewVal:any) {
    this.Body.push(NewVal);
  }

  public onCancel(e:any): void {
    this.starServices.onCancel_form(e, this);
  }

  public onNew(e:any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("this.masterKeyNameArr:", this.masterKeyNameArr, "this.masterKeyNameArr.length", this.masterKeyNameArr.length)
    if (this.masterKeyNameArr.length != 0) {
      for (var i = 0; i < this.masterKeyNameArr.length; i++) {
        if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyNameArr[i] + ":" + this.masterKeyArr[i])
        this.formInitialValues[this.masterKeyNameArr[i]] = this.masterKeyArr[i];
      }
    }
    else {
      if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyName + this.masterKey)
      this.formInitialValues[this.masterKeyName] = this.masterKey;
    }
    this.starServices.onNew_form(e, this);
  }

  public onRemove(form): void {
    this.starServices.onRemove_form(form, this);
  }

  public enterQuery(form: any): void {

    this.starServices.enterQuery_form(form, this);
  }

  public saveChanges(form: any): void {
    this.Body = [];
    this.starServices.saveChanges_form(form, this);
  }

  public goRecord(target: any): void {
    this.starServices.goRecord(target, this);
  }

  public formDefOpen() {
    this.formDefOpened = true;
    this.SOM_TABS_CODESGridConfig = new componentConfigDef();
    this.SOM_TABS_CODESGridConfig.showSave = true;

    this.grid_som_tabs_codes = new tabsCodes();
    this.grid_som_tabs_codes.CODENAME = "FORM_NAME";
  }

  public formDefClose() {
    if (this.paramConfig.DEBUG_FLAG) console.log("formDefClose: this.formDefOpened:", this.formDefOpened)
    this.formDefOpened = false;
    this.lookupArrDef = [{
      "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='FORM_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
      "lkpArrName": "lkpArrFORM_NAME"
    }];
    this.starServices.fetchLookups(this, this.lookupArrDef);
  }
  public multiStepFormClose() {
    this.multiStepFormOpened = false;
  }
  public showMultiStepForm(mode) {

    var orderFields = "[]";
    var formVal = this.form.value;
    if (formVal.FORM_NAME != "") {

      var formPagesNo = "";
      if (mode == 1)
        formPagesNo = "" + formVal.PAGE_NO;

      var masterParams = {
        "formName": formVal.FORM_NAME,
        "formPagesNo": formPagesNo,
        "orderFields": orderFields
      };
      if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;
      this.multiStepFormOpened = true;
    }
  }
  public savemultiStepFormCompletedHandler(DSP_MULTISTEP) {
    this.multiStepFormOpened = false;
  }
  public userLang = "EN";
  public lookupArrDef:any = [{
    "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='FORM_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName": "lkpArrFORM_NAME"
  },
  {
    "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='PAGE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName": "lkpArrPAGE_TYPE"
  },
  {
    "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='PAGE_ICON' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName": "lkpArrPAGE_ICON"
  }];

  public lkpArrFORM_NAME = [];

  public lkpArrPAGE_TYPE = [];

  public lkpArrPAGE_ICON = [];

  public lkpArrGetFORM_NAME(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFORM_NAME.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetPAGE_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrPAGE_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetPAGE_ICON(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrPAGE_ICON.find((x:any) => x.CODE === CODE);
    return rec;
  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('FORM_NAME').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
    //@ts-ignore: Object is possibly 'null'.
this.form.get('PAGE_TYPE').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
    //@ts-ignore: Object is possibly 'null'.
this.form.get('PAGE_ICON').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
  }


  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("dsp-form-page-form ComponentConfig:", ComponentConfig);

      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;

      if (ComponentConfig.masterSaved != null) {
        this.saveChanges(this.form);
        ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {
        this.isTEMPLATE_NAMEEnable = false;
        this.masterKey = ComponentConfig.masterKey;
      }
      if (ComponentConfig.masterKeyArr != null) {
        this.masterKeyArr = ComponentConfig.masterKeyArr;
      }
      if (ComponentConfig.masterKeyNameArr != null) {
        this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
      }

      if (ComponentConfig.formattedWhere != null) {
        this.formattedWhere = ComponentConfig.formattedWhere;
        this.isSearch = true;
        this.executeQuery(this.form)

      }

    }
  }


}


