import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { dashboardDef  ,dashboardDetail , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;


@Component({
  
  selector: 'app-adm-dashboard-def',
  templateUrl: './adm-dashboard-def.component.html',
  styleUrls: ['./adm-dashboard-def.component.css']
})
export class AdmDashboardDefComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = false;
  public paramConfig; 
  public title = "" ;
  public routineAuth=null;

  public componentConfig: componentConfigDef;

  public  form_ADM_DASHBOARD_DEF: dashboardDef;
  public grid_ADM_DASHBOARD_DETAIL : dashboardDetail;
  public  ADM_DASHBOARD_DEFFormConfig : componentConfigDef;
  public  ADM_DASHBOARD_DETAILGridConfig : componentConfigDef;
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
   // this.starServices.actOnParamConfig(this, SOMCODES' );
    this.form_ADM_DASHBOARD_DEF = new dashboardDef(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_ADM_DASHBOARD_DETAIL = new dashboardDetail ();

   this.ADM_DASHBOARD_DEFFormConfig = new componentConfigDef();
   this.ADM_DASHBOARD_DEFFormConfig.isMaster = true;
   this.ADM_DASHBOARD_DEFFormConfig.routineAuth = this.routineAuth;

   this.ADM_DASHBOARD_DETAILGridConfig = new componentConfigDef();
   this.ADM_DASHBOARD_DETAILGridConfig.isChild = true;
   this.ADM_DASHBOARD_DETAILGridConfig.gridHeight = 300;
   this.ADM_DASHBOARD_DETAILGridConfig.routineAuth = this.routineAuth;

  }
  public readCompletedHandler( form_ADM_DASHBOARD_DEF) {
    var masterKeyArr = [form_ADM_DASHBOARD_DEF.DASHBOARD_ID];
    var masterKeyNameArr = ["DASHBOARD_ID"];

    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_DASHBOARD_DEF);
    this.grid_ADM_DASHBOARD_DETAIL = new dashboardDetail();
//    this.grid_ADM_DASHBOARD_DETAIL.DASHBOARD_ID =  form_ADM_DASHBOARD_DEF.DASHBOARD_ID;


    for (var i = 0; i< masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log(masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.grid_ADM_DASHBOARD_DETAIL[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.ADM_DASHBOARD_DETAILGridConfig = new componentConfigDef();
    this.ADM_DASHBOARD_DETAILGridConfig.masterKeyArr =  [form_ADM_DASHBOARD_DEF.DASHBOARD_ID];
    this.ADM_DASHBOARD_DETAILGridConfig.masterKeyNameArr =  ["DASHBOARD_ID"];

  }
  public clearCompletedHandler( form_ADM_DASHBOARD_DEF) {
    this.grid_ADM_DASHBOARD_DETAIL = new  dashboardDetail();

  }

    public saveCompletedHandler( form_ADM_DASHBOARD_DEF) {
    this.ADM_DASHBOARD_DETAILGridConfig = new componentConfigDef();
    this.ADM_DASHBOARD_DETAILGridConfig.masterSaved = form_ADM_DASHBOARD_DEF;
//    this.ADM_DASHBOARD_DETAILGridConfig.masterKey =  form_ADM_DASHBOARD_DEF.DASHBOARD_ID;
    this.ADM_DASHBOARD_DETAILGridConfig.masterKeyArr =  [form_ADM_DASHBOARD_DEF.DASHBOARD_ID];
    this.ADM_DASHBOARD_DETAILGridConfig.masterKeyNameArr =  ["DASHBOARD_ID"];


  }


}
