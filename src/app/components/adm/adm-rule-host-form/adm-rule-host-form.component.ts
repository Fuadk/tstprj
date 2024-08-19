import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { ruleHost , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'HOST_ID' : new FormControl(dataItem.HOST_ID  , Validators.required ) ,
'URL' : new FormControl(dataItem.URL , Validators.required) ,
'PROTOCOL' : new FormControl(dataItem.PROTOCOL ) ,
'HOST' : new FormControl(dataItem.HOST ) ,
'PATH_NAME' : new FormControl(dataItem.PATH_NAME ) ,
'PORT' : new FormControl(dataItem.PORT ) ,
'HTTP_METHOD' : new FormControl(dataItem.HTTP_METHOD ) ,
'RULE_AUTHORIZATION' : new FormControl(dataItem.RULE_AUTHORIZATION ) ,
'CONTENT_TYPE' : new FormControl(dataItem.CONTENT_TYPE ) ,
'RULE_HEADER' : new FormControl(dataItem.RULE_HEADER ) ,
'SUCCESS_MSG' : new FormControl(dataItem.SUCCESS_MSG ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-rule-host-form',
  templateUrl: './adm-rule-host-form.component.html',
  styleUrls: ['./adm-rule-host-form.component.css']
})


export class AdmRuleHostFormComponent {
  public title = "Rule Host";
  private insertCMD = "INSERT_ADM_RULE_HOST";
  private updateCMD = "UPDATE_ADM_RULE_HOST";
  private deleteCMD =   "DELETE_ADM_RULE_HOST";
  private getCMD = "GET_ADM_RULE_HOST_QUERY";

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
  public  isHOST_IDEnable : boolean = true;
  private Body =[];

  private isNew: boolean;
  public primarKeyReadOnlyArr = {isHOST_IDreadOnly : false};  
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="HOST_ID";
  public formattedWhere = null;  
  public  submitted =  false;
  
  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {  
      this.componentConfig = new componentConfigDef(); 
      this.paramConfig = getParamConfig();
      //if (this.paramConfig.DEBUG_FLAG) console.log ( "this.paramConfig.titles.HOST_ID::", this.paramConfig.titles.HOST_ID)
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
  
  private formInitialValues =   new ruleHost();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.HOST_ID != "undefined"))
    {
      this.isHOST_IDEnable = false;
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
    
    this.starServices.enterQuery_form ( form, this);
  }

  public saveChanges( form: any): void {
    this.Body = []; 
    var formVal = this.form.value;
    var url = formVal.URL;
    if ( (url != "") && (url != null)) {
      var valid = url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);

      if (valid == null){
        var errorMsg = "URL is not valid";
        this.starServices.showNotification ('error',errorMsg);
        
        var dialogStruc = { 
          msg: errorMsg, 
          title : "Error",
          info: null, 
          object : this,
          action : this.starServices.OkActions,
          callback: null };
          this.starServices.showConfirmation(dialogStruc);  
          return ;         
       
      }
    }
    var array = url.split("/");
    if (this.paramConfig.DEBUG_FLAG) console.log("test:array:",array)
    var param1 = array[0].split(":");
    formVal.PROTOCOL = param1[0];
    formVal.PATH_NAME = array[3];
    

    var array1 = array[2].split(":");
    if (this.paramConfig.DEBUG_FLAG) console.log("test:array1:",array1)
    formVal.HOST = array1[0];
    formVal.PORT = "";
    if (typeof array1[1] !== "undefined"){
      formVal.PORT = array1[1];
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("test:formVal:",formVal)
    this.form.reset(formVal);


    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

  public userLang = "EN" ; 
  public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='HTTP_METHOD' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
        "lkpArrName":"lkpArrHTTP_METHOD"}];
  public lkpArrHTTP_METHOD = [];      
  
  public lkpArrGetMODULE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrHTTP_METHOD.find(x => x.CODE === CODE);
    return rec;
    }
onChanges(): void {
  this.form.get('HTTP_METHOD').valueChanges.subscribe(val => {
    //this.lookupArrDef =[];
    //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
    this.form.get('URL').valueChanges.subscribe(val => {
      if ( (val != "") && (val != null)) {
        var valid = val.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
        if (this.paramConfig.DEBUG_FLAG) console.log("valid:",valid)
        if (valid == null){
          var errorMsg = "URL is not valid";
          this.starServices.showNotification ('warning',errorMsg);
          
  
        }
      
      }
      });
}


public printScreen(){
  window.print();
}


  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-rule-host-form ComponentConfig:",ComponentConfig);

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
	       this.isHOST_IDEnable = false;
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


}


