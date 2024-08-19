import { Component, ViewEncapsulation } from '@angular/core';
import {   queryDef, dynamic ,sampleProducts, componentConfigDef } from '@modeldir/model';
import { SortableModule } from '@progress/kendo-angular-sortable';
declare function getParamConfig(): any;

interface ColumnSetting {
    field: string;
    title: string;
    format?: string;
    type: 'text' | 'numeric' | 'boolean' | 'date';
  }
@Component({
    selector: 'app-test-sortabe',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './test-sortabe.component.html',
      styleUrls: ['./test-sortabe.component.css'],
})
export class TestSortabeComponent {
  constructor() { 
    this.paramConfig = getParamConfig();
  }
    public gridData: any[] = sampleProducts;
    public paramConfig;
    public columns: ColumnSetting[]  = [
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

    public charts: any[] = [
        { data: this.colorsA, name: 'Chart A' , type:'line' , series: this.series1, categories:this.categories1 , width : "200", height : "150"
        , paramData:this.gridData,  paramId:"gridParams1", paramColumns : this.columns},
        { data: this.colorsB, name: 'Chart B' , type:'area' , series: this.series2 , categories:this.categories2, width : "400", height : "100"
        , paramData:this.gridData , paramId:"gridParams2" , paramColumns : this.columns},
        { data: this.colorsC, name: 'Chart C' , type:'verticalArea' , series: this.series1 , categories:this.categories1, width : "200", height : "100"
         , paramData:this.gridData, paramId:"gridParams3" , paramColumns : this.columns},
        { data: this.colorsD, name: 'Chart D' , type:'pie' , series: this.series1 , categories:this.categories1, width : "400", height : "100"
        , paramData:this.gridData, paramId:"gridParams4" , paramColumns : this.columns}
    ];

    private  getRec (CODE, fieldName){
        var rec;
        var lkpArrName = "lkpArr" + fieldName;
        if (this.paramConfig.DEBUG_FLAG) console.log("lkpArrName:", lkpArrName)
        rec ={
          CODE: CODE,
          CODETEXT_LANG : CODE
        };
        if ( (typeof this[lkpArrName] !== "undefined")  && (this[lkpArrName].length > 0) ) {
          rec = this[lkpArrName].find(x => x.CODE === CODE);
        }
        return rec;
      
      }
    public lkpArrGetfield(fieldName,row: any): any {
        // Change x.CODE below if not from SOM_TABS_CODE
        var rec;
        console.log ("lkpArrGetfield:field" , fieldName, row[fieldName])
        var CODE = row[fieldName];
        rec = this.getRec (CODE, fieldName);
      
        return rec;
        
      }
}

