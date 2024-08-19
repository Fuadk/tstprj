import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { orders  ,workOrders , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

const createFormGroup = (dataItem) => new FormGroup({

  'ORDER_TYPE' : new FormControl(dataItem.ORDER_TYPE  ) ,
 'ORDER_NO' : new FormControl(dataItem.ORDER_NO ) ,
 'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME) ,
 'SUBNO' : new FormControl(dataItem.SUBNO , Validators.required) ,
 'ORDER_STATUS' : new FormControl(dataItem.ORDER_STATUS ) ,
 'DIV' : new FormControl(dataItem.DIVS ) ,
 'DEPT' : new FormControl(dataItem.DEPT ) ,
 'ASSIGNEE_TYPE' : new FormControl(dataItem.ASSIGNEE_TYPE ) ,
 'ASSIGNEE' : new FormControl(dataItem.ASSIGNEE ) ,
 'PROMISED_DATE' : new FormControl(dataItem.PROMISED_DATE) ,
 'ORDERED_DATE' : new FormControl(dataItem.ORDERED_DATE) ,
 'COMPLETION_DATE' : new FormControl(dataItem.COMPLETION_DATE ) ,
 'NOTES' : new FormControl(dataItem.NOTES ) ,
 'PARENT_ORDER_TYPE' : new FormControl(dataItem.PARENT_ORDER_TYPE ) ,
 'PARENT_ORDER_NO' : new FormControl(dataItem.PARENT_ORDER_NO ) ,
 'ACTUAL_START_DATE' : new FormControl(dataItem.ACTUAL_START_DATE ) ,
 'ACTUAL_END_DATE' : new FormControl(dataItem.ACTUAL_END_DATE ) ,
 'ATTACHMENTS' : new FormControl(dataItem.ATTACHMENTS ) ,
 'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
 'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
 
 });
 declare function getParamConfig():any;

@Component({
  
  selector: 'app-dsp-order-work-orders-gg',
  templateUrl: './dsp-order-work-orders-gg.component.html',
  styleUrls: ['./dsp-order-work-orders-gg.component.css']
})
export class DspOrderWorkOrdersGgComponent implements OnInit {
  

  public title = "Overiew of Orders";
  constructor(public starServices: starServices) {  
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 

  }

  public showToolBar = true;
  public grid_DSP_ORDERS: orders;
  public grid_DSP_WORK_ORDERS : workOrders;

  public  DSP_ORDERSGridConfig : componentConfigDef;
  public  DSP_WORK_ORDERSGridConfig : componentConfigDef;
  public  form!: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public paramConfig;
  public componentConfig: componentConfigDef;
  
  private Body:any =[];

  public routineAuth = null;

  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  
  private formInitialValues:any =   new orders();   
  
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVORDEROV' );

    this.form = createFormGroup(
      this.formInitialValues
    );    
  
  this.onChanges();
  this.starServices.fetchLookups(this, this.lookupArrDef);

    this.grid_DSP_ORDERS = new orders(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

   this.DSP_ORDERSGridConfig = new componentConfigDef();
   this.DSP_ORDERSGridConfig.isMaster = true;
   //this.DSP_ORDERSGridConfig.showToolBar = false;
   this.DSP_ORDERSGridConfig.routineAuth =  this.routineAuth;
   this.DSP_ORDERSGridConfig.gridHeight = 250;
   this.DSP_ORDERSGridConfig.insertable = false;
   this.DSP_ORDERSGridConfig.showDiagram = false;
   
   this.grid_DSP_WORK_ORDERS = new workOrders ();
   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSGridConfig.isChild = true;
   this.DSP_WORK_ORDERSGridConfig.routineAuth =  this.routineAuth;
   this.DSP_WORK_ORDERSGridConfig.gridHeight = 250;
   this.DSP_WORK_ORDERSGridConfig.insertable = false;
   //this.DSP_WORK_ORDERSGridConfig.showToolBar = false;

  }
  public readCompletedHandler( grid_DSP_ORDERS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( "grid_DSP_ORDERS:", grid_DSP_ORDERS);
    this.grid_DSP_WORK_ORDERS = new workOrders();
    this.grid_DSP_WORK_ORDERS.ORDER_NO =  grid_DSP_ORDERS.ORDER_NO;

  }
  public clearCompletedHandler( grid_DSP_ORDERS) {
    this.grid_DSP_WORK_ORDERS = new  workOrders();

  }

    public saveCompletedHandler( grid_DSP_ORDERS) {
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.masterSaved = grid_DSP_ORDERS;
    this.DSP_WORK_ORDERSGridConfig.masterKey =  grid_DSP_ORDERS.ORDER_NO;

  }
  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }
  public  executeQuery( form: any ): void {
    var Page ="";
    if (this.paramConfig.DEBUG_FLAG) console.log("form before:" );
    if (this.paramConfig.DEBUG_FLAG) console.log(form );
    if (form.ASSIGNEE_TYPE == "N")
    {
      form.ASSIGNEE_TYPE = "= '' ";
    }
    if (form.ASSIGNEE_TYPE == "Y")
    {
      form.ASSIGNEE_TYPE = "<> '' ";
    }

    if (this.paramConfig.DEBUG_FLAG) console.log("form after:" );
    if (this.paramConfig.DEBUG_FLAG) console.log(form );

    Page =  this.starServices.formatWhere(form);
    if (this.paramConfig.DEBUG_FLAG) console.log("Page:" + Page);
  
    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.formattedWhere = Page;
   
   // this.starServices.executeQuery_form( form, this);
   // this.isReadOnly = true;
    
  }
  public onCancel(e:any): void {
    this.starServices.onCancel_form ( e , this);
    this.DSP_ORDERSGridConfig = new componentConfigDef();
    this.DSP_ORDERSGridConfig.clearComponent = true;
 
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.clearComponent = true;


  }

  
  public enterQuery (form : any): void{
  //  this.isReadOnly = false;
    this.starServices.enterQuery_form ( form, this);
  }


  public lkpArrDIV = [];
  onChanges(): void {

    //@ts-ignore: Object is possibly 'null'.
this.form.get('DEPT').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("DEPT valu changed")
      //var formVal = this.form.value;
      this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
      "lkpArrName":"lkpArrDIV"}];
     this.starServices.fetchLookups(this, this.lookupArrDef);
    });



  }
  public userLang = "EN" ; 
  public lookupArrDef:any =[	
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_STATUS' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
        "lkpArrName":"lkpArrORDER_STATUS"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
        "lkpArrName":"lkpArrDEPT"},
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='YES_OR_NO' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
        "lkpArrName":"lkpArrASSIGNEE_TYPE"}
      ];
  
  public lkpArrORDER_TYPE = [];
  
  public lkpArrORDER_STATUS = [];
  
  public lkpArrDEPT = [];
  
  public lkpArrASSIGNEE_TYPE = [];
  
  public lkpArrASSIGNEE = [];
  
  public lkpArrTEMPLATE_NAME = [];
  
  public lkpArrGetORDER_TYPE(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrORDER_TYPE.find((x:any) => x.CODE === CODE);
  return rec;
  }
  
  public lkpArrGetORDER_STATUS(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrORDER_STATUS.find((x:any) => x.CODE === CODE);
  return rec;
  }
  
  public lkpArrGetDEPT(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrDEPT.find((x:any) => x.CODE === CODE);
  return rec;
  }
  
  public lkpArrGetASSIGNEE_TYPE(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrASSIGNEE_TYPE.find((x:any) => x.CODE === CODE);
  return rec;
  }
    
  public printScreen(){
    window.print();
  }
}
