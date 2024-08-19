import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { orders  ,workOrders , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  
  selector: 'app-dsp-order-work-orders',
  templateUrl: './dsp-order-work-orders.component.html',
  styleUrls: ['./dsp-order-work-orders.component.css']
})
export class DspOrderWorkOrdersComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
}

  public showToolBar = false;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  public title = "";
  public routineAuth = null;

  public  form_DSP_ORDERS: orders;
  public  grid_DSP_WORK_ORDERS : workOrders;
  public  DSP_ORDERSFormConfig : componentConfigDef;
  public  DSP_WORK_ORDERSGridConfig : componentConfigDef;
  
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVORDERE' );
    this.form_DSP_ORDERS = new orders(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_DSP_WORK_ORDERS = new workOrders ();

   this.DSP_ORDERSFormConfig = new componentConfigDef();
   this.DSP_ORDERSFormConfig.isMaster = true;
   this.DSP_ORDERSFormConfig.routineAuth =  this.routineAuth;

   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSGridConfig.isChild = true;
   this.DSP_WORK_ORDERSGridConfig.insertable = false;
   this.DSP_WORK_ORDERSGridConfig.gridHeight = 300;
  }
  public readCompletedHandler( form_DSP_ORDERS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_DSP_ORDERS);
    this.grid_DSP_WORK_ORDERS = new workOrders();
    this.grid_DSP_WORK_ORDERS.ORDER_NO =  form_DSP_ORDERS.ORDER_NO;

    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    let masterParams = {
      ORDER_FIELDS: form_DSP_ORDERS.ORDER_FIELDS
    }
    this.DSP_WORK_ORDERSGridConfig.masterParams = masterParams;


  }
  public clearCompletedHandler( form_DSP_ORDERS) {
    this.grid_DSP_WORK_ORDERS = new  workOrders();

  }

    public saveCompletedHandler( form_DSP_ORDERS) {
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.masterSaved = form_DSP_ORDERS;
    this.DSP_WORK_ORDERSGridConfig.masterKey =  form_DSP_ORDERS.ORDER_NO;

  }


}
