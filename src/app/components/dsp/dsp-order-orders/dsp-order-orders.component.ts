import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { orders    , componentConfigDef } from '@modeldir/model';
declare function getParamConfig(): any;

@Component({
  
  selector: 'app-dsp-order-orders',
  templateUrl: './dsp-order-orders.component.html',
  styleUrls: ['./dsp-order-orders.component.css']
})
export class DspOrderOrdersComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor() { 
    this.paramConfig = getParamConfig();
  }
  public showToolBar = false;
  public  form_DSP_ORDERS: orders;
  public grid_DSP_ORDERS : orders;
  public  DSP_ORDERSFormConfig : componentConfigDef;
  public  DSP_ORDERSGridConfig : componentConfigDef;
  public paramConfig;
  
  ngOnInit(): void {
    this.form_DSP_ORDERS = new orders(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_DSP_ORDERS = new orders ();
    this.form_DSP_ORDERS = new orders ();

   this.DSP_ORDERSFormConfig = new componentConfigDef();
   this.DSP_ORDERSFormConfig.isMaster = true;

   this.DSP_ORDERSGridConfig = new componentConfigDef();

  }
  public readCompletedHandler( form_DSP_ORDERS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_DSP_ORDERS);
    this.grid_DSP_ORDERS = new orders();
    this.grid_DSP_ORDERS.ORDER_NO =  form_DSP_ORDERS.ORDER_NO;

  }
  public clearCompletedHandler( form_DSP_ORDERS) {
    this.grid_DSP_ORDERS = new  orders();

  }

    public saveCompletedHandler( form_DSP_ORDERS) {
    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.masterSaved = form_DSP_ORDERS;
    this.DSP_ORDERSGridConfig.masterKey =  form_DSP_ORDERS.ORDER_NO;

  }


}
