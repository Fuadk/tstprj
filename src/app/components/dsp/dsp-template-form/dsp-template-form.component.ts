

import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { starServices } from 'starlib';
import { Template ,  componentConfigDef} from '@modeldir/model';


const createFormGroup = (dataItem:any) => new FormGroup({
  'TEMPLATE_NAME' : new FormControl(dataItem.TEMPLATE_NAME  , Validators.required) ,
  'ORDER_TYPE' : new FormControl(dataItem.ORDER_TYPE , Validators.required) ,
  'TEMPLATE_OWNER' : new FormControl(dataItem.TEMPLATE_OWNER ) ,
  'DAYS' : new FormControl(dataItem.DAYS ) ,
  'DEPT' : new FormControl(dataItem.DEPT ) ,
  'DIV' : new FormControl(dataItem.DIVS ) ,
  'ASSIGNEE_TYPE' : new FormControl(dataItem.ASSIGNEE_TYPE ) ,
  'ASSIGNEE' : new FormControl(dataItem.ASSIGNEE ) ,

  'PARENT_ORDER_TYPE' : new FormControl(dataItem.PARENT_ORDER_TYPE ) ,
  'DESCRIPTION' : new FormControl(dataItem.DESCRIPTION ) ,
  'FORM_NAME' : new FormControl(dataItem.FORM_NAME ) ,
  'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
  'LOGNAME' : new FormControl(dataItem.LOGNAME )
       });
declare function getParamConfig():any;

@Component({
  selector: 'app-dsp-template-form',
  templateUrl: './dsp-template-form.component.html',
  styleUrls: ['./dsp-template-form.component.css']
})


export class DspTemplateFormComponent {
  public title = "Order Template";
  private insertCMD = "INSERT_DSP_TEMPLATE";
  private updateCMD = "UPDATE_DSP_TEMPLATE";
  private deleteCMD = "DELETE_DSP_TEMPLATE";
  private getCMD = "GET_DSP_TEMPLATE_QUERY";
  public  multiStepFormOpened : boolean = false;
  public fieldGridHeight = 400;
  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public  form!: FormGroup; 
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  public  DSP_MULTISTEPFormConfig : componentConfigDef;
  private CurrentRec = 0;
  public  executeQueryresult:any;
  private isSearch!: boolean;
  private Body:any =[];
  
  private isNew!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isAsigneeTypeReadOnly: boolean = false;
  public isAsigneeReadOnly: boolean = false;
  public primarKeyReadOnlyArr = {isTEMPLATE_NAMEreadOnly: false};
  public  fieldsOpened : boolean = false;  
  
  public paramConfig;

    //@Input()  
  public showToolBar = true;
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() copiedTemplateOutput: EventEmitter<any> = new EventEmitter();

  saveTemplateCopyObs: EventEmitter<any> = new EventEmitter<any>()
  
  showClone = false
  copyTemplateOpened = false
  copyTemplateName
  isLoading = false
  
  constructor(public starServices: starServices, public dialogService: DialogService) {
    this.paramConfig = getParamConfig();
    if (this.paramConfig.DEBUG_FLAG) console.log("this.paramConfig:",this.paramConfig)
    this.componentConfig = new componentConfigDef(); 
    this.DSP_MULTISTEPFormConfig = new componentConfigDef();
    this.DSP_MULTISTEPFormConfig.gridHeight =  this.fieldGridHeight;    
    }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVTEMP' );
    //this.formInitialValues.ASSIGNEE_TYPE = "TEAM";
    //this.formInitialValues.ASSIGNEE = this.paramConfig.USER_INFO.TEAM;

    
    this.form = createFormGroup(
        this.formInitialValues
    );

    //this.executeQuery (this.form);
    this.onChanges();
    
    var lkpArrASSIGNEEDef=	  {"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG FROM ADM_TEAM WHERE DEPT = '" 
    + this.paramConfig.USER_INFO.DEPT + "'  and DIVS = '" + this.paramConfig.USER_INFO.DIVS + "' ",
      "lkpArrName":"lkpArrASSIGNEE"}
      ;
    this.lookupArrDef.push(lkpArrASSIGNEEDef);

    this.starServices.fetchLookups(this, this.lookupArrDef);
    //this.formInitialValues.ASSIGNEE_TYPE = "TEAM";
    //this.formInitialValues.ASSIGNEE = this.paramConfig.USER_INFO.TEAM;

    this.form.reset(this.formInitialValues);
    this.isNew = true;

    this.readCompletedOutput.subscribe(() => this.showClone = true)
    this.saveTemplateCopyObs.subscribe((gridData) => {
      this.saveGridDataToTemplate(gridData)
    })
  }
  
   private formInitialValues:any =   new Template();
 
  @Input() public set executeQueryInput( form: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery_form object.form:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.form);

    this.isSearch = true;
    this.starServices.executeQuery_form( form, this);
  }    
  public  executeQuery( form: any ): void {
    this.starServices.executeQuery_form( form, this);
  }

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }
  public lkpArrDIV = [];
  onChanges(): void {
    /*
    //@ts-ignore: Object is possibly 'null'.
this.form.get('DEPT').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("DEPT valu changed")
      //var formVal = this.form.value;
      this.lookupArrDef =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DIV' and LANGUAGE_NAME = '" + this.userLang + "'   and CODEVALUE_LANG = '" + val + "' order by CODETEXT_LANG ",
      "lkpArrName":"lkpArrDIV"}];
     this.starServices.fetchLookups(this, this.lookupArrDef);
    });
*/
  
    //@ts-ignore: Object is possibly 'null'.
this.form.get('ASSIGNEE_TYPE').valueChanges.subscribe(val => {
      if (this.paramConfig.DEBUG_FLAG) console.log("ASSIGNEE_TYPE value changed")
	    var formVal = this.form.value;
      if (this.paramConfig.DEBUG_FLAG) console.log("formVal:")
      if (this.paramConfig.DEBUG_FLAG) console.log(formVal)
      if (val == "TEAM"){
        this.lookupArrDef =[	{"statment":"SELECT TEAM  CODE, FULLNAME CODETEXT_LANG FROM ADM_TEAM WHERE DEPT = '" + formVal.DEPT + "'  and DIVS = '" + formVal.DIV + "' ",
        "lkpArrName":"lkpArrASSIGNEE"}];
        this.starServices.fetchLookups(this, this.lookupArrDef);
      }
      else if (val == "PERSON"){
        //this.lookupArrDef =[	{"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG FROM ADM_USER_INFORMATION WHERE DEPT = '" + formVal.DEPT + "'  and DIVS = '" + formVal.DIV + "' ",
        this.lookupArrDef =[	{"statment":"SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG FROM ADM_USER_INFORMATION ",
        "lkpArrName":"lkpArrASSIGNEE"}];
        this.starServices.fetchLookups(this, this.lookupArrDef);
      }
    });
    

  }

  public onCancel(e:any): void {
    this.starServices.onCancel_form ( e , this);
    this.showClone = false
  }

  public onNew(e:any): void {
    this.formInitialValues.ASSIGNEE_TYPE = "TEAM";
    this.formInitialValues.ASSIGNEE = this.paramConfig.USER_INFO.TEAM;
    this.starServices.onNew_form ( e , this);
  }

  public onRemove( form:any): void {
    if (form.value.TEMPLATE_OWNER != "" && this.paramConfig.USER_INFO.USERNAME.toUpperCase() != form.value.TEMPLATE_OWNER.toUpperCase()) {
      this.starServices.showOkMsg(this, "You are not the owner of this template", "Error");
      return;
    }
    
    // this.Body = []
    // this.addToBody({
    //   "_QUERY": "DELETE_DSP_TEMPLATE_DETAIL",
    //   "TEMPLATE_NAME": form.value["TEMPLATE_NAME"],
    //   "SEQUENCE_NAME": "%"
    // })

    // // this.starServices.post(this, "&_trans=Y", this.Body).subscribe(() => {})
    this.starServices.onRemove_form(form, this);
  }

  public enterQuery (form : any): void{
    this.starServices.enterQuery_form ( form, this);
  }

  get f():any { return this.form.controls; }
  public  submitted =  false;

  public saveChanges( form: any): void {
    this.Body = []; 
    
    //console.log("this.paramConfig.USER_INFO.USERNAME:", this.paramConfig.USER_INFO.USERNAME,"form.value..TEMPLATE_OWNER:", form.value.TEMPLATE_OWNER, " x");
      if (form.value.TEMPLATE_OWNER == "")
        form.value.TEMPLATE_OWNER = this.paramConfig.USER_INFO.USERNAME;

      if (this.paramConfig.USER_INFO.USERNAME.toUpperCase() != form.value.TEMPLATE_OWNER.toUpperCase()) {
        this.starServices.showOkMsg(this, "You are not the owner of this template", "Error");
        return;
      }
    this.starServices.saveChanges_form ( form, this);
  }

  public goRecord ( target:any): void{
    this.starServices.goRecord ( target, this);
  }
 
  public printScreen(){
  window.print();
}
public multiStepFormClose(){
  this.multiStepFormOpened = false; 
}
public showMultiStepForm(mode){

  var orderFields = "[]";
  var formVal = this.form.value;
  if (formVal.FORM_NAME != ""){

    var formPagesNo = "";
    if (mode == 1)
    formPagesNo = "" + formVal.PAGE_NO;
    
    var masterParams={
      "formName" : formVal.FORM_NAME,
      "formPagesNo" : formPagesNo, 
      "orderFields" : orderFields
      };
      if (this.paramConfig.DEBUG_FLAG) console.log("test:masterParams:", masterParams);
      this.DSP_MULTISTEPFormConfig = new componentConfigDef();
      this.DSP_MULTISTEPFormConfig.masterParams = masterParams;
      this.multiStepFormOpened = true;
    }
}
public savemultiStepFormCompletedHandler(DSP_MULTISTEP){
this.multiStepFormOpened = false; 
}

  
  public userLang = "EN" ; 
public lookupArrDef:any =[	{"statment":"SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ORDER_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
			"lkpArrName":"lkpArrORDER_TYPE"},
	{"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='DEPT' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "lkpArrName":"lkpArrDEPT"},
 {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='ASSIGNEE_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "lkpArrName":"lkpArrASSIGNEE_TYPE"},
      {"statment":"SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='FORM_NAME' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "lkpArrName":"lkpArrFORM_NAME"}

];

  public lkpArrORDER_TYPE = [];
  public lkpArrDEPT = [];

  public lkpArrASSIGNEE_TYPE = [];
  public lkpArrASSIGNEE = [];
  public lkpArrFORM_NAME = [];

  public lkpArrGetORDER_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrORDER_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
    }
    
    
  public lkpArrGetDEPT(CODE: any): any {

  // Change x.CODE below if not from SOM_TABS_CODE
  var rec = this.lkpArrDEPT.find((x:any) => x.CODE === CODE);
  return rec;
  }
  
  public lkpArrGetASSIGNEE_TYPE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrASSIGNEE_TYPE.find((x:any) => x.CODE === CODE);
    return rec;
    }
 
    public lkpArrGetFORM_NAME(CODE: any): any {
      // Change x.CODE below if not from SOM_TABS_CODE
      var rec = this.lkpArrFORM_NAME.find((x:any) => x.CODE === CODE);
      return rec;
      }

          
    public lkpArrGetASSIGNEE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrASSIGNEE.find((x:any) => x.CODE === CODE);
    return rec;
    }
    
    @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
      if (typeof ComponentConfig !== "undefined"){
        if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
        if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
          this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
        if (ComponentConfig.isMaster == true)
        this.isMaster = true;
      }
    }
  
    
  copyTemplate() {
    if (this.copyTemplateName != "") {
      this.isLoading = true
      this.copiedTemplateOutput.emit(this.saveTemplateCopyObs)
    }
  }
  
  saveGridDataToTemplate(data) {
    this.Body = []
    this.addToBody({
      "_QUERY": "INSERT_DSP_TEMPLATE",
      "TEMPLATE_NAME": this.copyTemplateName,
      "ORDER_TYPE": this.form.value["ORDER_TYPE"],
      "DEPT": this.form.value["DEPT"],
      "DIV": this.form.value["DIV"],
      "ASSIGNEE_TYPE": this.form.value["ASSIGNEE_TYPE"],
      "ASSIGNEE": this.form.value["ASSIGNEE"],
      "PARENT_ORDER_TYPE": this.form.value["PARENT_ORDER_TYPE"],
      "DESCRIPTION": this.form.value["DESCRIPTION"],
      "SCREEN_TYPE": this.form.value["SCREEN_TYPE"],
      "FORM_NAME": this.form.value["FORM_NAME"],
      "FORM_USAGE": this.form.value["FORM_USAGE"],
      "DAYS": this.form.value["DAYS"],
      "LOGDATE": this.form.value["LOGDATE"],
      "LOGNAME": this.form.value["LOGNAME"]
    })

    this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
      this.Body = []

      this.Body = data.data.map((f: any) => {
        f._QUERY = "INSERT_DSP_TEMPLATE_DETAIL"
        f.TEMPLATE_NAME = this.copyTemplateName
        return f
      })

      this.starServices.post(this, "&_trans=Y", this.Body).subscribe(res => {
        this.copyTemplateOpened = false
        this.isLoading = false
        
        this.form.reset({
          TEMPLATE_NAME: this.copyTemplateName
        })
        this.CurrentRec = 0;

        this.executeQuery(this.form.value)
        this.copyTemplateName = null
      })
    }, err => {
      this.isLoading = false

      this.dialogService.open({
        title: "Field already exists",
        content: "Template name already exists please select another!",
        actions: [
          { text: 'Ok', primary: true }
        ],
        width: 450,
        height: 200,
        minWidth: 250
      })
    })  
  }

  openCopyDialog() {
    this.copyTemplateOpened = true
    this.copyTemplateName = `${this.form.value["TEMPLATE_NAME"]}_Copy`
  }
}
