import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { starServices } from 'starlib';
import { formFields, componentConfigDef } from '@modeldir/model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'


const createFormGroup = (dataItem:any) => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
  'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
  'AREA_NO': new FormControl(dataItem.AREA_NO, Validators.required),
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
  'FIELD_ENABLER': new FormControl(dataItem.FIELD_ENABLER),
  'FIELD_SHOW_IF': new FormControl(dataItem.FIELD_SHOW_IF),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
}, { updateOn: 'blur' });

const createFormatGroup = dataItem => new FormGroup({
  'style': new FormControl(dataItem.style),
  'minimumFractionDigits': new FormControl(dataItem.minimumFractionDigits),
  'spinners': new FormControl(dataItem.spinners),
  'step': new FormControl(dataItem.step),
  'maximumFractionDigits': new FormControl(dataItem.maximumFractionDigits),
  'currency': new FormControl(dataItem.currency),
  'currencyDisplay': new FormControl(dataItem.currencyDisplay),
  'min': new FormControl(dataItem.min),
  'max': new FormControl(dataItem.max),
  'useGrouping': new FormControl(dataItem.useGrouping),
})

declare function getParamConfig(): any;

@Component({
  selector: 'app-dsp-form-fields-form',
  templateUrl: './dsp-form-fields-form.component.html',
  styleUrls: ['./dsp-form-fields-form.component.css']
})

export class DspFormFieldsFormComponent {
  @ViewChild("focusElement") focusElement: ElementRef<HTMLDivElement>

  public title = "Field properties";
  private insertCMD = "INSERT_DSP_FORM_FIELDS";
  private updateCMD = "UPDATE_DSP_FORM_FIELDS";
  private deleteCMD = "DELETE_DSP_FORM_FIELDS";
  private getCMD = "GET_DSP_FORM_FIELDS_QUERY";

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
  public isNew: boolean = false;
  public primarKeyReadOnlyArr = { isFORM_NAMEreadOnly: false, isPAGE_NOreadOnly: false, isAREA_NOreadOnly: false, isFIELD_IDreadOnly: false };
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public masterKey = "";
  public masterKeyName = "FORM_NAME";
  public formattedWhere:any = null;
  public submitted = false;
  public useAutoSave = true;
  public emitEvent = false

  formatEditorOpened = false
  currentField
  formatForm: FormGroup
  formatStyles = ["decimal", "currency", "percent", "scientific", "accounting"]
  currencyDisplays = ["symbol", "code", "name"]

  public editorFormOpened: boolean = false;
  public DSP_EDITORFormConfig: componentConfigDef;
  selectedEditorField

  gridHasRequiredField = false
  areaType

  //@Input()
  public showToolBar = false;
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

    this.formatForm = createFormatGroup({});

    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);

    this.readCompletedOutput.subscribe(() => {
      if (this.currentField && !this.currentField.isNew) {
        let formData = this.currentField.field
        formData.FIELD_ROW = formData.FIELD_ROW_NEW
        formData.FIELD_ORDER = formData.FIELD_ORDER_NEW
        formData.FIELD_DEFAULT = formData.FIELD_DEFAULT_NEW
        formData.FIELD_FORMAT = formData.FIELD_FORMAT_NEW

        this.form.reset(formData)
      }
    })

    this.form.valueChanges.pipe(
      distinctUntilChanged(),
      // debounceTime(500)
    ).subscribe(() => {
      if (this.useAutoSave && this.currentField && this.currentField["FIELD_ID"] == this.form.value["FIELD_ID"] && this.objectDifference(this.currentField.field, this.form.value).length > 0) {
        this.saveChanges(this.form)
        this.saveCompletedOutput.emit({
          type: "field",
          updating: true,
          data: this.form.value
        })
      }
    })
  }

  objectDifference(obj1, obj2) {
    let diff = []
    Object.keys(obj1).forEach(key => {
      if (!key.includes('_NEW') && !key.includes('_QUERY') && obj1[key] != obj2[key]) diff.push(key)
    })

    return diff
  }

  private formInitialValues:any = new formFields();

  @Input() public set executeQueryInput(form: any) {
    if ((typeof form != "undefined") && form.type == "field" && (typeof form.data.field.FORM_NAME != "undefined") && (form.data.field.FORM_NAME != "")) {
      this.isFORM_NAMEEnable = false;
      this.isSearch = true;
      this.isNew = form.data.isNew
      this.currentField = JSON.parse(JSON.stringify(form.data))
      this.gridHasRequiredField = form.gridHasRequiredField
      this.areaType = form.areaType

      let formData = JSON.parse(JSON.stringify(form.data))
      delete formData.field.FIELD_ROW_NEW
      delete formData.field.FIELD_ORDER_NEW
      delete formData.field.FIELD_DEFAULT_NEW
      delete formData.field.FIELD_FORMAT_NEW

      this.executeQuery(formData.field)

      this.isChild = false;
      this.primarKeyReadOnlyArr.isFIELD_IDreadOnly = !form.data.isNew
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
  get ff():any { return this.formatForm.controls; }

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
    this.currentField.field = form.value
    this.Body = [];
    this.starServices.saveChanges_form(form, this);
    this.isNew = false
  }

  public goRecord(target: any): void {
    this.starServices.goRecord(target, this);
  }

  public userLang = "EN";
  public lookupArrDef:any = [{
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
    var rec = this.lkpArrFIELD_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetFIELD_LOOKUP(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFIELD_LOOKUP.find((x:any) => x.CODE === CODE);
    return rec;
  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('FIELD_TYPE').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
    //@ts-ignore: Object is possibly 'null'.
this.form.get('FIELD_LOOKUP').valueChanges.subscribe(val => {
      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
  }


  public printScreen() {
    window.print();
  }

  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("dsp-form-fields-form ComponentConfig:", ComponentConfig);

      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;

      if (ComponentConfig.masterSaved != null && ComponentConfig.masterSaved == true) {
        this.focusElement.nativeElement.focus()
        setTimeout(() => {
          this.saveChanges(this.form);
          ComponentConfig.masterSaved = null;

          // this.saveCompletedOutput.emit({
          //   type: ComponentConfig.formMode,
          //   data: this.form.value
          // })
        }, 200)
      }
      if (ComponentConfig.masterDeleted != null && ComponentConfig.masterDeleted == true) {
        this.onRemove(this.form);
        ComponentConfig.masterDeleted = null;

        this.clearCompletedOutput.emit({
          type: ComponentConfig.formMode,
          data: this.form.value
        })
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

      // if (ComponentConfig.useAutoSave != null) {
      //   this.useAutoSave = ComponentConfig.useAutoSave
      // }
    }
  }

  inputClicked(id, type) {
    if (id == "FIELD_FORMAT" && this.form.value["FIELD_TYPE"] == "NUMERIC" && type == "format") {
      this.formatForm = createFormatGroup(JSON.parse(this.form.value[id] || "{}"))
      this.formatEditorOpened = true
      return
    }

    this.selectedEditorField = id

    let dataItem = this.form.value
    let FIELD_TYPE = id == "FIELD_HELP" ? "TEXT_AREA" : dataItem["FIELD_TYPE"]

    if (FIELD_TYPE == "TEXT_AREA" || FIELD_TYPE == "HTML" && (type == "editor" || type == "help")) {
      var masterParams = {
        "val": dataItem[id],
        "editorType": FIELD_TYPE
      }

      this.DSP_EDITORFormConfig = new componentConfigDef()
      this.DSP_EDITORFormConfig.masterParams = masterParams
      this.DSP_EDITORFormConfig.title = "Value"
      this.editorFormOpened = true
    }
  }

  public saveFormCompletedHandler(value) {
    if (this.selectedEditorField != null) {
      let data = this.form.value
      data[this.selectedEditorField] = value
      this.form.reset(data)
    }

    this.editorFormOpened = false
  }

  submitFormat() {
    let data = this.form.value

    let value = JSON.parse(JSON.stringify(this.formatForm.value))
    Object.keys(this.formatForm.value).forEach(key => {
      if (this.formatForm.value[key] == null)
        delete value[key]
    })

    if (Object.keys(value).length > 0)
      data["FIELD_FORMAT"] = JSON.stringify(value)
    else data["FIELD_FORMAT"] = ""

    this.form.reset(data)

    this.formatEditorOpened = false
  }

  valueChangeFIELD_LOOKUP(value) { }
}


