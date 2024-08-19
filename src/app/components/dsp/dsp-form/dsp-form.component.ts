import { Component, OnInit, Output, Input, EventEmitter, HostListener} from '@angular/core';
import { formPage  ,formArea ,formFields , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;


@Component({
  
  selector: 'app-dsp-form',
  templateUrl: './dsp-form.component.html',
  styleUrls: ['./dsp-form.component.css']
})
export class DspFormComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = true;
  public paramConfig; 
  public title = "Form Page";
  public routineAuth=null;


  public componentConfig: componentConfigDef;

  public form_DSP_FORM_PAGE : formPage;
  public grid_DSP_FORM_AREA : formArea;
  public grid_DSP_FORM_FIELDS : formFields;

  public  DSP_FORM_PAGEFormConfig : componentConfigDef;
  public  DSP_FORM_AREAGridConfig : componentConfigDef;
  public  DSP_FORM_FIELDSGridConfig : componentConfigDef;
  public PDFfileName = this.title + ".PDF";
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVFORM' );

    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file
   this.form_DSP_FORM_PAGE = new formPage(); 
   this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
   this.DSP_FORM_PAGEFormConfig.isMaster = true;
//   this.DSP_FORM_PAGEFormConfig.routineAuth = this.routineAuth;
//   this.DSP_FORM_PAGEFormConfig.showToolBar = false;

   this.grid_DSP_FORM_AREA = new formArea ();
   
   this.DSP_FORM_AREAGridConfig = new componentConfigDef();
   this.DSP_FORM_AREAGridConfig.isChild = true;
//   this.DSP_FORM_AREAGridConfig.routineAuth = this.routineAuth;
//   this.DSP_FORM_AREAGridConfig.showToolBar = false;
   this.DSP_FORM_AREAGridConfig.gridHeight = 250;

   this.grid_DSP_FORM_FIELDS = new formFields ();
   
   this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
   this.DSP_FORM_FIELDSGridConfig.isChild = true;
   this.DSP_FORM_FIELDSGridConfig.routineAuth = this.routineAuth;
//   this.DSP_FORM_FIELDSGridConfig.showToolBar = false;
   this.DSP_FORM_FIELDSGridConfig.gridHeight = 250;

  }
  public readCompletedHandler( form_DSP_FORM_PAGE) {
    //Adjust nexr keys manually for DSP_FORM_AREA	
    var masterKeyArr = [form_DSP_FORM_PAGE.FORM_NAME,form_DSP_FORM_PAGE.PAGE_NO];
    var masterKeyNameArr = ["FORM_NAME","PAGE_NO"];

    this.grid_DSP_FORM_AREA = new formArea();
    for (var i = 0; i< masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.grid_DSP_FORM_AREA[masterKeyNameArr[i]] = masterKeyArr[i];
    }

    this.DSP_FORM_AREAGridConfig = new componentConfigDef();
    this.DSP_FORM_AREAGridConfig.masterKeyArr =  masterKeyArr;
    this.DSP_FORM_AREAGridConfig.masterKeyNameArr =  masterKeyNameArr;
  }
/////////////////////////
public readCompletedHandlerGrid( form_DSP_FORM_AREA) {
    //Adjust nexr keys manually for DSP_FORM_FIELDS	
    var masterKeyArr = [form_DSP_FORM_AREA.FORM_NAME,form_DSP_FORM_AREA.PAGE_NO, form_DSP_FORM_AREA.AREA_NO];
    var masterKeyNameArr = ["FORM_NAME","PAGE_NO", "AREA_NO"];
    this.grid_DSP_FORM_FIELDS = new formFields();

    for (var i = 0; i< masterKeyNameArr.length; i++){
      if (this.paramConfig.DEBUG_FLAG) console.log("masterKeyNameArr:" + masterKeyNameArr[i] + ":" + masterKeyArr[i])
       this.grid_DSP_FORM_FIELDS[masterKeyNameArr[i]] = masterKeyArr[i];
    }
    
    this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
    this.DSP_FORM_FIELDSGridConfig.masterKeyArr = masterKeyArr;
    //Adjust nexr keys manually
    this.DSP_FORM_FIELDSGridConfig.masterKeyNameArr =  masterKeyNameArr;
    var masterParams ={
      areaType : form_DSP_FORM_AREA.AREA_TYPE
    }
    this.DSP_FORM_FIELDSGridConfig.masterParams = masterParams;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.DSP_FORM_FIELDSGridConfig:", this.DSP_FORM_FIELDSGridConfig)


  }
  public clearCompletedHandler( form_DSP_FORM_PAGE) {
    this.grid_DSP_FORM_AREA = new  formArea();
    this.grid_DSP_FORM_FIELDS = new  formFields();

  }

    public saveCompletedHandler( form_DSP_FORM_PAGE) {
    this.DSP_FORM_AREAGridConfig = new componentConfigDef();
    this.DSP_FORM_AREAGridConfig.masterSaved = form_DSP_FORM_PAGE;
    this.DSP_FORM_AREAGridConfig.masterKey =  form_DSP_FORM_PAGE.FORM_NAME;

    this.DSP_FORM_AREAGridConfig.masterKeyArr =  [form_DSP_FORM_PAGE.FORM_NAME,form_DSP_FORM_PAGE.PAGE_NO];
    this.DSP_FORM_AREAGridConfig.masterKeyNameArr =  ["FORM_NAME","PAGE_NO"];
    


    this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
    this.DSP_FORM_FIELDSGridConfig.masterSaved = form_DSP_FORM_PAGE;
    this.DSP_FORM_FIELDSGridConfig.masterKey =  form_DSP_FORM_PAGE.FORM_NAME;

    //Adjust nexr keys manually	
    this.DSP_FORM_FIELDSGridConfig.masterKeyArr =  [form_DSP_FORM_PAGE.FORM_NAME,form_DSP_FORM_PAGE.PAGE_NO];
    this.DSP_FORM_FIELDSGridConfig.masterKeyNameArr =  ["FORM_NAME","PAGE_NO"];

  }
  @Input() public set detail_Input(form: any) {
    //if (this.paramConfig.DEBUG_FLAG) console.log("epm_lgc detail_Input:", form)
    if (typeof form !== "undefined")
    {
        this.form_DSP_FORM_PAGE = new formPage(); 
        this.form_DSP_FORM_PAGE = form;
    }

  }

  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("epm lgc ComponentConfig:",ComponentConfig);
    if (typeof ComponentConfig !== "undefined"){
	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
      if (ComponentConfig.masterSaved != null)
      {
        this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
        this.DSP_FORM_PAGEFormConfig.masterSaved = ComponentConfig.masterSaved;

        this.DSP_FORM_AREAGridConfig = new componentConfigDef();
        this.DSP_FORM_AREAGridConfig.masterSaved = ComponentConfig.masterSaved;
        if (this.paramConfig.DEBUG_FLAG) console.log("1 epm lgc ComponentConfig:",this.DSP_FORM_AREAGridConfig );

        this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
        this.DSP_FORM_FIELDSGridConfig.masterSaved = ComponentConfig.masterSaved;
      }
      if (ComponentConfig.clearScreen == true)
      {
        this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
        this.DSP_FORM_PAGEFormConfig.clearScreen = ComponentConfig.clearScreen;
        this.DSP_FORM_AREAGridConfig = new componentConfigDef();
        this.DSP_FORM_AREAGridConfig.clearScreen = ComponentConfig.clearScreen;
        if (this.paramConfig.DEBUG_FLAG) console.log("2 epm lgc ComponentConfig:",this.DSP_FORM_AREAGridConfig );
        this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
        this.DSP_FORM_FIELDSGridConfig.clearScreen = ComponentConfig.clearScreen;
      }
      
      if ((ComponentConfig.masterKeyArr != null) && (ComponentConfig.masterKeyNameArr != null) )
      {
        if ((ComponentConfig.masterKeyArr.length != 0) && (ComponentConfig.masterKeyNameArr.length != 0) )
        {
          this.DSP_FORM_PAGEFormConfig = new componentConfigDef();
          this.DSP_FORM_PAGEFormConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_PAGEFormConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;

          this.DSP_FORM_AREAGridConfig = new componentConfigDef();
          this.DSP_FORM_AREAGridConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_AREAGridConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
          if (this.paramConfig.DEBUG_FLAG) console.log("3 epm lgc ComponentConfig:",this.DSP_FORM_AREAGridConfig );
          
          this.DSP_FORM_FIELDSGridConfig = new componentConfigDef();
          this.DSP_FORM_FIELDSGridConfig.masterKeyArr = ComponentConfig.masterKeyArr;
          this.DSP_FORM_FIELDSGridConfig.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
          
        }


      }
    }
  }

}
