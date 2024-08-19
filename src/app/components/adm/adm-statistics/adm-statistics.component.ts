import { Component, OnInit} from '@angular/core';
import {  componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;

@Component({
  selector: 'app-adm-statistics',
  templateUrl: './adm-statistics.component.html',
  styleUrls: ['./adm-statistics.component.css']
})
export class AdmStatisticsComponent implements OnInit {

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
    this.starServices.actOnParamConfig(this, 'SOMSTATDEF' );
  }

}
