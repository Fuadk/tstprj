import { Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { groupinfo  ,authority , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;


@Component({
  
  selector: 'app-adm-group-authority',
  templateUrl: './adm-group-authority.component.html',
  styleUrls: ['./adm-group-authority.component.css']
})
export class AdmGroupAuthorityComponent implements OnInit {
  @Output() saveTriggerOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
}
  public showToolBar = false;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  
  public  form_ADM_GROUPINFO: groupinfo;
  public grid_ADM_AUTHORITY : authority;
  //public masterSaved=null;
  public ADM_GROUPINFOFormConfig : componentConfigDef;
  public ADM_AUTHORITYGridConfig : componentConfigDef;
  
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMAUTH' );
    this.form_ADM_GROUPINFO = new groupinfo(); 
    // to stop initial loading remove [executeQueryInput]="form_ADM_GROUPINFO"   from this (parent) html file

    this.grid_ADM_AUTHORITY = new authority ();
    this.ADM_GROUPINFOFormConfig = new componentConfigDef();
    this.ADM_GROUPINFOFormConfig.isMaster = true;

    this.ADM_AUTHORITYGridConfig = new componentConfigDef();
    this.ADM_AUTHORITYGridConfig.AUTH_TYPE = "G";
    this.ADM_AUTHORITYGridConfig.isChild = true;
    this.ADM_AUTHORITYGridConfig.gridHeight = 450;
    

 
  }
  public readCompletedHandler( form_ADM_GROUPINFO) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_ADM_GROUPINFO);
    this.grid_ADM_AUTHORITY = new authority();
    this.grid_ADM_AUTHORITY.USERNAME =  form_ADM_GROUPINFO.GROUPNAME;
    this.grid_ADM_AUTHORITY.AUTH_TYPE = "G";

  }
  public clearCompletedHandler( form_ADM_GROUPINFO) {
    this.grid_ADM_AUTHORITY = new  authority();

  }

    public saveCompletedHandler( form_ADM_GROUPINFO) {
    this.ADM_AUTHORITYGridConfig = new componentConfigDef();
    this.ADM_AUTHORITYGridConfig.masterSaved = form_ADM_GROUPINFO;	
    this.ADM_AUTHORITYGridConfig.masterKey =  form_ADM_GROUPINFO.GROUPNAME;
    
  }


}
