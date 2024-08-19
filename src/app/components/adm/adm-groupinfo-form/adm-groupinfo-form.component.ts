import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { groupinfo   , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'GROUPNAME' : new FormControl(dataItem.GROUPNAME  , Validators.required ) ,
'FULLNAME' : new FormControl(dataItem.FULLNAME ) ,
'DEFAULT_PRINTER' : new FormControl(dataItem.DEFAULT_PRINTER ) ,
'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-groupinfo-form',
  templateUrl: './adm-groupinfo-form.component.html',
  styleUrls: ['./adm-groupinfo-form.component.css']
})


export class AdmGroupinfoFormComponent {
  public title = "Group info";
  private insertCMD = "INSERT_ADM_GROUPINFO";
  private updateCMD = "UPDATE_ADM_GROUPINFO";
  private deleteCMD =   "DELETE_ADM_GROUPINFO";
  private getCMD = "GET_ADM_GROUPINFO_QUERY";

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
  
  public paramConfig;  
  public primarKeyReadOnlyArr = {isGROUPNAMEreadOnly : false};  
  
  //@Input()  
  public showToolBar = true;
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
    }
  
  private formInitialValues =   new groupinfo();   
  
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
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
        this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      if (ComponentConfig.isMaster == true)
      this.isMaster = true;
    }
  }  

}


