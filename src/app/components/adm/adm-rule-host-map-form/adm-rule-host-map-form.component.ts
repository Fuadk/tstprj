import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { ruleHostMap , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'HOST_ID' : new FormControl(dataItem.HOST_ID  , Validators.required ) ,
'MAP_ID' : new FormControl(dataItem.MAP_ID  , Validators.required ) ,
'MAP_NAME' : new FormControl(dataItem.MAP_NAME  , Validators.required ) ,
'XSLT_SEND' : new FormControl(dataItem.XSLT_SEND ) ,
'XSLT_RECEIVE' : new FormControl(dataItem.XSLT_RECEIVE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-rule-host-map-form',
  templateUrl: './adm-rule-host-map-form.component.html',
  styleUrls: ['./adm-rule-host-map-form.component.css']
})


export class AdmRuleHostMapFormComponent {
  public title = "Rule Host Map";
  private insertCMD = "INSERT_ADM_RULE_HOST_MAP";
  private updateCMD = "UPDATE_ADM_RULE_HOST_MAP";
  private deleteCMD =   "DELETE_ADM_RULE_HOST_MAP";
  private getCMD = "GET_ADM_RULE_HOST_MAP_QUERY";

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
  public primarKeyReadOnlyArr = {isHOST_IDreadOnly : false , isMAP_IDreadOnly : false};  
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
  
  private formInitialValues =   new ruleHostMap();   
  
  @Input() public set executeQueryInput( form: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("executeQueryInput:form.HOST_ID:", form.HOST_ID )
    if ( (typeof form != "undefined") &&   (typeof form.HOST_ID != "undefined") && (form.HOST_ID != ""))
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
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

public userLang = "EN" ; 
public lookupArrDef =[];

onChanges(): void {
}


public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-rule-host-map-form ComponentConfig:",ComponentConfig);

	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
	    if (ComponentConfig.isMaster == true)
	     this.isMaster = true;
       if ( ComponentConfig.masterKey != null)
       {
          this.isHOST_IDEnable = false;
          this.masterKey = ComponentConfig.masterKey;
       }
 
	    if ( ComponentConfig.masterSaved != null)
	    {
	      this.saveChanges(this.form);
	      ComponentConfig.masterSaved  = null;
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


