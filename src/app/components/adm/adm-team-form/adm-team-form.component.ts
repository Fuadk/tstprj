import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { team ,WeekDate, componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'TEAM' : new FormControl(dataItem.TEAM  , Validators.required ) ,
'FULLNAME' : new FormControl(dataItem.FULLNAME ) ,
'DIV' : new FormControl(dataItem.DIVS ) ,
'DEPT' : new FormControl(dataItem.DEPT ) ,
'PHONE' : new FormControl(dataItem.PHONE ) ,
'DEFAULT_PRINTER' : new FormControl(dataItem.DEFAULT_PRINTER ) ,
'NOTES' : new FormControl(dataItem.NOTES ) 
});
const createFormGroupWeek = dataItem => new FormGroup({
  'WEEK_DATE' : new FormControl(dataItem.WEEK_DATE ) 
  });
declare function getParamConfig():any;

@Component({
  selector: 'app-adm-team-form',
  templateUrl: './adm-team-form.component.html',
  styleUrls: ['./adm-team-form.component.css']
})


export class AdmTeamFormComponent {
  public title = "Teams";
  private insertCMD = "INSERT_ADM_TEAM";
  private updateCMD = "UPDATE_ADM_TEAM";
  private deleteCMD =   "DELETE_ADM_TEAM";
  private getCMD = "GET_ADM_TEAM_QUERY";

  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;
  
  public  form: FormGroup; 
  public  formWeek: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch: boolean;
  private Body =[];

  private isNew: boolean;
  public componentConfig: componentConfigDef;
  public primarKeyReadOnlyArr = {isTEAMreadOnly: false};
  public paramConfig;  
  public wrapStyle = "wrap";
  //public divWidth ="900px !important";
  public divWidth ="100%";
  public WEEKShow: boolean = false;
  //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() setParamsOutput: EventEmitter<any> = new EventEmitter();

 public userLang = "EN" ;
  public lookupArrDef =[   
    {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
      "lkpArrName":"lkpArrDEPT"

    }       
  ];
  
  public lkpArrDEPT = [];

  
  constructor(public starServices: starServices) {
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef(); 
  }
  private formInitialValuesWeeks =   new WeekDate();
  private formInitialValues =   new team();
  
  
     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVTEAM' );
    this.form = createFormGroup(
        this.formInitialValues
    );
    
    //this.formInitialValuesWeeks.WEEK_DATE = null;
    this.formWeek = createFormGroupWeek(
      this.formInitialValuesWeeks
  );

    //this.executeQuery (this.form);
    this.onChanges();
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    //this.formWeek.reset(this.formInitialValuesWeeks);
    this.isNew = true;
    }
    
    public lkpArrDIV = [];
    onChanges(): void {
     /* this.form.get('DIV').valueChanges.subscribe(val => {
        if (this.paramConfig.DEBUG_FLAG) console.log("DIV valu changed")
        //var formVal = this.form.value;
        this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
        "lkpArrName":"lkpArrDIV"}];
       this.starServices.fetchLookups(this, this.lookupArrDef);
      });*/

      this.form.get('DEPT').valueChanges.subscribe(val => {
        if (this.paramConfig.DEBUG_FLAG) console.log("DEPT valu changed")
        //var formVal = this.form.value;
        this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'  and CODEVALUE_LANG = '" + val + "' ",
        "lkpArrName":"lkpArrDIV"}];
       this.starServices.fetchLookups(this, this.lookupArrDef);
      });

      this.formWeek.get('WEEK_DATE').valueChanges.subscribe(val => {
        var valueDate:Date = null;
        if (val != null)
        {
          if (this.paramConfig.DEBUG_FLAG) console.log("changes:WEEK_DATE valu changed:", val)
          valueDate = this.starServices.getFirstWeekDay(this, val);
        }
          var masterParams={
            "WEEK_DATE" : valueDate
          };
          if (this.paramConfig.DEBUG_FLAG) console.log("changes:masterParams:", masterParams)
          this.setParamsOutput.emit(masterParams);
      });
    }
     
  
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
    if (this.paramConfig.DEBUG_FLAG) console.log("this.formInitialValuesWeeks:", this.formInitialValuesWeeks)
   // this.formWeek.reset(this.formInitialValuesWeeks);
  }

  public onNew(e): void {
    this.starServices.onNew_form ( e , this);
  }

  public onRemove( form): void {
    this.starServices.onRemove_form(form,this);
  }

  public enterQuery (form : any): void{
    
    this.starServices.enterQuery_form ( form, this);
    if (this.paramConfig.DEBUG_FLAG) console.log("this.formInitialValuesWeeks:", this.formInitialValuesWeeks)
   //this.formWeek.reset(this.formInitialValuesWeeks);

    
  }

  public saveChanges( form: any): void {
    this.Body = []; 
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:", ComponentConfig);
        this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      //if (ComponentConfig.isMaster == true)
      //   this.isMaster = true;
    }
  } 
  
}


