import { parseDate } from '@telerik/kendo-intl';
import { formatDate } from '@telerik/kendo-intl';
import { Component, OnInit, OnDestroy, ViewChild, Renderer2} from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';
import { orders } from '@modeldir/model';

//import * as moment from 'moment';

//import { environment } from '../../../../environments/environment'


import { starServices } from 'starlib';

/* comment */

const createFormGroup = (dataItem:any) => new FormGroup({
  'ORDER_TYPE': new FormControl(dataItem.ORDER_TYPE, Validators.required),
  'ORDER_NO': new FormControl(dataItem.ORDER_NO),
  'SUBNO': new FormControl(dataItem.SUBNO),
  'ORDER_STATUS': new FormControl(dataItem.ORDER_STATUS),
  'DIV': new FormControl(dataItem.DIVS),
  'DEPT': new FormControl(dataItem.DEPT),
  'ASSIGNEE_TYPE': new FormControl(dataItem.ASSIGNEE_TYPE),
  'ASSIGNEE': new FormControl(dataItem.ASSIGNEE),
  'PROMISED_DATE': new FormControl(dataItem.PROMISED_DATE),
  'ORDERED_DATE' : new FormControl(dataItem.ORDERED_DATE) ,
  'COMPLETION_DATE': new FormControl(dataItem.COMPLETION_DATE),
  'NOTES': new FormControl(dataItem.NOTES),
  'PARENT_ORDER_TYPE': new FormControl(dataItem.PARENT_ORDER_TYPE),
  'PARENT_ORDER_NO': new FormControl(dataItem.PARENT_ORDER_NO),
  'ACTUAL_START_DATE': new FormControl(dataItem.ACTUAL_START_DATE),
  'ACTUAL_END_DATE': new FormControl(dataItem.ACTUAL_END_DATE),
  'LOGDATE': new FormControl(dataItem.LOGDATE),
  'LOGNAME': new FormControl(dataItem.LOGNAME)
});



const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;

@Component({
  selector: 'app-dsp-orders',
  templateUrl: './dsp-orders.component.html',
  styleUrls: ['./dsp-orders.component.css']
})
export class DspOrdersComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent)
  public grid!: GridComponent;

  public depts =  [
    { DEPTName: 'BIL', DEPT: 'BIL' },
    { DEPTName: 'BIL1', DEPT: 'BIL1' },
    { DEPTName: 'BIL2', DEPT: 'BIL2' }
];
  
  public groups: GroupDescriptor[] = [];
  public view!: any[];
  public formGroup!: FormGroup;
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public value: Date = new Date(2019, 5, 1, 22);
  public format: string = 'MM/dd/yyyy HH:mm';
  public paramConfig;

  private Body:any = [];

  title = 'grid1';
  //https://www.telerik.com/kendo-angular-ui/components/grid/editing/in-cell-editing/

  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
      /*
      //this.view = this.starServices.pipe(map(data => process(data, this.gridState)));
      var state = "";
      var Page = encodeURI ("GET_DSP_ORDERS&SPC_FUNCTION='%'&EXCSYSTEM='%'&EQUIPID='%'");

      this.starServices.fetch(this, Page,state).subscribe(Page => {
      },
      err => {
      alert ('error:' + err.message);
      });
      this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
      */
  }
  public ngOnDestroy(): void {
      this.docClickSubscription();
  }

  public getDept(id: any): any {
    return this.depts.find((x:any) => x.DEPT === id);

}

  public addHandler(sender): void {
    this.saveCurrent();
      this.closeEditor();
      let today: Date = new Date();
      if (this.paramConfig.DEBUG_FLAG) console.log('today:' + today);
      this.formGroup = createFormGroup(
        this.gridInitialValues
      );
      this.isNew = true;
      if (this.paramConfig.DEBUG_FLAG) console.log(this.formGroup);
      this.grid.addRow(this.formGroup);
      if (this.paramConfig.DEBUG_FLAG) console.log("post addRow");
  }

  private gridInitialValues:any = new orders();   

  private addToBody(NewVal:any) {
      this.Body.push(NewVal);
      //if (this.paramConfig.DEBUG_FLAG) console.log('this.Body : ' + JSON.stringify(this.Body));
  }



  public cellClickHandler({
      event.isEdited,
      dataItem,
      event.rowIndex
  }): void {
      if (event.isEdited || (this.formGroup && !this.formGroup.valid)) {
          return;
      }

      if (this.isNew) {
          event.rowIndex += 1;
      }

      this.saveCurrent();
      this.formGroup = createFormGroup(event.dataItem);
      this.editedRowIndex = event.rowIndex;
      this.grid.editRow(event.rowIndex, this.formGroup);
  }
  public enterQuery(grid: any): void {
      this.grid.cancel;
      this.grid.data = [];
      this.addHandler(grid);
      this.isSearch = true;
  }


  public executeQuery(grid: any): void {
      //if (this.paramConfig.DEBUG_FLAG) console.log('this.isSearch :' + this.isSearch );
      var Page = "&_query=GET_DSP_ORDERS_QUERY";
      if (this.isSearch == true) {
          var NewVal = this.formGroup.value;
          this.isSearch = false;
          Page = Page + this.starServices.formatWhere(NewVal);
      }
      Page = encodeURI(Page);
      //if (this.paramConfig.DEBUG_FLAG) console.log('Page:' + Page);
      this.grid.loading = true;
      this.closeEditor();
      this.starServices.fetch(this, Page).subscribe(result => {
              if (result != null) {
                  if (this.paramConfig.DEBUG_FLAG) console.log('result.data[0].data:' + JSON.stringify(result.data[0].data[0]));
                  if (this.paramConfig.DEBUG_FLAG) console.log('result.data[0].data.length:' + JSON.stringify(result.data[0].data.length));

  
                  result = {
                      data: result.data[0].data,
                      total: parseInt(result.data[0].data.length, 10)
                  }
                  if (this.paramConfig.DEBUG_FLAG) console.log(result);
              }
              this.grid.loading = false;
              this.grid.data = result;
          },
          err => {
              this.grid.loading = false;
              alert('error:' + err.message);
          });
      this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));

  }

  public saveChanges(grid: any): void {
      this.saveCurrent();
      var Page = "&_trans=Y";
      this.starServices.post(this, Page, this.Body).subscribe(Page => {
              this.Body = [];
          },
          err => {
              alert('error:' + err.message);
          });
  }

  public cancelHandler(): void {
      this.closeEditor();
      this.isSearch = false;
  }


  private closeEditor(): void {
      this.grid.closeRow(this.editedRowIndex);
      this.isNew = false;
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
  }


  private onDocumentClick(e: any): void {
      if (this.formGroup && this.formGroup.valid &&
          !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
          this.saveCurrent();
      }
  }


  private saveCurrent(): void {
      if (this.paramConfig.DEBUG_FLAG) console.log('saveCurrent');
      if (this.formGroup) {
          var NewVal = {};
          NewVal = this.formGroup.value;
          //if (this.paramConfig.DEBUG_FLAG) console.log('this.formGroup.dirty :' + this.formGroup.dirty + " NewVal: " + JSON.stringify(NewVal));
          if (this.formGroup.dirty === true) {
              if (this.isNew == true) {

                  var result = this.starServices.addRec(this.grid.data, NewVal);
                  this.grid.data = result;
                  NewVal["_QUERY"] = "INSERT_DSP_ORDERS";
              } else {

                  var result1 = this.starServices.updateRec(this.grid.data, this.editedRowIndex, NewVal);
                  this.grid.data = result1;
                  NewVal["_QUERY"] = "UPDATE_DSP_ORDERS";
              }
              this.addToBody(NewVal);
          }
          this.closeEditor();

      }
  }

  public removeHandler({
      sender,
      dataItem
  }) {
      sender.cancelCell();

      if (typeof this.editedRowIndex !== "undefined") {
          var NewVal = {};
          var grid_data = JSON.parse(JSON.stringify(this.grid.data));

          NewVal = grid_data.data[this.editedRowIndex];
          var result1 = this.starServices.removeRec(this.grid.data, this.editedRowIndex);
          this.grid.data = result1;

          NewVal["_QUERY"] = "DELETE_DSP_ORDERS";
          this.addToBody(NewVal);
      }
      /*
      var Page = encodeURI("DELETE_DSP_ORDERS&SPC_FUNCTION=x&EXCSYSTEM=y&EQUIPID=z&CMDNO=a&PARAMNO=b");
      if (this.paramConfig.DEBUG_FLAG) console.log('removing:' + JSON.stringify(dataItem));

      this.starServices.delete(Page).subscribe(Page => {
      },
      err => {
      alert ('error:' + err.message);
      });*/

  }


}