import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { starServices } from 'starlib';
import { formDef, componentConfigDef } from '@modeldir/model';

const createFormGroup = (dataItem:any) => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
  'FORM_DESC': new FormControl(dataItem.FORM_DESC),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
});

declare function getParamConfig(): any;


@Component({
  selector: 'app-dsp-form-def-form',
  templateUrl: './dsp-form-def-form.component.html',
  styleUrls: ['./dsp-form-def-form.component.css']
})

export class DspFormDefFormComponent {
  public title = "Form properties";
  private insertCMD = "INSERT_DSP_FORM_DEF";
  private updateCMD = "UPDATE_DSP_FORM_DEF";
  private deleteCMD = "DELETE_DSP_FORM_DEF";
  private getCMD = "GET_DSP_FORM_DEF_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public form: FormGroup;
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  private CurrentRec = 0;
  public executeQueryresult: any;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isFORM_NAMEEnable: boolean = true;
  private Body:any = [];
  private isNew!: boolean;
  public primarKeyReadOnlyArr = { isFORM_NAMEreadOnly: false };
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public masterKey = "";
  public masterKeyName = "FORM_NAME";
  public formattedWhere:any = null;
  public submitted = false;
  private formInitialValues:any = new formDef();
  public showToolBar = false;
  public userLang = "EN";
  public lookupArrDef:any = [{
    "statment": "SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='FORM_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
    "lkpArrName": "lkpArrFORM_NAME"
  }];
  public lkpArrFORM_NAME = [];
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(private starServices: starServices) {
    this.componentConfig = new componentConfigDef();
    this.paramConfig = getParamConfig();
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

  @Input() public set executeQueryInput(form: any) {
    if ((typeof form != "undefined") && form.type == "form" && (typeof form.data.FORM_NAME != "undefined") && (form.data.FORM_NAME != "")) {
      this.isFORM_NAMEEnable = false;
      this.isSearch = true;
      this.executeQuery(form.data);
      this.isChild = false;
    }
    else {
      if (typeof this.form != "undefined") {
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

  public lkpArrGetFORM_NAME(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFORM_NAME.find((x:any) => x.CODE === CODE);
    return rec;
  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('FORM_NAME').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
  }

  public printScreen() {
    window.print();
  }

  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("dsp-form-def-form ComponentConfig:", ComponentConfig);

      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;

      if (ComponentConfig.masterSaved != null) {
        this.saveChanges(this.form);
        ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {
        this.isFORM_NAMEEnable = false;

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

  public callBackFunction(data:any) {
    // if (this.paramConfig.DEBUG_FLAG) console.log("ELHAMY:", this.executeQueryresult.data)
  }
}


