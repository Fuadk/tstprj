import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';
import {Day, firstDayInWeek} from '@progress/kendo-date-math';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   userDuty , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = dataItem => new FormGroup({
'USERNAME' : new FormControl(dataItem.USERNAME  , Validators.required ) ,
'ON_DUTY_DATE' : new FormControl(dataItem.ON_DUTY_DATE , Validators.required) ,
'A_1' : new FormControl(dataItem.A_1 ) ,
'P_1' : new FormControl(dataItem.P_1 ) ,
'O_1' : new FormControl(dataItem.O_1 ) ,
'A_2' : new FormControl(dataItem.A_2 ) ,
'P_2' : new FormControl(dataItem.P_2 ) ,
'O_2' : new FormControl(dataItem.O_2 ) ,
'A_3' : new FormControl(dataItem.A_3 ) ,
'P_3' : new FormControl(dataItem.P_3 ) ,
'O_3' : new FormControl(dataItem.O_3 ) ,
'A_4' : new FormControl(dataItem.A_4 ) ,
'P_4' : new FormControl(dataItem.P_4 ) ,
'O_4' : new FormControl(dataItem.O_4 ) ,
'A_5' : new FormControl(dataItem.A_5 ) ,
'P_5' : new FormControl(dataItem.P_5 ) ,
'O_5' : new FormControl(dataItem.O_5 ) ,
'A_6' : new FormControl(dataItem.A_6 ) ,
'P_6' : new FormControl(dataItem.P_6 ) ,
'O_6' : new FormControl(dataItem.O_6 ) ,
'A_7' : new FormControl(dataItem.A_7 ) ,
'P_7' : new FormControl(dataItem.P_7 ) ,
'O_7' : new FormControl(dataItem.O_7 ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) 
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1):any;

@Component({
  selector: 'app-adm-user-duty-grid',
  templateUrl: './adm-user-duty-grid.component.html',
  styleUrls: ['./adm-user-duty-grid.component.css'
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

export class AdmUserDutyGridComponent implements OnInit,OnDestroy {
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
  public isChild: boolean = false;
  public isMaster: boolean = false;
  public  isUSERNAMEEnable : boolean = true;
  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  private masterKey ="";
  public masterKeyName ="USERNAME";
  private insertCMD = "INSERT_ADM_USER_DUTY";
  private updateCMD = "UPDATE_ADM_USER_DUTY";
  private deleteCMD =   "DELETE_ADM_USER_DUTY";
  private getCMD = "GET_ADM_USER_DUTY_QUERY";

  public  executeQueryresult:any;
  public title = "Duties";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  public gridHeight = 400;
  public paramConfig;
      public createFormGroupGrid = createFormGroup;
  public formattedWhere = null;
  public otherMasterKey =  false;
  public dayOfWeek=["Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday", "Sunday"];
  public WEEK_DATE = null;

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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input AdmUserDutyGrid grid.TEAM :' + grid.TEAM);
    var masterKey = "";
    if (this.otherMasterKey == true)
    {
      masterKey = grid.TEAM;
      this.masterKeyName ="TEAM";
    }
    else{
      masterKey = grid.USERNAME;
      this.masterKeyName ="USERNAME";
    }

    if (masterKey != "")
    {
      // 
      this.masterKey = masterKey;
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
       // 
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

  
  private gridInitialValues = new userDuty();   

  private addToBody(NewVal){
    this.Body.push(NewVal);
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
    this.gridInitialValues[this.masterKeyName] = this.masterKey;
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
    this.readCompletedOutput.emit(this.formGroup.value);
}


  public enterQuery (grid : GridComponent): void{
    this.starServices.enterQuery_grid( grid, this);
  }
  
 
  public executeQuery (grid : GridComponent): void{
    if (this.isSearch == true){
      if (this.paramConfig.DEBUG_FLAG) console.log('this.formGroup:' + this.formGroup)
      if (typeof this.formGroup == "undefined") 
      {
        // a child component
        if (this.otherMasterKey == true)
          this.getCMD = "GET_ADM_USER_DUTY_JOIN_QUERY";
        if (this.WEEK_DATE != null){
          grid["ON_DUTY_DATE"] = this.WEEK_DATE;
        }
      }
    }
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
  
    if (this.paramConfig.DEBUG_FLAG) console.log("this.formGroup:",this.formGroup)
    if  (this.formGroup) {
      if (!this.formGroup.valid)
      {
        this.starServices.showOkMsg(this,this.starServices.fieldsRequiredMsg,"Error");
        return;
      }
      var NewVal = this.formGroup.value;
      if (this.paramConfig.DEBUG_FLAG) console.log(NewVal.ON_DUTY_DATE);
      var value = NewVal.ON_DUTY_DATE;
      var valueDate:Date 

      valueDate = this.starServices.getFirstWeekDay(this, value)

      NewVal.ON_DUTY_DATE = valueDate;
      this.formGroup.setValue(NewVal);
      //setGridData (this, NewVal);
      
      
    }
    

    this.starServices.saveCurrent_grid( this);
  }

  public removeHandler(sender ) {
    
    this.starServices.removeHandler_grid(sender, this);

  }

public userLang = "EN" ; 
  public lookupArrDef =[	{"statment":"SELECT USERNAME, Fullname CODETEXT_LANG FROM ADM_USER_INFORMATION",
                          "lkpArrName":"lkpArrUSERNAME"}];

public lkpArrUSERNAME = [];

public lkpArrGetUSERNAME(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrUSERNAME.find(x => x.USERNAME === CODE);
return rec;
}

public valueChangeUSERNAME(value: any): void {
//this.form.get('USERNAME').valueChanges.subscribe(val => {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}

  public printScreen(){
  window.print();
}
@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
    
	    if (this.paramConfig.DEBUG_FLAG) console.log("user duty ComponentConfig:",ComponentConfig);

    if (typeof ComponentConfig !== "undefined"){
      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );

      if ( ComponentConfig.showToolBar != null)
	      this.showToolBar = ComponentConfig.showToolBar;
	   
	    if (ComponentConfig.isMaster == true)
	    {
	     this.isMaster = true;
	    // 
	    }
	

	    if ( ComponentConfig.masterSaved != null)
	    {
	      this.saveChanges(this.grid);
	      ComponentConfig.masterSaved  = null;
	    }
	    if ( ComponentConfig.masterKey != null)
	    {
	      this.isUSERNAMEEnable = false;
	      this.masterKey = ComponentConfig.masterKey;
	    }
	    if ( ComponentConfig.isChild == true)
	    {
	      this.isChild = true;
	      this.isUSERNAMEEnable = false;
           //   
           
	    }

	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      this.executeQuery(this.grid)
		
	    }
	    if ( ComponentConfig.clearComponent == true)
	    {
        this.cancelHandler();
        this.grid.cancel;
        this.grid.data = [];
        this.Body =[];
	    }
	    if ( ComponentConfig.otherMasterKey == true)
	    {
        this.otherMasterKey = true;
      }
      if ( ComponentConfig.masterParams != null)
	    {
	      this.WEEK_DATE = ComponentConfig.masterParams.WEEK_DATE
	    }


    }

  }

}


