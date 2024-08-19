import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { queryDef , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'QUERY_ID' : new FormControl(dataItem.QUERY_ID ) ,
'QUERY_NAME' : new FormControl(dataItem.QUERY_NAME ) ,
'QUERY_TYPE' : new FormControl(dataItem.QUERY_TYPE ) ,
'MODULE' : new FormControl(dataItem.MODULE ) ,
'SELECT_CLAUSE' : new FormControl(dataItem.SELECT_CLAUSE ) ,
'FROM_CLAUSE' : new FormControl(dataItem.FROM_CLAUSE ) ,
'WHERE_CLAUSE' : new FormControl(dataItem.WHERE_CLAUSE ) ,
'WHERE_MAND_CLAUSE' : new FormControl(dataItem.WHERE_MAND_CLAUSE ) ,
'GROUP_ORDER_BY_CLAUSE' : new FormControl(dataItem.GROUP_ORDER_BY_CLAUSE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 

});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-query-def-form',
  templateUrl: './adm-query-def-form.component.html',
  styleUrls: ['./adm-query-def-form.component.css']
})

export class AdmQueryDefFormComponent {
  public title = "Query Def";
  private insertCMD = "INSERT_ADM_QUERY_DEF";
  private updateCMD = "UPDATE_ADM_QUERY_DEF";
  private deleteCMD =   "DELETE_ADM_QUERY_DEF";
  private getCMD = "GET_ADM_QUERY_DEF_QUERY";

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
  public  isQUERY_IDEnable : boolean = true;
  private Body =[];

  private isNew: boolean;
  public paramConfig;
  public primarKeyReadOnlyArr = {isQUERY_IDreadOnly : false};  
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="QUERY_ID";
  public formattedWhere = null;  
  public  submitted =  false;
  public  DSP_REPORTSConfig : componentConfigDef;
  public  DSP_CHARTConfig : componentConfigDef;
  
  
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
    this.starServices.actOnParamConfig(this, 'SOMQRYDEF' );
    this.form = createFormGroup(
        this.formInitialValues
    );
    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;

  }
  
  private formInitialValues =   new queryDef();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.QUERY_ID != "undefined"))
    {
      this.isQUERY_IDEnable = false;
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

    for (var key in formVal) {
      if (this.paramConfig.DEBUG_FLAG) console.log(key);
      if (this.paramConfig.DEBUG_FLAG) console.log(formVal[key]);
      var fieldName = key;
      var fieldVal = formVal[key];
      if (this.paramConfig.DEBUG_FLAG) console.log("fieldVal:",fieldVal)
      if (typeof fieldVal === 'string' )
         fieldVal =  fieldVal.split("\n").join(" ");
      formVal[fieldName] = fieldVal;
    }
    this.form.reset(formVal)
  
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='QUERY_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "lkpArrName":"lkpArrQUERY_TYPE"},
      {"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='MODULE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "lkpArrName":"lkpArrMODULE"}
    ];
      

public lkpArrQUERY_TYPE = [];
public lkpArrMODULE = [];

public lkpArrGetQUERY_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrQUERY_TYPE.find(x => x.CODE === CODE);
return rec;
}
public lkpArrGetMODULE(CODE: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrMODULE.find(x => x.CODE === CODE);
  return rec;
  }


onChanges(): void {
this.form.get('QUERY_ID').valueChanges.subscribe(val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
}

public reportOpened : boolean = false;
  public reportClose(){
    this.reportOpened = false; 
  } 
  public chartOpened : boolean = false;
  public chartClose(){
    this.chartOpened = false; 
  } 

public openTest(){
    if ( this.form.value.QUERY_TYPE == "REPORT"){

      this.reportOpened = true; 

      this.DSP_REPORTSConfig = new componentConfigDef();
      var formVal = this.form.value;
      this.DSP_REPORTSConfig.masterParams = formVal;
      if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_REPORTSConfig.masterParams:",this.DSP_REPORTSConfig.masterParams)
    }
    else
    if ( this.form.value.QUERY_TYPE == "CHART"){

      this.chartOpened = true; 

      this.DSP_CHARTConfig = new componentConfigDef();
      var formVal = this.form.value;
      var masterParams = {
        name : formVal.QUERY_NAME,
        type : "column",
        width : 400,
        height : 400,
        queryID : formVal.QUERY_ID,
        chartOrder : 1,
        showParams : true
      }
      this.DSP_CHARTConfig.masterParams = masterParams;
      if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_CHARTConfig.masterParams:",this.DSP_CHARTConfig.masterParams)
    }
  }

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-query-def-form ComponentConfig:",ComponentConfig);

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
	       this.isQUERY_IDEnable = false;
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


