import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { team  ,userDuty , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  
  selector: 'app-adm-team-duties',
  templateUrl: './adm-team-duties.component.html',
  styleUrls: ['./adm-team-duties.component.css']
})
export class AdmTeamDutiesComponent implements OnInit {
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

  public  form_ADM_TEAM: team;
  public grid_ADM_USER_DUTY : userDuty;
  public  ADM_TEAMFormConfig : componentConfigDef;
  public  ADM_USER_DUTYGridConfig : componentConfigDef;
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'PRVPRES' );
    this.form_ADM_TEAM = new team(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.grid_ADM_USER_DUTY = new userDuty ();

   this.ADM_TEAMFormConfig = new componentConfigDef();
   this.ADM_TEAMFormConfig.isMaster = true;
   this.ADM_TEAMFormConfig.routineAuth = this.routineAuth;
   this.ADM_TEAMFormConfig.WEEKShow = true;

   

   this.ADM_USER_DUTYGridConfig = new componentConfigDef();
   this.ADM_USER_DUTYGridConfig.isChild = true;
   this.ADM_USER_DUTYGridConfig.otherMasterKey = true;
   this.ADM_USER_DUTYGridConfig.showToolBar = false
   this.ADM_USER_DUTYGridConfig.routineAuth = this.routineAuth;
   

  }
  
  public setParamsHandler( masterParams) {
    if (this.paramConfig.DEBUG_FLAG) console.log("masterParams:", masterParams)
    this.ADM_USER_DUTYGridConfig = new componentConfigDef();
    this.ADM_USER_DUTYGridConfig.masterParams = masterParams;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.ADM_USER_DUTYGridConfig.masterParams:",this.ADM_USER_DUTYGridConfig.masterParams)
 
  }

  public readCompletedHandler( form_ADM_TEAM) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_TEAM);
    this.grid_ADM_USER_DUTY = new userDuty();
    this.grid_ADM_USER_DUTY.TEAM =  form_ADM_TEAM.TEAM;

  }
  public clearCompletedHandler( form_ADM_TEAM) {
    this.grid_ADM_USER_DUTY = new  userDuty();

  }

    public saveCompletedHandler( form_ADM_TEAM) {
    this.ADM_USER_DUTYGridConfig = new componentConfigDef();
    this.ADM_USER_DUTYGridConfig.masterSaved = form_ADM_TEAM;
    this.ADM_USER_DUTYGridConfig.masterKey =  form_ADM_TEAM.TEAM;

  }


}
