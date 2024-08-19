import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare function getParamConfig(): any;

const createFormGroup = (dataItem:any) => new FormGroup({
  'WO_TYPE': new FormControl(dataItem.WO_TYPE),
  'WO_ORDER_NO': new FormControl(dataItem.WO_ORDER_NO, Validators.required),
  'SUBNO': new FormControl(dataItem.SUBNO),
  'WO_STATUS': new FormControl(dataItem.WO_STATUS),
  'TEMPLATE_NAME': new FormControl(dataItem.TEMPLATE_NAME),
  'TEMPLATE_ORDER': new FormControl(dataItem.TEMPLATE_ORDER),
  'DIV': new FormControl(dataItem.DIV),
  'DEPT': new FormControl(dataItem.DEPT),
  'ASSIGNEE_TYPE': new FormControl(dataItem.ASSIGNEE_TYPE),
  'ASSIGNEE': new FormControl(dataItem.ASSIGNEE),
  'PROMISED_DATE': new FormControl(dataItem.PROMISED_DATE),
  'COMPLETION_DATE': new FormControl(dataItem.COMPLETION_DATE),
  'NOTES': new FormControl(dataItem.NOTES),
  'PARENT_WO_ORDER_NO': new FormControl(dataItem.PARENT_WO_ORDER_NO),
  'ORDER_NO': new FormControl(dataItem.ORDER_NO, Validators.required),
  'ACTUAL_START_DATE': new FormControl(dataItem.ACTUAL_START_DATE),
  'ACTUAL_END_DATE': new FormControl(dataItem.ACTUAL_END_DATE),
  'ORDERED_DATE': new FormControl(dataItem.ORDERED_DATE),
  'ORDER_FIELDS': new FormControl(dataItem.ORDER_FIELDS),
  'EXTERNAL_INFO': new FormControl(dataItem.EXTERNAL_INFO),
  'LOGDATE': new FormControl(dataItem.LOGDATE),
  'LOGNAME': new FormControl(dataItem.LOGNAME),
  'ATTACHMENTS': new FormControl(dataItem.ATTACHMENTS)
});


@Component({
  selector: 'app-dsp-work-order-ar',
  templateUrl: './dsp-work-order-ar.component.html',
  styleUrls: ['./dsp-work-order-ar.component.css']
})
export class DspWorkOrderArComponent implements OnInit {
  public showDiagram = true;
  public title = "Service Acceptance"

  public DSP_MULTISTEPFormConfig: componentConfigDef;
  public DSP_ORDERSFormConfig: componentConfigDef;
  
  public app_dsp_diagram_wrapConfig:componentConfigDef;


  showMultistep = false
  Body = []
  gridData = []
  public paramConfig;
  showHistoryCheck = false
  showForm = false

  constructor(private starServices: starServices) {
    this.DSP_ORDERSFormConfig = new componentConfigDef();
    this.DSP_ORDERSFormConfig.isMaster = true;
    this.DSP_ORDERSFormConfig.masterParams = {
      hideOthers: true
    }

    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight = 400;
    this.DSP_MULTISTEPFormConfig.masterParams = {
      isReadOnly: true
    }

    this.paramConfig = getParamConfig();
  }

  ngOnInit(): void {
    this.getWorkOrdersApprove(this.paramConfig.CREATED)
  }

  getWorkOrdersApprove(approvalFlag) {
    this.gridData = []
    this.showHistoryCheck = false
    this.showForm = false
    this.showMultistep = false

    this.Body = []
    this.Body.push({
      "_QUERY": "GET_DSP_WORK_ORDERS_TO_APPROVE",
      "TEMPLATE_NAME": "%",
      "APPROVAL_FLAG": "%",
      "WO_STATUS": approvalFlag,
    })

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
      // let workOrders = (res.data[0].data as []).filter(wo =>
      //   wo["WO_STATUS"] == this.paramConfig.CREATED &&
      //   this.filterWorkOrder(wo))

      let workOrdersAll = (res.data[0].data as []).filter(wo => this.filterWorkOrder(wo))

      // this.gridData = workOrders
      // this.gridDataNew = workOrders
      this.gridData = workOrdersAll
    })
  }

  filterWorkOrder(wo) {
    if (wo["ASSIGNEE_TYPE"] == "MGR") {
      if (this.paramConfig.USER_INFO.MANAGER == 1 && this.paramConfig.USER_INFO.DEPT == wo["DEPT"]) {
        console.log("MANAGER MATCH 1", this.paramConfig.USER_INFO)
        return true
      }
    }

    if (wo["ASSIGNEE_TYPE"] == "TEAM") {
      if (this.paramConfig.USER_INFO.TEAM == wo["ASSIGNEE"]) {
        console.log("MANAGER MATCH 1: TEAM", wo, this.paramConfig.USER_INFO)
        return true;
      }
    }

    return false;
    // if(wo["ASSIGNEE_TYPE"] == "MGR" && this.paramConfig.USER_INFO.MANAGER == 1) {
    //   console.log("MANAGER MATCH 2", this.paramConfig.USER_INFO);
    //   return true;
    // }else 
    //   return false;
  }

  public readCompletedHandler(form) {
    if (form.type == "cancel") {
      this.showMultistep = false
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.gridHeight = 400;
      this.DSP_MULTISTEPFormConfig.masterParams = {
        isReadOnly: true
      }
    }
    else if (form["ORDER_NO"] != "") {
      this.showMultiStepForm(form)
    }
  }

  public showMultiStepForm(form) {
    this.Body = [];

    var Page = "&_trans=Y";

    var newVal = { "_QUERY": "GET_DSP_TEMPLATE", "TEMPLATE_NAME": form.TEMPLATE_NAME };
    this.Body.push(newVal);

    this.starServices.post(this, Page, this.Body).subscribe(result => {
      this.Body = [];
      let templateInfo = result.data[0].data[0];

      if ((form.ORDER_FIELDS == "") || (form.ORDER_FIELDS == null)) {
        form.ORDER_FIELDS = "{}";
      }

      var formPagesNo = "";
      var masterParams = {
        "formName": templateInfo.FORM_NAME,
        "formPagesNo": formPagesNo,
        "orderFields": form.ORDER_FIELDS,
        "isReadOnly": true
      };

      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;

      this.showMultistep = true;
    });
  }

  saveCompletedOutputHandler(e) { }

  gridUserSelectionChange(selection) {
    const selectedData = selection.selectedRows[0].dataItem;

    this.showForm = true
    this.DSP_ORDERSFormConfig = new componentConfigDef();
    this.DSP_ORDERSFormConfig.isMaster = true;
    this.DSP_ORDERSFormConfig.masterParams = {
      hideOthers: true,
      order: selectedData
    }
  }

  orderStatusHandler(data) {
    this.gridData[this.gridData.findIndex(d => d["WO_ORDER_NO"] == data.orderNo)].WO_STATUS = data.status
  }

  parseApprvalFlag(status) {
    if (status == "") return "Created.";

    if (status == this.paramConfig.CREATED)
      return "Created.";

    else if (status == this.paramConfig.APPROVED)
      return "Approved.";

    else if (status == this.paramConfig.REJECTED)
      return "Rejected.";

    else return "On Hand.";
  }

  showHistory() {
    this.getWorkOrdersApprove(this.showHistoryCheck ? '%' : this.paramConfig.CREATED)
  }

  public printScreen() {
    window.print();
  }
  public async getsendWOs(dataItem){
    let whereClause = " ORDER_NO = '" + dataItem.ORDER_NO + "'";
    let body = [
      {
        "_QUERY": "GET_DSP_WORK_ORDERS_QUERY",
        "_WHERE": whereClause
      }
    ]
  
    let workOrders;
    let data = await this.starServices.execSQLBody(this, body, "");
    workOrders = data[0].data;
    console.log("testx post execSQLBody:", workOrders);
    if (workOrders.length != 0) {
      this.app_dsp_diagram_wrapConfig = new componentConfigDef();
      this.app_dsp_diagram_wrapConfig.masterParams = {
        action:"build",
        workOrders: workOrders,
        useModeler: true,
        showDiagram: this.showDiagram
      }
  
      
      
    }
    
  
  }
  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    this.getsendWOs(dataItem);
    console.log("inside cellClickHandler:dataItem", dataItem);
  }

}
