import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { dashboardDef , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'DASHBOARD_ID' : new FormControl(dataItem.DASHBOARD_ID   ) ,
'DASHBOARD_NAME' : new FormControl(dataItem.DASHBOARD_NAME, Validators.required ) ,
'MODULE' : new FormControl(dataItem.MODULE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-dashboard-def-form',
  templateUrl: './adm-dashboard-def-form.component.html',
  styleUrls: ['./adm-dashboard-def-form.component.css']
})


export class AdmDashboardDefFormComponent {
  public title = "Dashboard Def";
  private insertCMD = "INSERT_ADM_DASHBOARD_DEF";
  private updateCMD = "UPDATE_ADM_DASHBOARD_DEF";
  private deleteCMD =   "DELETE_ADM_DASHBOARD_DEF";
  private getCMD = "GET_ADM_DASHBOARD_DEF_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;
  public  DSP_DASHBOARDConfig : componentConfigDef;

  public  form: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isDASHBOARD_IDEnable : boolean = true;
  private Body =[];

  private isNew: boolean;
  public dashboardOpened : boolean = false;
  public primarKeyReadOnlyArr = {isDASHBOARD_IDreadOnly : false}; 
  public paramConfig;
  private masterKeyArr = [];
  private masterKeyNameArr = [];
  public  masterKey="";
  public masterKeyName ="DASHBOARD_ID";
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
  
  private formInitialValues =   new dashboardDef();   
  
  @Input() public set executeQueryInput( form: any) {
    if ( (typeof form != "undefined") &&   (typeof form.DASHBOARD_ID != "undefined"))
    {
      this.isDASHBOARD_IDEnable = false;
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
    
    if (this.isNew == true){
        var getCMD = "GET_MAX_ADM_DASHBOARD_ID";
        var page = "&_query=" + getCMD  ;
        if (this.paramConfig.DEBUG_FLAG) console.log("page:" + page)
        page = encodeURI(page);

        this.starServices.fetch(this, page).subscribe(result => {
          if (this.paramConfig.DEBUG_FLAG) console.log("result:", result.data[0].data);
          if (result != null){
            //this.serverData = result.data[0].data;
            
            if (this.paramConfig.DEBUG_FLAG) console.log("result.data[0].data:",result.data[0].data)

            var formVal = this.form.value;
            formVal.DASHBOARD_ID = result.data[0].data[0].DASHBOARD_ID;
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

public userLang = "EN" ; 
public lookupArrDef =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='MODULE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrMODULE"}];

public lkpArrMODULE = [];

public lkpArrGetMODULE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrMODULE.find(x => x.CODE === CODE);
return rec;
}

onChanges(): void {
this.form.get('MODULE').valueChanges.subscribe(val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
});
}
  public dashboardClose(){
    this.dashboardOpened = false; 
  } 

public openTest(){
  var formVal = this.form.value;
  if ( formVal.DASHBOARD_ID == ""){
    this.starServices.showOkMsg(this,"Please select a Dashboard","Info");
    return;
  }

    this.dashboardOpened = true; 

    this.DSP_DASHBOARDConfig = new componentConfigDef();
    var masterParams ={
      DASHBOARD_ID : formVal.DASHBOARD_ID
    }
    this.DSP_DASHBOARDConfig.masterParams = masterParams;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_DASHBOARDConfig.masterParams:",this.DSP_DASHBOARDConfig.masterParams)
}
public printScreen(){
  window.print();
  
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {

    if (typeof ComponentConfig !== "undefined"){
	    if (this.paramConfig.DEBUG_FLAG) console.log("adm-dashboard-def-form ComponentConfig:",ComponentConfig);

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
	       this.isDASHBOARD_IDEnable = false;
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


