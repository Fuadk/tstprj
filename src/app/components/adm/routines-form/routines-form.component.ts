import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { starServices } from 'starlib';
import { routines , componentConfigDef} from '@modeldir/model';


 const createFormGroup = dataItem => new FormGroup({
'ROUTINE_NAME' : new FormControl(dataItem.ROUTINE_NAME  , Validators.required ) ,
'RTYPE' : new FormControl(dataItem.RTYPE ) ,
'PROGRAM' : new FormControl(dataItem.PROGRAM ) ,
'CHOICE' : new FormControl(dataItem.CHOICE ) ,
'ROUT_VER' : new FormControl(dataItem.ROUT_VER ) ,
'ROUTINE_DESC' : new FormControl(dataItem.ROUTINE_DESC ) ,
'HELP_FILE' : new FormControl(dataItem.HELP_FILE ) ,
'MODULE' : new FormControl(dataItem.MODULE ) ,
'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) 
});

declare function getParamConfig():any;

@Component({
  selector: 'app-routines-form',
  templateUrl: './routines-form.component.html',
  styleUrls: ['./routines-form.component.css']
})


export class RoutinesFormComponent {
  public title = "Routines";
  private insertCMD = "INSERT_ROUTINES";
  private updateCMD = "UPDATE_ROUTINES";
  private deleteCMD =   "DELETE_ROUTINES";
  private getCMD = "GET_ROUTINES_QUERY";

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
  public isChild: boolean = false ;
  private masterKey ="";
  public masterKeyName ="CHOICE";
    public  isCHOICEEnable : boolean = true;
  
  //@Input()  
  public paramConfig;  
  public primarKeyReadOnlyArr = {isROUTINEreadOnly : false};  
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
  
  private formInitialValues =   new routines();   
  
  @Input() public set executeQueryInput( form: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery_form object.form:");
    if (this.paramConfig.DEBUG_FLAG) console.log(form);

    if (form.CHOICE != "")
    {
      this.masterKey = form.CHOICE ;
      this.isCHOICEEnable = false;
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
    this.formInitialValues.CHOICE = this.masterKey; 
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

  public lkpArrRTYPE = 
  [
          {
            "CODE": "F",
            "CODETEXT_LANG": "Form"
          },
          {
            "CODE": "R",
            "CODETEXT_LANG": "Report"
          }
  ]

public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
  if (this.paramConfig.DEBUG_FLAG) console.log("routines ComponentConfig:");
  if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);


  if (typeof ComponentConfig !== "undefined"){
    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
    if ( ComponentConfig.masterSaved != null)
      {
        this.saveChanges(this.form);
        ComponentConfig.masterSaved  =null;
      }
      if ( ComponentConfig.masterKey != null)
      {
        this.isCHOICEEnable = false;
        this.masterKey = ComponentConfig.masterKey;
      }
      if ( ComponentConfig.isChild == true)
      {
        this.isChild = true;
        this.isCHOICEEnable = false;
        
      }

    }
  }

}


