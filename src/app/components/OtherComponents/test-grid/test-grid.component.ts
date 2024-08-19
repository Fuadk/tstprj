


import { Component} from '@angular/core';
import { starServices } from 'starlib';
import {dbService} from './dbService';
declare function getParamConfig(): any;


  
  
@Component({
    selector: 'app-test-grid',
    templateUrl: './test-grid.component.html',
    styleUrls: ['./test-grid.component.css']
  })
  

export class TestGridComponent {
  public gridData: any[] ;
  public paramConfig;

  constructor(private   dbService: dbService, public starServices: starServices) {
    this.paramConfig = getParamConfig();
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    var page = "&_QUERY=GET_ADM_USER_INFORMATION&USERNAME=STAR";
    var body = "";
    
    this.dbService.getData(page, body).subscribe(result => {
      if (this.paramConfig.DEBUG_FLAG) console.log(result)
      if (result != null) {
        if (this.paramConfig.DEBUG_FLAG) console.log(result.data[0].data[0]);
        var rec = result.data[0].data;
        if (this.paramConfig.DEBUG_FLAG) console.log("rec");
        if (this.paramConfig.DEBUG_FLAG) console.log(rec);
        this.gridData = rec;
      }
    });

  }
  


}
