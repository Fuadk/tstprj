import { Component, OnInit} from '@angular/core';
import { ruleHost  ,ruleHostMap, componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;


@Component({
  
  selector: 'app-adm-rules-hosts',
  templateUrl: './adm-rules-hosts.component.html',
  styleUrls: ['./adm-rules-hosts.component.css']
})
export class AdmRulesHostsComponent implements OnInit {

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = false;
  public paramConfig; 
  public title = "" ;
  public routineAuth=null;

  public componentConfig: componentConfigDef;

  public  form_ADM_RULE_HOST: ruleHost;
  public form_ADM_RULE_HOST_MAP : ruleHostMap;

  public  ADM_RULE_HOSTFormConfig : componentConfigDef;
  public  ADM_RULE_HOST_MAPFormConfig : componentConfigDef;

  public ngAfterViewInit() {
    this.starServices.setRTL();
   } 
  ngOnInit(): void {
    //this.starServices.actOnParamConfig(this, SOMCODES' );
    this.form_ADM_RULE_HOST = new ruleHost(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.form_ADM_RULE_HOST_MAP = new ruleHostMap ();
    this.ADM_RULE_HOSTFormConfig = new componentConfigDef();
    this.ADM_RULE_HOSTFormConfig.isMaster = true;
   this.ADM_RULE_HOSTFormConfig.routineAuth = this.routineAuth;

    this.ADM_RULE_HOST_MAPFormConfig = new componentConfigDef();
    this.ADM_RULE_HOST_MAPFormConfig.isChild = true;
   this.ADM_RULE_HOST_MAPFormConfig.routineAuth = this.routineAuth;

  }
  public readCompletedHandler( form_ADM_RULE_HOST) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_RULE_HOST);
    this.form_ADM_RULE_HOST_MAP = new ruleHostMap();
    this.form_ADM_RULE_HOST_MAP.HOST_ID =  form_ADM_RULE_HOST.HOST_ID;

  }
  public clearCompletedHandler( form_ADM_RULE_HOST) {
    this.form_ADM_RULE_HOST_MAP = new  ruleHostMap();

  }

  public saveCompletedHandler( form_ADM_RULE_HOST) {
    this.ADM_RULE_HOST_MAPFormConfig = new componentConfigDef();
    this.ADM_RULE_HOST_MAPFormConfig.masterSaved = form_ADM_RULE_HOST;
    this.ADM_RULE_HOST_MAPFormConfig.masterKey =  form_ADM_RULE_HOST.HOST_ID;

  }


}
