import { Component, OnInit, Input, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import {  GridComponent } from '@progress/kendo-angular-grid';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { formatDate } from '@angular/common';
import { SeriesType, } from '@progress/kendo-angular-charts';
import {  dynamic, sampleProducts , componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
//import { ɵNAMESPACE_URIS } from '@angular/platform-browser';
interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  lookup?:string;
  type: 'text' | 'numeric' | 'boolean' | 'date' |'string'|'any';
}

declare function getParamConfig():any;
@Component({
  selector: 'app-dsp-dynamic-chart',
  templateUrl: './dsp-dynamic-chart.component.html',
  styleUrls: ['./dsp-dynamic-chart.component.css']
})
export class DspDynamicChartComponent implements OnInit {

  constructor(public starServices: starServices,  private renderer: Renderer2) { 
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   }

   public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  ngOnInit(): void {
  }

  public gridParams: GridComponent;
  public formDate : FormGroup;

  public paramConfig;
  public componentConfig: componentConfigDef;
  private Body:any =[];

  public  showParams : boolean = false;
  public gridParamsData: any[] ;//= sampleProducts;
  public gridParamsDataUser: any[] ;
  public columns: ColumnSetting[] ;
  /*= [
    {
      field: 'ProductName',
      title: 'Product Name',
      type: 'text'
    }, {
      field: 'UnitPrice',
      format: '{0:c}',
      title: 'Unit Price',
      type: 'numeric'
    }, {
      field: 'FirstOrderedOn',
      format: '{0:d}',
      title: 'First Ordered',
      type: 'date'
    }
  ];
*/

  public selectedField;
  

  public lookupData =[];
  public  lookupOpened : boolean = false;
  public  dateOpened : boolean = false;
  public  stack : boolean = false;
  public dialogTitle;
  public dialogDateTitle;
  public reportDef;
  public lookupCallBack;
  public chartData;
  public queryID = "";
  
  



  public title ="chart";
  public height = 250;
  public width = 400;
  public name = "a name";
  
  public chartType: SeriesType = "bar";

  //public chartType = "bar"
  /*
  public series: any[] = [{
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
  */

  //public categories: number[] = [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011];
  /*
  public series: any[] = [
    { name: "Created",         data: [13,10,3,3,2,2,2] },
    { name: "Pending action",  data: [1 ,  , , , , , ] },
    { name: "on hold",         data: [2 ,  , , , , , ] },
    { name: "waiting",         data: [  ,  ,1, , , , ] }
  ];
  
  public categories = ["ADDE", "ADN", "ADDU", "ADDV" ,"CONFIGE","INST","PREP"];
*/
  public series: any[] = [];
  /*
    { name: "Created",  data: [25, 14] },
    { name: "on hold",  data: [2, 5] }
  ];
  */
  public categories = []; //["ADU", "INST"];

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }

  public cellClickHandler({ column, isEdited, dataItem, rowIndex }): void {
    if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandler:",column.field ,column, dataItem)
    var val = dataItem[column.field];
    var fieldName = column.field;
    var fieldType = column.filter;
    if (this.paramConfig.DEBUG_FLAG) console.log ("val:" , val , " fieldType:", fieldType)
    this.selectedField = fieldName;
    
    if ( fieldType == "date")
    {
     var formVal = this.formDate.value;
     formVal.DYNAMIC_FIELD = new Date(val);
     this.formDate.reset(formVal);
 
     this.dialogDateTitle = this.starServices.CapitalizeTitle(fieldName) ;
     this.dateOpened = true;
    }
    else
    {
     
     var lkpArrName = "lkpArr" + fieldName;
     if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
     this.lookupData = this[lkpArrName];
     this.dialogTitle = this.starServices.CapitalizeTitle(fieldName) ;
     this.lookupOpened = true; 
 
    }
 }
 public cellClickHandlerLookup({ column, isEdited, dataItem, rowIndex }): void {
   if (this.paramConfig.DEBUG_FLAG) console.log("cellClickHandlerLookup",column.field ,column, dataItem)
   this.lookupOpened = false; 
   var val = dataItem["CODE"];
   this.gridParamsData[0][this.selectedField] = val;
 
   if ( this.selectedField == "ASSIGNEE_TYPE"){
     this.lookupArrDef = [];
     var fieldName = "ASSIGNEE";
     var lkpArrName = "lkpArr" + fieldName;
     var selectStmt = this.starServices.getAssigneeSelect(this, val);
     var lkpDef =  	{"statment":selectStmt,
            "lkpArrName":lkpArrName, "fieldName": fieldName};
     this.lookupArrDef.push(lkpDef);
     this.lookupCallBack = "PARAMS";
     this.starServices.fetchLookups(this, this.lookupArrDef);
 
   }
   this.showChart();

   
 }
 public lookupClose(){
  this.lookupOpened = false; 
}
public dateClose(){
  this.dateOpened = false; 
}
public valueChangeDYNAMIC_FIELDE(value: any): void {
  this.dateOpened = false; 
  var formVal = this.formDate.value;
  
  if (this.paramConfig.DEBUG_FLAG) console.log("formVal:",formVal)
  if (typeof formVal.DYNAMIC_FIELD != "undefined"){
    var DYNAMIC_FIELD = formVal.DYNAMIC_FIELD;//.toISOString();
    //DYNAMIC_FIELD = formatDate(DYNAMIC_FIELD, this.paramConfig.DateFormat,this.paramConfig.dateLocale)

    this.gridParamsData[0][this.selectedField] = DYNAMIC_FIELD;
    if (this.paramConfig.DEBUG_FLAG) console.log("this.gridParamsData:",this.gridParamsData);
    
  }

  
}


 public userLang = "EN" ; 
 public lookupArrDef:any =[];
 private  getRec (CODE, fieldName){
  var rec;
  var lkpArrName = "lkpArr" + fieldName;
  if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
  rec ={
    CODE: CODE,
    CODETEXT_LANG : CODE
  };
  if ( (typeof this[lkpArrName] !== "undefined")  && (this[lkpArrName].length > 0) ) {
    rec = this[lkpArrName].find((x:any) => x.CODE === CODE);
  }
  return rec;

}
 public lkpArrGetfield(fieldName,row: any): any {
  // Change x.CODE below if not from SOM_TABS_CODE
  var rec;
  if (this.paramConfig.DEBUG_FLAG) console.log ("lkpArrGetfield:field" , fieldName, row[fieldName])
  var CODE = row[fieldName];
  rec = this.getRec (CODE, fieldName);

  return rec;
  
}

public prepareReportSQLParams(rec){
  var sql = "SELECT " + rec.SELECT_CLAUSE + " FROM " + rec.FROM_CLAUSE + " WHERE " + rec.WHERE_CLAUSE;
  if ( ( rec.GROUP_ORDER_BY_CLAUSE != "") && ( rec.GROUP_ORDER_BY_CLAUSE !== null ) ){
    sql = sql + " " + rec.GROUP_ORDER_BY_CLAUSE;
  }
    

  if (this.paramConfig.DEBUG_FLAG) console.log("this.gridParamsData:",this.gridParamsData)
  this.Body = [];
  var NewVal = {};
  NewVal["_QUERY"] = "GET_STMT";
  var reportParams = "";
 // this.gridWidth = 0;

  for (var key in this.gridParamsData[0]) {
    if (this.paramConfig.DEBUG_FLAG) console.log("fieldName:", key);
    if (this.paramConfig.DEBUG_FLAG) console.log("fieldVal:", this.gridParamsData[0][key]);
    var fieldName = key;
    var fieldVal = this.gridParamsData[0][key];
    NewVal[fieldName] = fieldVal;


    
    var title  = fieldName;
    var type = "text";
    for (var i=0; i< this.columns.length; i++){
      if (fieldName == this.columns[i].field){
        title = this.columns[i].title;
        type = this.columns[i].type;
      }
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("type:", type)
    if (this.paramConfig.DEBUG_FLAG) console.log("this.columns:",this.columns)
    if (type == "date"){
      fieldVal = formatDate(fieldVal, this.paramConfig.DateFormat,this.paramConfig.dateLocale)
    }
    else{
      rec = this.getRec (fieldVal, fieldName);
      if (typeof rec !== "undefined") {
        fieldVal = rec.CODETEXT_LANG;
      }
    }

    if (reportParams != "")
      reportParams = reportParams + " , ";
    reportParams = reportParams + title + "=" + fieldVal;

   // this.gridWidth = this.gridWidth  + 150;

  }
  NewVal["_STMT"] = sql;
  var reportSqlParams ={
    NewVal : NewVal,
    reportParams : reportParams
  }

  return reportSqlParams;
}
public ngAfterContentChecked() {
  this.starServices.setRTL();
}
public fetchLookupsCallBack(){
  if (this.paramConfig.DEBUG_FLAG) console.log("---fetchLookupsCallBack");
  if (this.lookupCallBack == "PARAMS")
    this.processlookupCallBackParams();
  else if (this.lookupCallBack == "CATEGORIES")
    this.processlookupCallBackCategories();

    
}
/*
public series: any[] = [
    { name: "Created",  data: [25, 14] },
    { name: "on hold",  data: [2, 5] }
  ];
  
  public categories = ["ADU", "INST"];
*/
public BAR_LIKE = ["bar", "line", "column", "stack_bar", "area", "verticalArea"];
public PIE_LIKE = ["pie", "donut", "funnel", "waterfall"];

public chartBarLike;
public chartPieLike;
public chartCategory;
public chartValue;

public processlookupCallBackCategories() {
  if (this.paramConfig.DEBUG_FLAG) console.log("processlookupCallBackCategories:this.chartType:", this.chartType)
  this.chartBarLike = false;
  this.chartPieLike = false;
  if (this.paramConfig.DEBUG_FLAG) console.log("this.chartType:", this.chartType, "this.chartType.length:", this.chartType.length)
  if (this.chartType.length == 0)
    this.chartType = "bar";
  if ( this.BAR_LIKE.includes(this.chartType )) {
    this.processBarLikeChartData();
    this.chartBarLike = true;
  }
  else if ( this.PIE_LIKE.includes(this.chartType )) {
    this.processPieLikeChartData();
    this.chartPieLike = true;
  }
}
public processPieLikeChartData(){
  //if (this.paramConfig.DEBUG_FLAG) console.log("this.chartData:", this.chartData)
  //if (this.paramConfig.DEBUG_FLAG) console.log("this.chartData.length:", this.chartData.length);
  var j = 0;
  for (var key in this.chartData[0]) {
    if (j == 0) {
      this.chartCategory = key;
    } else 
    if (key.toLowerCase() == "count") {
        this.chartValue = key;
    }
    j++;
  }
  
  this.series = this.chartData;
  
}
public processBarLikeChartData() {

  var categories:any = [];
  var dataNames:any = [];
  var data;
  let countName = "count"; //Fuad
  if (this.paramConfig.DEBUG_FLAG) console.log("processBarLikeChartData")
  if (this.paramConfig.DEBUG_FLAG) console.log("this.chartData:", this.chartData)
  if (this.paramConfig.DEBUG_FLAG) console.log("this.chartData.length:", this.chartData.length)
  for (var i = 0; i < this.chartData.length; i++) {
      //if (this.paramConfig.DEBUG_FLAG) console.log("this.chartData[i]:", this.chartData[i])
      var j = 0;
      for (var key in this.chartData[i]) {
          if (this.paramConfig.DEBUG_FLAG) console.log("key:",key);
          if (this.paramConfig.DEBUG_FLAG) console.log("data:", this.chartData[i][key]);
          var val = this.chartData[i][key];
          var fieldName = key;
          //if (this.paramConfig.DEBUG_FLAG) console.log("fieldName:", fieldName, " this.chartData[i]:", this.chartData[i])
          //var rec = this.lkpArrGetfield(fieldName, this.chartData[i])
          //val = rec.CODETEXT_LANG;
          //if (this.paramConfig.DEBUG_FLAG) console.log("rec:", rec)
          if (j == 0) {
              categories[val] = key;
          } else {
              if (key.toLowerCase() == "count") {
                  //if (this.paramConfig.DEBUG_FLAG) console.log("countName:", this.chartData[i], j)
                  countName = key;
                  data = data + ":" + val;
              } else
                  dataNames[val] = key;
          }
          j++;
      }
  }
  if (this.paramConfig.DEBUG_FLAG) console.log("test:categories:", categories, "categories.length:", Object.keys(categories).length)
  if (this.paramConfig.DEBUG_FLAG) console.log("test:dataNames:", dataNames, "dataNames.length:", Object.keys(dataNames).length)
  if (Object.keys(dataNames).length == 0)
    dataNames  = categories;
  if (this.paramConfig.DEBUG_FLAG) console.log("test:dataNames:", dataNames, "dataNames.length:", Object.keys(dataNames).length)

  function getData(category, dataName, chartData) {
      var elmData = "";
      var categoryKey = Object.keys(category)[0];
      var categoryVal = category[categoryKey];

      var dataNameKey = Object.keys(dataName)[0];
      var dataNameVal = dataName[dataNameKey];

      //if (this.paramConfig.DEBUG_FLAG) console.log("dataNameKey:", dataNameKey, " dataNameVal:", dataNameVal, "categoryKey:", categoryKey, " categoryVal", categoryVal)
      //if (this.paramConfig.DEBUG_FLAG) console.log("chartData.length:", chartData.length, "chartData:", chartData)

      var i = 0;
      while (i < chartData.length) {
          //if (this.paramConfig.DEBUG_FLAG) console.log("chartData:", chartData[i])
          //if (this.paramConfig.DEBUG_FLAG) console.log(chartData[i][dataNameKey] + " : " + dataNameVal);
          if ((chartData[i][dataNameKey] == dataNameVal) && (chartData[i][categoryKey] == categoryVal)) {
              elmData = chartData[i][countName];
              break;
          }
          i++;
      }
      return (elmData);


  }

  //////////

  var seriesArr:any = [];

  for (var dataNamekey in dataNames) {
      var dataNameval = dataNames[dataNamekey];
      if (this.paramConfig.DEBUG_FLAG) if (this.paramConfig.DEBUG_FLAG) console.log("dataNamekey:", dataNamekey, " dataNameval:", dataNameval);
      var dataName = {};
      dataName[dataNameval] = dataNamekey;
      //console.log("dataName:",dataName)

      var dataNamesSeries:any = [];

      for (var categorykey in categories) {
          var categoryval = categories[categorykey];
          if (this.paramConfig.DEBUG_FLAG) console.log("categorykey:",categorykey, " categoryval:", categoryval);
          var category = {};
          category[categoryval] = categorykey;

          var dataElm = getData(category, dataName, this.chartData)
          var object = {};
          object[categorykey] = dataElm;
          dataNamesSeries.push(object)

      }
      if (this.paramConfig.DEBUG_FLAG) console.log("dataNamesSeries:", dataNamesSeries)
      var seriesData:any = [];
      for (var i = 0; i < dataNamesSeries.length; i++) {
          var AdataNamesSerie = dataNamesSeries[i];
          //if (this.paramConfig.DEBUG_FLAG) console.log("key:", key," AdataNamesSerie:",AdataNamesSerie )
          for (var key in AdataNamesSerie) {
              var val = AdataNamesSerie[key];
              //val = [i]
              seriesData.push(val);
          }

      }
      
//      if (this.paramConfig.DEBUG_FLAG) console.log("seriesData:", seriesData)
      var row = {};
      row[dataNameval] = dataNamekey;
//      if (this.paramConfig.DEBUG_FLAG) console.log("row:", row);
      var rec = this.lkpArrGetfield(dataNameval, row)
      if (typeof rec !== "undefined") {
          val = rec.CODETEXT_LANG;
      }


      var seriesElm = {
          name: val,
          data: seriesData
      }
      if (this.paramConfig.DEBUG_FLAG) console.log("seriesElm:", seriesElm)
       seriesArr.push(seriesElm)

  }
  var categoriesArr:any = [];
  for (var key in categories) {
      categoriesArr.push(key);
  }
  // seriesArr = [
  //   { name: "Created",  data: [25, 14] },
  //   { name: "on hold",  data: [2, 5] }
  // ];
  if (this.paramConfig.DEBUG_FLAG) console.log("seriesArr:", seriesArr," categoriesArr:", categoriesArr)

  this.categories = categoriesArr;
  this.series = seriesArr;




}
public processlookupCallBackParams() {
  if (this.paramConfig.DEBUG_FLAG) console.log("------this.gridParamsDataUser:", this.gridParamsDataUser)
    if (typeof this.gridParamsDataUser !== "undefined") {
      this.gridParamsData = this.gridParamsDataUser;
    }
    else{
      if (this.selectedField == "ASSIGNEE_TYPE") {
          var fieldName = "ASSIGNEE"
          var lkpArrName = "lkpArr" + fieldName;
          var lkpRec = {
              "CODE": "%",
              "CODETEXT_LANG": "Any"
          }
          this[lkpArrName].unshift(lkpRec);
          if (this.paramConfig.DEBUG_FLAG) console.log("this.gridParamsData:", this.gridParamsData)

          return;
      }
      if (typeof this.columns !== "undefined") {
          var gridParamsData:any = [];
          var gridRec = {};

          for (var i = 0; i < this.columns.length; i++) {
              var fieldName = this.columns[i].field;
              if (this.paramConfig.DEBUG_FLAG) console.log("this.columns[i].type:", this.columns[i].type, this.columns[i].title)
              if (this.columns[i].type == "date") {
                  var d = new Date();
                  var dStr = formatDate(d, this.paramConfig.DateFormat, this.paramConfig.dateLocale)
                  if (this.paramConfig.DEBUG_FLAG) console.log(" d: before", d)
                  //d = toLocalDate(d);
                  //console .log(" d: after", d)
                  //var CODE = d.toISOString();
                  var CODE = dStr;


              } else {


                  var lkpArrName = "lkpArr" + fieldName;
                  var lkpRec = {
                      "CODE": "%",
                      "CODETEXT_LANG": "Any"
                  }
                  this[lkpArrName].unshift(lkpRec);


                  if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
                  var CODE = this[lkpArrName][0].CODE;
              }
              gridRec[fieldName] = CODE;
          }
          gridParamsData.push(gridRec);
          if (this.paramConfig.DEBUG_FLAG) console.log("gridParamsData:", gridParamsData)
          this.gridParamsData = gridParamsData;
          //this.showParams = true;
      }
    }
  ///////////////////// 
  this.showChart(); 

}
public showChart(){

  var reportSqlParams = this.prepareReportSQLParams(this.reportDef);
  if (this.paramConfig.DEBUG_FLAG) console.log("reportSqlParams:",reportSqlParams)
  this.Body = [];

  this.addToBody(reportSqlParams.NewVal);
  if (this.paramConfig.DEBUG_FLAG) console.log("this.Body:", this.Body)
  var Page = "";
  Page = encodeURI(Page);
  this.starServices.post(this, Page, this.Body).subscribe(result => {
          if (result != null) {
              if (this.paramConfig.DEBUG_FLAG) console.log("------result::", result.data[0].data);
              this.lookupArrDef = [];
              //if (this.paramConfig.DEBUG_FLAG) console.log(result.data[0].data);
              //Fuad
              for (let i = result.data[0].data.length-1; i >= 0; i--){
                if (typeof result.data[0].data[i]._QUERY != "undefined"){
                  delete result.data[0].data[i]._QUERY;
                }
              }
              this.chartData = result.data[0].data;

              delete this.chartData._QUERY;
              var columns = result.data[0].data[0];
              //delete columns._QUERY;
              
              if (this.paramConfig.DEBUG_FLAG) console.log("columns:", columns)
              //var columnsDef = [];
              for (var key in columns) {
                  if (this.paramConfig.DEBUG_FLAG) console.log(key);
                  if (this.paramConfig.DEBUG_FLAG) console.log(columns[key]);
                  var fieldName = key;
                  if ("COUNT" != fieldName.toUpperCase()){
                    var lkpArrName = "lkpArr" + fieldName;
                    if (typeof this[lkpArrName] == "undefined") {
                      if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName.length, lkpArrName,this[lkpArrName])
                      var lkpDef = this.starServices.prepareLookup(fieldName, this.paramConfig);
                      this.lookupArrDef.push(lkpDef);
                    }
                  }



              }

              //if (this.paramConfig.DEBUG_FLAG) console.log("columnsDef:", columnsDef)
              if (this.paramConfig.DEBUG_FLAG) console.log("this.lookupArrDef:", this.lookupArrDef)
              //this.columns = columnsDef;

              this.lookupCallBack = "CATEGORIES";
              this.starServices.fetchLookups(this, this.lookupArrDef);


              //for (var i=0; i < result.data[0].data.length;i++)
              //  result.data[0].data[i] = this.starServices.dateYYYYMMDD(this, result.data[0].data[i]);


          }
      },
      err => {
          //this.grid.loading = false;
          //this.grid.data = [];
          if (this.paramConfig.DEBUG_FLAG) console.log("err:", err.error)
          this.starServices.showNotification("error", "error:" + err.error.error);
      });
    }

public populateParamGrid (rec){
 // this.showParams = false;
  //this.hideDynamicGrid = true;

  this.lookupArrDef = [];
  var columnsDef:any = [];
  var gridParamsData = [];
  if ( rec.WHERE_CLAUSE != null)
  {
    var array  = rec.WHERE_CLAUSE.split(":");
    for (var i=0; i< array.length; i++){
      var fieldDef = array[i];
      if (this.paramConfig.DEBUG_FLAG) console.log("fieldDef:", fieldDef)
      if (i != 0){
        var fieldName  = fieldDef.split(" ");

        var fieldType = "text";
        var fieldFormat = "" ;
        var fieldLookup = true;
        var n = fieldName[0].toUpperCase().search("_DATE");
        if (n != -1){
          fieldType = "date"
          //fieldFormat= "{0:d}";
          fieldFormat= this.paramConfig.DateFormat;
          fieldLookup = false;
        }
        else
        {
          var lkpDef = this.starServices.prepareLookup(fieldName[0], this.paramConfig);
          this.lookupArrDef.push(lkpDef);
          if (this.paramConfig.DEBUG_FLAG) console.log ("this.lookupArrDef:",this.lookupArrDef)
        }

        var fieldNameCaps = this.starServices.CapitalizeTitle(fieldName[0]);
        var field = {
          field: fieldName[0],
          title: fieldNameCaps ,
          format : fieldFormat,
          type: fieldType,
          lookup: fieldLookup
        }
        columnsDef.push(field)
      }
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("columnsDef:", columnsDef)
    this.columns = columnsDef;
    this.lookupCallBack = "PARAMS";
    this.starServices.fetchLookups(this, this.lookupArrDef);

  }


}

public readQuery(queryID){
  this.Body = [];
  var NewVal = {};
  NewVal["_QUERY"] = "GET_ADM_QUERY_DEF";

  NewVal["QUERY_ID"] = queryID;
  this.addToBody(NewVal);
 if (this.paramConfig.DEBUG_FLAG) console.log("this.Body CHART : HF",this.Body)
  var Page ="";
  Page = encodeURI(Page);
  this.starServices.post(this, Page,this.Body).subscribe(result => {
    if (result != null)
    {
      if (this.paramConfig.DEBUG_FLAG) console.log("------result CHART ::HF",result.data[0].data);
      var Query = result.data[0].data;
      if (this.paramConfig.DEBUG_FLAG) console.log("Query: CHART HF",Query);
      //if (this.paramConfig.DEBUG_FLAG) console.log("Query:",Query.QUERY_ID);
      //if (this.paramConfig.DEBUG_FLAG) console.log("Query:",Query[0].QUERY_ID);
      this.reportDef = Query[0];

            if (Query.length != 0)
        this.populateParamGrid(Query[0])
    
    }
  },
  err => {
    if (this.paramConfig.DEBUG_FLAG) console.log("err:",err.error)
    this.starServices.showNotification ("error","error:" + err.error.error);
  });
  


}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("DspDynamicChartComponent ComponentConfig:", ComponentConfig);
    if (typeof ComponentConfig !== "undefined") {
        
        
        this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
        if ( ComponentConfig.masterParams != null)
        {
          this.showParams = ComponentConfig.masterParams.showParams;
          if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig.masterParams.queryID:", ComponentConfig.masterParams.queryID)
          if (typeof ComponentConfig.masterParams.queryID !== "undefined") {
            if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig.masterParams.queryID:", ComponentConfig.masterParams.queryID)
            this.height = ComponentConfig.masterParams.height;
            this.width = ComponentConfig.masterParams.width;
            let chartType = ComponentConfig.masterParams.type;
            if ( chartType == "stack_bar"){
              this.chartType = "bar";
              this.stack = true;
            }
            else
            if (chartType == "stack_area"){
              this.chartType = "area";
              this.stack = true;
            }
            else
            this.chartType = ComponentConfig.masterParams.type;

            this.title = ComponentConfig.masterParams.name;
            this.queryID = ComponentConfig.masterParams.queryID;
            this.gridParamsDataUser = ComponentConfig.masterParams.gridParamsDataUser;
            this.readQuery(this.queryID);
          }

        }
  
      }
      
  
  
    }
  
}
