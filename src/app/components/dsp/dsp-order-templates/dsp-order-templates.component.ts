import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { orders  ,templateDetail, componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;


@Component({
  
  selector: 'app-dsp-order-templates',
  templateUrl: './dsp-order-templates.component.html',
  styleUrls: ['./dsp-order-templates.component.css']
})
export class DspOrderTemplatesComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
  }
  public showToolBar = false;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  public title="";
  public routineAuth = null;

  public  form_DSP_ORDERS: orders;
  public grid_DSP_TEMPLATE_DETAIL : templateDetail;
  //public masterSaved=null;
  public DSP_TEMPLATE_DETAILGridConfig : componentConfigDef;
  public DSP_ORDERSFormConfig : componentConfigDef;

  
  ngOnInit(): void {
    var masterParams ={
      disableLogutton :false
    }
   
    this.starServices.actOnParamConfig(this, 'PRVORDERC' );
    this.form_DSP_ORDERS = new orders(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_DSP_TEMPLATE_DETAIL = new templateDetail ();

    this.DSP_TEMPLATE_DETAILGridConfig = new componentConfigDef();
    this.DSP_TEMPLATE_DETAILGridConfig.showToolBar = false;
    this.DSP_TEMPLATE_DETAILGridConfig.savingMode= "ORDERS";
    this.DSP_TEMPLATE_DETAILGridConfig.routineAuth = this.routineAuth;

    this.DSP_ORDERSFormConfig = new componentConfigDef();
    this.DSP_ORDERSFormConfig.formMode = "CREATE";
    this.DSP_ORDERSFormConfig.isMaster = true;
    this.DSP_ORDERSFormConfig.routineAuth = this.routineAuth;
    this.DSP_ORDERSFormConfig.masterParams = masterParams;
    if (this.paramConfig.DEBUG_FLAG) console.log("TemplateDPSHANI",this.DSP_ORDERSFormConfig.masterParams);


  }
  public readCompletedHandler( form_DSP_ORDERS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_DSP_ORDERS);
    this.grid_DSP_TEMPLATE_DETAIL = new templateDetail();
    this.grid_DSP_TEMPLATE_DETAIL.TEMPLATE_NAME =  form_DSP_ORDERS.TEMPLATE_NAME;

  }
  public clearCompletedHandler( form_DSP_ORDERS) {
    this.grid_DSP_TEMPLATE_DETAIL = new  templateDetail();

  }

    public saveCompletedHandler( form_dsp_template) {
    //this.masterSaved = form_dsp_template;
    this.DSP_TEMPLATE_DETAILGridConfig = new componentConfigDef();
    this.DSP_TEMPLATE_DETAILGridConfig.masterSaved = form_dsp_template;
    if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig Parent:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.DSP_TEMPLATE_DETAILGridConfig);
  }


}
