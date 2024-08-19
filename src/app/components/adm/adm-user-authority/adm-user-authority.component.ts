import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { userInformation , authority , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  
  selector: 'app-adm-user-authority',
  templateUrl: './adm-user-authority.component.html',
  styleUrls: ['./adm-user-authority.component.css']
})
export class AdmUserAuthorityComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
}
  public showToolBar = false;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  
  public  form_ADM_USER_INFORMATION: userInformation;
  public grid_ADM_AUTHORITY : authority;
  public ADM_USER_INFORMATIONFormConfig : componentConfigDef;
  public ADM_AUTHORITYGridConfig : componentConfigDef;
  
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMAUTH' );
    this.form_ADM_USER_INFORMATION = new userInformation(); 
    // to stop initial loading remove [executeQueryInput]="form_ADM_USER_INFORMATION"   from this (parent) html file

    this.grid_ADM_AUTHORITY = new authority ();
    this.ADM_USER_INFORMATIONFormConfig = new componentConfigDef();
    this.ADM_USER_INFORMATIONFormConfig.isMaster = true;

    this.ADM_AUTHORITYGridConfig = new componentConfigDef();
    this.ADM_AUTHORITYGridConfig.AUTH_TYPE = "U";
    this.ADM_AUTHORITYGridConfig.gridHeight = 300;

    

 
  }
  public readCompletedHandler( form_ADM_USER_INFORMATION) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_USER_INFORMATION);
    this.grid_ADM_AUTHORITY = new authority();
    if (this.paramConfig.DEBUG_FLAG) console.log("form_ADM_USER_INFORMATION.USERNAME");
    if (this.paramConfig.DEBUG_FLAG) console.log(form_ADM_USER_INFORMATION.USERNAME);
    this.grid_ADM_AUTHORITY.USERNAME =  form_ADM_USER_INFORMATION.USERNAME;
    this.grid_ADM_AUTHORITY.AUTH_TYPE = "U";

  }
  public clearCompletedHandler( form_ADM_USER_INFORMATION) {
    this.grid_ADM_AUTHORITY = new  authority();

  }
  public saveCompletedHandler( form_ADM_USER_INFORMATION) {
    if (this.paramConfig.DEBUG_FLAG) console.log("in saveCompletedHandler")
    //this.masterSaved = form_dsp_template;
    this.ADM_AUTHORITYGridConfig = new componentConfigDef();
    this.ADM_AUTHORITYGridConfig.masterSaved = form_ADM_USER_INFORMATION;	
    this.ADM_AUTHORITYGridConfig.masterKey =  form_ADM_USER_INFORMATION.USERNAME;
    if (this.paramConfig.DEBUG_FLAG) console.log(this.ADM_AUTHORITYGridConfig);

  }
  
  
    
    
}
