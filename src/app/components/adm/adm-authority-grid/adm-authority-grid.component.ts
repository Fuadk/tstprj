import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   authority, componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'AUTH_TYPE' : new FormControl(dataItem.AUTH_TYPE  ) ,
'USERNAME' : new FormControl(dataItem.USERNAME , Validators.required ) ,
'ROUTINE_NAME' : new FormControl(dataItem.ROUTINE_NAME , Validators.required ) ,
'AUTHLEVEL' : new FormControl(dataItem.AUTHLEVEL ) ,
'DISP_FLAG' : new FormControl(dataItem.DISP_FLAG ) ,
'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) 
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;


@Component({
  selector: 'app-adm-authority-grid',
  templateUrl: './adm-authority-grid.component.html',
  styleUrls: ['./adm-authority-grid.component.css'
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

export class AdmAuthorityGridComponent implements OnInit,OnDestroy {
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
  public  isUSERNAMEEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  private masterKey ="";
  public masterKeyName ="USERNAME";
  private AUTH_TYPE = "";
  private insertCMD = "INSERT_ADM_AUTHORITY";
  private updateCMD = "UPDATE_ADM_AUTHORITY";
  private deleteCMD =   "DELETE_ADM_AUTHORITY";
  private getCMD = "GET_ADM_AUTHORITY_QUERY";

  public  executeQueryresult:any;
  public title = "Authority";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public paramConfig;
      public createFormGroupGrid = createFormGroup; 
  

  private Body =[];

  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices, private renderer: Renderer2) { 
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef(); 
   this.componentConfig.gridHeight = 500;
    this.componentConfig.showTitle = true;
   }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.starServices.fetchLookups(this, this.lookupArrDef);
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


  
@Input() public set detail_Input(grid: any) {
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input template grid.USERNAME :' + grid.USERNAME);
    if (this.paramConfig.DEBUG_FLAG) console.log(grid);
    if (grid.USERNAME != "")
    {
      
      this.masterKey = grid.USERNAME;
      this.AUTH_TYPE = grid.AUTH_TYPE;
      this.isUSERNAMEEnable = false;
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
        this.isUSERNAMEEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }

  
  private gridInitialValues = new authority();  
  
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
    this.saveCurrent();
    this.gridInitialValues.USERNAME = this.masterKey;
    this.gridInitialValues.AUTH_TYPE = this.AUTH_TYPE;
        this.closeEditor();
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


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : GridComponent): void{
    this.starServices.executeQuery_grid( grid,this);
  } 

  public saveChanges(grid: GridComponent): void {
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


  
  public lookupArrDef =[   
    {"statment": "select CHOICE, choice || ' - ' || text TEXT from menus where   menu_type ='R' order by choice " ,
      "lkpArrName":"lkpArrROUTINE"

    }       
  ];
  public lkpArrAUTHLEVEL = 
[
        {
          "CODE": 0,
          "CODETEXT_LANG": "No access"
        },
        {
          "CODE": 1,
          "CODETEXT_LANG": "Read access"
        },
        {
          "CODE": 2,
          "CODETEXT_LANG": "Full access"
        }
]
public lkpArrDISP_FLAG = 
[
        {
          "CODE": "Y",
          "CODETEXT_LANG": "Yes"
        },
        {
          "CODE": "N",
          "CODETEXT_LANG": "No"
        }
];
public lkpArrROUTINE = [];

  public lkpArrGetROUTINE(CODE: any): any {
    console.log("testing :CODE: ", CODE, "this.lkpArrROUTINE:", this.lkpArrROUTINE);
    
    var rec = this.lkpArrROUTINE.find(x => x.CHOICE === CODE);
    return rec;
}
public lkpArrGetAUTHLEVEL(CODE: any): any {
  var rec = this.lkpArrAUTHLEVEL.find(x => x.CODE === CODE);
  return rec;
}
public lkpArrGetDISP_FLAG(CODE: any): any {
  
  var rec = this.lkpArrDISP_FLAG.find(x => x.CODE === CODE);

  return rec;
}

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    if (typeof ComponentConfig !== "undefined"){
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:");
      if (this.paramConfig.DEBUG_FLAG) console.log(ComponentConfig);
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );

      if ( ComponentConfig.masterSaved != null)
      {
        this.saveChanges(this.grid);
      }
      if ( ComponentConfig.masterKey != null)
      {
        this.masterKey = ComponentConfig.masterKey;
      }
      if ( ComponentConfig.AUTH_TYPE != null)
      {
        this.isUSERNAMEEnable = false;
        this.AUTH_TYPE = ComponentConfig.AUTH_TYPE;
      }
    }
  }
}


