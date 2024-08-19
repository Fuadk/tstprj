import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { starServices } from 'starlib';
import { Template, templateDetail, componentConfigDef } from '@modeldir/model';
//import {DspTemplateDetailComponent} from '../../dsp/dsp-template-detail/dsp-template-detail.component';
declare function getParamConfig(): any;

@Component({

  selector: 'app-dsp-templates',
  templateUrl: './dsp-templates.component.html',
  styleUrls: ['./dsp-templates.component.css']
})
export class DspTemplatesComponent implements OnInit {

  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
  }
  public showToolBar = false;
  public componentConfig: componentConfigDef;

  public form_dsp_template: Template;
  public grid_dsp_template_detail: templateDetail;
  // public masterSaved=null;
  public DSP_TEMPLATE_DETAILGridConfig: componentConfigDef;
  public DSP_ORDERSFormConfig: componentConfigDef;
  public paramConfig;

  copiedTemplate

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
  ngOnInit(): void {
    // this.form_dsp_template = new Template(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    //this.grid_dsp_template_detail = new templateDetail();
    this.DSP_TEMPLATE_DETAILGridConfig = new componentConfigDef();
    this.DSP_TEMPLATE_DETAILGridConfig.showToolBar = true;

    this.DSP_ORDERSFormConfig = new componentConfigDef();
    this.DSP_ORDERSFormConfig.showToolBar = false;
    this.DSP_ORDERSFormConfig.isMaster = true;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_ORDERSFormConfig:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.DSP_ORDERSFormConfig);



  }
  public readCompletedHandler(form_dsp_template) {
    if (this.paramConfig.DEBUG_FLAG) console.log('aveHandler');
    if (this.paramConfig.DEBUG_FLAG) console.log(form_dsp_template);
    this.grid_dsp_template_detail = new templateDetail();
    this.grid_dsp_template_detail.TEMPLATE_NAME = form_dsp_template.TEMPLATE_NAME;
    this.grid_dsp_template_detail.FORM_NAME = form_dsp_template.FORM_NAME; //Fuad: work aruond

  }
  public clearCompletedHandler(form_dsp_template) {
    if (this.paramConfig.DEBUG_FLAG) console.log('clearCompletedHandler');
    if (this.paramConfig.DEBUG_FLAG) console.log(form_dsp_template);
    this.grid_dsp_template_detail = new templateDetail();
    //this.grid_dsp_template_detail.TEAM =  form_dsp_template.TEAM;
  }


  public saveCompletedHandler(form_DSP_TEMPLATE) {
    if (this.paramConfig.DEBUG_FLAG) console.log("in saveCompletedHandler");
    this.DSP_TEMPLATE_DETAILGridConfig = new componentConfigDef();
    this.DSP_TEMPLATE_DETAILGridConfig.masterSaved = form_DSP_TEMPLATE;
    this.DSP_TEMPLATE_DETAILGridConfig.masterKey = form_DSP_TEMPLATE.TEMPLATE_NAME;
  }

  handleCopiedTemplateOutput(data) {
    this.copiedTemplate = data

    setTimeout(() => {
      this.copiedTemplate = null
    }, 200)
  }
}
