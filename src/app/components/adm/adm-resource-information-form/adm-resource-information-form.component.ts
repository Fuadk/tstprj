
import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { userInformation , componentConfigDef} from '@modeldir/model';
import {Md5} from 'ts-md5/dist/md5';


 const createFormGroup = dataItem => new FormGroup({
'USERNAME' : new FormControl(dataItem.USERNAME  , Validators.required ) ,
'FULLNAME' : new FormControl(dataItem.FULLNAME ) ,
'SIGN' : new FormControl(dataItem.SIGN ) ,
'DIV' : new FormControl(dataItem.DIVS ) ,
'DEPT' : new FormControl(dataItem.DEPT ) ,
'PHONE' : new FormControl(dataItem.PHONE ) ,
'GROUPNAME' : new FormControl(dataItem.GROUPNAME ) ,
'LANGUAGE_NAME' : new FormControl(dataItem.LANGUAGE_NAME ) ,
'IP_RESTRICT' : new FormControl(dataItem.IP_RESTRICT ) ,
'WEB_ENABLED' : new FormControl(dataItem.WEB_ENABLED ) ,
'WEB_BROWSER' : new FormControl(dataItem.WEB_BROWSER ) ,
'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) ,
'DEFAULT_PRINTER' : new FormControl(dataItem.DEFAULT_PRINTER ) ,
'EXTRA_PERC' : new FormControl(dataItem.EXTRA_PERC ) ,
'FIN_ADMIN' : new FormControl(dataItem.FIN_ADMIN ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'PASSWORD' : new FormControl(dataItem.PASSWORD ) ,
'TEAM' : new FormControl(dataItem.TEAM ) ,
'LEADER' : new FormControl(dataItem.LEADER ) ,
'MANAGER' : new FormControl(dataItem.LEADER ) ,
'TODAY' : new FormControl(dataItem.TODAY ) ,
'TOMORROW' : new FormControl(dataItem.TOMORROW ) ,
'NOTES' : new FormControl(dataItem.NOTES ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-resource-information-form',
  templateUrl: './adm-resource-information-form.component.html',
  styleUrls: ['./adm-resource-information-form.component.css']
})


export class AdmResourceInformationFormComponent {
  public title = "Resource";
  private insertCMD = "INSERT_ADM_USER_INFORMATION";
  private updateCMD = "UPDATE_ADM_USER_INFORMATION";
  private deleteCMD =   "DELETE_ADM_USER_INFORMATION";
  private getCMD = "GET_ADM_USER_INFORMATION_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  private Body =[];

  private isNew: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  masterKey="";
  public isPasswordChanged: boolean = false;
  
  
  //@Input()  
  public showToolBar = true;
  public paramConfig; 
  public primarKeyReadOnlyArr = {isUSERNAMEreadOnly : false};  

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
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
    public lkpArrDIV = [];
  
    onChanges(): void {
    this.form.get('DEPT').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("DEPT valu changed :" + val)
      //var formVal = this.form.value;
      this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
      "lkpArrName":"lkpArrDIV"}];
     this.starServices.fetchLookups(this, this.lookupArrDef);
    });
    this.form.get('PASSWORD').valueChanges.subscribe(val => {
      var formVal = this.form.value;
      //if (this.paramConfig.DEBUG_FLAG) console.log ("---------userinformation this.form.value:" + formVal.PASSWORD + " this.form.dirty:" + this.form.dirty)
      if (this.form.dirty == true) 
      {
        if ((formVal.PASSWORD == "") || (val.length >20) )
        {
          return;
        }
        //if (this.paramConfig.DEBUG_FLAG) console.log("PASSWORD valu changed : " + val)
        this.isPasswordChanged = true;
      }
    });     
  }
  private formInitialValues =   new userInformation();   
  
  @Input() public set executeQueryInput( form: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery_form object.form:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.form);

    this.isSearch = true;
    this.starServices.executeQuery_form( form, this);
  }    
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
    this.saveCompletedOutput.emit(form);
    
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

  public userLang = "EN" ;
  public lookupArrDef =[   
    {"statment":" select  distinct GROUPNAME, FULLNAME  from adm_GROUPinfo order by groupname  ",
      "lkpArrName":"lkpArrGROUPNAME"
    },
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    "lkpArrName":"lkpArrDEPT"
    }              
  ];
  public lkpArrGROUPNAME = [];
  public lkpArrDEPT = [];

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){

      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
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
          //this.isUSERNAMEEnable = false;
          this.masterKey = ComponentConfig.masterKey;
      }
    }
  }

}


