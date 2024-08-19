import { Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { starServices } from 'starlib';
import { menus, componentConfigDef } from '@modeldir/model';


const createFormGroup = dataItem => new FormGroup({
  'MENU': new FormControl(dataItem.MENU, Validators.required),
  'MENU_TYPE': new FormControl(dataItem.MENU_TYPE),
  'CHOICE': new FormControl(dataItem.CHOICE),
  'TEXT': new FormControl(dataItem.TEXT),
  'AR_TEXT': new FormControl(dataItem.AR_TEXT),
  'LINE': new FormControl(dataItem.LINE),
  'LANGUAGE_NAME': new FormControl(dataItem.LANGUAGE_NAME),
  'EN_TEXT': new FormControl(dataItem.EN_TEXT),
  'FLEX_FLD1': new FormControl(dataItem.FLEX_FLD1),
  'FLEX_FLD2': new FormControl(dataItem.FLEX_FLD2),
  'FLEX_FLD3': new FormControl(dataItem.FLEX_FLD3),
  'FLEX_FLD4': new FormControl(dataItem.FLEX_FLD4),
  'FLEX_FLD5': new FormControl(dataItem.FLEX_FLD5),
  'CHOICE_TYPE': new FormControl(dataItem.CHOICE_TYPE),
  'FMODE': new FormControl(dataItem.FMODE)
});

declare function getParamConfig(): any;

@Component({
  selector: 'app-menus-form',
  templateUrl: './menus-form.component.html',
  styleUrls: ['./menus-form.component.css']
})


export class MenusFormComponent {
  public title = "Menus";
  private insertCMD = "INSERT_MENUS";
  private updateCMD = "UPDATE_MENUS";
  private deleteCMD = "DELETE_MENUS";
  private getCMD = "GET_MENUS_QUERY";

  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public active = false;

  public form: FormGroup;
  public PDFfileName = this.title + ".PDF";
  public componentConfig: componentConfigDef;
  private CurrentRec = 0;
  public executeQueryresult: any;
  private isSearch: boolean;
  private Body = [];

  private isNew: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;

  hideOthers = false

  //@Input()  
  public showToolBar = true;
  public paramConfig;
  public primarKeyReadOnlyArr = { isMENUreadOnly: false };
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
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form.reset(this.formInitialValues);
    this.isNew = true;
  }

  private formInitialValues = new menus();

  @Input() public set executeQueryInput(form: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery_form object.form:");
    if (this.paramConfig.DEBUG_FLAG) console.log(this.form);

    this.isSearch = true;
    this.starServices.executeQuery_form(form, this);
  }
  public executeQuery(form: any): void {
    this.starServices.executeQuery_form(form, this);
  }

  private addToBody(NewVal) {
    this.Body.push(NewVal);
  }

  public onCancel(e): void {
    this.starServices.onCancel_form(e, this);
  }

  public onNew(e): void {
    this.starServices.onNew_form(e, this);
  }

  public onRemove(form): void {
    this.starServices.onRemove_form(form, this);
  }

  public enterQuery(form: any): void {

    this.starServices.enterQuery_form(form, this);
  }

  public saveChanges(form: any): void {
    this.Body = [];
    this.starServices.saveChanges_form(form, this);
  }

  public goRecord(target: any): void {
    this.starServices.goRecord(target, this);
  }

  public userLang = "EN";
  public lookupArrDef = [
    {
      "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='MENUTYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "columns": [{ "column": "CODE" }, { "column": "CODETEXT_LANG" }],
      "lkpArrName": "lkpArrTYPE"

    },
    {
      "statment": "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='LANGUAGE' and PARTCODE =0 and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG  ",
      "columns": [{ "column": "CODE" }, { "column": "CODETEXT_LANG" }],
      "lkpArrName": "lkpArrLANGUAGE"

    }
  ];
  public lkpArrTYPE = [];
  public lkpArrLANGUAGE = [];


  public lkpArrMENU_TYPE =
    [
      {
        "CODE": "M",
        "CODETEXT_LANG": "Menu"
      },
      {
        "CODE": "R",
        "CODETEXT_LANG": "Routine_name"
      }
    ]

  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.isMaster == true)
        this.isMaster = true;

      if (ComponentConfig.masterParams != null) {
        this.hideOthers = ComponentConfig.masterParams.hideOthers
        if (this.hideOthers) {
          this.isChild = false
          this.isSearch = true
        }
      }
    }
  }



}


