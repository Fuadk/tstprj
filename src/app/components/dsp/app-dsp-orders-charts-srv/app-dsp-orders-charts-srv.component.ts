import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { starServices } from 'starlib';
import { workOrders, componentConfigDef, orders } from '@modeldir/model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays } from '@progress/kendo-date-math';
import { SelectEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { Starlib1 } from '../../Starlib1';

declare function getParamConfig(): any;

const createFormGroup = (dataItem) => new FormGroup({
  'ORDER_TYPE': new FormControl(dataItem.ORDER_TYPE),
  'ORDER_NO': new FormControl(dataItem.ORDER_NO),
  'TEMPLATE_NAME': new FormControl(dataItem.TEMPLATE_NAME),
  'SUBNO': new FormControl(dataItem.SUBNO, Validators.required),
  'ORDER_STATUS': new FormControl(dataItem.ORDER_STATUS),
  'DIV': new FormControl(dataItem.DIV),
  'DEPT': new FormControl(dataItem.DEPT),
  'ASSIGNEE_TYPE': new FormControl(dataItem.ASSIGNEE_TYPE),
  'ASSIGNEE': new FormControl(dataItem.ASSIGNEE),
  'PROMISED_DATE': new FormControl(dataItem.PROMISED_DATE),
  'ORDERED_DATE': new FormControl(dataItem.ORDERED_DATE),
  'COMPLETION_DATE': new FormControl(dataItem.COMPLETION_DATE),
  'NOTES': new FormControl(dataItem.NOTES),
  'PARENT_ORDER_TYPE': new FormControl(dataItem.PARENT_ORDER_TYPE),
  'PARENT_ORDER_NO': new FormControl(dataItem.PARENT_ORDER_NO),
  'ACTUAL_START_DATE': new FormControl(dataItem.ACTUAL_START_DATE),
  'ACTUAL_END_DATE': new FormControl(dataItem.ACTUAL_END_DATE),
  'ATTACHMENTS': new FormControl(dataItem.ATTACHMENTS),
  'LOGDATE': new FormControl(dataItem.LOGDATE),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
});

const createAddFormGroup = (dataItem) => new FormGroup({
  'ORDER_TYPE': new FormControl(dataItem.ORDER_TYPE, Validators.required),
  'ORDER_NO': new FormControl(dataItem.ORDER_NO),
  'TEMPLATE_NAME': new FormControl(dataItem.TEMPLATE_NAME, Validators.required),
  'SUBNO': new FormControl(dataItem.SUBNO, Validators.required),
  'ORDER_STATUS': new FormControl(dataItem.ORDER_STATUS),
  'DIV': new FormControl(dataItem.DIV),
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


@Component({
  selector: 'app-app-dsp-orders-charts-srv',
  templateUrl: './app-dsp-orders-charts-srv.component.html',
  styleUrls: ['./app-dsp-orders-charts-srv.component.css']
})
export class AppDspOrdersChartsSrvComponent implements OnInit {
  public title = "Service creation"
  public showToolBar = false

  public componentConfig: componentConfigDef
  public paramConfig
  public DSP_ORDERSGridConfig: componentConfigDef;
  public DSP_WORK_ORDERSGridConfig: componentConfigDef;
  public grid_DSP_ORDERS: orders;
  public grid_DSP_WORK_ORDERS: workOrders;

  public routineAuth = null;
  public form: FormGroup;
  public addForm: FormGroup;
  private formInitialValues:any = new orders();
  private addFormInitialValues = new orders();
  private Body:any = [];
  fieldsDataObj = {}
  fieldsDataObjKeys = {}
  public isAsigneeTypeReadOnly: boolean = false;
  public isAsigneeReadOnly: boolean = false;

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();

  newRequestOpened = false

  public CRC_CRC_STATConfig: componentConfigDef;
  public CRC_CRC_STATConfig2: componentConfigDef;
  public userLang = "EN";
  public lookupArrDef:any = [
    {
      "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_STATUS' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
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
    // {
    //   "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='YES_OR_NO' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    //   "lkpArrName": "lkpArrASSIGNEE_TYPE"
    // },
    {
      "statment": "SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' and CODEVALUE_LANG = 'HR' order by CODETEXT_LANG  ",
      "lkpArrName": "lkpArrORDER_TYPE"
    },
    // {
    //   "statment": "SELECT TEMPLATE_NAME, TEMPLATE_NAME CODETEXT_LANG FROM DSP_TEMPLATE  ",
    //   "lkpArrName": "lkpArrTEMPLATE_NAME"
    // }
  ];

  public lookupArrDefTemplateName = [
    {
      "statment": "SELECT TEMPLATE_NAME, TEMPLATE_NAME CODETEXT_LANG FROM DSP_TEMPLATE WHERE ORDER_TYPE = REPLACE_THIS",
      "lkpArrName": "lkpArrTEMPLATE_NAME"
    }
  ]
  public lkpArrORDER_TYPE = [];
  public lkpArrORDER_STATUS = [];
  public lkpArrDEPT = [];
  public lkpArrASSIGNEE_TYPE = [];
  public lkpArrASSIGNEE = [];
  public lkpArrTEMPLATE_NAME = [];
  public DSP_ORDERSFormConfig: componentConfigDef;

  public uploadSaveUrl = 'saveUrl';
  public uploadRemoveUrl = 'removeUrl';
  public currentFileUpload;
  public myFiles: Array<any> = [];
  public filesDeleted: Array<any> = [];
  public uploadInProgress: boolean = false;
  public kendoFiles;
  public filesSet;
  public AttDwnUrl = "";
  public submitted = false;

  public DSP_MULTISTEPFormConfig: componentConfigDef;
  public templateInfo;
  public fieldsData = {};
  public fieldsSave: boolean = false;
  showMultistep = false

  constructor(public starServices: starServices, private starlib1: Starlib1,) {
    this.paramConfig = getParamConfig()
    this.componentConfig = new componentConfigDef()

    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = 400;

    // this.CRC_CRC_STATConfig = new componentConfigDef();
    // this.CRC_CRC_STATConfig2 = new componentConfigDef();
    // var masterParams = {
    //   DASHBOARD_ID: 2,
    //   hideOptions: true
    // }
    // this.CRC_CRC_STATConfig.masterParams = masterParams;
  }

  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVORDEROV');

    this.form = createFormGroup(
      this.formInitialValues
    );

    this.addFormInitialValues.ASSIGNEE_TYPE = "TEAM";
    this.addFormInitialValues.ASSIGNEE = this.paramConfig.USER_INFO.TEAM;
    this.addForm = createAddFormGroup(
      this.addFormInitialValues
    );

    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);

    this.AttDwnUrl = this.starServices.SERVER_URL + "/api/att?action=download&username=" + this.paramConfig.USERNAME.toLowerCase() + "&name=";

    this.grid_DSP_ORDERS = new orders();

    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.isMaster = true;
    this.DSP_ORDERSGridConfig.routineAuth = this.routineAuth;
    this.DSP_ORDERSGridConfig.gridHeight = 250;
    this.DSP_ORDERSGridConfig.insertable = false;
    this.DSP_ORDERSGridConfig.masterParams = {
      readOnly: true
    }

    this.grid_DSP_WORK_ORDERS = new workOrders();
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.isChild = true;
    this.DSP_WORK_ORDERSGridConfig.routineAuth = this.routineAuth;
    this.DSP_WORK_ORDERSGridConfig.gridHeight = 250;
    this.DSP_WORK_ORDERSGridConfig.insertable = false;

    this.DSP_ORDERSFormConfig = new componentConfigDef();
    this.DSP_ORDERSFormConfig.isMaster = true;
  }

  public executeQuery(form: any): void {
    var Page = "";

    // if (form.ASSIGNEE_TYPE == "N") {
    //   form.ASSIGNEE_TYPE = "= '' ";
    // }
    // if (form.ASSIGNEE_TYPE == "Y") {
    //   form.ASSIGNEE_TYPE = "<> '' ";
    // }

    // form["ASSIGNEE"] = this.paramConfig.USER_INFO.USERNAME

    Page = this.starServices.formatWhere(form);

    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.formattedWhere = Page;
  }

  public onCancel(e:any): void {
    this.starServices.onCancel_form(e, this);
    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.clearComponent = true;

    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.clearComponent = true;
  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('DEPT').valueChanges.subscribe(val => {
      this.lookupArrDef = [{
        "statment": "SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
        "lkpArrName": "lkpArrDIV"
      }];
      this.starServices.fetchLookups(this, this.lookupArrDef);
    });

    
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

  print() {
    window.print()
  }

  public series: any[] = [{
    name: "India",
    data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
  }, {
    name: "Russian Federation",
    data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
  }, {
    name: "Germany",
    data: [0.010, -0.375, 1.161, 0.684, 3.7, 3.269, 1.083, -5.127, 3.690, 2.995]
  }, {
    name: "World",
    data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
  }]

  public categories = ["ADDE", "ADN", "ADDU", "ADDV", "CONFIGE", "INST", "PREP"];

  public pieData: any[] = [
    { category: '0-14', value: 0.2545 },
    { category: '15-24', value: 0.1552 },
    { category: '25-54', value: 0.4059 },
    { category: '55-64', value: 0.0911 },
    { category: '65+', value: 0.0933 }
  ];

  public readCompletedHandler(grid_DSP_ORDERS) {
    this.grid_DSP_WORK_ORDERS = new workOrders()
    this.grid_DSP_WORK_ORDERS.ORDER_NO = grid_DSP_ORDERS.ORDER_NO
    console.log('this.addForm.value["ORDER_TYPE"]:', this.form.value["ORDER_TYPE"])
    this.CRC_CRC_STATConfig = new componentConfigDef();
    this.CRC_CRC_STATConfig2 = new componentConfigDef();
    let gridParamsDataUser:any=[];
    let orderType = "%";
    let orderStatus = "%";
    let assignee = "%";
    if ( (this.form.value["ORDER_TYPE"] != "") && (typeof this.form.value["ORDER_TYPE"] != "undefined") )
      orderType = this.form.value["ORDER_TYPE"];
    if ((this.form.value["ORDER_STATUS"] != "")&& (typeof this.form.value["ORDER_STATUS"] != "undefined") )
      orderStatus = this.form.value["ORDER_STATUS"];
    if ((this.form.value["ASSIGNEE"] != "") && (typeof this.form.value["ASSIGNEE"] != "undefined") )
      assignee = this.form.value["ASSIGNEE"];

    let params = {
      ORDER_TYPE:orderType,
      ORDER_STATUS:orderStatus,
      ASSIGNEE:assignee
     
    };
    gridParamsDataUser.push(params);
    
    var masterParams = {
      name : "Services bye Types",
      type : "bar",
      queryID : 15,
      gridParamsDataUser :gridParamsDataUser
    
    }
    this.CRC_CRC_STATConfig.masterParams = masterParams;
    console.log("this.CRC_CRC_STATConfig:", this.CRC_CRC_STATConfig)
    
    var masterParams = {
      name : "Services by Types, status",
      type : "bar",
      queryID : 16,
      gridParamsDataUser :gridParamsDataUser
    
    }
    this.CRC_CRC_STATConfig2.masterParams = masterParams;
    console.log("this.CRC_CRC_STATConfig2:", this.CRC_CRC_STATConfig2)
  }

  public clearCompletedHandler(grid_DSP_ORDERS) {
    this.grid_DSP_WORK_ORDERS = new workOrders()
  }

  public saveCompletedHandler(grid_DSP_ORDERS) {
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef()
    this.DSP_WORK_ORDERSGridConfig.masterSaved = grid_DSP_ORDERS
    this.DSP_WORK_ORDERSGridConfig.masterKey = grid_DSP_ORDERS.ORDER_NO
  }

  public valueChangeORDER_TYPE(value: any): void {
    console.log("valueChangeORDER_TYPE:", value, this.addForm.value["ORDER_TYPE"])
    this.lookupArrDefTemplateName = [
      {
        "statment": `SELECT TEMPLATE_NAME, TEMPLATE_NAME CODETEXT_LANG FROM DSP_TEMPLATE WHERE ORDER_TYPE = '${this.addForm.value["ORDER_TYPE"]}'`,
        "lkpArrName": "lkpArrTEMPLATE_NAME"
      }
    ]
    this.starServices.fetchLookups(this, this.lookupArrDefTemplateName);
  }

  public fetchLookupsCallBack() {
    console.log("ELHAMY", this.lkpArrTEMPLATE_NAME)
    if (this.newRequestOpened) {
      let selectedVal = this.lkpArrTEMPLATE_NAME.find(d => d["TEMPLATE_NAME"] != "")
      if (selectedVal) {
        this.addForm.patchValue({
          "TEMPLATE_NAME": selectedVal["TEMPLATE_NAME"]
        }, { emitEvent: true })
        this.valueChangeTEMPLATE_NAME(null)
      }
    }
  }

  public valueChangeTEMPLATE_NAME(value: any): void {
    var formVal = this.addForm.value;
    if (typeof formVal.TEMPLATE_NAME != "undefined") {
      this.readCompletedOutput.emit(formVal);
      var NewVal = {
        "TEMPLATE_NAME": formVal.TEMPLATE_NAME
      };
      NewVal["_QUERY"] = "GET_DSP_TEMPLATE";

      this.Body.push(NewVal);
      var NewVal1 = {
        "TEMPLATE_NAME": formVal.TEMPLATE_NAME,
        "SEQUENCE_NAME": "%",
      };
      NewVal1["_QUERY"] = "GET_DSP_TEMPLATE_DETAIL";
      this.Body.push(NewVal1);

      this.starServices.performPost(this, this.populateForm);
      this.showMultiStepForm()
    }
  }

  public populateForm(object, result) {
    if (object.isNew == true) {
      let formVal: orders = object.addForm.value;
      if ((result.data[0].data[0].DAYS == null) || (result.data[0].data[0].DAYS == 0)) {
        var details = result.data[1].data;
        var detailDays = 0;
        for (var i = 0; i < details.length; i++) {
          detailDays = detailDays + details[i].DURATION;
        }
        result.data[0].data[0].DAYS = detailDays;
      }
      let days: number = parseInt(result.data[0].data[0].DAYS);

      var promisedDate: Date = new Date();

      promisedDate = addDays(promisedDate, days);

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

  public selectEventHandler(e: SelectEvent) {
    e.files.forEach((file) => {
      if (this.paramConfig.DEBUG_FLAG) console.log(`File selected: ${file.name}`);
      if (!file.validationErrors) {
        this.currentFileUpload = file;
      }
    });
  }

  public removeEventHandler_not_used(e: SelectEvent): void {
    e.files.forEach((file) => {
      var exists = this.checkNameExist(this.filesDeleted, file.name);
      if (exists == -1)
        this.filesDeleted.push({ name: file.name })
    });
  }

  public removeFile(name): void {
    var exists = this.checkNameExist(this.filesDeleted, name);
    if (exists == -1)
      this.filesDeleted.push({ name: name })

    var exists = this.checkNameExist(this.myFiles, name);
    if (exists != -1)
      this.myFiles.splice(exists, 1);

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
    var myFilesNew:any = [];
    for (var i = 0; i < this.myFiles.length; i++) {
      var exists = this.checkNameExist(myFilesNew, this.myFiles[i].name);
      if (exists == -1) {
        var fileElm = { name: this.myFiles[i].name, size: this.myFiles[i].size };
        myFilesNew.push(fileElm)
      }
    }
    this.myFiles = myFilesNew

    var myFilesNew:any = [];
    for (var i = 0; i < this.filesDeleted.length; i++) {
      var exists = this.checkNameExist(this.myFiles, this.filesDeleted[i].name);
      if (exists == -1) {
        var fileElm = { name: this.filesDeleted[i].name, size: this.filesDeleted[i].size };
        myFilesNew.push(fileElm)
      }
    }
    this.filesDeleted = myFilesNew
  }

  public completeEventHandler(e: SelectEvent) {
    this.rebuildMyFiles();
    this.uploadInProgress = false;
    this.buildAttachmentField();
  }

  public buildAttachmentField() {
    var attachments = "";
    var formVal = this.addForm.value;
    if (this.myFiles != null) {
      var attachmentsArr:any = [];
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
    this.addForm.reset(formVal);
    this.addForm.markAsDirty();
  }

  public uploadEventHandler(e: UploadEvent) {
    this.uploadInProgress = true;
    var ver = "";
    var name = "";
    this.kendoFiles = e.files;
    this.filesSet = new Set<File>();
    for (let i = 0; i < this.kendoFiles.length; i++) {
      const rawFile: File = this.kendoFiles[i].rawFile;
      if (this.paramConfig.DEBUG_FLAG) console.log("rawFile:" + rawFile)
      if (this.paramConfig.DEBUG_FLAG) console.log(rawFile)
      this.filesSet.add(rawFile);
      if (this.paramConfig.DEBUG_FLAG) console.log(rawFile.name + " " + rawFile.lastModified)
      ver = rawFile.lastModified.toString();
      name = rawFile.name;
    }

    let formVal: orders = this.addForm.value;
    var id = formVal.ORDER_NO;
    var page = "?action=upload";

    this.starServices.uploadFile(page, this.filesSet, id);
  }

  public showMultiStepForm() {
    this.Body = [];

    var Page = "&_trans=Y";

    var newVal = { "_QUERY": "GET_DSP_TEMPLATE", "TEMPLATE_NAME": this.addForm.value.TEMPLATE_NAME };
    this.Body.push(newVal);

    this.starServices.post(this, Page, this.Body).subscribe(result => {
      this.Body = [];
      this.templateInfo = result.data[0].data[0];

      if ((this.addForm.value.ORDER_FIELDS == "") || (this.addForm.value.ORDER_FIELDS == null)) {
        this.addForm.value.ORDER_FIELDS = "{}";
      }

      var formPagesNo = "";
      var masterParams = {
        "formName": this.templateInfo.FORM_NAME,
        "formPagesNo": formPagesNo,
        "orderFields": this.addForm.value.ORDER_FIELDS
      };

      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;

      this.showMultistep = true;

      this.fieldsData = JSON.parse(this.addForm.value.ORDER_FIELDS);
      this.fieldsSave = false;
    },
      err => {

      });
  }

  addNewRequest() {
    this.addForm.reset()
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = 400;
    this.showMultistep = false

    this.newRequestOpened = true
  }

  public submitAction() {
    if (!this.fieldsDataObj || typeof this.fieldsDataObj === undefined) return
    if (this.fieldsDataObj && Object.keys(this.fieldsDataObj).length == 0) return

    var page = "";
    var url = this.starServices.SERVER_URL + '/prov/api?_format=json';
    var formVal = this.addForm.value;
    var orderField = formVal.ORDER_FIELDS;

    var newVal = { "_QUERY": "CREATE_ORDER" };

    newVal["TEMPLATE_NAME"] = formVal.TEMPLATE_NAME;
    newVal["SUBNO"] = formVal.SUBNO;
    newVal["EMAIL"] = "";
    newVal["NOTES"] = formVal.ORDER_NOTE;
    newVal["ASSIGNEE"] = this.paramConfig.USERNAME;
    newVal["ASSIGNEE_TYPE"] = "PERSON";
    newVal["ORDERED_DATE"] = this.starlib1.GET_DATE_ISO();
    newVal["ATTACHMENTS"] = formVal.ATTACHMENTS;

    if ((orderField == "") || (orderField == null))
      orderField = "{}";
    var orderFieldJson = JSON.parse(orderField);

    // orderFieldJson["data"] = this.fieldsDataObj;

    Object.keys(this.fieldsDataObjKeys).forEach(key => {
      // if (key != "data")
      orderFieldJson[key] = this.fieldsDataObjKeys[key]
    })

    newVal["ORDER_FIELDS"] = orderFieldJson;
    this.Body.push(newVal);

    this.starServices.postCommand(page, url, this.Body).subscribe(result => {
      if (result != null) {
        this.Body = [];
        var dataResult = JSON.parse(JSON.stringify(result));

        this.starServices.showNotification("success", "Order created No:" + dataResult.ORDER_NO);
        var dialogStruc = {
          msg: "Successfully created order  No:" + dataResult.ORDER_NO,
          title: "Success",
          info: null,
          object: this,
          action: this.starServices.OkActions,
          callback: null
        };
        this.starServices.showConfirmation(dialogStruc);
      }
      else
        this.starServices.showNotification("error", "error:" + result);
      this.Body = [];

      this.newRequestOpened = false
      this.fieldsDataObj = {}
      this.fieldsDataObjKeys = {}
    });
  }

  saveCompletedOutputHandler(e) {
    this.fieldsDataObj = e.data
    this.fieldsDataObjKeys = e
    this.submitAction()
  }
}
