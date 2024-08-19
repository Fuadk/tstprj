import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { trans      , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';
import { StarNotifyService } from '../../../services/starnotification.service';
import { Subscription } from 'rxjs';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';


 const createFormGroup = dataItem => new FormGroup({
'LOGDATE' : new FormControl(dataItem.LOGDATE  ,   Validators.required ) ,
'LOGDATE_TO' : new FormControl(dataItem.LOGDATE_TO  ,   Validators.required ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME   ) ,
'TRANS' : new FormControl(dataItem.TRANS  , ) 
});

declare function getParamConfig():any;

@Component({
  
  selector: 'app-adm-log-trans',
  templateUrl: './adm-log-trans.component.html',
  styleUrls: ['./adm-log-trans.component.scss']
})
export class AdmLogTransComponent implements OnInit {
  public title = "Log Trans";
  public routineAuth=null;

  constructor(public responsive: BreakpointObserver, private starNotify: StarNotifyService, public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = true;
  public  submitted =  false;

  public paramConfig; 
  public componentConfig: componentConfigDef;

  public form_LOG_TRANS : trans;
  public grid_LOG_TRANS: trans;
  public form_LOG_TRANS_3 : trans;

  public  LOG_TRANSFormConfig : componentConfigDef;
  public  LOG_TRANSGridConfig : componentConfigDef;
  public  LOG_TRANSFormConfig_3 : componentConfigDef;
  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public routineName = "trans";

  public WhereClause = "";
  public OrderByClause = "";

  public isPhonePortrait = false;
  public children = ["any"];
  public primarKeyReadOnlyArr = {isLOGDATEreadOnly : false , isLOGNAMEreadOnly : false}; 

  private Body =[];
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  private formInitialValues =   new trans();   
  private componentConfigChangeEvent: Subscription;
  public ngAfterViewInit() {
    this.starServices.setRTL();
  }  

  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, this.routineName );	//SOMCODES
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
    this.paramConfig = getParamConfig();
    //this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);

     
    this.grid_LOG_TRANS = new trans(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file
   this.LOG_TRANSGridConfig = new componentConfigDef();
   this.LOG_TRANSGridConfig.isMaster = true;
   this.LOG_TRANSGridConfig.routineAuth = this.routineAuth;
   this.LOG_TRANSGridConfig.showToolBar = false;
   this.LOG_TRANSGridConfig.gridHeight = 250;

   this.form_LOG_TRANS_3 = new trans ();
   
   this.LOG_TRANSFormConfig_3 = new componentConfigDef();
   this.LOG_TRANSFormConfig_3.isChild = true;
   this.LOG_TRANSFormConfig_3.routineAuth = this.routineAuth;
   this.LOG_TRANSFormConfig_3.showToolBar = false;
   //this.LOG_TRANSFormConfig_3.gridHeight = "250";

  }
   public ngOnDestroy(): void {
    // Unsubscribe the event once not needed.
    if (typeof this.componentConfigChangeEvent !== "undefined") this.componentConfigChangeEvent.unsubscribe();
 }

  callStarNotify(componentConfig) {
    componentConfig.eventFrom = this.constructor.name;
    this.starNotify.sendEvent<componentConfigDef>('componentConfigDef', componentConfig);
  }

  public readCompletedHandler( form_LOG_TRANS) {
    this.form_LOG_TRANS_3 = new trans();
    //this.grid_LOG_TRANS.LOGDATE =  form_LOG_TRANS.LOGDATE;
    //-----------------Adjust next keys manually for LOG_TRANS--------------------	
    let masterKeyArr = [form_LOG_TRANS.LOGDATE,form_LOG_TRANS.LOGNAME];
    let masterKeyNameArr = ["LOGDATE","LOGNAME"];

    this.form_LOG_TRANS_3 = new trans();
    for (let i = 0; i< masterKeyNameArr.length; i++){
       this.form_LOG_TRANS_3[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.LOG_TRANSFormConfig_3 = new componentConfigDef();
    this.LOG_TRANSFormConfig_3.masterKeyArr = masterKeyArr;
    //Adjust next keys manually
    this.LOG_TRANSFormConfig_3.masterKeyNameArr =  masterKeyNameArr;
    this.LOG_TRANSFormConfig_3.masterParams = form_LOG_TRANS;
    

  }
  public clearCompletedHandler( grid_LOG_TRANS) {
    this.form_LOG_TRANS_3 = new  trans();

  }

    public saveCompletedHandler( form_LOG_TRANS) {

    this.LOG_TRANSFormConfig_3 = new componentConfigDef();
    this.LOG_TRANSFormConfig_3.masterSaved = form_LOG_TRANS;
    //this.LOG_TRANSFormConfig_3.masterKey =  form_LOG_TRANS.LOGDATE;
    this.LOG_TRANSFormConfig_3.masterKeyArr =  [form_LOG_TRANS.LOGDATE,form_LOG_TRANS.LOGNAME];
    this.LOG_TRANSFormConfig_3.masterKeyNameArr =  ["LOGDATE","LOGNAME"];


  }
  private addToBody(NewVal){
    this.Body.push(NewVal);
  }
  get f():any { return this.form.controls; }
  public  executeQuery( form: any ): void {
    if (this.form.invalid)
    {
      this.submitted =  true;
      this.starServices.showOkMsg(this,this.starServices.fieldsRequiredMsg,"Error");
      return;
    }

    let Page =null;

//    if (form.ASSIGNEE_TYPE == "N")
//    {
//      form.ASSIGNEE_TYPE = "= '' ";
//    }
let trans = "%";
if ( form['TRANS'] != "" ){
  trans = form['TRANS'];
}
let logName = form['LOGNAME'];
if ((logName == "") || (typeof logName === "undefined") || ( logName === "undefined")) {
  logName ="%";
}
let fromDate = encodeURIComponent(form['LOGDATE'].toISOString());
let toDate = encodeURIComponent(form['LOGDATE_TO'].toISOString());



trans =encodeURIComponent(trans );
logName =encodeURIComponent(logName );

this.WhereClause = " LOGDATE between '" +  fromDate + "' and '" 
            +  toDate + "' AND LOGNAME LIKE '" +  logName 
            + "' AND TRANS LIKE '" + trans + "'" ;
    if  (this.WhereClause != "")  
    {
      Page = "&_WHERE=" +this.WhereClause ;
    }
    else{
      Page =  this.starServices.formatWhere(form);
    }
  
    this.LOG_TRANSGridConfig = new componentConfigDef();
    this.LOG_TRANSGridConfig.formattedWhere = Page;
   
    
  }
  public onCancel(e): void {
    this.starServices.onCancel_form ( e , this);
   this.LOG_TRANSGridConfig = new componentConfigDef();
   this.LOG_TRANSGridConfig.clearComponent = true;

   this.LOG_TRANSFormConfig_3 = new componentConfigDef();
   this.LOG_TRANSFormConfig_3.clearComponent = true;

  }
  public enterQuery (form : any): void{
    
    this.starServices.enterQuery_form ( form, this);
  }


public userLang = "EN" ; 
public lookupArrDef =[{"statment":"SELECT USERNAME CODE , USERNAME CODETEXT_LANG  FROM ADM_USER_INFORMATION  order by CODETEXT_LANG ",
"lkpArrName":"lkpArrLOGNAME"}];


public lkpArrLOGNAME = [];

public lkpArrGetLOGNAME(CODE: any): any {
var rec = this.lkpArrLOGNAME.find(x => x.CODE === CODE);
return rec;
}


public printScreen(){
  window.print();
}

}
