import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { addDays, addWeeks, addMonths, addYears, addDecades, addCenturies } from '@progress/kendo-date-math';
import { UploadEvent, SelectEvent , ClearEvent} from '@progress/kendo-angular-upload';
import { FileInfo, FileState } from '@progress/kendo-angular-upload';

import { starServices } from 'starlib';
import { orders, Template, componentConfigDef } from '@modeldir/model';

const createFormGroup = (dataItem) => new FormGroup({

  'ORDER_TYPE': new FormControl(dataItem.ORDER_TYPE, Validators.required),
  'ORDER_NO': new FormControl(dataItem.ORDER_NO),
  'TEMPLATE_NAME': new FormControl(dataItem.TEMPLATE_NAME, Validators.required),

  'SUBNO': new FormControl(dataItem.SUBNO, Validators.required),
  'ORDER_STATUS': new FormControl(dataItem.ORDER_STATUS),
  'DIV': new FormControl(dataItem.DIVS),
  'DEPT': new FormControl(dataItem.DEPT),
  'ASSIGNEE_TYPE': new FormControl(dataItem.ASSIGNEE_TYPE),
  'ASSIGNEE': new FormControl(dataItem.ASSIGNEE),
  'PROMISED_DATE': new FormControl(dataItem.PROMISED_DATE, Validators.required),
  'ORDERED_DATE': new FormControl(dataItem.ORDERED_DATE),

  'COMPLETION_DATE': new FormControl(dataItem.COMPLETION_DATE),
  'NOTES': new FormControl(dataItem.NOTES),
  'PARENT_ORDER_TYPE': new FormControl(dataItem.PARENT_ORDER_TYPE),
  'PARENT_ORDER_NO': new FormControl(dataItem.PARENT_ORDER_NO),
  'ACTUAL_START_DATE': new FormControl(dataItem.ACTUAL_START_DATE),
  'ACTUAL_END_DATE': new FormControl(dataItem.ACTUAL_END_DATE),
  'ORDER_FIELDS': new FormControl(dataItem.ORDER_FIELDS),
  'ATTACHMENTS': new FormControl(dataItem.ATTACHMENTS),
  'LOGDATE': new FormControl(dataItem.LOGDATE),
  'LOGNAME': new FormControl(dataItem.LOGNAME),

});

declare function getParamConfig(): any;

@Component({
  selector: 'app-dsp-orders-form',
  templateUrl: './dsp-orders-form.component.html',
  styleUrls: ['./dsp-orders-form.component.css']
})


export class DspOrdersFormComponent {
  public logOpened: boolean = false;
  public form_adm_rule_log: componentConfigDef;
  public title = "Orders";
  private insertCMD = "INSERT_DSP_ORDERS";
  private updateCMD = "UPDATE_DSP_ORDERS";
  private deleteCMD = "DELETE_DSP_ORDERS";
  private getCMD = "GET_DSP_ORDERS_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;
  public hide_log: boolean = false;

  public form: FormGroup;
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;

  public DSP_MULTISTEPFormConfig: componentConfigDef;
  private CurrentRec = 0;
  private isSearch!: boolean;
  private Body:any = [];

  private isNew!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isAsigneeTypeReadOnly: boolean = false;
  public isAsigneeReadOnly: boolean = false;

  public multiStepFormOpened: boolean = false;

  public uploadInProgress: boolean = false;

  public ADM_RuleLogGridConfig: componentConfigDef;
  public paramConfig;
  public executeQueryresult: any;
  public primarKeyReadOnlyArr = { isORDER_NOreadOnly: false, isTEMPLATE_NAMEreadOnly: false };
  public action = "";
  private fieldsRequiredMsg = "Please select a template and enter the required fields.";
  private fieldsRequiredMsg2 = "Please enter the required fields.";

  //@Input()  

  public showToolBar = true;
  public hideForCreate = false;
  private createUsingTemplate = false;
  public AttDwnUrl = "";
  public fieldGridHeight = 400;

  public fieldsData = {};
  public fieldsSave: boolean = false;
  public fieldsFormSave: boolean = false;
  public templateInfo;
  public screenStyle;

  hideOthers = false
  showButtons = false
  attachements = []
  workOrder
  woApprovalFlag

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() getOrderOutput: EventEmitter<any> = new EventEmitter();
  @Output() orderStatusOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    // if (this.paramConfig.DEBUG_FLAG) console.log("this.paramConfig:",this.paramConfig)
    this.componentConfig = new componentConfigDef();


    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = this.fieldGridHeight;
    this.ADM_RuleLogGridConfig = new componentConfigDef();
    this.ADM_RuleLogGridConfig.gridHeight = this.fieldGridHeight;

    var w = window.innerWidth;
    w = w - 20;
    this.screenStyle = "width: " + w + "px;";

  }
  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
  public ngOnInit(): void {


    //this.starServices.actOnParamConfig(this, 'PRVORDERC' );
    this.formInitialValues.ASSIGNEE_TYPE = this.hideOthers ? "PERSON" : "TEAM";
    this.formInitialValues.ASSIGNEE = this.hideOthers ? "%" : this.paramConfig.USER_INFO.TEAM;

    this.form = createFormGroup(
      this.formInitialValues
    );
    this.onChanges();
    var lkpArrASSIGNEEDef = {
      "statment": "SELECT TEAM  CODE, FULLNAME CODETEXT_LANG FROM ADM_TEAM WHERE DEPT = '"
        + this.paramConfig.USER_INFO.DEPT + "'  and DIVS = '" + this.paramConfig.USER_INFO.DIVS + "' ",
      "lkpArrName": "lkpArrASSIGNEE"
    }
      ;
    this.lookupArrDef.push(lkpArrASSIGNEEDef);

    console.log("HF lookupArrDef for status", this.lookupArrDef)

    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;
    this.AttDwnUrl = this.starServices.SERVER_URL + "/api/att?action=download&username=" + this.paramConfig.USERNAME.toLowerCase() + "&name=";


    if (typeof this.paramConfig.ORDER_NO != "undefined") {
      if (this.paramConfig.ORDER_NO != "") {
        //  if (this.paramConfig.DEBUG_FLAG) console.log("this.paramConfig.ORDER_NO:" + this.paramConfig.ORDER_NO)

        let formVal: orders = this.form.value;

        if (this.paramConfig.DEBUG_FLAG) console.log("formVal:");
        if (this.paramConfig.DEBUG_FLAG) console.log(formVal);
        formVal.ORDER_NO = this.paramConfig.ORDER_NO;
        /*
        if (this.paramConfig.DEBUG_FLAG) console.log("formVal.ORDER_NO:" + formVal.ORDER_NO);
        this.form.reset(formVal);
        if (this.paramConfig.DEBUG_FLAG) console.log("formVal:");
        if (this.paramConfig.DEBUG_FLAG) console.log(formVal);
        */

        this.isSearch = true;
        this.executeQuery(formVal);
        this.paramConfig.ORDER_NO = "";

      }
    }
  }

  filterWorkOrder(wo) {
    if (wo["ASSIGNEE_TYPE"] == "TEAM") {
      if (this.paramConfig.USER_INFO.MANAGER == 1 && this.paramConfig.USER_INFO.DEPT == wo["ASSIGNEE"]) return true
      // if (wo["DEPT"] ==  this.paramConfig.USER_INFO.DEPT) return true;
    }

    return wo["ASSIGNEE_TYPE"] == "MGR" && this.paramConfig.USER_INFO.MANAGER == 1
  }

  getOrder(id) {
    this.Body = []
    this.addToBody({
      "_QUERY": "GET_DSP_ORDERS",
      "ORDER_NO": id,
      "ORDER_TYPE": "%"
    })

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
      let data = res.data[0].data[0]

      this.getOrderOutput.emit(data)

      if (data["ORDER_NO"] != "" && data["ATTACHMENTS"] && data["ATTACHMENTS"] != "")
        this.attachements = JSON.parse(data["ATTACHMENTS"])
    })
  }

  private formInitialValues:any = new orders();

  @Input() public set executeQueryInput(form: any) {


    if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery_form object.form:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.form);

    this.isSearch = true;
    this.starServices.executeQuery_form(form, this);
  }

  public callBackFunction(data:any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("inside callBackFunction:data:", data)

    // return;
    if (typeof data != "undefined") {
      this.myFiles = [];
      //id=120_test3.txt;size=11|id=120_test1.txt;size=11|"

      var attachments = data.ATTACHMENTS;
      if ((attachments != null) && (attachments != "")) {
        this.myFiles = JSON.parse(attachments);
        if (this.paramConfig.DEBUG_FLAG) console.log("att:this.myFiles:", this.myFiles)

      }
      if (this.paramConfig.DEBUG_FLAG) console.log("att:2this.myFiles:", this.myFiles);
      var formVal = this.form.value;
      for (var i = 0; i < this.myFiles.length; i++) {
        var page = "?action=fetch&name=" + this.myFiles[i].name + "&id=" + this.myFiles[i].id + "&orderno=" + formVal.ORDER_NO;
        if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page);
        var apiURL = this.starServices.SERVER_URL + '/api/att' + page;
        this.starServices.postUpload(apiURL, "").subscribe(result => {
          //if (this.paramConfig.DEBUG_FLAG) console.log('result', result); });
          if (this.paramConfig.DEBUG_FLAG) console.log("ATT:", result);
        });

      }


    }

  }
  public executeQuery(form: any): void {
    this.starServices.executeQuery_form(form, this);
  }

  private addToBody(NewVal:any) {
    this.Body.push(NewVal);
  }
  public lkpArrDIV = [];
  onChanges(): void {
    /*
    //@ts-ignore: Object is possibly 'null'.
this.form.get('DEPT').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("DEPT valu changed")
      //var formVal = this.form.value;
      this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
      "lkpArrName":"lkpArrDIV"}];
     this.starServices.fetchLookups(this, this.lookupArrDef);
    });
*/


    //@ts-ignore: Object is possibly 'null'.
this.form.get('ASSIGNEE_TYPE').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("ASSIGNEE_TYPE value changed")
      var formVal = this.form.value;
      if (this.paramConfig.DEBUG_FLAG) console.log("formVal:")
      if (this.paramConfig.DEBUG_FLAG) console.log(formVal)
      var selectStmt = this.starServices.getAssigneeSelect(this, val)
      if (val == "TEAM") {
        this.lookupArrDef = [{
          "statment": selectStmt,
          "lkpArrName": "lkpArrASSIGNEE"
        }];
        this.starServices.fetchLookups(this, this.lookupArrDef);
      }
      else if (val == "PERSON") {
        this.lookupArrDef = [{
          "statment": selectStmt,
          "lkpArrName": "lkpArrASSIGNEE"
        }];
        this.starServices.fetchLookups(this, this.lookupArrDef);
      }
      else if (val == "NETWORK") {
        this.lookupArrDef = [{
          "statment": selectStmt,
          "lkpArrName": "lkpArrASSIGNEE"
        }];
        this.starServices.fetchLookups(this, this.lookupArrDef);
      }

    });


  }
  public onCancel(e:any): void {
    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }
    this.starServices.onCancel_form(e, this);
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.clearComponent = true;
    this.ADM_RuleLogGridConfig = new componentConfigDef();
    this.ADM_RuleLogGridConfig.clearComponent = true;

    this.primarKeyReadOnlyArr = { isORDER_NOreadOnly: false, isTEMPLATE_NAMEreadOnly: false };
    this.getOrderOutput.emit({ type: "cancel" })
    this.showButtons = false
    this.isSearch = true
    this.attachements = []
    this.woApprovalFlag = null
    this.workOrder = null
  }


  public onNew(e:any): void {
    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }

    this.starServices.onNew_form(e, this);
  }

  public onRemove(form): void {
    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }

    this.starServices.onRemove_form(form, this);
  }

  public enterQuery(form: any): void {
    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("form:", form)
    this.starServices.enterQuery_form(form, this);
  }
  get f():any { return this.form.controls; }
  public submitted = false;

  public callBackRemoveAtt(object, NewVal) {

    var id;
    for (var i = 0; i < object.myFiles.length; i++) {
      id = NewVal.ORDER_NO + "-" + object.myFiles[i].name;
      var page = "?action=remove&id=" + id + "&orderno=" + NewVal.ORDER_NO;
      if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page);
      var apiURL = this.starServices.SERVER_URL + '/api/att' + page;
      this.starServices.postUpload(apiURL, "").subscribe(result => {
        //if (this.paramConfig.DEBUG_FLAG) console.log('result', result); });
        if (this.paramConfig.DEBUG_FLAG) console.log(result);
      });
    }

  }
  public saveAttachment() {
    var attachments = "";
    var formVal = this.form.value;
    for (var i = 0; i < this.filesDeleted.length; i++) {
      id = formVal.ORDER_NO + "-" + this.filesDeleted[i].name;
      var page = "?action=remove&id=" + id + "&name=" + this.filesDeleted[i].name + "&orderno=" + formVal.ORDER_NO;
      if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page);
      var apiURL = this.starServices.SERVER_URL + '/api/att' + page;
      this.starServices.postUpload(apiURL, "").subscribe(result => {
        //if (this.paramConfig.DEBUG_FLAG) console.log('result', result); });
        if (this.paramConfig.DEBUG_FLAG) console.log(result);
      });
    }

    if (this.myFiles != null) {
      if (this.paramConfig.DEBUG_FLAG) console.log("this.myFiles.length:" + this.myFiles.length)
      var attachmentsArr = [];
      var id = "";
      for (var i = 0; i < this.myFiles.length; i++) {
        if (this.isNew == true)
          id = "-" + this.myFiles[i].name;
        else
          id = formVal.ORDER_NO + "-" + this.myFiles[i].name;
        var attElm = {
          name: this.myFiles[i].name,
          id: id,
          size: this.myFiles[i].size
        }
        attachmentsArr.push(attElm);
        var page = "?action=save&id=" + id + "&isNew=" + this.isNew + "&name=" + this.myFiles[i].name + "&orderno=" + formVal.ORDER_NO;
        if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page);
        var apiURL = this.starServices.SERVER_URL + '/api/att' + page;
        this.starServices.postUpload(apiURL, "").subscribe(result => {
          //if (this.paramConfig.DEBUG_FLAG) console.log('result', result); });
          if (this.paramConfig.DEBUG_FLAG) console.log(result);
        });

      }
      attachments = JSON.stringify(attachmentsArr);


    }
    formVal.ATTACHMENTS = attachments;
  }
  public buildAttachmentField() {
    var attachments = "";
    var formVal = this.form.value;
    if (this.myFiles != null) {
      if (this.paramConfig.DEBUG_FLAG) console.log("this.myFiles.length:" + this.myFiles.length)
      var attachmentsArr = [];
      var id = "";
      for (var i = 0; i < this.myFiles.length; i++) {
        id = formVal.ORDER_NO + "-" + this.myFiles[i].name;
        var attElm = {
          name: this.myFiles[i].name,
          id: id,
          size: this.myFiles[i].size
        }
        attachmentsArr.push(attElm);

      }
      attachments = JSON.stringify(attachmentsArr);


    }
    formVal.ATTACHMENTS = attachments;
    this.form.reset(formVal);
    this.form.markAsDirty();

  }

  public saveChanges(form: any): void {
    this.Body = [];

    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }
    var formVal = this.form.value;
    var msg = this.fieldsRequiredMsg2;
    if ((formVal.TEMPLATE_NAME == "") || (typeof formVal.TEMPLATE_NAME == "undefined"))
      msg = this.fieldsRequiredMsg;

    if (this.form.invalid) {
      this.submitted = true;
      this.starServices.showOkMsg(this, msg, "Error");
      return;
    }
    this.saveAttachment();

    if (this.createUsingTemplate == false) {
      this.starServices.saveChanges_form(form, this);
    }
    else {
      var newVal = { "_QUERY": "UPDATE_ADM_DUAL", "KEY": "ORDER_NO" };
      this.addToBody(newVal);
      var newVal = { "_QUERY": "GET_ADM_DUAL", "KEY": "ORDER_NO" };
      this.addToBody(newVal);
      var Page = "&_trans=Y";

      this.starServices.post(this, Page, this.Body).subscribe(result => {
        if (this.paramConfig.DEBUG_FLAG) console.log("VAL:" + result.data[1].data[0].VAL);
        var ORDER_NO = result.data[1].data[0].VAL;
        if (this.paramConfig.DEBUG_FLAG) console.log(this.form.value);
        var formVal = form.value;
        formVal.ORDER_NO = ORDER_NO;
        this.saveCompletedOutput.emit(formVal);
        this.Body = [];
      },
        err => {
          alert('error:' + err.message);
        });
    }

  }

  public goRecord(target: any): void {
    if (this.uploadInProgress == true) {
      this.starServices.showOkMsg(this, "Uploading in progress", "Info");
      return;
    }

    this.starServices.goRecord(target, this);
    var formVal = this.form.value;
    this.myFiles = [];
    var attachments = formVal.ATTACHMENTS;
    if ((attachments != "") && (attachments != null))
      this.myFiles = JSON.parse(attachments);

    if (this.paramConfig.DEBUG_FLAG) console.log("formVal:", formVal, " attachments:", attachments, " this.myFiles :", this.myFiles)



  }

  public userLang = "EN";
  public lookupArrDef:any = [{
    "statment": "SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrORDER_TYPE"
  },
  {
    "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_STATUS' and LANGUAGE_NAME = '" + this.userLang + "'  order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrORDER_STATUS"
  },
  {
    "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrDEPT"
  },
  {
    "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrASSIGNEE_TYPE"
  },
  /*{"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
      "lkpArrName":"lkpArrASSIGNEE"},*/
  {
    "statment": "SELECT TEMPLATE_NAME, TEMPLATE_NAME CODETEXT_LANG FROM DSP_TEMPLATE  ",
    "lkpArrName": "lkpArrTEMPLATE_NAME"
  }];

  public lkpArrORDER_TYPE = [];

  public lkpArrORDER_STATUS = [];

  public lkpArrDEPT = [];

  public lkpArrASSIGNEE_TYPE = [];

  public lkpArrASSIGNEE = [];

  public lkpArrTEMPLATE_NAME = [];

  public lkpArrGetORDER_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrORDER_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetORDER_STATUS(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrORDER_STATUS.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetDEPT(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrDEPT.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetASSIGNEE_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrASSIGNEE_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetASSIGNEE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrASSIGNEE.find((x:any) => x.CODE === CODE);
    return rec;
  }

  public lkpArrGetTEMPLATE_NAME(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrTEMPLATE_NAME.find((x:any) => x.CODE === CODE);
    return rec;
  }

  //////////////////////////////////////
  public showMultiStepForm(formVal) {
    this.Body = [];

    var Page = "&_trans=Y";

    var newVal = { "_QUERY": "GET_DSP_TEMPLATE", "TEMPLATE_NAME": formVal.TEMPLATE_NAME };
    this.addToBody(newVal);


    this.starServices.post(this, Page, this.Body).subscribe(result => {
      this.Body = [];
      if (this.paramConfig.DEBUG_FLAG) console.log(" ", result.data[0].data)
      this.templateInfo = result.data[0].data[0];
      if (this.paramConfig.DEBUG_FLAG) console.log("this.templateInfo:", this.templateInfo);


      if ((formVal.ORDER_FIELDS == "") || (formVal.ORDER_FIELDS == null)) {
        formVal.ORDER_FIELDS = "{}";
      }
      if (this.paramConfig.DEBUG_FLAG) console.log("test:formVal.ORDER_FIELDS:", formVal.ORDER_FIELDS);
      var formPagesNo = "";
      var masterParams = {
        "formName": this.templateInfo.FORM_NAME,
        "formPagesNo": formPagesNo,
        "orderFields": formVal.ORDER_FIELDS

      };
      if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;


      this.multiStepFormOpened = true;
      if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
      //if (formVal.ORDER_FIELDS == "")
      //  formVal.ORDER_FIELDS = null;
      if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);

      this.fieldsData = JSON.parse(formVal.ORDER_FIELDS);
      if (this.paramConfig.DEBUG_FLAG) console.log("test:this.fieldsData:", this.fieldsData);
      this.fieldsSave = false;

    },
      err => {
        alert('error:' + err.message);
      });

  }
  public multiStepFormClose() {
    this.multiStepFormOpened = false;
  }
  public savemultiStepFormCompletedHandler(DSP_MULTISTEP) {
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsFormSave :", this.fieldsFormSave, " DSP_DYNAMIC_RW:", DSP_MULTISTEP);

    this.fieldsData = DSP_MULTISTEP;
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsData:", this.fieldsData);
    /*for (var i=0; i<this.fieldsData.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsData.data:", this.fieldsData[i].data)
    }*/

    var orderField = JSON.stringify(this.fieldsData);
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsFormSave:", this.fieldsFormSave)
    var formVal = this.form.value;
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:saveCompletedHandler:orderField,", orderField)
    formVal["ORDER_FIELDS"] = orderField;
    this.form.reset(formVal);
    this.multiStepFormClose();

  }

  //////////////////////////

  //////////////////////////
  public populateForm(object, result) {
    if (object.paramConfig.DEBUG_FLAG) console.log("object.isNew:", object.isNew)
    if (object.isNew == true) {


      if (object.paramConfig.DEBUG_FLAG) console.log("got data:" + result);
      if (object.paramConfig.DEBUG_FLAG) console.log(result);
      let formVal: orders = object.form.value;
      //let template:Template = result.data[0].data[0];
      if ((result.data[0].data[0].DAYS == null) || (result.data[0].data[0].DAYS == 0)) {
        var details = result.data[1].data;
        var detailDays = 0;
        if (object.paramConfig.DEBUG_FLAG) console.log("details.length:" + details.length)
        if (object.paramConfig.DEBUG_FLAG) console.log(details)
        for (var i = 0; i < details.length; i++) {
          if (object.paramConfig.DEBUG_FLAG) console.log("details.DURATION:" + details[i].DURATION)
          detailDays = detailDays + details[i].DURATION;

        }
        result.data[0].data[0].DAYS = detailDays;
      }
      let days: number = parseInt(result.data[0].data[0].DAYS);

      var promisedDate: Date = new Date();
      if (object.paramConfig.DEBUG_FLAG) console.log("promisedDate:" + promisedDate + "====days=== " + days);

      promisedDate = addDays(promisedDate, days);
      //promisedDate = addDays(promisedDate,  1);
      if (object.paramConfig.DEBUG_FLAG) console.log("promisedDate:" + promisedDate)

      formVal.ORDER_TYPE = result.data[0].data[0].ORDER_TYPE;
      formVal.PROMISED_DATE = promisedDate;
      formVal.ORDERED_DATE = new Date();
      formVal.DEPT = result.data[0].data[0].DEPT;
      formVal.DIVS = result.data[0].data[0].DIVS;
      formVal.ASSIGNEE_TYPE = result.data[0].data[0].ASSIGNEE_TYPE;
      formVal.ASSIGNEE = object.paramConfig.USER_INFO.TEAM;


      object.form.reset(formVal);
    }
  }

  public valueChangeTEMPLATE_NAME(value: any): void {
    if (this.hideOthers) return

    //This is for combobox value change
    var formVal = this.form.value;
    if (typeof formVal.TEMPLATE_NAME != "undefined") {
      this.readCompletedOutput.emit(formVal);
      var NewVal = {
        "TEMPLATE_NAME": formVal.TEMPLATE_NAME
      };
      NewVal["_QUERY"] = "GET_DSP_TEMPLATE";

      this.addToBody(NewVal);
      var NewVal1 = {
        "TEMPLATE_NAME": formVal.TEMPLATE_NAME,
        "SEQUENCE_NAME": "%",
      };
      NewVal1["_QUERY"] = "GET_DSP_TEMPLATE_DETAIL";
      this.addToBody(NewVal1);

      this.starServices.performPost(this, this.populateForm);
    }


  }
  public currentFileUpload;
  public myFiles: Array<any> = [];
  /*
    {name:'test1.txt', size:1},
    {name:'test2.txt', size:1},
    {name:'test3.txt', size:1},
  ];*/
  public filesDeleted: Array<any> = [];

  public clearEventHandler(e: ClearEvent): void { if (this.paramConfig.DEBUG_FLAG) console.log("clearEventHandler:") }

  public removeEventHandler_not_used(e: SelectEvent): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("removeEventHandler:")
    e.files.forEach((file) => {
      if (this.paramConfig.DEBUG_FLAG) console.log(`File selected: ${file.name}`);
      var exists = this.checkNameExist(this.filesDeleted, file.name);
      if (exists == -1)
        this.filesDeleted.push({ name: file.name })
    });
    if (this.paramConfig.DEBUG_FLAG) console.log(this.filesDeleted)
  }
  public removeFile(name): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("removeFile:")
    var exists = this.checkNameExist(this.filesDeleted, name);
    if (exists == -1)
      this.filesDeleted.push({ name: name })

    if (this.paramConfig.DEBUG_FLAG) console.log(this.filesDeleted)

    var exists = this.checkNameExist(this.myFiles, name);
    if (exists != -1)
      this.myFiles.splice(exists, 1);

    if (this.paramConfig.DEBUG_FLAG) console.log(this.myFiles)

    this.rebuildMyFiles();
  }
  public checkNameExist(fileList, name) {
    var exists = -1;
    var i = 0;
    while (i < fileList.length) {
      if (fileList[i].name == name) {
        exists = i;
        break;
      }
      i++;
    }
    return exists;
  }
  public rebuildMyFiles() {
    var myFilesNew = [];
    for (var i = 0; i < this.myFiles.length; i++) {
      var exists = this.checkNameExist(myFilesNew, this.myFiles[i].name);
      if (exists == -1) {
        var fileElm = { name: this.myFiles[i].name, size: this.myFiles[i].size };
        myFilesNew.push(fileElm)
      }
    }
    this.myFiles = myFilesNew

    var myFilesNew = [];
    for (var i = 0; i < this.filesDeleted.length; i++) {
      var exists = this.checkNameExist(this.myFiles, this.filesDeleted[i].name);
      if (this.paramConfig.DEBUG_FLAG) console.log(exists + " " + this.filesDeleted[i].name)
      if (exists == -1) {
        var fileElm = { name: this.filesDeleted[i].name, size: this.filesDeleted[i].size };
        if (this.paramConfig.DEBUG_FLAG) console.log(fileElm)
        myFilesNew.push(fileElm)
      }
    }
    this.filesDeleted = myFilesNew

    if (this.paramConfig.DEBUG_FLAG) console.log(this.filesDeleted)
    if (this.paramConfig.DEBUG_FLAG) console.log(this.myFiles)

  }
  public completeEventHandler(e: SelectEvent) {

    this.rebuildMyFiles();
    this.uploadInProgress = false;
    this.buildAttachmentField();
  }
  public uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  public uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint



  public selectEventHandler(e: SelectEvent) {
    const that = this;
    e.files.forEach((file) => {
      if (this.paramConfig.DEBUG_FLAG) console.log(`File selected: ${file.name}`);
      if (!file.validationErrors) {
        this.currentFileUpload = file;
      }
    });
  }
  public kendoFiles;
  public filesSet;

  public uploadEventHandler(e: UploadEvent) {
    this.uploadInProgress = true;
    var ver = "";
    var name = "";
    this.kendoFiles = e.files;
    this.filesSet = new Set<File>();
    for (let i = 0; i < this.kendoFiles.length; i++) {
      const rawFile: File = this.kendoFiles[i].rawFile;
      if (this.paramConfig.DEBUG_FLAG) console.log("rawFile:" , rawFile)
      if (this.paramConfig.DEBUG_FLAG) console.log(rawFile)
      this.filesSet.add(rawFile);
      if (this.paramConfig.DEBUG_FLAG) console.log(rawFile.name + " " + rawFile.lastModified)
      ver = rawFile.lastModified.toString();
      name = rawFile.name;
    }


    let formVal: orders = this.form.value;
    var id = formVal.ORDER_NO;
    var page = "?action=upload";
    if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page)
    this.starServices.uploadFile(page, this.filesSet, id);

  }
  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (this.paramConfig.DEBUG_FLAG) console.log("Outside InputmaterisNotNull", ComponentConfig);
    if (ComponentConfig.masterParams != null) {
      if (this.paramConfig.DEBUG_FLAG) console.log("Inside InputmaterisNot Null", ComponentConfig.masterParams.disableLogutton);
      if (ComponentConfig.masterParams.disableLogutton == false) {
        this.hide_log = true;
      }
      // put your code to hide the button
      this.hideOthers = ComponentConfig.masterParams.hideOthers
      if (this.hideOthers) {
        this.isChild = false
        this.isSearch = true
      }

      if (ComponentConfig.masterParams.order) {
        this.form.reset({
          "ORDER_NO": ComponentConfig.masterParams.order.ORDER_NO
        })
        this.executeQuery(this.form.value)

        if (ComponentConfig.masterParams.order["WO_STATUS"] != this.paramConfig.CREATED) {
          this.woApprovalFlag = ComponentConfig.masterParams.order["WO_STATUS"]
          this.showButtons = false
          this.workOrder = null
        }
        else {
          this.getOrder(ComponentConfig.masterParams.order["ORDER_NO"])
          this.showButtons = true
          this.workOrder = ComponentConfig.masterParams.order
          this.woApprovalFlag = ComponentConfig.masterParams.order["WO_STATUS"]
        }

        if (ComponentConfig.masterParams.getOrder == true) {
          this.getOrder(ComponentConfig.masterParams.order["ORDER_NO"])
        }
      }
    }
    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("Orders Form ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);

      if (ComponentConfig.formMode == "CREATE") {
        this.hideForCreate = true;
        this.createUsingTemplate = true;
      }
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;
    }

  }




  public logOpen(formVal) {
    var orderno = formVal.ORDER_NO;

    //  RULE_KEY = ‘430’ or RULE_KEY like ‘430-%’ 
    var whereClause = " RULE_KEY = '" + orderno + "' OR RULE_KEY like '" + orderno + "-%' ";

    if (this.paramConfig.DEBUG_FLAG) console.log("Hani whereClause:" + whereClause)
    whereClause = encodeURIComponent(whereClause);
    var Page = "&_WHERE=" + whereClause;


    this.ADM_RuleLogGridConfig = new componentConfigDef();
    this.ADM_RuleLogGridConfig.formattedWhere = Page;


    this.logOpened = true;



  }


  public logClose() {
    if (this.paramConfig.DEBUG_FLAG) console.log("logClose: this.logOpened:", this.logOpened)
    this.logOpened = false;
  }

  changeWOStatus(status) {
    this.Body = []
    this.addToBody({
      "_QUERY": "UPDATE_DSP_WORK_ORDERS_DISPATCH",
      "WO_STATUS": status,
      "WO_ORDER_NO": this.workOrder["WO_ORDER_NO"],
    })

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
      this.showButtons = false
      this.woApprovalFlag = status
      this.orderStatusOutput.emit({
        orderNo: this.workOrder["WO_ORDER_NO"],
        status
      })
    })
  }
}