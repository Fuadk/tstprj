import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { ruleLog , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'RULE_ID' : new FormControl(dataItem.RULE_ID  , Validators.required ) ,
'RULE_KEY' : new FormControl(dataItem.RULE_KEY  , Validators.required ) ,
'ACTION_ID' : new FormControl(dataItem.ACTION_ID ) ,
'STATUS' : new FormControl(dataItem.STATUS ) ,
'MSG_RESPONSE' : new FormControl(dataItem.MSG_RESPONSE ) ,
'MODULE' : new FormControl(dataItem.MODULE ) ,
'SENT_DATE' : new FormControl(dataItem.SENT_DATE  , Validators.required ) ,
'MSG_RECEIVED' : new FormControl(dataItem.MSG_RECEIVED ) ,
'PARAMETER_SENT' : new FormControl(dataItem.PARAMETER_SENT ) ,
'BODY_SENT' : new FormControl(dataItem.BODY_SENT ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-rule-log-form',
  templateUrl: './adm-rule-log-form.component.html',
  styleUrls: ['./adm-rule-log-form.component.css']
})


export class AdmRuleLogFormComponent {
  public title = "Rule Log";
  private insertCMD = "INSERT_ADM_RULE_LOG";
  private updateCMD = "UPDATE_ADM_RULE_LOG";
  private deleteCMD =   "DELETE_ADM_RULE_LOG";
  private getCMD = "GET_ADM_RULE_LOG_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isRULE_IDEnable : boolean = true;
  private Body =[];

  private isNew: boolean;
  public primarKeyReadOnlyArr = {isRULE_IDreadOnly : false , isRULE_KEYreadOnly : false , isSENT_DATEreadOnly : false};  
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="RULE_ID";
  public formattedWhere = null;  
  public  submitted =  false;
  public  isReadOnly : boolean = true;
  public  insertable : boolean = false;
  
  
  
  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {  
      this.componentConfig = new componentConfigDef(); 
      this.paramConfig = getParamConfig();
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.form = createFormGroup(
        this.formInitialValues
    );
    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

  }
  
  private formInitialValues =   new ruleLog();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.RULE_ID != "undefined") &&   (form.RULE_ID != ""))
    {
      this.isRULE_IDEnable = false;
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
    this.isReadOnly = true;
    this.starServices.executeQuery_form( form, this);
  }

  private addToBody(NewVal){
    this.Body.push(NewVal);
  }

  public onCancel(e): void {
    this.starServices.onCancel_form ( e , this);
  }

  public onNew(e): void {
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

  public onRemove( form): void {
    this.starServices.onRemove_form(form,this);
  }

  public enterQuery (form : any): void{
    this.isReadOnly = false;
    this.starServices.enterQuery_form ( form, this);
  }

  public saveChanges( form: any): void {
    this.Body = []; 
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='RULE_ID' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrRULE_ID"}];

public lkpArrRULE_ID = [];

public lkpArrGetRULE_ID(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrRULE_ID.find(x => x.CODE === CODE);
return rec;
}

onChanges(): void {
this.form.get('RULE_ID').valueChanges.subscribe(val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
}


public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-rule-log-form ComponentConfig:",ComponentConfig);

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
	       this.isRULE_IDEnable = false;
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
      if ( ComponentConfig.masterParams != null)
      {
        var dataItem = ComponentConfig.masterParams.dataItem;
        var formVal = this.form;
        formVal["RULE_ID"] = dataItem.RULE_ID;
        formVal["RULE_KEY"] = dataItem.RULE_KEY;

        formVal["ACTION_ID"] = dataItem.ACTION_ID;
        formVal["STATUS"] = dataItem.STATUS;

        formVal["MSG_RESPONSE"] = dataItem.MSG_RESPONSE;
        formVal["MODULE"] = dataItem.MODULE;
        formVal["SENT_DATE"] = dataItem.SENT_DATE;
        formVal["MSG_RECEIVED"] =  dataItem.MSG_RECEIVED;
        formVal["PARAMETER_SENT"] = dataItem.PARAMETER_SENT;
        formVal["BODY_SENT"] = dataItem.BODY_SENT;

        this.form.reset(formVal);



   
      }
	  }
  }


}


