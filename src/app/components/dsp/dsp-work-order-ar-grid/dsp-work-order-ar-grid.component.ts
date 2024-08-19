import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { workOrders    , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;


@Component({
  
  selector: 'app-dsp-work-order-ar-grid',
  templateUrl: './dsp-work-order-ar-grid.component.html',
  styleUrls: ['./dsp-work-order-ar-grid.component.scss']
})
export class DspWorkOrderArGridComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(private starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = false;
  public paramConfig; 
  public title = "" ;
  public routineAuth=null;

  public componentConfig: componentConfigDef;

  public  grid_DSP_WORK_ORDERS: workOrders;
  public form_DSP_WORK_ORDERS : workOrders;
  public  DSP_WORK_ORDERSGridConfig : componentConfigDef;
  public  DSP_WORK_ORDERSFormConfig : componentConfigDef;
  public ngAfterViewInit() {
    this.starServices.setRTL();
  }  
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'DspWorkOrderArGrid' );
    this.grid_DSP_WORK_ORDERS = new workOrders(); 
    // to stop initial loading remove [executeQueryInput]="grid_dsp_template"  from this (parent) html file

    this.form_DSP_WORK_ORDERS = new workOrders ();

   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSGridConfig.isMaster = true;
   this.DSP_WORK_ORDERSGridConfig.routineAuth = this.routineAuth;
   this.DSP_WORK_ORDERSGridConfig.gridHeight = 300;

   this.DSP_WORK_ORDERSFormConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSFormConfig.isChild = true;
   this.DSP_WORK_ORDERSFormConfig.routineAuth = this.routineAuth;

  }
  public readCompletedHandler( grid_DSP_WORK_ORDERS) {
    var masterKeyArr = [grid_DSP_WORK_ORDERS.ORDER_NO];
    var masterKeyNameArr = ["ORDER_NO"];

    console.log( grid_DSP_WORK_ORDERS);
    this.form_DSP_WORK_ORDERS = new workOrders();
//    this.form_DSP_WORK_ORDERS.ORDER_NO =  grid_DSP_WORK_ORDERS.ORDER_NO;


    for (var i = 0; i< masterKeyNameArr.length; i++){
      console.log(masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.form_DSP_WORK_ORDERS[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.DSP_WORK_ORDERSFormConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSFormConfig.masterKeyArr =  [grid_DSP_WORK_ORDERS.ORDER_NO];
    this.DSP_WORK_ORDERSFormConfig.masterKeyNameArr =  ["ORDER_NO"];

  }
  public clearCompletedHandler( grid_DSP_WORK_ORDERS) {
    this.form_DSP_WORK_ORDERS = new  workOrders();

  }

    public saveCompletedHandler( grid_DSP_WORK_ORDERS) {
    this.DSP_WORK_ORDERSFormConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSFormConfig.masterSaved = grid_DSP_WORK_ORDERS;
//    this.DSP_WORK_ORDERSFormConfig.masterKey =  grid_DSP_WORK_ORDERS.ORDER_NO;
    this.DSP_WORK_ORDERSFormConfig.masterKeyArr =  [grid_DSP_WORK_ORDERS.ORDER_NO];
    this.DSP_WORK_ORDERSFormConfig.masterKeyNameArr =  ["ORDER_NO"];


  }


}
