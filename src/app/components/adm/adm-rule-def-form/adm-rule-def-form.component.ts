import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { ruleDef , ruleHost, componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'MODULE' : new FormControl(dataItem.MODULE  , Validators.required ) ,
'RULE_ID' : new FormControl(dataItem.RULE_ID ) ,
'RULE_TRIGGER' : new FormControl(dataItem.RULE_TRIGGER , Validators.required) ,
'ROUTINE_NAME' : new FormControl(dataItem.ROUTINE_NAME ) ,
'QUERY_DEF' : new FormControl(dataItem.QUERY_DEF , Validators.required) ,
'RULE_KEY' : new FormControl(dataItem.RULE_KEY , Validators.required) ,
'RESPONSE_DATA_ID' : new FormControl(dataItem.RESPONSE_DATA_ID) ,
'RESPONSE_DATA_NAME' : new FormControl(dataItem.RESPONSE_DATA_NAME) ,
'DISABLED' : new FormControl(dataItem.DISABLED)  ,
'RULE_DESCRIPTION' : new FormControl(dataItem.RULE_DESCRIPTION)  ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-rule-def-form',
  templateUrl: './adm-rule-def-form.component.html',
  styleUrls: ['./adm-rule-def-form.component.css']
})


export class AdmRuleDefFormComponent {
  public title = "Rule Def";
  private insertCMD = "INSERT_ADM_RULE_DEF";
  private updateCMD = "UPDATE_ADM_RULE_DEF";
  private deleteCMD =   "DELETE_ADM_RULE_DEF";
  private getCMD = "GET_ADM_RULE_DEF_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  public grid_adm_rule_keys:componentConfigDef;

  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isEnable : boolean = true;
  public hostOpened : boolean = false;
  public isROUTINEreadOnly  : boolean = false;
  private Body =[];

  private isNew: boolean;
  public primarKeyReadOnlyArr = {isMODULEreadOnly : false , isRULE_IDreadOnly : false};  
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="";
  public formattedWhere = null;  
  public  submitted =  false;
  public  grid_adm_rule_host_def: ruleHost;
  public hostID ;
  public  keysOpened : boolean = false;
  public keysData =[];
  public ruleKeysSave : boolean = false;

  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {  
      this.componentConfig = new componentConfigDef(); 
      this.paramConfig = getParamConfig();
      this.lkpArrQUERY_DEF = this.paramConfig.lkpArrQUERY_DEF;
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMRULEDEF' );
    this.form = createFormGroup(
        this.formInitialValues
    );
    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

    //this.grid_adm_rule_keys = new componentConfigDef();

  }
  
  private formInitialValues =   new ruleDef();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") )
    {
      this.isEnable = false;
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
    this.isROUTINEreadOnly = false;
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
    this.isROUTINEreadOnly = false;
    this.starServices.enterQuery_form ( form, this);
  }

  public saveChanges( form: any): void {
    if (this.isNew == true){
      var getCMD = "GET_MAX_ADM_RULE_ID";
      var page = "&_query=" + getCMD  ;
      if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page)
      page = encodeURI(page);

      this.starServices.fetch(this, page).subscribe(result => {
        if (this.paramConfig.DEBUG_FLAG) console.log("result:", result.data[0].data);
        if (result != null){
          //this.serverData = result.data[0].data;
          
          if (this.paramConfig.DEBUG_FLAG) console.log("result.data[0].data:",result.data[0].data)

          var formVal = this.form.value;
          formVal.RULE_ID = result.data[0].data[0].RULE_ID;
          this.starServices.saveChanges_form ( form, this);
        }
      },
        err => {
          this.starServices.showErrorMsg(this, err);
      });
  }
  else
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }
  
  public callBackFunction(data){
    if (this.paramConfig.DEBUG_FLAG) console.log("inside callBackFunction:data:", data)
    this.isROUTINEreadOnly = false;

    var formVal = this.form.value;
    var ruleTrigger = formVal.RULE_TRIGGER;
    if ( (ruleTrigger == "POST") || (ruleTrigger == "PRE") ){
      this.isROUTINEreadOnly = true;
    }

  }
  
public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='MODULE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
      "lkpArrName":"lkpArrMODULE"},
      {"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='RULE_TRIGGER' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
      "lkpArrName":"lkpArrRULE_TRIGGER"},
      { "statment": "SELECT ROUTINE_NAME CODE, ROUTINE_DESC CODETEXT_LANG FROM ROUTINES  order by CODETEXT_LANG",
      "lkpArrName": "lkpArrROUTINE" }
];
      
public lkpArrMODULE = [];
public lkpArrRULE_TRIGGER = [];
public lkpArrROUTINE = [];
public lkpArrQUERY_DEF = [];


public lkpArrGetMODULE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrMODULE.find(x => x.CODE === CODE);
return rec;
}
public lkpArrGetRULE_TRIGGER(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrRULE_TRIGGER.find(x => x.CODE === CODE);
  return rec;
  }
  public lkpArrGetROUTINE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrROUTINE.find(x => x.CODE === CODE);
    return rec;
    }
  
  public lkpArrGetQUERY_DEF(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrQUERY_DEF.find(x => x.CODE === CODE);
    return rec;
    }
onChanges(): void {
this.form.get('MODULE').valueChanges.subscribe(val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});

this.form.get('RULE_TRIGGER').valueChanges.subscribe(val => {
  this.isROUTINEreadOnly = false;
  if (this.paramConfig.DEBUG_FLAG) console.log("testx:val:", val)
    if ( (val == "POST") || (val == "PRE") ){
      this.isROUTINEreadOnly = true;
      this.form.controls['ROUTINE_NAME'].setValue("");
    }

  });
  this.form.get('QUERY_DEF').valueChanges.subscribe(val => {
    //this.lookupArrDef =[];
    //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
}

public viewHost(){
  
  this.hostOpened = true; 
  this.grid_adm_rule_host_def = new ruleHost(); 
  this.grid_adm_rule_host_def.HOST_ID =  "%";

}
public hostClose(){
  this.hostOpened = false; 
}

public keysOpen(){
  var queryDef = this.form.get('QUERY_DEF').value;
  if (this.paramConfig.DEBUG_FLAG) console.log("queryDef:",queryDef);
  this.keysData =[];
  if (queryDef != "")
  {
      var rec = this.lkpArrGetQUERY_DEF(queryDef);
      if (this.paramConfig.DEBUG_FLAG) console.log("rec:",rec);

      if (typeof rec !== "undefined"){
        var statement = rec.statement;
        statement = statement.join("");
        if (this.paramConfig.DEBUG_FLAG) console.log ("statement:",statement)
        if (this.paramConfig.DEBUG_FLAG) console.log("rec:",rec);
        var whereStr = " WHERE ";
        var insertStr = "INSERT";
        

        
        var wherePos = statement.toUpperCase().search(whereStr);
        if (wherePos != -1){
          var keysStr = statement.slice(wherePos +whereStr.length);
          var arrayphrase = keysStr.toUpperCase().split(" AND ");
          if (this.paramConfig.DEBUG_FLAG) console.log ("arrayphrase:",arrayphrase)
          for (var i = 0; i < arrayphrase.length; i++)
          {
            var arrayCols = arrayphrase[i].split("=");
            if (this.paramConfig.DEBUG_FLAG) console.log ("arrayCols:",arrayCols);
            var COL_NAME = arrayCols[0].trim();
            if (this.paramConfig.DEBUG_FLAG) console.log ("COL_NAME:",COL_NAME);
            var colRec = {
              COL_NAME :COL_NAME,
              SELECTED : false
            }
            this.keysData.push(colRec);
          }
        }
        else
        {
          statement = statement.trim();
          if (this.paramConfig.DEBUG_FLAG) console.log ("statement:",statement)
          var insertFound = statement.toUpperCase().startsWith(insertStr);
          if (insertFound == true ){
            var insertPos = statement.toUpperCase().search(insertStr);
            var phrase1 = statement.slice(insertPos + insertStr.length);
            if (this.paramConfig.DEBUG_FLAG) console.log ("phrase1:",phrase1)
            var phrasePos = phrase1.indexOf("(");
            if (phrasePos != -1){
              var phraseStr = phrase1.slice(phrasePos + 1);
              if (this.paramConfig.DEBUG_FLAG) console.log ("phraseStr:",phraseStr)

              var phrasePos = phraseStr.indexOf(")");
              if (phrasePos != -1){
                var keysStr = phraseStr.slice(0, phrasePos );
      
                var arrayphrase = keysStr.toUpperCase().split(",");
                if (this.paramConfig.DEBUG_FLAG) console.log ("arrayphrase:",arrayphrase);
                for (var i = 0; i < arrayphrase.length; i++)
                {
                  var COL_NAME = arrayphrase[i].trim();
                  if (this.paramConfig.DEBUG_FLAG) console.log ("COL_NAME:",COL_NAME);
                  var colRec = {
                    COL_NAME :COL_NAME,
                    SELECTED : false
                  }
                  this.keysData.push(colRec);
                }
              }
            }
          }
        }
        if (this.paramConfig.DEBUG_FLAG) console.log("this.keysData:", this.keysData);
        if (this.keysData.length != 0)
        {
          var ruleKeys = this.form.get('RULE_KEY').value;
          var keys = ruleKeys.split(",");
          for (var i = 0; i < keys.length; i++)
          {
            var COL_NAME = keys[i].trim();
            var rec = this.keysData.find(x => x.COL_NAME === COL_NAME);
            if (this.paramConfig.DEBUG_FLAG) console.log("COL_NAME:", COL_NAME, " rec:", rec)
            if (typeof rec !== "undefined"){
              rec.SELECTED = true;
            }
            if (this.paramConfig.DEBUG_FLAG) console.log("this.keysData:", this.keysData);
          }
        }
        else
        {

        }
      }
      this.keysOpened = true; 
      this.ruleKeysSave = false;
      //this.grid_adm_rule_host_def = new ruleHost(); 
      //this.grid_adm_rule_host_def.HOST_ID =  "%";
      var masterParams={
        "result" : this.keysData        
      };
      if (this.paramConfig.DEBUG_FLAG) console.log("masterParams:", masterParams)
    
      this.grid_adm_rule_keys = new componentConfigDef();
      this.grid_adm_rule_keys.masterParams = masterParams;
   }
  else
  {
    this.starServices.showOkMsg(this,"Please select a Transaction.","Error");
    return;
  }
}
public keysClose(){
  if (this.paramConfig.DEBUG_FLAG) console.log("keysClose: this.keysOpened:", this.keysOpened)
  this.keysOpened = false; 
}
public onSaveKeys(e): void {
  e.preventDefault();
  this.keysOpened = false; 
  this.ruleKeysSave = true;

 }

public onCancelKeys(e): void {
  e.preventDefault();
  this.keysClose();
}
public saveCompletedHandler( grid_ADM_ADM_RULE_KEYS) {
  if (this.paramConfig.DEBUG_FLAG) console.log("test:this.ruleKeysSave :", this.ruleKeysSave , " grid_ADM_ADM_RULE_KEYS:", grid_ADM_ADM_RULE_KEYS.data);

  var ruleKeys = "";
  for (var i=0; i < grid_ADM_ADM_RULE_KEYS.data.length; i++){
    if (grid_ADM_ADM_RULE_KEYS.data[i].SELECTED == true){
      if (ruleKeys != "")
        ruleKeys = ruleKeys + ",";
      ruleKeys = ruleKeys + grid_ADM_ADM_RULE_KEYS.data[i].COL_NAME;
    }
  }
  if (this.ruleKeysSave == true){
    var formVal = this.form.value;
    if (this.paramConfig.DEBUG_FLAG) console.log("saveCompletedHandler:ruleKeys,", ruleKeys)
    formVal["RULE_KEY"] = ruleKeys;
    this.form.reset(formVal)
  }
}
public valueChangeQUERY_DEF(value: any): void {
  if (this.paramConfig.DEBUG_FLAG) console.log("valueChangeQUERY_DEF:")
  var formVal = this.form.value;
  
  formVal["RULE_KEY"] = "";
  this.form.reset(formVal)
  
  }
 
public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-rule-def-form ComponentConfig:",ComponentConfig);

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
	       this.isEnable = false;
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
        this.componentConfig.queryable  = false;
        this.componentConfig.navigable = false;
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      this.executeQuery(this.form)
		
	    }

	  }
  }


}


