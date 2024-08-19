import { Component, OnInit} from '@angular/core';
import { userInformation , authority , componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-user-group-authority',
  templateUrl: './adm-user-group-authority.component.html',
  styleUrls: ['./adm-user-group-authority.component.css']
})
export class AdmUserGroupAuthorityComponent implements OnInit {
  public componentConfig: componentConfigDef;
  public paramConfig;  
  public title = "";
  
  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
}

public ngAfterViewInit() {
  this.starServices.setRTL();
 }
  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMAUTH' );
  }

}
