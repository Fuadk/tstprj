import { Component, OnInit} from '@angular/core';
import { menus  ,routines, componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
declare function getParamConfig():any;

@Component({
  
  selector: 'app-adm-menus-routines',
  templateUrl: './adm-menus-routines.component.html',
  styleUrls: ['./adm-menus-routines.component.css']
})
export class AdmMenusRoutinesComponent implements OnInit {

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
}

  public showToolBar = false;
  public  form_MENUS: menus;
  public form_ROUTINES : routines;

  public  MENUSFormConfig : componentConfigDef;
  public  ROUTINESFormConfig : componentConfigDef;
  public componentConfig: componentConfigDef;
  public paramConfig;  
  public title="";
  public routineAuth = null;
  
  public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMMNU' );

    this.form_MENUS = new menus(); 
    // to stop initial loading remove [executeQueryInput]="form_dsp_template"  from this (parent) html file

    this.form_ROUTINES = new routines ();
    this.MENUSFormConfig = new componentConfigDef();
    this.MENUSFormConfig.isMaster = true;
    this.MENUSFormConfig.routineAuth = this.routineAuth;

    this.ROUTINESFormConfig = new componentConfigDef();
    this.ROUTINESFormConfig.routineAuth = this.routineAuth;

  }
  public readCompletedHandler( form_MENUS) {
    if (this.paramConfig.DEBUG_FLAG) console.log( form_MENUS);
    this.form_ROUTINES = new routines();
    this.form_ROUTINES.CHOICE =  form_MENUS.CHOICE;

  }
  public clearCompletedHandler( form_MENUS) {
    this.form_ROUTINES = new  routines();

  }

  public saveCompletedHandler( form_MENUS) {
    if (this.paramConfig.DEBUG_FLAG) console.log("in saveCompletedHandler")
    this.ROUTINESFormConfig = new componentConfigDef();
    this.ROUTINESFormConfig.masterSaved = form_MENUS;
    this.ROUTINESFormConfig.masterKey =  form_MENUS.CHOICE;
    if (this.paramConfig.DEBUG_FLAG) console.log(this.ROUTINESFormConfig);

  }


}
