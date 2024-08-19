import { Component, OnInit, Output, Input, EventEmitter, HostListener} from '@angular/core';
import { ruleDef  ,ruleItem ,ruleAction , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;


@Component({
  
  selector: 'app-adm-rules',
  templateUrl: './adm-rules.component.html',
  styleUrls: ['./adm-rules.component.css']
})
export class AdmRulesComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = true;
  public paramConfig; 
  public title = "Rule Def";
  public routineAuth=null;


  public componentConfig: componentConfigDef;

  public form_ADM_RULE_DEF : ruleDef;
  public grid_ADM_RULE_ITEM : ruleItem;
  public grid_ADM_RULE_ACTION : ruleAction;

  public  ADM_RULE_DEFFormConfig : componentConfigDef;
  public  ADM_RULE_LOGGridConfig : componentConfigDef;
  
  public  ADM_RULE_ITEMGridConfig : componentConfigDef;
  public  ADM_RULE_ACTIONGridConfig : componentConfigDef;
  public PDFfileName = this.title + ".PDF";
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMRULES' );

    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file
   this.form_ADM_RULE_DEF = new ruleDef(); 
   this.ADM_RULE_DEFFormConfig = new componentConfigDef();
   this.ADM_RULE_DEFFormConfig.isMaster = true;
//   this.ADM_RULE_DEFFormConfig.routineAuth = this.routineAuth;
//   this.ADM_RULE_DEFFormConfig.showToolBar = false;

   this.grid_ADM_RULE_ITEM = new ruleItem ();
   
   this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
   this.ADM_RULE_ITEMGridConfig.isChild = true;
//   this.ADM_RULE_ITEMGridConfig.routineAuth = this.routineAuth;
//   this.ADM_RULE_ITEMGridConfig.showToolBar = false;
   this.ADM_RULE_ITEMGridConfig.gridHeight = 200;

   this.grid_ADM_RULE_ACTION = new ruleAction ();
   
   this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
   this.ADM_RULE_ACTIONGridConfig.isChild = true;
   this.ADM_RULE_ACTIONGridConfig.routineAuth = this.routineAuth;
//   this.ADM_RULE_ACTIONGridConfig.showToolBar = false;
   this.ADM_RULE_ACTIONGridConfig.gridHeight = "100%";

  }
  public readCompletedHandler( form_ADM_RULE_DEF) {
    //Adjust nexr keys manually for ADM_RULE_ITEM	
    var masterKeyArr = [form_ADM_RULE_DEF.MODULE,form_ADM_RULE_DEF.RULE_ID];
    var masterKeyNameArr = ["MODULE","RULE_ID"];

    this.grid_ADM_RULE_ITEM = new ruleItem();
    for (var i = 0; i< masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.grid_ADM_RULE_ITEM[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
    this.ADM_RULE_ITEMGridConfig.masterKeyArr =  masterKeyArr;
    this.ADM_RULE_ITEMGridConfig.masterKeyNameArr =  masterKeyNameArr;
    this.ADM_RULE_ITEMGridConfig.masterParams =  form_ADM_RULE_DEF;

/////////////////////////
    //Adjust nexr keys manually for ADM_RULE_ACTION	
    var masterKeyArr = [form_ADM_RULE_DEF.MODULE,form_ADM_RULE_DEF.RULE_ID];
    var masterKeyNameArr = ["MODULE","RULE_ID"];

    this.grid_ADM_RULE_ACTION = new ruleAction();
    for (var i = 0; i< masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.grid_ADM_RULE_ACTION[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
    this.ADM_RULE_ACTIONGridConfig.masterKeyArr = masterKeyArr;
    //Adjust nexr keys manually
    this.ADM_RULE_ACTIONGridConfig.masterKeyNameArr =  masterKeyNameArr;

  }
  public clearCompletedHandler( form_ADM_RULE_DEF) {
    this.grid_ADM_RULE_ITEM = new  ruleItem();
    this.grid_ADM_RULE_ACTION = new  ruleAction();

  }

    public saveCompletedHandler( form_ADM_RULE_DEF) {
      if (this.paramConfig.DEBUG_FLAG) console.log("form_ADM_RULE_DEF:",form_ADM_RULE_DEF)
    this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
    this.ADM_RULE_ITEMGridConfig.masterSaved = form_ADM_RULE_DEF;
    this.ADM_RULE_ITEMGridConfig.masterKey =  form_ADM_RULE_DEF.MODULE;

    this.ADM_RULE_ITEMGridConfig.masterKeyArr =  [form_ADM_RULE_DEF.MODULE,form_ADM_RULE_DEF.RULE_ID];
    this.ADM_RULE_ITEMGridConfig.masterKeyNameArr =  ["MODULE","RULE_ID"];
    this.ADM_RULE_ITEMGridConfig.masterParams =  form_ADM_RULE_DEF;

    this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
    this.ADM_RULE_ACTIONGridConfig.masterSaved = form_ADM_RULE_DEF;
    this.ADM_RULE_ACTIONGridConfig.masterKey =  form_ADM_RULE_DEF.MODULE;

    //Adjust nexr keys manually	
    this.ADM_RULE_ACTIONGridConfig.masterKeyArr =  [form_ADM_RULE_DEF.MODULE,form_ADM_RULE_DEF.RULE_ID];
    this.ADM_RULE_ACTIONGridConfig.masterKeyNameArr =  ["MODULE","RULE_ID"];
    this.ADM_RULE_ACTIONGridConfig.masterParams =  form_ADM_RULE_DEF;
  }
  @Input() public set detail_Input(form: any) {
    //if (this.paramConfig.DEBUG_FLAG) console.log("epm_lgc detail_Input:", form)
    if (typeof form !== "undefined")
    {
        this.form_ADM_RULE_DEF = new ruleDef(); 
        this.form_ADM_RULE_DEF = form;
    }

  }

  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("adm rules ComponentConfig:",ComponentConfig);
    if (typeof ComponentConfig !== "undefined"){
	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      if (ComponentConfig.masterSaved != null)
      {
        this.ADM_RULE_DEFFormConfig = new componentConfigDef();
        this.ADM_RULE_DEFFormConfig.masterSaved = ComponentConfig.masterSaved;

        this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
        this.ADM_RULE_ITEMGridConfig.masterSaved = ComponentConfig.masterSaved;
        if (this.paramConfig.DEBUG_FLAG) console.log("1 epm lgc ComponentConfig:",this.ADM_RULE_ITEMGridConfig );

        this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
        this.ADM_RULE_ACTIONGridConfig.masterSaved = ComponentConfig.masterSaved;
      }
      if (ComponentConfig.clearScreen == true)
      {
        this.ADM_RULE_DEFFormConfig = new componentConfigDef();
        this.ADM_RULE_DEFFormConfig.clearScreen = ComponentConfig.clearScreen;
        this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
        this.ADM_RULE_ITEMGridConfig.clearScreen = ComponentConfig.clearScreen;
        if (this.paramConfig.DEBUG_FLAG) console.log("2 epm lgc ComponentConfig:",this.ADM_RULE_ITEMGridConfig );
        this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
        this.ADM_RULE_ACTIONGridConfig.clearScreen = ComponentConfig.clearScreen;
      }
      
      if ((ComponentConfig.masterKeyArr != null) && (ComponentConfig.masterKeyNameArr != null) )
      {
        if ((ComponentConfig.masterKeyArr.length != 0) && (ComponentConfig.masterKeyNameArr.length != 0) )
        {
          this.ADM_RULE_DEFFormConfig = new componentConfigDef();
          this.ADM_RULE_DEFFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.ADM_RULE_DEFFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;

          this.ADM_RULE_ITEMGridConfig = new componentConfigDef();
          this.ADM_RULE_ITEMGridConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.ADM_RULE_ITEMGridConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
          if (this.paramConfig.DEBUG_FLAG) console.log("3 epm lgc ComponentConfig:",this.ADM_RULE_ITEMGridConfig );
          
          this.ADM_RULE_ACTIONGridConfig = new componentConfigDef();
          this.ADM_RULE_ACTIONGridConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.ADM_RULE_ACTIONGridConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
          
        }


      }
      if (ComponentConfig.masterParams != null) {
        let masterParams = ComponentConfig.masterParams;
        

         this.ADM_RULE_DEFFormConfig = new componentConfigDef();
         this.ADM_RULE_DEFFormConfig.formattedWhere = masterParams.formattedWhere_rule;

         this.ADM_RULE_LOGGridConfig = new componentConfigDef();
         this.ADM_RULE_LOGGridConfig.formattedWhere = masterParams.formattedWhere_ruleLog;

         
      }
    }
  }

}
