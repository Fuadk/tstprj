import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { StarNotifyService } from '../../../services/starnotification.service';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Starlib1 } from '../../Starlib1';
import { Subscription } from 'rxjs';
import { IntlService } from "@progress/kendo-angular-intl";
import { trans , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'LOGDATE' : new FormControl(dataItem.LOGDATE  ,   Validators.required ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME  ,   Validators.required ) ,
'TRANS' : new FormControl(dataItem.TRANS  , ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-log-trans-form',
  templateUrl: './log-trans-form.component.html',
  styleUrls: ['./log-trans-form.component.scss']
})


export class LogTransFormComponent {
  public title = '';
  public routineName = "LogTransForm";
  private insertCMD = "INSERT_LOG_TRANS";
  private updateCMD = "UPDATE_LOG_TRANS";
  private deleteCMD =   "DELETE_LOG_TRANS";
  private getCMD = "GET_LOG_TRANS_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  public editableMode = false;
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isLOGDATEEnable : boolean = true;

  public FORM_TRIGGER_FAILURE;
  public NOTFOUND;
  public disableEmitSave = false;
  public disableEmitReadCompleted = false;
  public children = ["any"];

  public action = "";
  private Body =[];
  private isNew: boolean;
  public primarKeyReadOnlyArr = {isLOGDATEreadOnly : false , isLOGNAMEreadOnly : false};  
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="LOGDATE";
  public WhereClause = "";
  public OrderByClause = "";
  
  public formattedWhere = null;  
  public  submitted =  false;
  public masterParams;
public isPhonePortrait = false;
  
  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

   constructor(public intl: IntlService, public responsive: BreakpointObserver, private starNotify: StarNotifyService, private starlib1: Starlib1,  public starServices: starServices) {
      this.title =  this.starServices.getNLS([],"log_trans_form.trans.component_title","Log Trans");
      this.componentConfig = new componentConfigDef(); 
      this.paramConfig = getParamConfig();
  }
  private componentConfigChangeEvent: Subscription;
  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
   async ngOnInit() {
        this.responsive
      .observe([Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        
        this.isPhonePortrait = false;
        if (state.matches) {
           this.isPhonePortrait = true;

          let componentConfig = new componentConfigDef();
          let masterParams = {
            isPhonePortrait: this.isPhonePortrait
          }
          componentConfig.masterParams = masterParams;
          this.children = ["AppComponent"];
          componentConfig.eventTo = this.children;
          this.callStarNotify(componentConfig);
        
        }
        
      });


this.form = createFormGroup(
        this.formInitialValues
    );
    //this.executeQuery (this.form);
    
    //let Choice_cd = this.starlib1.get_application_property(this, 'Current_Form');
    //let P_Form_Ver = '1.0';
    // await this.starlib1.invoke_form(this.routineName);
    // await this.starlib1.global_program(Choice_cd, P_Form_Ver);

    

    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.onNew(this.form);

 // Subscribing the event.
    this.componentConfigChangeEvent = this.starNotify.subscribeEvent<componentConfigDef>('componentConfigDef', componentConfig => {
      if (componentConfig.eventFrom != this.constructor.name) {
         if (componentConfig.eventTo.includes(this.constructor.name)|| componentConfig.eventTo.includes("any"))  {
            this.handleComponentConfig(componentConfig);
         }
      }
   });

    this.componentConfig.queryable  = false;
    this.componentConfig.navigable = false;
    this.componentConfig.insertable = false;
    this.componentConfig.removeable = false;
    this.componentConfig.updateable = false;
    this.componentConfig.enabled = true;

    //this.PRE_BLOCK();
    this.WHEN_NEW_FORM_INSTANCE();

  }
  
  public ngOnDestroy(): void {
    // Unsubscribe the event once not needed.
    if (typeof this.componentConfigChangeEvent !== "undefined") this.componentConfigChangeEvent.unsubscribe();
 }

  callStarNotify(componentConfig) {
    componentConfig.eventFrom = this.constructor.name;
    this.starNotify.sendEvent<componentConfigDef>('componentConfigDef', componentConfig);
  }

  private formInitialValues =   new trans();   
    @Input() public set detail_Input(form: any) {
    console.log('detail_Input LogTransForm form.LOGDATE :' + form.LOGDATE);
    if ( (form.LOGDATE != "") && (form.LOGDATE != null) &&   (typeof form.LOGDATE != "undefined"))
    {
      this.masterKey = form.LOGDATE;
      
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
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.LOGDATE != "undefined") &&   (form.LOGDATE != ""))
    {
      
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

   async callBackFunction(data) {
    console.log("inside callBackFunction:data:", data);
    if (typeof data !== "undefined") {
      await this.POST_QUERY(data);
      //this.form.markAsPristine();
      //this.form.markAsUntouched();
      //this.commonCallStarNotify(data);

      
    }
  }
   public commonCallStarNotify(data){
    let componentConfig = new componentConfigDef();
      let masterParams = {
        data: data
      }

      let masterKeyArr = [data['LOGDATE']];
      let masterKeyNameArr = ['LOGDATE'];
      //for (let i = 0; i < masterKeyNameArr.length; i++) {
      //  componentConfig.masterKeyNameArr[i] = masterKeyArr[i];
      //}
      componentConfig.masterKeyArr = masterKeyArr;
      componentConfig.masterKeyNameArr = masterKeyNameArr;
      componentConfig.masterReadCompleted = true;
      componentConfig.eventTo = this.children;
      componentConfig.masterParams = masterParams;
      //this.callStarNotify(componentConfig);
   }

    async executeQuery( form: any ) {
      if (typeof form == "undefined")
        return;
     await this.PRE_QUERY(form);
     if (this.FORM_TRIGGER_FAILURE == true)
         return;
    if ( (this.WhereClause != "") && (this.isSearch != true) )
    {
      this.formattedWhere = this.WhereClause ;
      this.isSearch = true;
    }
    this.starServices.executeQuery_form( form, this);
  }

  private addToBody(NewVal){
    this.Body.push(NewVal);
  }

  public onCancel(e): void {
    this.starServices.onCancel_form ( e , this);
  }
   public fetchLookupsCallBack() {

      console.log("this.lookupArrDef:", this.lookupArrDef)
   }

  public onNew(e): void {
    console.log("this.masterKeyNameArr:", this.masterKeyNameArr, "this.masterKeyNameArr.length",this.masterKeyNameArr.length)
    if (this.masterKeyNameArr.length != 0)
    {
      for (let i = 0; i< this.masterKeyNameArr.length; i++){
        console.log(this.masterKeyNameArr[i] + ":" + this.masterKeyArr[i])
        this.formInitialValues[this.masterKeyNameArr[i]] = this.masterKeyArr[i];
      }
    }
    else
    {
      console.log(this.masterKeyName + this.masterKey)
      this.formInitialValues[this.masterKeyName] = this.masterKey;
    }

    this.starServices.onNew_form ( e , this);
    this.setRequired();
    this.setInitialValues();
    this.WHEN_CREATE_RECORD();
    //this.KEY_CRREC();

  }
   public setInitialValues() {
    
    //this.form.patchValue({ 'LOGDATE': new Date(1990, 0, 1) });
    this.form.patchValue({ 'LOGDATE': null });
  
    //this.form.patchValue({ 'GSM_OPERATOR': 'N' });
    this.form.markAsPristine();
    this.form.markAsUntouched();

   }
   public setRequired() {
   //this.form.controls['GOVERNATE'].setValidators([Validators.required]);
   }



  async onRemove( form) {
    await this.PRE_DELETE(form.value);
    //await this.KEY_DELREC();
     if (this.FORM_TRIGGER_FAILURE) 
       return;

    this.starServices.onRemove_form(form,this);
  }

  async  enterQuery (form : any){
    
    this.starServices.enterQuery_form ( form, this);

    await this.KEY_ENTQRY();
  }

    async callBackPost_Insert(NewVal) {
      console.log("callBackPost_Insert:",  " NewVal:", NewVal)
      this.commonCallStarNotify(NewVal);
      if (this.FORM_TRIGGER_FAILURE) 
      {
         this.starServices.endTrans(this, false);
         return;
      }
       await this.POST_INSERT(NewVal);
      if (this.FORM_TRIGGER_FAILURE) 
      {
         this.starServices.endTrans(this, false);
         return;
      }

      if (!this.FORM_TRIGGER_FAILURE) {
         this.saveCompletedOutput.emit(this.form.value);
      }
   }
   async callBackPost_Update( NewVal) {
      console.log("callBackPost_Update:",  " NewVal:", NewVal);
      this.commonCallStarNotify(NewVal);
      await this.POST_UPDATE(NewVal);
   }

   async callBackPost_Remove( NewVal) {
      console.log("callBackPost_Remove:",  " NewVal:", NewVal);
      this.commonCallStarNotify("");
      await this.POST_DELETE(NewVal);
   }

   async saveChanges(form: any) {
      this.FORM_TRIGGER_FAILURE = false;
      this.Body = [];
        
     


         this.form.markAllAsTouched();
   
          await this.WHEN_VALIDATE_RECORD(form.value);
         if (this.FORM_TRIGGER_FAILURE)
            return;

      //this.starServices.beginTrans();

      if (this.isNew == true) {
         this.disableEmitSave = true;
          await this.PRE_INSERT(form.value);
         if (this.FORM_TRIGGER_FAILURE){
            this.starServices.endTrans(this, false);
            return;
         }

      }
      else {
       
             await this.PRE_UPDATE(form.value);
         if (this.FORM_TRIGGER_FAILURE){
            this.starServices.endTrans(this, false);
            return;
         }

      }
      if (this.form.valid == false){
         let invalid = this.starlib1.getInvalidControls(this);
          this.FORM_TRIGGER_FAILURE = true;
          this.starServices.endTrans(this, false);
          return;
      }

     
      if (!this.FORM_TRIGGER_FAILURE) {
	        await this.KEY_COMMIT();
	      if (this.FORM_TRIGGER_FAILURE == true){
		this.starServices.endTrans(this, false);
		 return;
		}
         
         this.starServices.saveChanges_form(form, this);
      }

   }


  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

public userLang = "EN" ; 
public lookupArrDef =[/**/];

onChanges(): void {
this.form.get('LOGNAME').valueChanges.subscribe(val => {
});
this.form.get('TRANS').valueChanges.subscribe(val => {
});
}


public printScreen(){
  window.print();
}
  public handleComponentConfig(ComponentConfig) {
    if (typeof ComponentConfig !== "undefined") {
      console.log("LogTransForm ComponentConfig:", ComponentConfig);

      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;

      if (ComponentConfig.masterSaved != null) {
        this.saveChanges(this.form);
        ComponentConfig.masterSaved = null;
      }
      if (ComponentConfig.masterKey != null) {

        this.masterKey = ComponentConfig.masterKey;
      }
      if (ComponentConfig.masterKeyArr != null) {
        this.masterKeyArr = ComponentConfig.masterKeyArr;
      }
      if (ComponentConfig.masterKeyNameArr != null) {
        this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
      }
      if (ComponentConfig.masterParams != null) {
        this.masterParams = ComponentConfig.masterParams;
      }

      if (ComponentConfig.formattedWhere != null) {
        this.formattedWhere = ComponentConfig.formattedWhere;
        this.isSearch = true;
        this.executeQuery(this.form)

      }
      if (ComponentConfig.masterReadCompleted != null) {
        this.isSearch = false;
        this.isChild = true;
        this.executeQuery(this.form)
      }
      if (ComponentConfig.clearComponent == true) {
        this.onCancel(this.form)
      }


    }
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    this.handleComponentConfig(ComponentConfig);


  }
  
  WHEN_NEW_FORM_INSTANCE(){
    
    
  }
  WHEN_CREATE_RECORD(){
    undefined

  }
   KEY_ENTQRY(){
    undefined

  }
   KEY_DELREC(){
    undefined

  }
   async WHEN_VALIDATE_RECORD(formGroup){
    

  }
  async  PRE_UPDATE(formGroup){

  }
  async  POST_UPDATE(formGroup){
    
    
  }
  async KEY_COMMIT(){
   

}
  async  PRE_INSERT(formGroup){
    
  }
  async  POST_INSERT(formGroup){
    
   
  }
  async  PRE_QUERY (formGroup){
    
   
  }
  async  POST_QUERY(formGroup){
  
    let TRANS = JSON.parse(formGroup['TRANS']);
    //TRANS =  JSON.stringify(TRANS);
    TRANS =  JSON.stringify(TRANS, null, "\t");

    this.form.patchValue({ 'TRANS': TRANS });
    
    

    
  }
  async  PRE_DELETE(formGroup){
    

  }
  async POST_DELETE(formGroup){
    

  }


async POST_CHANGE_LOGDATE(value) {

 this.FORM_TRIGGER_FAILURE = false ; 
 this.form.controls['LOGDATE'].setErrors({invalid: true}); 
 // Code goes here 

 if ( this.FORM_TRIGGER_FAILURE == true) 
 return; 
 
 this.form.controls['LOGDATE'].clearValidators();
 this.form.get('LOGDATE').updateValueAndValidity();
 this.form.updateValueAndValidity(); 
 }
async POST_CHANGE_LOGNAME(value) {

 this.FORM_TRIGGER_FAILURE = false ; 
 this.form.controls['LOGNAME'].setErrors({invalid: true}); 
 // Code goes here 

 if ( this.FORM_TRIGGER_FAILURE == true) 
 return; 
 
 this.form.controls['LOGNAME'].clearValidators();
 this.form.get('LOGNAME').updateValueAndValidity();
 this.form.updateValueAndValidity(); 
 }
async POST_CHANGE_TRANS(value) {

 this.FORM_TRIGGER_FAILURE = false ; 
 this.form.controls['TRANS'].setErrors({invalid: true}); 
 // Code goes here 

 if ( this.FORM_TRIGGER_FAILURE == true) 
 return; 
 
 this.form.controls['TRANS'].clearValidators();
 this.form.get('TRANS').updateValueAndValidity();
 this.form.updateValueAndValidity(); 
 } 
 async onValueChange_LOGDATE(value) { 
  this.FORM_TRIGGER_FAILURE = false;	
 await this.POST_CHANGE_LOGDATE(value); if ( this.FORM_TRIGGER_FAILURE) return;  
  } 
 async onChange_LOGNAME({ target }) { 
 var value = target.value; 
 if ((value == null) || (value == '')) 	
 	return;  
    this.FORM_TRIGGER_FAILURE = false;	
 await   this.POST_CHANGE_LOGNAME(value); if ( this.FORM_TRIGGER_FAILURE) return;  
 } 
 async onChange_TRANS({ target }) { 
 var value = target.value; 
 if ((value == null) || (value == '')) 	
 	return;  
    this.FORM_TRIGGER_FAILURE = false;	
 await   this.POST_CHANGE_TRANS(value); if ( this.FORM_TRIGGER_FAILURE) return;  
 }



}


