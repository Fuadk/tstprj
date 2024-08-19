import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import { groupBy, GroupDescriptor  } from '@progress/kendo-data-query';

import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { starServices } from 'starlib';

import {   formArea , componentConfigDef } from '@modeldir/model';

// must invalidate table KEY by adding Validators.required otherwise add new as detail in master/detail screen won't work
 const createFormGroup = (dataItem:any) => new FormGroup({
'FORM_NAME' : new FormControl(dataItem.FORM_NAME  , Validators.required ) ,
'PAGE_NO' : new FormControl(dataItem.PAGE_NO  , Validators.required ) ,
'AREA_NO' : new FormControl(dataItem.AREA_NO  , Validators.required ) ,
'AREA_TYPE' : new FormControl(dataItem.AREA_TYPE ) ,
'AREA_TITLE' : new FormControl(dataItem.AREA_TITLE ) ,
'AREA_HELP' : new FormControl(dataItem.AREA_HELP ) ,
'AREA_PROTECTED' : new FormControl(dataItem.AREA_PROTECTED ) ,
'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
'LOGDATE' : new FormControl(dataItem.LOGDATE )
});



const matches = (el:any, selector:any) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig():any;
declare function setParamConfig(var1:any):any;

@Component({
  selector: 'app-dsp-form-area-grid',
  templateUrl: './dsp-form-area-grid.component.html',
  styleUrls: ['./dsp-form-area-grid.component.css'
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

export class DspFormAreaGridComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent)

 public grid!: GridComponent;

 //@Input()
 public showToolBar = true;

  public groups: GroupDescriptor[] = [];
  public view!: any[];
  public formGroup!: FormGroup;
  private editedRowIndex!: number;
  private docClickSubscription: any;
  private isNew!: boolean;
  private isSearch!: boolean;
  public isChild: boolean = false;
  public isMaster: boolean = false;
  		public  isFORM_NAMEEnable : boolean = true;
public  isPAGE_NOEnable : boolean = true;

  	public  isAREA_NOEnable : boolean = true;

  public  isFilterable : boolean = false;
  public  isColumnMenu : boolean = false;

  private masterKeyArr = [];
  private masterKeyNameArr = [];
  private masterKey ="";
  private masterKeyName ="FORM_NAME";
  private insertCMD = "INSERT_DSP_FORM_AREA";
  private updateCMD = "UPDATE_DSP_FORM_AREA";
  private deleteCMD =   "DELETE_DSP_FORM_AREA";
  private getCMD = "GET_DSP_FORM_AREA_QUERY";

  public  executeQueryresult:any;
  public title = "Form Area";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";
  public componentConfig: componentConfigDef;
  //public gridHeight = "500";
  public formattedWhere:any = null;
  public primarKeyReadOnlyArr = {isFORM_NAMEreadOnly : false , isPAGE_NOreadOnly : false , isAREA_NOreadOnly : false};
  public paramConfig;
  public createFormGroupGrid = createFormGroup;

  private Body:any =[];
  @Output() readCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() clearCompletedOutput: EventEmitter<any> = new EventEmitter();
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();

  constructor(public starServices: starServices, private renderer: Renderer2) {
      this.paramConfig = getParamConfig();
      this.componentConfig = new componentConfigDef();
      this.componentConfig.gridHeight =  "500";
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
    if (this.paramConfig.DEBUG_FLAG) console.log('detail_Input DspFormAreaGrid grid.FORM_NAME :' + grid.FORM_NAME);
    if ( (grid.FORM_NAME != "") &&   (typeof grid.FORM_NAME != "undefined"))
    {
      this.masterKey = grid.FORM_NAME;
      this.isFORM_NAMEEnable = false;
      this.isPAGE_NOEnable = false;
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
        this.isFORM_NAMEEnable = true;
      }
    }
  }

  public toggleFilter(): void {
    this.isFilterable = !this.isFilterable;
  }
  public toggleColumnMenu(): void {
    this.isColumnMenu = !this.isColumnMenu;
  }


  private gridInitialValues:any = new formArea();

  private addToBody(NewVal:any){
    this.Body.push(NewVal);
  }
  private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
        !matches(e.target, '#grid tbody *, #grid .k-grid-toolbar .k-button')) {
        this.saveCurrent();
    }
  }


  public addHandler(): void {
    this.starServices.addHandler_grid(this)
  }

 public cellClickHandler( event:any ): void {
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
    this.readCompletedOutput.emit(this.formGroup.value);
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

  public removeHandler(sender:any ) {

    this.starServices.removeHandler_grid(sender, this);

  }

public userLang = "EN" ;
public lookupArrDef:any =[	{"statment":"SELECT CODE, CODETEXT_LANG, CODEVALUE_LANG FROM SOM_TABS_CODES WHERE CODENAME ='AREA_TYPE' and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG",
			"lkpArrName":"lkpArrAREA_TYPE"}];

public lkpArrAREA_TYPE = [];

public lkpArrGetAREA_TYPE(CODE: any): any {
// Change x.CODE below if not from SOM_TABS_CODE
var rec = this.lkpArrAREA_TYPE.find((x:any) => x.CODE === CODE);
return rec;
}

public valueChangeAREA_TYPE(value: any): void {
//this.lookupArrDef =[];
//this.starServices.fetchLookups(this, this.lookupArrDef);
}

public printScreen(){
  window.print();
}
  @Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
	    if (this.paramConfig.DEBUG_FLAG) console.log("detail ComponentConfig:" ,ComponentConfig);

    if (typeof ComponentConfig !== "undefined"){
	    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );
	    if ( ComponentConfig.showToolBar != null)
	      this.showToolBar = ComponentConfig.showToolBar;

	    if (ComponentConfig.isMaster == true)
	    {
	     this.isMaster = true;
	    }


	    if ( ComponentConfig.masterSaved != null)
	    {
	      this.saveChanges(this.grid);
	      ComponentConfig.masterSaved  = null;
	    }
	    if ( ComponentConfig.masterKey != null)
	    {
        this.isFORM_NAMEEnable = false;
        this.isPAGE_NOEnable = false;
	      this.masterKey = ComponentConfig.masterKey;
	    }
	    if ( ComponentConfig.masterKeyArr != null)
	    {
	      this.masterKeyArr = ComponentConfig.masterKeyArr;
	    }
	    if ( ComponentConfig.masterKeyNameArr != null)
	    {
	      this.masterKeyNameArr = ComponentConfig.masterKeyNameArr;
	    }

	    if ( ComponentConfig.isChild == true)
	    {
	      this.isChild = true;
	      this.isFORM_NAMEEnable = false;
	    }

	    if ( ComponentConfig.formattedWhere != null)
	    {
	      this.formattedWhere = ComponentConfig.formattedWhere ;
	      this.isSearch =  true;
	      if (typeof this.grid !== "undefined"){
	         this.executeQuery(this.grid)
	      }

	    }
	    if ( ComponentConfig.clearComponent == true)
	    {
		this.cancelHandler();
		this.grid.cancel;
		this.grid.data = [];
		this.Body =[];
	    }
	      if (ComponentConfig.clearScreen == true)
	      {
		this.grid.data = [];
	      }

    }

  }

}


