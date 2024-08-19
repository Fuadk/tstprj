import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { starServices } from 'starlib';
import { formPage, componentConfigDef } from '@modeldir/model';

const createFormGroup = (dataItem:any) => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
  'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
  'PAGE_ORDER': new FormControl(dataItem.PAGE_ORDER),
  'PAGE_TYPE': new FormControl(dataItem.PAGE_TYPE),
  'PAGE_TITLE': new FormControl(dataItem.PAGE_TITLE),
  'PAGE_ICON': new FormControl(dataItem.PAGE_ICON),
  'PAGE_HELP': new FormControl(dataItem.PAGE_HELP),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
}, { updateOn: 'blur' });

declare function getParamConfig(): any;

@Component({
  selector: 'app-dsp-form-page-form',
  templateUrl: './dsp-form-page-form.component.html',
  styleUrls: ['./dsp-form-page-form.component.css']
})

export class DspFormPageFormComponent {
  @ViewChild("focusElement") focusElement: ElementRef<HTMLDivElement>

  public title = "Page properties";
  private insertCMD = "INSERT_DSP_FORM_PAGE";
  private updateCMD = "UPDATE_DSP_FORM_PAGE";
  private deleteCMD = "DELETE_DSP_FORM_PAGE";
  private getCMD = "GET_DSP_FORM_PAGE_QUERY";

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
  public primarKeyReadOnlyArr = { isFORM_NAMEreadOnly: false, isPAGE_NOreadOnly: false };
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public masterKey = "";
  public masterKeyName = "FORM_NAME";
  public formattedWhere:any = null;
  public submitted = false;
  private formInitialValues:any = new formPage();
  public showToolBar = false;
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
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  currentPage

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

    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

    this.form.valueChanges.pipe(
      distinctUntilChanged()
      // debounceTime(500)
    ).subscribe(() => {
      if (this.currentPage && this.currentPage && this.currentPage["PAGE_NO"] == this.form.value["PAGE_NO"] && this.objectDifference(this.currentPage, this.form.value).length > 0) {
        console.log("object.form:saving changes:", this.form.status,this.form.touched, this.form)
        if (this.form.status != "INVALID"){
         //this.saveChanges(this.form)
        // this.saveCompletedOutput.emit({
        //   type: "page",
        //   updating: true,
        //   data: this.form.value
        // })
      }
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

  @Input() public set executeQueryInput(form: any) {
    if ((typeof form != "undefined") && form.type == "page" && (typeof form.data.FORM_NAME != "undefined") && (form.data.FORM_NAME != "")) {
      this.isFORM_NAMEEnable = false;
      this.isSearch = true;
      this.currentPage = JSON.parse(JSON.stringify(form.data))
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
    console.log ("in saveChanges:this.isNew:form:page:", this.isNew, form)
    this.currentPage = form.value
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

      if (ComponentConfig.masterSaved != null && ComponentConfig.masterSaved == true) {
        this.focusElement.nativeElement.focus()
        setTimeout(() => {
          console.log("object.form:saving changes:2:", this.form.status,this.form.touched, this.form)
          if (this.form.status != "INVALID"){
            this.saveChanges(this.form)
          }
          ComponentConfig.masterSaved = null;

          if (ComponentConfig.formMode == "page_new")
            this.saveCompletedOutput.emit({
              type: ComponentConfig.formMode,
              data: this.form.value
            })
        }, 200)
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

        this.formInitialValues.FORM_NAME = this.masterKeyArr[this.masterKeyNameArr.indexOf("FORM_NAME")]
      }

      if (ComponentConfig.formattedWhere != null) {
        this.formattedWhere = ComponentConfig.formattedWhere;
        this.isSearch = true;
        this.executeQuery(this.form)
      }
    }
  }
}
