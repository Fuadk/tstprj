import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { workOrders , componentConfigDef} from '@modeldir/model';


 const createFormGroup = (dataItem:any) => new FormGroup({
'WO_TYPE' : new FormControl(dataItem.WO_TYPE ) ,
'WO_ORDER_NO' : new FormControl(dataItem.WO_ORDER_NO  , Validators.required ) ,
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
'PARENT_WO_ORDER_NO' : new FormControl(dataItem.PARENT_WO_ORDER_NO ) ,
'ORDER_NO' : new FormControl(dataItem.ORDER_NO  , Validators.required ) ,
'ACTUAL_START_DATE' : new FormControl(dataItem.ACTUAL_START_DATE ) ,
'ACTUAL_END_DATE' : new FormControl(dataItem.ACTUAL_END_DATE ) ,
'ORDERED_DATE' : new FormControl(dataItem.ORDERED_DATE ) ,
'ORDER_FIELDS' : new FormControl(dataItem.ORDER_FIELDS ) ,
'EXTERNAL_INFO' : new FormControl(dataItem.EXTERNAL_INFO ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'ATTACHMENTS' : new FormControl(dataItem.ATTACHMENTS ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-dsp-work-orders-form',
  templateUrl: './dsp-work-orders-form.component.html',
  styleUrls: ['./dsp-work-orders-form.component.css']
})


export class DspWorkOrdersFormComponent {
  public toggle_flg: number = 0;
  public form_name: string;
  public form_name_external: string;
  public title = "Work Orders";
  public logOpened: boolean = false;
  public hide_log: boolean = false;
  private insertCMD = "INSERT_DSP_WORK_ORDERS";
  private updateCMD = "UPDATE_DSP_WORK_ORDERS";
  private deleteCMD =   "DELETE_DSP_WORK_ORDERS";
  private getCMD = "GET_DSP_WORK_ORDERS_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form!: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  public  DSP_MULTISTEPFormConfig : componentConfigDef;

  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isORDER_NOEnable : boolean = true;
  private Body:any =[];
  private isNew!: boolean;
  public primarKeyReadOnlyArr = {isWO_ORDER_NOreadOnly : false};  
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="ORDER_NO";
  public formattedWhere:any = null;  
  public  submitted =  false;
  public  multiStepFormOpened : boolean = false;  
  
  public fieldGridHeight = 400;
  public fieldsData ={};
  public fieldsSave : boolean = false;
  public fieldsFormSave : boolean = false;
  public orderFieldModified : boolean = true;
  public formPagesNo:string  = "";
  
  public templateInfo;
  public  ADM_RuleLogGridConfig: componentConfigDef;


  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {  
      this.componentConfig = new componentConfigDef(); 
      this.paramConfig = getParamConfig();
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.gridHeight =  this.fieldGridHeight;
      this.ADM_RuleLogGridConfig = new componentConfigDef();
      this.ADM_RuleLogGridConfig.gridHeight =  this.fieldGridHeight;

  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.form = createFormGroup(
        this.formInitialValues
    );
    var masterParams ={
      disableLogutton :true
    }
    this.ADM_RuleLogGridConfig.masterParams = masterParams;
    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

  }
  
  private formInitialValues:any =   new workOrders();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.ORDER_NO != "undefined") &&   (form.ORDER_NO != ""))
    {
      this.isORDER_NOEnable = false;
      this.isSearch = true;
      this.executeQuery(form);
      this.isChild = true;
      //this.showToolBar = false;
    }
    else
    {
      
      if (typeof this.form != "undefined")
      {
        //this.isChild = false;
        this.form.reset();
        this.masterKey = "";
      }
    }
  }

  get f():any { return this.form.controls; }
  public  executeQuery( form: any ): void {
    this.orderFieldModified = false;
    this.starServices.executeQuery_form( form, this);
  }

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }

  public onCancel(e:any): void {
    this.starServices.onCancel_form ( e , this);
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.clearComponent = true;
    this.ADM_RuleLogGridConfig = new componentConfigDef();
    this.ADM_RuleLogGridConfig.clearComponent = true;

  }

  public onNew(e:any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("this.masterKeyNameArr:", this.masterKeyNameArr, "this.masterKeyNameArr.length",this.masterKeyNameArr.length)
    if (this.masterKeyNameArr.length != 0)
    {
      for (var i = 0; i< this.masterKeyNameArr.length; i++){
        if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyNameArr[i] + ":" + this.masterKeyArr[i])
        this.formInitialValues[this.masterKeyNameArr[i]] = this.masterKeyArr[i];
      }
    }
    else
    {
      if (this.paramConfig.DEBUG_FLAG) console.log(this.masterKeyName + this.masterKey)
      this.formInitialValues[this.masterKeyName] = this.masterKey;
    }
    this.starServices.onNew_form ( e , this);
  }

  public onRemove( form:any): void {
    this.starServices.onRemove_form(form,this);
  }

  public enterQuery (form : any): void{
    if (this.paramConfig.DEBUG_FLAG) console.log("test:dirty:", this.form.dirty);
    this.starServices.enterQuery_form ( form, this);
  }

  public saveChanges( form: any): void {
    this.Body = []; 
    if (this.orderFieldModified){
      var formVal = this.form.value;
      var newVal = { "_QUERY": "UPDATE_DSP_ORDER_FIELDS" , "ORDER_NO": formVal.ORDER_NO, "ORDER_FIELDS": formVal.ORDER_FIELDS};
      this.addToBody(newVal);
    }
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.orderFieldModified = false;
    this.starServices.goRecord ( target, this);
  }
public templateFields;


  //////////////////////////////////////
  public showMultiStepFormScreen(formVal, FIELDS, formname){
       if (parseInt(this.formPagesNo) < 1){
      this.starServices.showOkMsg(this,"No Pages defined for this work order.","Warning");
      if (this.paramConfig.DEBUG_FLAG) console.log("test:here");
      return;
    }

    var masterParams={
      "formName" : formname,
      "formPagesNo" : this.formPagesNo, 
      "orderFields" : FIELDS
      

    };
    if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.masterParams = masterParams;
    this.multiStepFormOpened = true;
    if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
    //if (formVal.ORDER_FIELDS == "")
    //  formVal.ORDER_FIELDS = null;
    if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
    
    if (typeof formVal.FIELDS == "undefined")
      formVal.FIELDS = null;

    this.fieldsData = JSON.parse(formVal.FIELDS);
    if (this.paramConfig.DEBUG_FLAG) console.log("test:this.fieldsData:", this.fieldsData);
    this.fieldsSave = false;
  }

 



public showMultiStepForm(formVal, toggle_flg: number){
  var formVal = this.form.value;
 
  if (this.paramConfig.DEBUG_FLAG) console.log("Inside multiple HF Please" ,this.orderFieldModified );
  this.toggle_flg = toggle_flg;
  if(toggle_flg ==0)
  {
    if (this.orderFieldModified){
      this.showMultiStepFormScreen(formVal, formVal.ORDER_FIELDS,this.form_name);
      if (this.paramConfig.DEBUG_FLAG) console.log("Inside multi0 HF Please");
      return;
    }
  }
  else
  {
    if (this.orderFieldModified){
      this.showMultiStepFormScreen(formVal, formVal.EXTERNAL_INFO,this.form_name_external);
      if (this.paramConfig.DEBUG_FLAG) console.log("Inside multi1 HF please");
      return;
    }
        
  }

  var OrderNo = formVal.ORDER_NO;
  
  this.Body = [];
  
  var Page = "&_trans=Y";
  var newVal = { "_QUERY": "GET_DSP_TEMPLATE_BY_ORDER_NO" , "ORDER_NO": OrderNo};
  this.addToBody(newVal);

  var newVal1 = { "_QUERY": "GET_DSP_ORDERS" , "ORDER_NO": OrderNo, "ORDER_TYPE": "%"};
  this.addToBody(newVal1);

  var newVal2 = { "_QUERY": "GET_DSP_TEMPLATE_DETAIL_BY_ORDER_NO" , "ORDER_NO": OrderNo};
  this.addToBody(newVal2);


//  var newVal = { "_QUERY": "GET_DSP_TEMPLATE" , "TEMPLATE_NAME": formVal.TEMPLATE_NAME};
//  this.addToBody(newVal);

  if (this.paramConfig.DEBUG_FLAG) console.log("Body of multistep HF Please",this.Body);

  this.starServices.post(this, Page, this.Body).subscribe(result => {
          this.Body = [];
          if (this.paramConfig.DEBUG_FLAG) console.log("result.data[0].data:", result.data[0].data)
          this.templateInfo = result.data[0].data[0];
          if (this.paramConfig.DEBUG_FLAG) console.log("test2:this.templateInfo:", this.templateInfo);
        
          var dspOrder = result.data[1].data[0];
          if (this.paramConfig.DEBUG_FLAG) console.log("test2:dspOrder:", dspOrder);


          

          var ORDER_FIELDS = dspOrder.ORDER_FIELDS;
          var EXTERNAL_INFO = dspOrder.EXTERNAL_INFO;
          

          this.formPagesNo = "";
          //if (this.templateInfo.FORM_USAGE  == "PAGE_PER_WO"){
            var WO_ORDER_NO = formVal.WO_ORDER_NO;
            var array = WO_ORDER_NO.split("-");
            var order = array[1];
            var rec = result.data[2].data[order-1];
            if (this.paramConfig.DEBUG_FLAG) console.log("test2:rec:", rec);
            this.formPagesNo = "";
            if (rec.TEMPLATE_ORDER == order){
              if(rec.FORM_PAGES_NO == '0')
              {
                this.formPagesNo = "1"; 
              }
              else
              {
                this.formPagesNo = rec.FORM_PAGES_NO;
              }
              
            }
          //}
          if (this.paramConfig.DEBUG_FLAG) console.log("test2:this.formPagesNo:", this.formPagesNo);

          if (this.paramConfig.DEBUG_FLAG) console.log("test2:result.data[2].data:", result.data[2].data)
          if (this.paramConfig.DEBUG_FLAG) console.log("test2:formVal:", formVal)
          this.form_name = this.templateInfo.FORM_NAME;
            if(toggle_flg ==0)
            {
              this.showMultiStepFormScreen(formVal, ORDER_FIELDS, this.form_name);
            }
            else
            {
              this.form_name_external = this.form_name + "_" + formVal.TEMPLATE_ORDER;
              this.showMultiStepFormScreen(formVal, EXTERNAL_INFO,this.form_name_external );
            }
          
         
	  
      },
      err => {
          alert('error:' + err.message);
      });

}


public multiStepFormClose(){
  this.multiStepFormOpened = false; 
}
public savemultiStepFormCompletedHandler( DSP_MULTISTEP) {
  if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsFormSave :", this.fieldsFormSave , " DSP_MULTISTEP:", DSP_MULTISTEP);
  
  this.fieldsData = DSP_MULTISTEP;
  if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsData:", this.fieldsData);
  /*
  for (var i=0; i<this.fieldsData.length; i++){
    if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsData.data:", this.fieldsData[i].data)
  }
  */
  var orderField = JSON.stringify(this.fieldsData);
  if (this.paramConfig.DEBUG_FLAG) console.log("test1:this.fieldsFormSave:", this.fieldsFormSave)
  var formVal = this.form.value;
  if (this.paramConfig.DEBUG_FLAG) console.log("test1:saveCompletedHandler:orderField,", orderField)
  formVal["ORDER_FIELDS"] = orderField;
  this.form.reset(formVal);
  this.orderFieldModified = true;
  this.fieldsSave = false;
  this.multiStepFormClose();
  
}

  ///////////
  
public userLang = "EN" ; 
public lookupArrDef:any =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrWO_TYPE"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='WO_STATUS' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrWO_STATUS"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='TEMPLATE_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrTEMPLATE_NAME"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrDEPT"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrASSIGNEE_TYPE"},
	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrASSIGNEE"}];

public lkpArrWO_TYPE = [];

public lkpArrWO_STATUS = [];

public lkpArrTEMPLATE_NAME = [];

public lkpArrDEPT = [];

public lkpArrASSIGNEE_TYPE = [];

public lkpArrASSIGNEE = [];

public lkpArrGetWO_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrWO_TYPE.find((x:any) => x.CODE === CODE);
return rec;
}

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

onChanges(): void {
//@ts-ignore: Object is possibly 'null'.
this.form.get('WO_TYPE').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
//@ts-ignore: Object is possibly 'null'.
this.form.get('WO_STATUS').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
//@ts-ignore: Object is possibly 'null'.
this.form.get('TEMPLATE_NAME').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
//@ts-ignore: Object is possibly 'null'.
this.form.get('DEPT').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
//@ts-ignore: Object is possibly 'null'.
this.form.get('ASSIGNEE_TYPE').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
//@ts-ignore: Object is possibly 'null'.
this.form.get('ASSIGNEE').valueChanges.subscribe(_val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
}


public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    
    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("dsp-work-orders-form ComponentConfig:",ComponentConfig);

	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
	    if (ComponentConfig.isMaster == true)
	     this.isMaster = true;

	    if ( ComponentConfig.masterSaved != null)
	    {
	      this.saveChanges(this.form);
	      ComponentConfig.masterSaved  = null;
	    }
	    if ( ComponentConfig.masterKey != null)
	    {
	       this.isORDER_NOEnable = false;
	       this.masterKey = ComponentConfig.masterKey;
	    }
	    if ( ComponentConfig.masterKeyArr != null)
	    {
	      this.masterKeyArr = ComponentConfig.masterKeyArr;
	    }
	    if ( ComponentConfig.masterKeyNameArr != null)
	    {
	      this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
	    }

	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      this.executeQuery(this.form)
		
	    }

	  }
  }

  public logOpen(formVal){
    var wo_orderno = formVal.WO_ORDER_NO;

   //  RULE_KEY = ‘430’ or RULE_KEY like ‘430-%’ 
   var whereClause =   " RULE_KEY = '" + wo_orderno + "' AND RULE_KEY_NAME ='WO_ORDER_NO' ";
   // var whereClause =   " RULE_KEY = '511-6' AND RULE_KEY_NAME ='WO_ORDER_NO' ";

    if (this.paramConfig.DEBUG_FLAG) console.log("Hani whereClause:" + whereClause)
    whereClause = encodeURIComponent(whereClause);
    var Page =  "&_WHERE=" + whereClause;
    
  
    this.ADM_RuleLogGridConfig = new componentConfigDef();
    this.ADM_RuleLogGridConfig.formattedWhere = Page;
      
   
    this.logOpened = true; 
   
    

  }
  public logClose(){
    if (this.paramConfig.DEBUG_FLAG) console.log("logClose: this.logOpened:", this.logOpened)
    this.logOpened = false; 
  }

}


