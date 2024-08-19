import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { formDef, formPage, formArea, formFields, componentConfigDef, tabsCodes } from '@modeldir/model';
import { starServices } from 'starlib';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { process, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
declare function getParamConfig(): any;

const createFormGroup = dataItem => new FormGroup({
  'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
  'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
  'PAGE_ORDER': new FormControl(dataItem.PAGE_ORDER),
  'PAGE_TYPE': new FormControl(dataItem.PAGE_TYPE),
  'PAGE_TITLE': new FormControl(dataItem.PAGE_TITLE),
  'PAGE_ICON': new FormControl(dataItem.PAGE_ICON),
  'PAGE_HELP': new FormControl(dataItem.PAGE_HELP),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'LOGDATE': new FormControl(dataItem.LOGDATE)
});


@Component({
  selector: 'app-dsp-form-drag',
  templateUrl: './dsp-form-drag.component.html',
  styleUrls: ['./dsp-form-drag.component.css']
})

export class DspFormDragComponent implements OnInit {
  @ViewChild("fieldContainer") fieldContainer: ElementRef
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();

  public showToolBar = true;
  public paramConfig;
  public title = "Form Def";
  public routineAuth = null;

  public form: FormGroup;
  public primarKeyReadOnlyArr = { isFORM_NAMEreadOnly: false, isPAGE_NOreadOnly: false };
  get f():any { return this.form.controls; }
  public masterKey = "";
  public masterKeyName = "FORM_NAME";
  public componentConfig: componentConfigDef;
  public form_DSP_FORM_DEF: formDef;
  public form_DSP_FORM_PAGE: formPage;
  public form_DSP_FORM_AREA: formArea;
  public form_DSP_FORM_FIELDS: formFields;

  public DSP_FORM_DEFFormConfig: componentConfigDef;
  public DSP_FORM_PAGEFormConfig: componentConfigDef;
  public DSP_FORM_AREAFormConfig: componentConfigDef;
  public DSP_FORM_FIELDSFormConfig: componentConfigDef;

  public PDFfileName = this.title + ".PDF";

  public DSP_MULTISTEPFormConfig: componentConfigDef;
  public multiStepFormOpened: boolean = false;
  public fieldGridHeight = 400;

  private formInitialValues = new formPage();
  public submitted = false;
  private insertCMD = "INSERT_DSP_FORM_PAGE";
  private updateCMD = "UPDATE_DSP_FORM_PAGE";
  private deleteCMD = "DELETE_DSP_FORM_PAGE";
  private getCMD = "GET_DSP_FORM_PAGE_QUERY";

  public userLang = "EN";
  public lookupArrDef = [
    {
      "statment": "SELECT * FROM SOM_TABS_CODES WHERE CODENAME ='FORM_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
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
  private Body = []

  currentForm

  currentPage = 0
  currentPageOld = 0
  currentPages = []

  currentArea = 0
  currentAreaOld = 0
  currentAreas = []

  currentFields = []
  isLoading = false
  selectedElement
  useAutosave = true
  showChangesOnly = false

  newPageOpened = false
  newFormOpened = false
  newAreaOpened = false
  newFieldOpened = false

  newField
  newFieldId

  grid = {
    data: {
      data: null
    }
  }

  public DSP_PAGEConfig: componentConfigDef
  public DSP_FORMConfig: componentConfigDef
  public DSP_AREAConfig: componentConfigDef

  public grid_som_tabs_codes: tabsCodes;
  public SOM_TABS_CODESGridConfig: componentConfigDef;
  public executeQueryresult: any;
  private CurrentRec = 0;
  public isNew = false

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  copyFormOpened = false
  copyFormName
  isCopying = false

  constructor(private starServices: starServices, public dialogService: DialogService) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
    

    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = this.fieldGridHeight;

    this.DSP_PAGEConfig = new componentConfigDef();
    this.DSP_PAGEConfig.gridHeight = this.fieldGridHeight;
    this.DSP_PAGEConfig.formMode = "page_new";

    this.DSP_FORMConfig = new componentConfigDef();
    this.DSP_FORMConfig.gridHeight = this.fieldGridHeight;
    this.DSP_FORMConfig.formMode = "form_new";

    this.DSP_AREAConfig = new componentConfigDef();
    this.DSP_AREAConfig.gridHeight = this.fieldGridHeight;
    this.DSP_AREAConfig.formMode = "area_new";
  }

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }

  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVFORMD');

    this.form_DSP_FORM_DEF = new formDef();
    this.DSP_FORM_DEFFormConfig = new componentConfigDef();
    this.DSP_FORM_DEFFormConfig.isMaster = true;

    this.form_DSP_FORM_PAGE = new formPage();

    this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
    this.DSP_FORM_PAGEFormConfig.isChild = true;
    this.DSP_FORM_PAGEFormConfig.gridHeight = "250";

    this.form_DSP_FORM_AREA = new formArea();

    this.DSP_FORM_AREAFormConfig = new componentConfigDef();
    this.DSP_FORM_AREAFormConfig.isChild = true;
    this.DSP_FORM_AREAFormConfig.routineAuth = this.routineAuth;
    this.DSP_FORM_AREAFormConfig.gridHeight = "250";

    this.form_DSP_FORM_FIELDS = new formFields();

    this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
    this.DSP_FORM_FIELDSFormConfig.isChild = false;
    this.DSP_FORM_FIELDSFormConfig.routineAuth = this.routineAuth;
    this.DSP_FORM_FIELDSFormConfig.gridHeight = "250";


    this.form = createFormGroup(
      this.formInitialValues
    );

    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);

    this.saveCompletedOutput.subscribe(data => {
      if (data.Body) {
        if (data.Body[0]["FIELD_ROW"]) {
          let newField = data.Body[0]
          if (this.currentFields[newField["FIELD_ROW"] - 1].some(f => f.field["FIELD_ID"] == newField["FIELD_ID"]))
            return

          let field = {
            isNew: false,
            field: newField
          }
          this.currentFields[newField["FIELD_ROW"] - 1].push(field)
          console.log("ELHAMWAA")

          setTimeout(() => {
            this.selectElement("field", field, true)
          }, 100);
        }
      }
    })
  }

  createFormFormGroup = dataItem => new FormGroup({
    "CODE": new FormControl(dataItem.CODE),
    "CODETEXT_LANG": new FormControl(dataItem.CODETEXT_LANG),
    "CODEVALUE_LANG": new FormControl(dataItem.CODEVALUE_LANG)
  })

  createPageFormGroup = dataItem => new FormGroup({
    'FORM_NAME': new FormControl(dataItem.FORM_NAME),
    'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
    'PAGE_ORDER': new FormControl(dataItem.PAGE_ORDER),
    'PAGE_HELP': new FormControl(dataItem.PAGE_HELP),
    'PAGE_TYPE': new FormControl(dataItem.PAGE_TYPE),
    'PAGE_TITLE': new FormControl(dataItem.PAGE_TITLE),
    'PAGE_ICON': new FormControl(dataItem.PAGE_ICON),
    'LOGNAME': new FormControl(dataItem.LOGNAME),
    'LOGDATE': new FormControl(dataItem.LOGDATE)
  })

  createAreaFormGroup = dataItem => new FormGroup({
    'FORM_NAME': new FormControl(dataItem.FORM_NAME, Validators.required),
    'PAGE_NO': new FormControl(dataItem.PAGE_NO, Validators.required),
    'AREA_NO': new FormControl(dataItem.AREA_NO, Validators.required),
    'AREA_TYPE': new FormControl(dataItem.AREA_TYPE),
    'AREA_TITLE': new FormControl(dataItem.AREA_TITLE),
    'AREA_HELP': new FormControl(dataItem.AREA_HELP),
    'LOGNAME': new FormControl(dataItem.LOGNAME),
    'LOGDATE': new FormControl(dataItem.LOGDATE),
    'AREA_PROTECTED': new FormControl(dataItem.AREA_PROTECTED)
  })

  createFieldFormGroup = dataItem => new FormGroup({
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
  });

  public readCompletedHandler(form_DSP_FORM_DEF) { }

  public readCompletedHandlerForm(form_DSP_FORM_DEF) {
    //-----------------Adjust nexr keys manually for DSP_FORM_AREA--------------------
    var masterKeyArr = [form_DSP_FORM_DEF.FORM_NAME, form_DSP_FORM_DEF.PAGE_NO, form_DSP_FORM_DEF.PAGE_TITLE];
    var masterKeyNameArr = ["FORM_NAME", "PAGE_NO", "PAGE_TITLE"];

    this.form_DSP_FORM_AREA = new formArea();
    for (var i = 0; i < masterKeyNameArr.length; i++) {
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
      this.form_DSP_FORM_AREA[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.DSP_FORM_AREAFormConfig = new componentConfigDef();
    this.DSP_FORM_AREAFormConfig.masterKeyArr = masterKeyArr;
    //Adjust next keys manually
    this.DSP_FORM_AREAFormConfig.masterKeyNameArr = masterKeyNameArr;

    //-----------------Adjust nexr keys manually for DSP_FORM_FIELDS--------------------
    var masterKeyArr = [form_DSP_FORM_DEF.FORM_NAME, form_DSP_FORM_DEF.PAGE_NO, form_DSP_FORM_DEF.PAGE_TITLE];
    var masterKeyNameArr = ["FORM_NAME", "PAGE_NO", "PAGE_TITLE"];

    this.form_DSP_FORM_FIELDS = new formFields();
    for (var i = 0; i < masterKeyNameArr.length; i++) {
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
      this.form_DSP_FORM_FIELDS[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
    this.DSP_FORM_FIELDSFormConfig.masterKeyArr = masterKeyArr;
    //Adjust next keys manually
    this.DSP_FORM_FIELDSFormConfig.masterKeyNameArr = masterKeyNameArr;

  }

  public clearCompletedHandler(form_DSP_FORM_DEF) {
    this.form_DSP_FORM_PAGE = new formPage();
    this.form_DSP_FORM_AREA = new formArea();
    this.form_DSP_FORM_FIELDS = new formFields();

  }

  public saveCompletedHandler(form_DSP_FORM_DEF) {
    // if (!form_DSP_FORM_DEF.type) return
    let select = false

    if (form_DSP_FORM_DEF.PAGE_TITLE || form_DSP_FORM_DEF.type == "page") {
      let page = form_DSP_FORM_DEF.type != "page" ? form_DSP_FORM_DEF : form_DSP_FORM_DEF.data

      let index = this.currentPages.findIndex(p => p.data["PAGE_NO"] == page["PAGE_NO"])

      if (index > -1) {
        this.currentPages[index].label = page["PAGE_TITLE"]
        this.currentPages[index].icon = page["PAGE_ICON"]
        this.currentPages[index].data = page
      }

      if (form_DSP_FORM_DEF.updating) return
      select = true
    }
    else if (form_DSP_FORM_DEF.AREA_TITLE || form_DSP_FORM_DEF.type == "area") {
      if ((form_DSP_FORM_DEF.PAGE_NO ?? form_DSP_FORM_DEF.data["PAGE_NO"]) == this.currentPages[this.currentPage].pageNo) {
        let area = form_DSP_FORM_DEF.type != "area" ? form_DSP_FORM_DEF : form_DSP_FORM_DEF.data
        //area.AREA_PROTECTED = Number(area.AREA_PROTECTED)

        let index = this.currentAreas.findIndex(p => p["AREA_NO"] == area["AREA_NO"])

        if (index > -1)
          this.currentAreas[index] = area

        if (form_DSP_FORM_DEF.updating) return
      }

      select = true
    }
    else if (form_DSP_FORM_DEF.FIELD_ID || form_DSP_FORM_DEF.type == "field") {
      if ((form_DSP_FORM_DEF.PAGE_NO ?? form_DSP_FORM_DEF.data["PAGE_NO"]) == this.currentPages[this.currentPage].pageNo) {
        let field = form_DSP_FORM_DEF.type != "field" ? form_DSP_FORM_DEF : form_DSP_FORM_DEF.data

        field.FIELD_PROTECTED = Number(field.FIELD_PROTECTED)
        field.FIELD_REQUIRED = Number(field.FIELD_REQUIRED)

        let rowIndex = this.currentFields.findIndex(r => (r as []).some((f: any) => f.field["FIELD_ID"] == field.FIELD_ID))

        if (rowIndex > -1) {
          let orderIndex = this.currentFields[rowIndex].findIndex((f: any) => f.field["FIELD_ID"] == field.FIELD_ID)

          if (orderIndex > -1)
            this.currentFields[rowIndex][orderIndex] = {
              isNew: form_DSP_FORM_DEF.isNew != null ? form_DSP_FORM_DEF.isNew : false,
              field: field
            }
        }

        let fieldArea = this.currentAreas.find(a => a["AREA_NO"] == field["AREA_NO"])
        if (fieldArea) {
          let areaFields: any = [].concat.apply([], this.currentFields).filter((f) => f.field["AREA_NO"] == fieldArea["AREA_NO"])

          if (fieldArea["AREA_TYPE"] == "GRID" && !areaFields.some((f: any) => f.field["FIELD_REQUIRED"] == 1) && !field["FIELD_REQUIRED"]) {
            this.dialogService.open({
              title: "Field required",
              content: "At least one field should be checked as required",
              actions: [
                { text: 'Ok', primary: true }
              ],
              width: 450,
              height: 200,
              minWidth: 250
            })
          }
        }

        if (form_DSP_FORM_DEF.updating) return
      }

      select = true
    }
    else if (form_DSP_FORM_DEF.type == "page_new") {
      this.newPageOpened = false
      this.currentPages.push({
        label: form_DSP_FORM_DEF.data["PAGE_TITLE"],
        icon: form_DSP_FORM_DEF.data["PAGE_ICON"],
        pageNo: form_DSP_FORM_DEF.data["PAGE_NO"],
        data: form_DSP_FORM_DEF.data
      })

      this.currentPage = this.currentPages.length - 1
      this.selectPage()
      this.addArea()
    }
    else if (form_DSP_FORM_DEF.type == "area_new") {
      this.newAreaOpened = false
      this.currentAreas.push(form_DSP_FORM_DEF.data)
    }
  }

  public addToBody(NewVal) {
    this.Body.push(NewVal)
  }

  @Input() public set detail_Input(form: any) {
    if (typeof form !== "undefined") {
      this.form_DSP_FORM_DEF = new formDef();
      this.form_DSP_FORM_DEF = form;
    }
  }

  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("epm lgc ComponentConfig:", ComponentConfig);
    if (typeof ComponentConfig !== "undefined") {
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.masterSaved != null) {
        this.DSP_FORM_DEFFormConfig = new componentConfigDef();
        this.DSP_FORM_DEFFormConfig.masterSaved = ComponentConfig.masterSaved;

        this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
        this.DSP_FORM_PAGEFormConfig.masterSaved = ComponentConfig.masterSaved;
        if (this.paramConfig.DEBUG_FLAG) console.log("1 epm lgc ComponentConfig:", this.DSP_FORM_PAGEFormConfig);

        this.DSP_FORM_AREAFormConfig = new componentConfigDef();
        this.DSP_FORM_AREAFormConfig.masterSaved = ComponentConfig.masterSaved;

        this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
        this.DSP_FORM_FIELDSFormConfig.masterSaved = ComponentConfig.masterSaved;

      }
      if (ComponentConfig.clearScreen == true) {
        this.DSP_FORM_DEFFormConfig = new componentConfigDef();
        this.DSP_FORM_DEFFormConfig.clearScreen = ComponentConfig.clearScreen;
        this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
        this.DSP_FORM_PAGEFormConfig.clearScreen = ComponentConfig.clearScreen;
        if (this.paramConfig.DEBUG_FLAG) console.log("2 ComponentConfig:", this.DSP_FORM_PAGEFormConfig);
        this.DSP_FORM_AREAFormConfig = new componentConfigDef();
        this.DSP_FORM_AREAFormConfig.clearScreen = ComponentConfig.clearScreen;
        this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
        this.DSP_FORM_FIELDSFormConfig.clearScreen = ComponentConfig.clearScreen;

      }

      if ((ComponentConfig.masterKeyArr != null) && (ComponentConfig.masterKeyNameArr != null)) {
        if ((ComponentConfig.masterKeyArr.length != 0) && (ComponentConfig.masterKeyNameArr.length != 0)) {
          this.DSP_FORM_DEFFormConfig = new componentConfigDef();
          this.DSP_FORM_DEFFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_DEFFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;

          this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
          this.DSP_FORM_PAGEFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_PAGEFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
          if (this.paramConfig.DEBUG_FLAG) console.log("3 epm lgc ComponentConfig:", this.DSP_FORM_PAGEFormConfig);

          this.DSP_FORM_AREAFormConfig = new componentConfigDef();
          this.DSP_FORM_AREAFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_AREAFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;

          this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
          this.DSP_FORM_FIELDSFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_FIELDSFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;

        }


      }
    }
  }

  public lkpArrGetFORM_NAME(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrFORM_NAME.find(x => x.CODE === CODE);
    return rec;
  }

  public selectionChange(value: any): void {
    this.currentForm = value.CODE

    let reqBody = [
      { "_QUERY": "GET_DSP_FORM_PAGE", "FORM_NAME": value.CODE, "PAGE_NO": "%" },
    ]

    this.currentPage = 0
    this.currentPageOld = 0
    this.currentPages = []
    this.currentArea = 0
    this.currentAreaOld = 0
    this.currentAreas = []
    this.currentFields = []

    this.isLoading = true
    this.starServices.post(this, "&_trans=Y", reqBody).subscribe(result => {
      this.currentPages = result.data[0].data.map(page => {
        return { label: page["PAGE_TITLE"], icon: page["PAGE_ICON"], pageNo: page["PAGE_NO"], data: page }
      })

      if (this.currentPages.length == 0) {
        this.isLoading = false
        this.addPage(this.currentForm + "")
        return
      }

      this.selectPage()
    })
  }

  selectPage() {
    this.selectElement('page', this.currentPages[this.currentPage].data, true)

    let reqBody = [
      {
        "_QUERY": "GET_DSP_FORM_AREA",
        "FORM_NAME": this.currentForm,
        "PAGE_NO": this.currentPages[this.currentPage].pageNo,
        "AREA_NO": "%"
      },
    ]

    setTimeout(() => {
      this.currentArea = 0
      this.currentAreaOld = 0
      this.currentAreas = []
      this.currentFields = []
      this.isLoading = true

      this.starServices.post(this, "&_trans=Y", reqBody).subscribe(result => {
        this.currentAreas = result.data[0].data
        if (this.currentAreas.length > 0)
          this.selectArea(this.currentAreas[0], 0, false)
        else this.isLoading = false
      })
    }, 200)
  }

  selectArea(area, index, checkAutoSave = true) {
    let pageIndex = checkAutoSave ? (this.useAutosave ? this.currentPageOld : this.currentPage) : this.currentPage
    let reqBody = [
      {
        "_QUERY": "GET_DSP_FORM_FIELDS",
        "FORM_NAME": this.currentForm,
        "PAGE_NO": this.currentPages[pageIndex].pageNo,
        "AREA_NO": area.AREA_NO,
        "FIELD_ID": "%"
      },
    ]

    setTimeout(() => {
      this.currentArea = index
      this.currentFields = []
      this.isLoading = true

      this.starServices.post(this, "&_trans=Y", reqBody).subscribe(result => {
        this.currentFields = this.groupBy(result.data[0].data, row => row["FIELD_ROW"]).map(row => {
          return row.map(field => {
            return {
              isNew: false,
              field: {
                ...field,
                FIELD_ORDER_NEW: field["FIELD_ORDER"],
                FIELD_ROW_NEW: field["FIELD_ROW"],
                FIELD_DEFAULT_NEW: field["FIELD_DEFAULT"],
                FIELD_FORMAT_NEW: field["FIELD_FORMAT"],
              }
            }
          })
        })

        if (this.currentFields.length == 0)
          this.currentFields.push([])

        this.isLoading = false
      })
    }, 200)
  }

  selectElement(type, data = null, checkAutoSave = true) {
    if (!type || !data) return

    if (type == "form" && !this.currentForm) return
    console.log("this.form:",this.form)
 
    this.saveChanges()
    setTimeout(() => {
      if (data._QUERY)
        delete data._QUERY
      if (data._QUERY_DONE)
        delete data._QUERY_DONE

      if (type == "field") {
        let field = {
          isNew: data.isNew,
          field: { ...data.field }
        }

        if (typeof field.field.FIELD_ROW_NEW === undefined || field.field.FIELD_ROW_NEW == null) {
          field.field.FIELD_ROW_NEW = parseInt(field.field.FIELD_ROW + "")
          field.field.FIELD_ORDER_NEW = parseInt(field.field.FIELD_ORDER + "")
        }
        if (typeof field.field.FIELD_DEFAULT_NEW === undefined || field.field.FIELD_DEFAULT_NEW == null) {
          field.field.FIELD_DEFAULT_NEW = field.field.FIELD_DEFAULT + ""
          field.field.FIELD_FORMAT_NEW = field.field.FIELD_FORMAT + ""
        }

        if (data.isNew) {
          field.field.FIELD_ROW = parseInt(field.field.FIELD_ROW_NEW + "")
          field.field.FIELD_ORDER = parseInt(field.field.FIELD_ORDER_NEW + "")
        }
        else {
          field.field.FIELD_ROW = "%"
          field.field.FIELD_ORDER = "%"

          field.field.FIELD_DEFAULT = "%"
          field.field.FIELD_FORMAT = "%"
        }

        if (field.field._QUERY)
          delete field.field._QUERY
        if (field.field._QUERY_DONE)
          delete field.field._QUERY_DONE

        this.selectedElement = {
          type,
          data: field,
          gridHasRequiredField: this.currentAreas[this.currentArea].AREA_TYPE == "GRID" && this.currentFields[0].some(f => f.field["FIELD_REQUIRED"] == 1),
          areaType: this.currentAreas[this.currentArea].AREA_TYPE
        }
      }
      else {
        this.selectedElement = {
          type,
          data
        }
      }

      this.currentPageOld = this.currentPage
      this.currentAreaOld = this.currentArea
    }, 300)
  }

  onDrop(e) {
    this.currentFields.forEach((row: [], rowIndex) => {
      row.forEach((field: any, order) => {
        field.field["FIELD_ORDER_NEW"] = order + 1
        field.field["FIELD_ROW_NEW"] = rowIndex + 1
      })
    })
    console.log("herex2")
    let saveData = [].concat.apply([], this.currentFields).filter((f: any) => !f.isNew).map((f: any) => {
      f.field._QUERY = "UPDATE_DSP_FORM_FIELDS"
      f.field.FIELD_ORDER = parseInt(f.field.FIELD_ORDER_NEW + "")
      f.field.FIELD_ROW = parseInt(f.field.FIELD_ROW_NEW + "")
      return f.field
    })

    if (saveData.length > 0) {
      this.grid.data.data = saveData
      this.starServices.saveChanges_grid(this, this)
    }

    let field = [].concat.apply([], this.currentFields).find((f) => f.field["FIELD_ID"] == e.value["FIELD_ID"])
    this.selectElement('field', field, false)
  }

  public showMultiStepForm(mode) {
    var orderFields = "[]";
    if (this.currentForm != "") {

      var formPagesNo = "";
      if (mode == 1)
        formPagesNo = "" + this.currentPages[this.currentPage].pageNo;

      var masterParams = {
        "formName": this.currentForm,
        "formPagesNo": formPagesNo,
        "orderFields": orderFields
      };

      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;
      this.multiStepFormOpened = true;
    }
  }

  public saveCurrent(): void {
    console.log("herex1")
    this.insertCMD = "INSERT_DSP_FORM_FIELDS";
    this.updateCMD = "UPDATE_DSP_FORM_FIELDS";
    this.deleteCMD = "DELETE_DSP_FORM_FIELDS";
    this.getCMD = "GET_DSP_FORM_FIELDS_QUERY";

    this.starServices.saveCurrent_grid(this);
  }

  saveChanges() {
    if (this.selectedElement) {
      if (this.selectedElement.type == "form") {
        let oldMasterKey = this.DSP_FORM_DEFFormConfig.masterKey

        this.DSP_FORM_DEFFormConfig = new componentConfigDef();
        this.DSP_FORM_DEFFormConfig.masterSaved = true;
        this.DSP_FORM_DEFFormConfig.masterKey = oldMasterKey;
        this.DSP_FORM_DEFFormConfig.formMode = this.selectedElement.type
      }
      else if (this.selectedElement.type == "page") {
        let oldMasterKey = this.DSP_FORM_PAGEFormConfig.masterKey

        this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
        this.DSP_FORM_PAGEFormConfig.masterSaved = true;
        this.DSP_FORM_PAGEFormConfig.masterKey = oldMasterKey;
        this.DSP_FORM_PAGEFormConfig.formMode = this.selectedElement.type
      }
      else if (this.selectedElement.type == "area") {
        let oldMasterKey = this.DSP_FORM_AREAFormConfig.masterKey

        this.DSP_FORM_AREAFormConfig = new componentConfigDef();
        this.DSP_FORM_AREAFormConfig.masterSaved = true;
        this.DSP_FORM_AREAFormConfig.masterKey = oldMasterKey;
        this.DSP_FORM_AREAFormConfig.formMode = this.selectedElement.type
      }
      else if (this.selectedElement.type == "field") {
        let oldMasterKey = this.DSP_FORM_FIELDSFormConfig.masterKey

        this.DSP_FORM_FIELDSFormConfig = new componentConfigDef();
        this.DSP_FORM_FIELDSFormConfig.isChild = false
        this.DSP_FORM_FIELDSFormConfig.masterSaved = true;
        this.DSP_FORM_FIELDSFormConfig.masterKey = oldMasterKey;
        this.DSP_FORM_FIELDSFormConfig.formMode = this.selectedElement.type
        this.DSP_FORM_FIELDSFormConfig.useAutoSave = this.useAutosave
      }
    }
  }

  addRow() {
    this.currentFields.push([])
    setTimeout(() => {
      this.fieldContainer.nativeElement.scrollTop = this.fieldContainer.nativeElement.scrollHeight
    }, 50)
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });

    return Array.from(map).map(item => item[1])
  }

  public formDefOpen() {
    this.newFormOpened = true;
    this.SOM_TABS_CODESGridConfig = new componentConfigDef();
    this.SOM_TABS_CODESGridConfig.showSave = true;

    this.grid_som_tabs_codes = new tabsCodes();
    this.grid_som_tabs_codes.CODENAME = "FORM_NAME";

    // this.currentForm = null
    // this.currentPages = []
    // this.currentAreas = []
    // this.currentFields = []
    // this.selectedElement = null
  }

  cancelNewPage() {
    this.newPageOpened = false
    this.DSP_PAGEConfig = new componentConfigDef();
    this.DSP_PAGEConfig.gridHeight = this.fieldGridHeight;
    this.DSP_PAGEConfig.formMode = "page_new";
  }

  cancelNewForm() {
    this.newFormOpened = false
    this.DSP_FORMConfig = new componentConfigDef();
    this.DSP_FORMConfig.gridHeight = this.fieldGridHeight;
    this.DSP_FORMConfig.formMode = "form_new";
  }

  cancelNewArea() {
    this.newAreaOpened = false
    this.DSP_AREAConfig = new componentConfigDef();
    this.DSP_AREAConfig.gridHeight = this.fieldGridHeight;
    this.DSP_AREAConfig.formMode = "area_new";
  }

  submitNewPage() {
    this.DSP_PAGEConfig = new componentConfigDef();
    this.DSP_PAGEConfig.gridHeight = this.fieldGridHeight;
    this.DSP_PAGEConfig.formMode = "page_new";
    this.DSP_PAGEConfig.masterSaved = true
  }

  submitNewForm() {
    this.DSP_FORMConfig = new componentConfigDef();
    this.DSP_FORMConfig.gridHeight = this.fieldGridHeight;
    this.DSP_FORMConfig.formMode = "form_new";
    this.DSP_FORMConfig.masterSaved = true
  }

  submitNewArea() {
    this.DSP_AREAConfig = new componentConfigDef();
    this.DSP_AREAConfig.gridHeight = this.fieldGridHeight;
    this.DSP_AREAConfig.formMode = "area_new";
    this.DSP_AREAConfig.masterSaved = true
  }

  addArea() {
    this.DSP_AREAConfig = new componentConfigDef();
    this.DSP_AREAConfig.gridHeight = this.fieldGridHeight;
    this.DSP_AREAConfig.formMode = "area_new";
    this.DSP_AREAConfig.masterKeyArr = [this.currentForm, this.currentPages[this.currentPage].pageNo]
    this.DSP_AREAConfig.masterKeyNameArr = ["FORM_NAME", "PAGE_NO"]
    this.newAreaOpened = true
  }

  addPage(formName = null) {
    if (!this.currentForm) return

    this.DSP_PAGEConfig = new componentConfigDef();
    this.DSP_PAGEConfig.gridHeight = this.fieldGridHeight;
    this.DSP_PAGEConfig.formMode = "page_new";
    this.DSP_PAGEConfig.masterKeyArr = [formName ? formName : this.currentForm]
    this.DSP_PAGEConfig.masterKeyNameArr = ["FORM_NAME"]
    this.newPageOpened = true
  }

  deleteForm = (formData): Observable<any> => {
    this.Body = []

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_FIELDS",
      "FORM_NAME": formData["CODETEXT_LANG"],
      "PAGE_NO": "%",
      "AREA_NO": "%",
      "FIELD_ID": "%"
    })

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_AREA",
      "FORM_NAME": formData["CODETEXT_LANG"],
      "PAGE_NO": "%",
      "AREA_NO": "%",
    })

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_PAGE",
      "FORM_NAME": formData["CODETEXT_LANG"],
      "PAGE_NO": "%",
    })

    return this.starServices.post(this, "&_trans=Y", this.Body);
    // this.starServices.onRemove_form(form, this)
  }

  deletePage() {
    let form = this.createPageFormGroup(this.currentPages[this.currentPage].data)

    this.insertCMD = "INSERT_DSP_FORM_PAGE"
    this.updateCMD = "UPDATE_DSP_FORM_PAGE"
    this.deleteCMD = "DELETE_DSP_FORM_PAGE"
    this.getCMD = "GET_DSP_FORM_PAGE_QUERY"
    this.executeQueryresult = {
      data: [this.currentPages[this.currentPage].data],
      total: 1
    }
    this.isNew = false

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_FIELDS",
      "FORM_NAME": this.currentForm,
      "PAGE_NO": this.currentPages[this.currentPage].pageNo,
      "AREA_NO": "%",
      "FIELD_ID": "%"
    })

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_AREA",
      "FORM_NAME": this.currentForm,
      "PAGE_NO": this.currentPages[this.currentPage].pageNo,
      "AREA_NO": "%",
    })

    this.starServices.onRemove_form(form, this)
  }

  deleteArea() {
    let areaNo = this.currentAreas[this.currentArea].AREA_NO
    let form = this.createAreaFormGroup(this.currentAreas[this.currentArea])
    console.log("deleteArea")
    this.insertCMD = "INSERT_DSP_FORM_AREA"
    this.updateCMD = "UPDATE_DSP_FORM_AREA"
    this.deleteCMD = "DELETE_DSP_FORM_AREA"
    this.getCMD = "GET_DSP_FORM_AREA_QUERY"
    this.executeQueryresult = {
      data: [this.currentAreas[this.currentArea]],
      total: 1
    }
    this.isNew = false

    this.addToBody({
      "_QUERY": "DELETE_DSP_FORM_FIELDS",
      "FORM_NAME": this.currentForm,
      "PAGE_NO": this.currentPages[this.currentPage].pageNo,
      "AREA_NO": areaNo,
      "FIELD_ID": "%"
    })

    this.starServices.onRemove_form(form, this)
  }

  deleteField(field, column, index, e) {
    e.stopPropagation()

    if (!field.isNew) {
      let form = this.createFieldFormGroup(field.field)
      console.log("herex3")
      this.insertCMD = "INSERT_DSP_FORM_FIELDS";
      this.updateCMD = "UPDATE_DSP_FORM_FIELDS";
      this.deleteCMD = "DELETE_DSP_FORM_FIELDS";
      this.getCMD = "GET_DSP_FORM_FIELDS_QUERY";

      this.executeQueryresult = {
        data: [field.field],
        total: 1
      }
      this.isNew = false

      this.starServices.onRemove_form(form, this)
    }
    else {
      this.currentFields[column].splice(index, 1)
      this.selectedElement = null
    }
  }

  callBackRemoveAtt(data, newVal) {
    if (newVal.AREA_TITLE) {
      this.selectPage()
    }
    else if (newVal.PAGE_TITLE) {
      let index = this.currentPages.findIndex(v => v.label === newVal.PAGE_TITLE)
      this.currentPages.splice(index, 1)
      setTimeout(() => {
        this.currentPage = index > (this.currentPages.length - 1) ? index - 1 : index

        if (this.currentPages.length - 1 > this.currentPage)
          this.selectPage()
        else
          this.selectionChange({ CODE: this.currentForm })
      }, 100);
    }
    else if (newVal.FIELD_ID) {
      if (this.currentFields[newVal["FIELD_ROW"] - 1])
        this.currentFields[newVal["FIELD_ROW"] - 1].splice(newVal["FIELD_ORDER"] - 1, 1)
    }

    this.selectedElement = null
  }

  toggleAutoSave() {
    let oldMasterKey = this.DSP_FORM_FIELDSFormConfig.masterSaved

    this.DSP_FORM_FIELDSFormConfig = new componentConfigDef()
    this.DSP_FORM_FIELDSFormConfig.isChild = false
    this.DSP_FORM_FIELDSFormConfig.masterSaved = false
    this.DSP_FORM_FIELDSFormConfig.masterKey = oldMasterKey
    this.DSP_FORM_FIELDSFormConfig.formMode = "field"
    this.DSP_FORM_FIELDSFormConfig.useAutoSave = this.useAutosave
  }

  addField(index) {
    this.newField = {
      AREA_NO: this.currentAreas[this.currentArea].AREA_NO,
      FIELD_DEFAULT: "",
      FIELD_ENABLER: "",
      FIELD_FORMAT: "",
      FIELD_HELP: "",
      FIELD_ID: null,
      FIELD_LOOKUP: "",
      FIELD_NAME: "",
      FIELD_PROTECTED: 0,
      FIELD_REQUIRED: 0,

      FIELD_ORDER: this.currentFields[index].length + 1,
      FIELD_ROW: index + 1,

      FIELD_SHOW_IF: "",
      FIELD_TYPE: "TEXT",
      FORM_NAME: this.currentForm,
      PAGE_NO: this.currentPages[this.currentPage].pageNo,
      _QUERY: "INSERT_DSP_FORM_FIELDS"
    }

    this.newFieldOpened = true
  }

  saveNewField() {
    if (!this.newFieldId) return
    this.newField.FIELD_ID = this.newFieldId
    this.newField.FIELD_NAME = this.newFieldId

    let saveData = [this.newField]

    this.grid.data.data = saveData
    this.starServices.saveChanges_grid(this, this)
    this.newFieldOpened = false
    this.newFieldId = null
  }


  public formDefClose() {
    this.newFormOpened = false;
  }

  public onSaveFormDef(grid) {
    let newForms: [] = grid.data.data.filter(d => d["CODETEXT_LANG"] != "");

    let formsToDelete = this.lkpArrFORM_NAME.filter(o => !newForms.some(n => o["CODE"] == n["CODE"])).filter(o => o["CODE"] != "")
    formsToDelete.forEach(form => {
      this.deleteForm(form).subscribe((e) => {
        this.lkpArrFORM_NAME = [this.lkpArrFORM_NAME[0], ...newForms]
      })
    })

    if (formsToDelete.length == 0)
      this.lkpArrFORM_NAME = [this.lkpArrFORM_NAME[0], ...newForms]
  }

  openCopyDialog() {
    this.copyFormOpened = true
    this.copyFormName = `${this.currentForm}_Copy`
  }

  copyForm() {
    this.isCopying = true

    let formData = this.lkpArrFORM_NAME.find(f => f["CODE"] == this.currentForm)
    let pagesData = this.currentPages.map(p => p.data)
    let areasData = []
    let fieldsData = []

    this.Body = []
    pagesData.forEach(page => {
      this.addToBody({
        "_QUERY": "GET_DSP_FORM_AREA",
        "FORM_NAME": this.currentForm,
        "PAGE_NO": page["PAGE_NO"],
        "AREA_NO": "%"
      })
    })

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(areasRes => {
      this.Body = []

      areasRes.data.forEach(pageAreas => {
        areasData = [...areasData, ...pageAreas.data]
      })

      areasData.forEach(area => {
        this.addToBody({
          "_QUERY": "GET_DSP_FORM_FIELDS",
          "FORM_NAME": this.currentForm,
          "PAGE_NO": area["PAGE_NO"],
          "AREA_NO": area["AREA_NO"],
          "FIELD_ID": "%"
        })
      })

      this.starServices.post(this, "&_trans=Y", this.Body).subscribe(fieldsRes => {
        this.Body = []

        fieldsRes.data.forEach(areaFields => {
          fieldsData = [...fieldsData, ...areaFields.data]
        })

        this.doCopyForm(formData, pagesData, areasData, fieldsData)
      })
    })
  }

  doCopyForm(form, pages, areas, fields) {
    form = JSON.parse(JSON.stringify(form))

    form.CODE = this.copyFormName
    form.CODETEXT_LANG = this.copyFormName

    this.addToBody({
      ...form,
      "_QUERY": "INSERT_SOM_TABS_CODES"
    })

    let pagesData = pages.map(p => {
      p._QUERY = "INSERT_DSP_FORM_PAGE"
      p.FORM_NAME = this.copyFormName
      return p
    })
    console.log("doCopyForm")
    let areasData = areas.map(p => {
      p._QUERY = "INSERT_DSP_FORM_AREA"
      p.FORM_NAME = this.copyFormName
      return p
    })
    let fieldsData = fields.map(p => {
      p._QUERY = "INSERT_DSP_FORM_FIELDS"
      p.FORM_NAME = this.copyFormName
      return p
    })

    this.Body = [...this.Body, ...pagesData, ...areasData, ...fieldsData]

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
      this.Body = []
      this.copyFormOpened = false
      this.isCopying = false
      this.copyFormName = null
      this.lkpArrFORM_NAME.push(form)
    }, e => {
      this.isCopying = false

      this.dialogService.open({
        title: "Error",
        content: e.error,
        actions: [
          { text: 'Ok', primary: true }
        ],
        width: 450,
        height: 200,
        minWidth: 250
      })
    })
  }

  getIconByFieldType(fieldType) {
    switch (fieldType) {
      case "CHECKBOX":
        return "k-i-checkbox-checked";
      case "DATE":
        return "k-i-calendar-date";
      case "EMAIL":
        return "k-i-email";
      case "HTML":
        return "k-i-paste-as-html";
      case "IMAGE":
        return "k-i-image";
      case "LABEL":
        return "k-i-edit-tools";
      case "NUMERIC":
        return "k-i-parameter-integer";
      case "PASSWORD":
        return "k-i-password";
      case "SIGNATURE":
        return "k-i-signature";
      case "TEXT":
        return "k-i-textbox";
      case "TEXT_AREA":
        return "k-i-textarea";
      default:
        return "k-i-textbox";
    }
  }
}
