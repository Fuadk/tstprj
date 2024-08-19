import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { tabsCodesSpec , tabsCodes, componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  
  selector: 'app-som-codes',
  templateUrl: './som-codes.component.html',
  styleUrls: ['./som-codes.component.css']
})
export class SomCodesComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }
  public showToolBar = false;

  public paramConfig; 
  public title = "" ;
  public routineAuth=null;
  public componentConfig: componentConfigDef;

  public  form_som_tabs_codes_spec: tabsCodesSpec;
  public grid_som_tabs_codes : tabsCodes;
  public masterSaved=null;
  public SOM_TABS_CODES_SPECFormConfig : componentConfigDef;
  public SOM_TABS_CODESGridConfig : componentConfigDef;
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMCODES' );

    this.form_som_tabs_codes_spec = new tabsCodesSpec(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_som_tabs_codes = new tabsCodes ();


    this.SOM_TABS_CODES_SPECFormConfig = new componentConfigDef();
    this.SOM_TABS_CODES_SPECFormConfig.isMaster = true;
    this.SOM_TABS_CODES_SPECFormConfig.routineAuth = this.routineAuth;
    
    this.SOM_TABS_CODESGridConfig = new componentConfigDef();
    this.SOM_TABS_CODESGridConfig.gridHeight = 350;
    this.SOM_TABS_CODESGridConfig.routineAuth = this.routineAuth;
 
  }
  public readCompletedHandler( form_som_tabs_codes_spec) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_som_tabs_codes_spec);
    this.grid_som_tabs_codes = new tabsCodes();
    this.grid_som_tabs_codes.CODENAME =  form_som_tabs_codes_spec.CODENAME;

  }
  public clearCompletedHandler( form_som_tabs_codes_spec) {
    this.grid_som_tabs_codes = new  tabsCodes();

  }
  
  public saveCompletedHandler( form_SOM_TABS_CODES_SPEC) {
    this.SOM_TABS_CODESGridConfig = new componentConfigDef();
    this.SOM_TABS_CODESGridConfig.masterSaved = form_SOM_TABS_CODES_SPEC;	
    this.SOM_TABS_CODESGridConfig.masterKey = form_SOM_TABS_CODES_SPEC.CODENAME;
  }

}
