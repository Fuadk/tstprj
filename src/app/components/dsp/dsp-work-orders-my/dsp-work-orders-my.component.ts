import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { workOrders    , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;

 const createFormGroup = (dataItem:any) => new FormGroup({
'WO_TYPE' : new FormControl(dataItem.WO_TYPE ) ,
'WO_ORDER_NO' : new FormControl(dataItem.WO_ORDER_NO   ) ,
'SUBNO' : new FormControl(dataItem.SUBNO ) ,
'WO_STATUS' : new FormControl(dataItem.WO_STATUS ) ,
'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME ) ,
'TEMPLATE_ORDER' : new FormControl(dataItem.TEMPLATE_ORDER ) ,
'DIV' : new FormControl(dataItem.DIV ) ,
'DEPT' : new FormControl(dataItem.DEPT ) ,
'ASSIGNEE_TYPE' : new FormControl(dataItem.ASSIGNEE_TYPE ) ,
'ASSIGNEE' : new FormControl(dataItem.ASSIGNEE ) ,
'PROMISED_DATE' : new FormControl(dataItem.PROMISED_DATE ) ,
'COMPLETION_DATE' : new FormControl(dataItem.COMPLETION_DATE ) ,
'NOTES' : new FormControl(dataItem.NOTES ) ,
'PARENT_WO_ORDER' : new FormControl(dataItem.PARENT_WO_ORDER ) ,
'ORDER_NO' : new FormControl(dataItem.ORDER_NO ) ,
'ACTUAL_START_DATE' : new FormControl(dataItem.ACTUAL_START_DATE ) ,
'ACTUAL_END_DATE' : new FormControl(dataItem.ACTUAL_END_DATE ) ,
'ORDERED_DATE' : new FormControl(dataItem.ORDERED_DATE ) ,
'ATTACHMENTS' : new FormControl(dataItem.ATTACHMENTS ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) 
});

declare function getParamConfig():any;

@Component({
  
  selector: 'app-dsp-work-orders-my',
  templateUrl: './dsp-work-orders-my.component.html',
  styleUrls: ['./dsp-work-orders-my.component.css']
})
export class DspWorkOrdersMyComponent implements OnInit {
  public title = "Work Orders";
  public routineAuth=null;

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    if (this.paramConfig.DEBUG_FLAG) console.log("this.paramConfig")
    if (this.paramConfig.DEBUG_FLAG) console.log(this.paramConfig)
    var lkpArrASSIGNEEDef=	{"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG, DEPT FROM ADM_USER_INFORMATION  where TEAM = '" + this.paramConfig.USER_INFO.TEAM + "' ",
    "lkpArrName":"lkpArrASSIGNEE"};
    this.lookupArrDef.push(lkpArrASSIGNEEDef);
    if (this.paramConfig.USER_INFO.LEADER == "1")
      this.showAssignee = true;

    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = true;
  public  submitted =  false;

  public paramConfig; 
  public componentConfig: componentConfigDef;

  public grid_DSP_WORK_ORDERS: workOrders;

  public  DSP_WORK_ORDERSGridConfig : componentConfigDef;
  public  form!: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  private Body:any =[];

  public showAssignee: boolean = false;

  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  private formInitialValues:any =   new workOrders();   
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVMYWO' );
      this.form = createFormGroup(
        this.formInitialValues
    );
    this.paramConfig = getParamConfig();
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);

     
  //  this.grid_DSP_WORK_ORDERS = new workOrders(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file
   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   //this.DSP_WORK_ORDERSGridConfig.isMaster = false;
   this.DSP_WORK_ORDERSGridConfig.routineAuth = this.routineAuth;
   this.DSP_WORK_ORDERSGridConfig.queryable = false;
   this.DSP_WORK_ORDERSGridConfig.insertable = false;

   this.DSP_WORK_ORDERSGridConfig.gridHeight = 500;


  }
  public readCompletedHandler( grid_DSP_WORK_ORDERS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( grid_DSP_WORK_ORDERS);
    this.grid_DSP_WORK_ORDERS = new workOrders();
    this.grid_DSP_WORK_ORDERS.WO_ORDER_NO =  grid_DSP_WORK_ORDERS.WO_ORDER_NO;

  }
  public clearCompletedHandler( grid_DSP_WORK_ORDERS) {
    this.grid_DSP_WORK_ORDERS = new  workOrders();

  }

    public saveCompletedHandler( grid_DSP_WORK_ORDERS) {
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.masterSaved = grid_DSP_WORK_ORDERS;
    this.DSP_WORK_ORDERSGridConfig.masterKey =  grid_DSP_WORK_ORDERS.WO_ORDER_NO;

  }
  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }
  get f():any { return this.form.controls; }
  public  executeQuery( form: any ): void {
    

    var Page =null;


    if (this.paramConfig.DEBUG_FLAG) console.log("form:")
    if (this.paramConfig.DEBUG_FLAG) console.log(form)

    //Page =  this.starServices.formatWhere(form);
    var whereClause = "";
    if (this.paramConfig.USER_INFO.LEADER == "1"){
      whereClause = "(assignee_type = 'TEAM' and assignee = '" + this.paramConfig.USER_INFO.TEAM + "')" ;
      if (this.paramConfig.DEBUG_FLAG) console.log("form.ASSIGNEE:" + form.ASSIGNEE)
      if ( (form.ASSIGNEE != "") && (typeof form.ASSIGNEE !== "undefined") )
      {
        whereClause = " assignee_type = 'PERSON' and assignee = '" + form.ASSIGNEE + "'  ";
      }
      else
      {
        whereClause = whereClause + " or ( assignee_type = 'PERSON' and assignee in (select username from adm_user_information where team = '" + this.paramConfig.USER_INFO.TEAM + "' )) "
      }
    }
    else{
      whereClause = "  assignee_type = 'PERSON' and assignee = '" + this.paramConfig.USER_INFO.USERNAME + "' ";
    }
    if ( ( form.WO_STATUS != "") && (typeof form.WO_STATUS !== "undefined") ){
      if ( whereClause != ""){
        whereClause = "(" + whereClause + ") AND ";
      }
      whereClause =  whereClause + "  WO_STATUS  = '" + form.WO_STATUS + "' ";
    }
    if (whereClause != ""){
      if (this.paramConfig.DEBUG_FLAG) console.log("whereClause:" + whereClause)
      whereClause = encodeURIComponent(whereClause);
       Page =  "&_WHERE=" + whereClause;
    }
  
    this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
    this.DSP_WORK_ORDERSGridConfig.formattedWhere = Page;
   
    
  }
  public onCancel(e:any): void {
    this.starServices.onCancel_form ( e , this);
   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSGridConfig.clearComponent = true;

   this.DSP_WORK_ORDERSGridConfig = new componentConfigDef();
   this.DSP_WORK_ORDERSGridConfig.clearComponent = true;

  }
  public enterQuery (form : any): void{
    
    this.starServices.enterQuery_form ( form, this);
  }

onChanges(): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}

public userLang = "EN" ; 
public lookupArrDef:any =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_STATUS' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrWO_STATUS"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='TEMPLATE_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrTEMPLATE_NAME"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrDIV"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrDEPT"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrASSIGNEE_TYPE"}
    ];

public lkpArrWO_STATUS = [];

public lkpArrTEMPLATE_NAME = [];

public lkpArrDIV = [];

public lkpArrDEPT = [];

public lkpArrASSIGNEE_TYPE = [];

public lkpArrASSIGNEE = [];

public lkpArrGetWO_STATUS(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrWO_STATUS.find((x:any) => x.CODE === CODE);
return rec;
}

public lkpArrGetTEMPLATE_NAME(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrTEMPLATE_NAME.find((x:any) => x.CODE === CODE);
return rec;
}

public lkpArrGetDIV(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrDIV.find((x:any) => x.CODE === CODE);
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

public lkpArrGetASSIGNEE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrASSIGNEE.find((x:any) => x.CODE === CODE);
return rec;
}


public printScreen(){
  window.print();
}

}
