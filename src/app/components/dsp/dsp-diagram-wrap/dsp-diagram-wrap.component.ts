import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { starServices } from 'starlib';

import { orders, componentConfigDef } from '@modeldir/model';
declare function getParamConfig(): any;
@Component({
  selector: 'app-dsp-diagram-wrap',
  templateUrl: './dsp-diagram-wrap.component.html',
  styleUrl: './dsp-diagram-wrap.component.css'
})
export class DspDiagramWrapComponent {

  public paramConfig;
  public ModelShow = false;
  public showDiagram = true;

  public componentConfig: componentConfigDef;
  public app_diagramConfig: componentConfigDef;
  public app_diagramConfigView: componentConfigDef;


  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
  }

  async saveFormCompletedHandler(value) {
    //console.log("value:", value)
    
   // this.ModelShow=false;
    
    this.app_diagramConfigView = new componentConfigDef();
    this.app_diagramConfigView.masterParams = {
      action:"view",
      xml: value.xml,
      workOrders: value.workOrders,
      Orders: value.Orders,
      useModeler: false,
      rulesDef : value.rulesDef
    }
  }

  public getRuleLogClause(ruleID,workOrders, rulesDef, Orders){
    let whereClauseLog = "";
    console.log("rulesDef:", rulesDef)
    let ruleDef:any ={};
    let i=0;
    while (i <rulesDef.length ){
      if (rulesDef[i].RULE_ID == ruleID ){
        ruleDef = rulesDef[i];
        break;
      }
      i++;
    }
    if (ruleDef.RULE_KEY == "WO_ORDER_NO"){
      let templateORder = ruleDef.TEMPLATE_ORDER;
      let orderNo = workOrders[0].ORDER_NO;
      let ruleKey = orderNo + "-" + templateORder;
      whereClauseLog =   "RULE_ID  = '" + ruleID + "' AND RULE_KEY ='" + ruleKey + "'";
      console.log("whereClauseLog:" + whereClauseLog)
    }
  else   if (ruleDef.RULE_KEY == "ORDER_NO"){
    let orderNo = workOrders[0].ORDER_NO;
    let ruleKey = orderNo ;
    whereClauseLog =   "RULE_ID  = '" + ruleID + "' AND RULE_KEY ='" + ruleKey + "'";
    console.log("whereClauseLog:" + whereClauseLog)
  }
  else   if (ruleDef.RULE_KEY == "ORDER_TYPE_ORDER_NO"){
    let ruleKey = Orders[0].ORDER_TYPE + "_" + Orders[0].ORDER_NO;
    whereClauseLog =   "RULE_ID  = '" + ruleID + "' AND RULE_KEY ='" + ruleKey + "'";
    console.log("whereClauseLog:" + whereClauseLog);
    

  }

  return whereClauseLog;
}
public async getRuleIDs(TEMPLATE_ORDER, rulesDef, workOrders, Orders){
  let rulesFound =[];
  let i =0 ;
  
  while (i < rulesDef.length){
    let whereClauseLog ="";
    let logStatus = "";
    if (rulesDef[i].TEMPLATE_ORDER == TEMPLATE_ORDER){
      //rulesFound.push(rulesDef[i].RULE_ID);
      whereClauseLog = this.getRuleLogClause(rulesDef[i].RULE_ID,workOrders, rulesDef, Orders);
      //console.log("getRuleIDs:whereClauseLog:2:" + whereClauseLog);
      let body = [
        {
          "_QUERY": "GET_ADM_RULE_LOG_QUERY",
          "_WHERE": whereClauseLog
        }
      ]
      let ruleLog;  
      let data = await this.starServices.execSQLBody(this, body, "");
      ruleLog = data[0].data;
      logStatus = "";
      if (ruleLog.length != 0){
        logStatus = ruleLog[0].STATUS;
      }
      console.log("getRuleIDs:ruleLog:", logStatus, whereClauseLog, ruleLog)
      rulesDef[i]['whereClauseLog'] = whereClauseLog;
      rulesDef[i]['logStatus'] = logStatus;
      console.log("getRuleIDs:1: rulesDef[i].logStatus:",  rulesDef[i].logStatus);
    }
 

    i++;
  }
  // console.log("rulesFound:", rulesFound)
  // for  (let i=0; i< rulesFound.length; i++){
   

    
  // }
  
}
public async loopOnTemplateOrders (rulesDef,   workOrders,  Orders)
{
  let TEMPLATE_ORDER = 0;
  await this.getRuleIDs (TEMPLATE_ORDER, rulesDef, workOrders,  Orders );

  for (let i=0;i<workOrders.length;i++ ){
    //console.log("workOrders:", workOrders[i]);
    await this.getRuleIDs (workOrders[i].TEMPLATE_ORDER, rulesDef, workOrders,  Orders );
  }
  console.log("rulesDef:1:",  rulesDef);
}
public async sendToDiagram(ComponentConfig){
  let masterParams = ComponentConfig.masterParams;
  
  await this.loopOnTemplateOrders (masterParams.rulesDef,   masterParams.workOrders,  masterParams.Orders);
  console.log("masterParams.rulesDef:",masterParams.rulesDef);
  
  this.app_diagramConfig = new componentConfigDef();
  this.app_diagramConfig.masterParams = masterParams;
  this.ModelShow=true;
  this.showDiagram = ComponentConfig.masterParams.showDiagram;
  }

  @Input() public  set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("DspDiagramWrapComponent ComponentConfig:", ComponentConfig);
    
    if (typeof ComponentConfig !== "undefined") {
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.masterParams != null) {
       // this.sendToDiagram(ComponentConfig);
       
      }
      if (ComponentConfig.showDiagram != null)
        this.showDiagram = ComponentConfig.showDiagram;
      console.log("this.showDiagram:", this.showDiagram, ComponentConfig)
    }

  }


  diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  handleImported(event) {

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    //this.importError = error;
  }
}

