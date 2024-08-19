import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { team, userInformation } from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig(): any;

@Component({
  
  selector: 'app-adm-team-users',
  templateUrl: './adm-team-users.component.html',
  styleUrls: ['./adm-team-users.component.css']
})
export class AdmTeamUsersComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) { 
    this.paramConfig = getParamConfig();
  }
  public showToolBar = false;
  public  form_adm_team: team;
  public grid_adm_user_information : userInformation;
  public masterSaved=null;
  public paramConfig;
  
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.form_adm_team = new team();
    //this.form_adm_team.TEAM = "aa";
    if (this.paramConfig.DEBUG_FLAG) console.log(this.form_adm_team);
    this.grid_adm_user_information = new userInformation();
    //this.form_adm_team.TEAM = "aa";
    if (this.paramConfig.DEBUG_FLAG) console.log(this.grid_adm_user_information);
  }
  public readCompletedHandler( form_adm_team) {
    if (this.paramConfig.DEBUG_FLAG) console.log('aveHandler');
    if (this.paramConfig.DEBUG_FLAG) console.log( form_adm_team);
    this.grid_adm_user_information = new userInformation();
    this.grid_adm_user_information.TEAM =  form_adm_team.TEAM;

  }
  public clearCompletedHandler( form_adm_team) {
    if (this.paramConfig.DEBUG_FLAG) console.log('clearCompletedHandler');
    if (this.paramConfig.DEBUG_FLAG) console.log( form_adm_team);
    this.grid_adm_user_information = new userInformation();

  }

  public saveCompletedHandler( form_dsp_template) {
    this.masterSaved = form_dsp_template;
  }


}
