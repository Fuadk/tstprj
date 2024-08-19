
import { Component, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadEvent, SelectEvent, ClearEvent } from '@progress/kendo-angular-upload';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';

import { userInformation } from './myModels';
import {dbService} from './dbService';
import { starServices } from 'starlib';
declare function getParamConfig(): any;

const createFormGroup = dataItem => new FormGroup({
  'USERNAME' : new FormControl(dataItem.USERNAME  , Validators.required ) ,
  'FULLNAME' : new FormControl(dataItem.FULLNAME ) ,
  'SIGN' : new FormControl(dataItem.SIGN ) ,
  'DIV' : new FormControl(dataItem.DIVS ) ,
  'DEPT' : new FormControl(dataItem.DEPT ) ,
  'PHONE' : new FormControl(dataItem.PHONE ) ,
  'GROUPNAME' : new FormControl(dataItem.GROUPNAME ) ,
  'LANGUAGE_NAME' : new FormControl(dataItem.LANGUAGE_NAME ) ,
  'IP_RESTRICT' : new FormControl(dataItem.IP_RESTRICT ) ,
  'WEB_ENABLED' : new FormControl(dataItem.WEB_ENABLED ) ,
  'WEB_BROWSER' : new FormControl(dataItem.WEB_BROWSER ) ,
  'FLEX_FLD1' : new FormControl(dataItem.FLEX_FLD1 ) ,
  'FLEX_FLD2' : new FormControl(dataItem.FLEX_FLD2 ) ,
  'FLEX_FLD3' : new FormControl(dataItem.FLEX_FLD3 ) ,
  'FLEX_FLD4' : new FormControl(dataItem.FLEX_FLD4 ) ,
  'FLEX_FLD5' : new FormControl(dataItem.FLEX_FLD5 ) ,
  'DEFAULT_PRINTER' : new FormControl(dataItem.DEFAULT_PRINTER ) ,
  'EXTRA_PERC' : new FormControl(dataItem.EXTRA_PERC ) ,
  'FIN_ADMIN' : new FormControl(dataItem.FIN_ADMIN ) ,
  'LOGDATE' : new FormControl(dataItem.LOGDATE ) ,
  'LOGNAME' : new FormControl(dataItem.LOGNAME ) ,
  'PASSWORD' : new FormControl(dataItem.PASSWORD ) ,
  'TEAM' : new FormControl(dataItem.TEAM ) ,
  'LEADER' : new FormControl(dataItem.LEADER ) ,
  'TODAY' : new FormControl(dataItem.TODAY ) ,
  'TOMORROW' : new FormControl(dataItem.TOMORROW ) ,
  'NOTES' : new FormControl(dataItem.NOTES ) 
  });
  

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})

export class TestFormComponent {
  @ViewChild("pdf") pdf: PDFExportComponent
  public  title = "User Information";
  public  form: FormGroup; 
  private formInitialValues =   new userInformation();   
  public paramConfig;
  
  constructor(private   dbService: dbService, public starServices: starServices) {
    this.paramConfig = getParamConfig();
  }

     public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
    this.form = createFormGroup(
        this.formInitialValues
    );
    var page = "&_QUERY=GET_ADM_USER_INFORMATION&USERNAME=STAR";
    var body = "";
    
    this.dbService.getData(page, body).subscribe(result => {
      if (this.paramConfig.DEBUG_FLAG) console.log(result)
      if (result != null) {
        if (this.paramConfig.DEBUG_FLAG) console.log(result.data[0].data[0]);
        var rec = result.data[0].data[0];
        this.form.reset(rec);
      }
    });

    
  }
  /*
  private saveURL = 'http://localhost:8090/attt&file=x' ;
  public uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  public uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  public uploadEventHandler(e: UploadEvent) 
     {
       if (this.paramConfig.DEBUG_FLAG) console.log("uploadEventHandler:")
       if (this.paramConfig.DEBUG_FLAG) console.log(e)
       var page =  this.starServices.SERVER_URL +  '/api?upload=y';

         this.starServices.postUpload(page, e.files).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG) console.log('result', result); });

     }
*/
public currentFileUpload;
public clearEventHandler(e: ClearEvent): void { if (this.paramConfig.DEBUG_FLAG) console.log("clearEventHandler:")}
public removeEventHandler(e: SelectEvent): void {if (this.paramConfig.DEBUG_FLAG) console.log("removeEventHandler:")}
public completeEventHandler(e: SelectEvent): void {if (this.paramConfig.DEBUG_FLAG) console.log("completeEventHandler:")}
public uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
public uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint

public selectEventHandler(e: SelectEvent): void {
  const that = this;
  e.files.forEach((file) => {
       if (this.paramConfig.DEBUG_FLAG) console.log(`File selected: ${file.name}`);
       if (!file.validationErrors) {
            this.currentFileUpload = file;

       }

  });
}
public kendoFiles;
public filesSet;

public uploadEventHandler(e: UploadEvent) {

  this.kendoFiles = e.files;
  this.filesSet = new Set<File>();
  for (let i = 0; i < this.kendoFiles.length; i++) {
  const rawFile: File = this.kendoFiles[i].rawFile;
  if (this.paramConfig.DEBUG_FLAG) console.log("rawFile:" + rawFile)
  if (this.paramConfig.DEBUG_FLAG) console.log( rawFile.name + " " + rawFile.lastModified)
  this.filesSet.add(rawFile);
  }
  
  var documentversionid = "123";
  var page = "?action=upload"
  this.starServices.uploadFile(page, this.filesSet,"123");

/*
  // alert('file uploaded=' + e.files[0].name);
  if (this.paramConfig.DEBUG_FLAG) console.log('file uploaded=' + e.files[0].name);
  if (this.paramConfig.DEBUG_FLAG) console.log(this.currentFileUpload);
  this.starServices.isLoading = true;
  this.starServices.uploadFile(this.currentFileUpload);
  */
  }
  public doProxyURL = true;
  public pdfexportURL = "pdfexport";
  public exportfileName = "contract123.pdf"
  public proxyData = {"orderno":"430"}
//https://angular.io/guide/build
  public pdfExport(){
    this.pdf.saveAs(this.exportfileName);
  }

  public pdfExportTest(){
    var Group = this.pdf.export().then((data) =>{
      if (this.paramConfig.DEBUG_FLAG) console.log("data:",data);
    })
    if (this.paramConfig.DEBUG_FLAG) console.log("Group:",Group);
  }

}
