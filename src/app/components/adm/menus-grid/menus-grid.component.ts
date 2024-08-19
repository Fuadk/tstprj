import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   menus ,componentConfigDef} from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'MENU' : new FormControl(dataItem.MENU  , Validators.required ) ,
'MENU_TYPE' : new FormControl(dataItem.MENU_TYPE ) ,
'CHOICE' : new FormControl(dataItem.CHOICE ) ,
'TEXT' : new FormControl(dataItem.TEXT ) ,
'AR_TEXT' : new FormControl(dataItem.AR_TEXT ) ,
'LINE' : new FormControl(dataItem.LINE ) ,
'LANGUAGE_NAME' : new FormControl(dataItem.LANGUAGE_NAME ) ,
'EN_TEXT' : new FormControl(dataItem.EN_TEXT ) ,
'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) ,
'CHOICE_TYPE' : new FormControl(dataItem.CHOICE_TYPE ) ,
'FMODE' : new FormControl(dataItem.FMODE ) 
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;


@Component({
  selector: 'app-menus-grid',
  templateUrl: './menus-grid.component.html',
  styleUrls: ['./menus-grid.component.css'
//  , './pdf-styles.css'
],
  
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

export class MenusGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent) 
 
 public grid: GridComponent;
 
 //@Input()    
 public showToolBar = true;
  
  public groups: GroupDescriptor[] = [];
  public view: any[];
  public formGroup: FormGroup; 
  private editedRowIndex: number;
  private docClickSubscription: any;
  private isNew: boolean;
  private isSearch: boolean;
  public isChild: boolean  = false;
  public  isMENUEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  private masterKey ="";
  public masterKeyName ="MENU";
  private insertCMD = "INSERT_MENUS";
  private updateCMD = "UPDATE_MENUS";
  private deleteCMD =   "DELETE_MENUS";
  private getCMD = "GET_MENUS_QUERY";

  public  executeQueryresult:any;
  public title = "menus";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public gridHeight = 500;
  public paramConfig;
      public createFormGroupGrid = createFormGroup;


  private Body =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices, private renderer: Renderer2) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
    }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
    public ngOnDestroy(): void {
        this.docClickSubscription();
    }
//Next part for filtering
   public state: State = {
  };
  
    public dataStateChange(state: DataStateChangeEvent): void {
      if (this.paramConfig.DEBUG_FLAG) console.log("dataStateChange");
      this.state = state;
      var out = process(this.executeQueryresult.data , this.state);
      if (this.paramConfig.DEBUG_FLAG) console.log(out);
      this.grid.data = out;
      if (this.paramConfig.DEBUG_FLAG) console.log(this.grid.data);
  }

  @Input() public set triggersaveChanges_Input(masterSaved: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log("in triggersaveChanges_Input: " + masterSaved);
    if ( masterSaved != null)
      this.saveChanges(this.grid);
  }
  @Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.MENU :' + grid.MENU);
    if (grid.MENU != "")
    {
      
      this.masterKey = grid.MENU ;
      this.isMENUEnable = false;
      this.isSearch = true;
      this.executeQuery(grid);
      this.isChild = true;
      //this.showToolBar = false;
    }
    else
    {
      
      if (typeof this.grid != "undefined")
      {
        
        //this.isChild = false;
        this.grid.data = [];
        this.masterKey = "";
        this.isMENUEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues = new menus();   

  private addToBody(NewVal){
    this.Body.push(NewVal);
    if (this.paramConfig.DEBUG_FLAG) console.log('this.Body : '  + JSON.stringify(this.Body));
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
        this.saveCurrent();
    }
  }
  

  public addHandler(): void {
      if (this.isChild == true){
      if (this.masterKey == ""){
        this.starServices.showOkMsg(this,this.starServices.saveMasterMsg,"Error");
        return;
      }
    }
    if (this.paramConfig.DEBUG_FLAG) console.log("addHandler")
    this.gridInitialValues.MENU = this.masterKey;
        //this.closeEditor();
        this.saveCurrent();
        this.formGroup = createFormGroup(
          this.gridInitialValues
        );
      this.isNew = true;
      this.grid.addRow(this.formGroup);
  }

 public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
        return;
    }
    if (this.isNew) {
        rowIndex += 1;
    }
    this.saveCurrent();
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
}


  public enterQuery (grid : any): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : any): void{
    this.starServices.executeQuery_grid( grid,this);
  } 

  public saveChanges(grid: any): void {
    this.starServices.saveChanges_grid( grid,this);
  }

  public cancelHandler(): void {
    this.starServices.cancelHandler_grid( this);
  }

  private closeEditor(): void {
    this.starServices.closeEditor_grid( this);
  }

  private saveCurrent(): void {
    this.starServices.saveCurrent_grid( this);
  }

  public removeHandler(sender ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }

  public printScreen(){
    window.print();
  }


  public lkpArrTYPE = 
[
        {
          "CODE": "F",
          "CODETEXT_LANG": "Form"
        },
        {
          "CODE": "R",
          "CODETEXT_LANG": "Report"
        }
]
}


