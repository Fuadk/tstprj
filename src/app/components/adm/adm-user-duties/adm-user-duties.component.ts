import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { userInformation  ,userDuty , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;


@Component({
  
  selector: 'app-adm-user-duties',
  templateUrl: './adm-user-duties.component.html',
  styleUrls: ['./adm-user-duties.component.css']
})
export class AdmUserDutiesComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
  }

  public showToolBar = false;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  public title = "";
  public routineAuth = null;

  public  form_ADM_USER_INFORMATION: userInformation;
  public grid_ADM_USER_DUTY : userDuty;
  public  ADM_USER_INFORMATIONFormConfig : componentConfigDef;
  public  ADM_USER_DUTYGridConfig : componentConfigDef;
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVRESO' );

    this.form_ADM_USER_INFORMATION = new userInformation(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_ADM_USER_DUTY = new userDuty ();

   this.ADM_USER_INFORMATIONFormConfig = new componentConfigDef();
   this.ADM_USER_INFORMATIONFormConfig.isMaster = true;
   this.ADM_USER_INFORMATIONFormConfig.routineAuth = this.routineAuth;

   this.ADM_USER_DUTYGridConfig = new componentConfigDef();
   this.ADM_USER_DUTYGridConfig.isChild = true;
   this.ADM_USER_DUTYGridConfig.routineAuth = this.routineAuth;

  }
  public readCompletedHandler( form_ADM_USER_INFORMATION) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_USER_INFORMATION);
    this.grid_ADM_USER_DUTY = new userDuty();
    this.grid_ADM_USER_DUTY.USERNAME =  form_ADM_USER_INFORMATION.USERNAME;

  }
  public clearCompletedHandler( form_ADM_USER_INFORMATION) {
    this.grid_ADM_USER_DUTY = new  userDuty();

  }

    public saveCompletedHandler( form_ADM_USER_INFORMATION) {
    this.ADM_USER_DUTYGridConfig = new componentConfigDef();
    this.ADM_USER_DUTYGridConfig.masterSaved = form_ADM_USER_INFORMATION;
    this.ADM_USER_DUTYGridConfig.masterKey =  form_ADM_USER_INFORMATION.USERNAME;

  }


}
