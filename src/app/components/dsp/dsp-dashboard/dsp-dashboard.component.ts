import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GridComponent } from '@progress/kendo-angular-grid';
//import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { toLocalDate } from '@progress/kendo-date-math'
import { SortableModule } from '@progress/kendo-angular-sortable';

import { starServices } from 'starlib';

import { dashboardDef, dynamic, sampleProducts, componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
const createFormGroup = (dataItem:any) => new FormGroup({
  'DASHBOARD_ID': new FormControl(dataItem.DASHBOARD_ID, Validators.required)
});

const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig(): any;
declare function setParamConfig(var1:any): any;

@Component({
  selector: 'app-dsp-dashboard',
  templateUrl: './dsp-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dsp-dashboard.component.css'],
  //  , './pdf-styles.css'

  styles: [
    `.button-notification {
          padding: 10px 5px;
          font-size: 1em;
          color: #313536;
      }
      .kendo-pdf-export {
        font-family: "DejaVu Sans", "Arial", sans-serif;
        font-size: 12px;
      }
      `
  ]
})

export class DspDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)

  public grid!: GridComponent;
  public gridParams: GridComponent;

  //@Input()    
  public showToolBar = true;
  public form: FormGroup;
  public view!: any[];
  public formGroup!: FormGroup;
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public isQUERY_IDEnable: boolean = true;
  public showParams: boolean = false;


  public isFilterable: boolean = false;
  public isColumnMenu: boolean = false;

  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey = "";
  private masterKeyName = "QUERY_ID";
  private insertCMD = "INSERT_DSP_DYNAMIC";
  private updateCMD = "UPDATE_DSP_DYNAMIC";
  private deleteCMD = "DELETE_DSP_DYNAMIC";
  private getCMD = "GET_DSP_DYNAMIC_QUERY";

  public executeQueryresult: any;
  public title = "Dynamic";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;

  //public gridHeight = "500";
  public formattedWhere:any = null;
  public paramConfig;
  public ADM_QUERY_DEFGridConfig: componentConfigDef;
  public DSP_DYNAMICChartConfig: componentConfigDef;
  private formInitialValues:any = new dashboardDef();
  private formDateInitialValues = new dynamic();

  public lookupData = [];
  public lookupOpened: boolean = false;
  public dateOpened: boolean = false;
  public dialogTitle;
  public dialogDateTitle;
  public selectedField;
  public initialQUERY_ID = "";
  public DASHBOARD_ID = ""



  public hideDynamicGrid: boolean = true;
  public chartTitle = "";
  public gridWidth = 150;
  public Module = 'PROVISION';
  public totalQuerys = 0;

  hideOptions = false




  //////////////////////////
  /*
  public colorsA: string[] = ['Violet', 'Magenta', 'Purple', 'SlateBlue'];
  public colorsB: string[] = ['SteelBlue', 'CornflowerBlue', 'RoyalBlue', 'MediumBlue'];
  public colorsC: string[] = ['LimeGreen', 'SeaGreen', 'Green', 'OliveDrab'];
  public colorsD: string[] = ['LightSalmon', 'Salmon', 'IndianRed', 'FireBrick'];
  
  public series1: any[] = [{
      name: "India",
      data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
    }, {
      name: "Russian Federation",
      data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3]
    }, {
      name: "Germany",
      data: [0.010, -0.375, 1.161, 0.684, 3.7, 3.269, 1.083, -5.127, 3.690, 2.995]
    },{
      name: "World",
      data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727]
    }];
  
    public series2: any[] = [{
      name: "Egypt",
      data: [3.907, 7.943, 7.848, 9.284, 9.263]
    }, {
      name: "Kuwait",
      data: [4.743, 7.295, 7.175, 6.376]
    }, ];
    public categories1: number[] = [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
    public categories2: number[] = [ 2007, 2008, 2009, 2010, 2011];
  
  public DSP_DYNAMICChartConfig1: componentConfigDef;
  public DSP_DYNAMICChartConfig2: componentConfigDef;
  public DSP_DYNAMICChartConfig3: componentConfigDef;
  public DSP_DYNAMICChartConfig4: componentConfigDef;
  */

  public dashboard: any[] = [];

  //////////////////////////
  private Body:any = [];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
    this.componentConfig.gridHeight = 500;
    //this.componentConfig.showTitle = true;

    this.DSP_DYNAMICChartConfig = new componentConfigDef();
    this.DSP_DYNAMICChartConfig.queryable = false;
    this.DSP_DYNAMICChartConfig.isChild = true;
    this.DSP_DYNAMICChartConfig.insertable = false



  }

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }
  public ngOnInit(): void {
    // this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.starServices.actOnParamConfig(this, 'PRVDASH');
    this.starServices.fetchLookups(this, this.lookupArrDef);
    this.form = createFormGroup(
      this.formInitialValues
    );

    this.onChanges();

    //this.title = this.Module + " dashboard" 
    this.title = " Dashboard"

  }
  public ngOnDestroy(): void {
    //this.docClickSubscription();
  }
  //Next part for filtering
  public state: State = {
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("dataStateChange");
    this.state = state;
    var out = process(this.executeQueryresult.data, this.state);
    if (this.paramConfig.DEBUG_FLAG) console.log(out);
    this.grid.data = out;
    if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
  }




  private addToBody(NewVal:any) {
    this.Body.push(NewVal);
  }


  public fetchLookupsCallBack() {
    if (this.paramConfig.DEBUG_FLAG) console.log("test:lkpArrDASHBOARD_ID:", this.lkpArrDASHBOARD_ID)
    var found = 0;
    var i = 0;
    var viewID = "";
    while ( (!found) && ( this.lkpArrDASHBOARD_ID.length > 0) ) {
      if (this.lkpArrDASHBOARD_ID[i].CODE != "") {
        viewID = this.lkpArrDASHBOARD_ID[i].CODE;

        /*var formVal = this.form.value;
        formVal.DASHBOARD_ID = viewID;
        this.form.reset(formVal);*/
        break;
      }
      i++;
    }
    if ((viewID != "") && (this.DASHBOARD_ID == "")) {
      this.DASHBOARD_ID = viewID;
      this.rundashboard(this.DASHBOARD_ID);
    }
  }

  onChanges(): void {
    //@ts-ignore: Object is possibly 'null'.
this.form.get('DASHBOARD_ID').valueChanges.subscribe(val => {
      this.selectedField = "";
      var rec = this.lkpArrGetDASHBOARD_ID(val);
      this.chartTitle = rec.CODETEXT_LANG;
      if (this.paramConfig.DEBUG_FLAG) console.log("test:rec:", rec, " test:val:", val);
      if (val != this.DASHBOARD_ID) {
        this.DASHBOARD_ID = val;
        this.rundashboard(val);
      }

      //this.lookupArrDef =[];
      //this.starServices.fetchLookups(this, this.lookupArrDef);
    });
  }


  public userLang = "EN";
  public lookupArrDef:any = [{
    "statment": "SELECT DASHBOARD_ID CODE, DASHBOARD_NAME CODETEXT_LANG  FROM ADM_DASHBOARD_DEF WHERE MODULE = '" + this.Module + "'",
    "lkpArrName": "lkpArrDASHBOARD_ID"
  }];

  public lkpArrDASHBOARD_ID:any = [];

  public lkpArrGetDASHBOARD_ID(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrDASHBOARD_ID.find((x:any) => x.CODE === CODE);
    return rec;
  }




  public rundashboard(DASHBOARD_ID) {
    if (this.paramConfig.DEBUG_FLAG) console.log("rundashboard:DASHBOARD_ID:", DASHBOARD_ID)


    this.Body = [];
    var NewVal = {};
    NewVal["_QUERY"] = "GET_ADM_DASHBOARD_DETAIL";

    NewVal["DASHBOARD_ID"] = DASHBOARD_ID;
    NewVal["CHART_ID"] = "%";
    this.addToBody(NewVal);
    if (this.paramConfig.DEBUG_FLAG) console.log("this.Body:", this.Body)
    var Page = "";
    Page = encodeURI(Page);
    this.starServices.post(this, Page, this.Body).subscribe(result => {
      if (result != null) {
        if (this.paramConfig.DEBUG_FLAG) console.log("------result::", result.data[0].data);
        var Querys = result.data[0].data;

        this.totalQuerys = Querys.length;

        var dashboard:any = [];
        for (var i = 0; i < Querys.length; i++) {
          var masterParams = {
            name: Querys[i].CHART_TITLE,
            type: Querys[i].CHART_TYPE,
            width: Querys[i].CHART_WIDTH,
            height: Querys[i].CHART_HEIGHT,
            queryID: Querys[i].QUERY_ID,
            chartOrder: i,
            showParams: this.showParams
          }
          var DSP_DYNAMICChartConfig = new componentConfigDef();
          DSP_DYNAMICChartConfig.masterParams = masterParams;

          var chart = {
            width: Querys[i].CHART_WIDTH, height: Querys[i].CHART_HEIGHT
            , config: DSP_DYNAMICChartConfig
          };
          dashboard.push(chart);

        }

        this.dashboard = dashboard;
        if (this.paramConfig.DEBUG_FLAG) console.log("this.dashboard:", this.dashboard)

      }
    },
      err => {
        if (this.paramConfig.DEBUG_FLAG) console.log("err:", err.error)
        this.starServices.showNotification("error", "error:" + err.error.error);
      });

  }
  public openShowParams() {
    this.showParams = !this.showParams;
    this.rundashboard(this.DASHBOARD_ID)


  }
  public printScreen() {
    window.print();
  }
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("xxx: reports ComponentConfig:", ComponentConfig);

    if (typeof ComponentConfig !== "undefined") {
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.showToolBar != null)
        this.showToolBar = ComponentConfig.showToolBar;
      if (ComponentConfig.masterParams != null) {
        this.DASHBOARD_ID = ComponentConfig.masterParams.DASHBOARD_ID;
        if (ComponentConfig.masterParams.hideOptions)
          this.hideOptions = ComponentConfig.masterParams.hideOptions
        this.rundashboard(this.DASHBOARD_ID);
      }





    }

  }

}


