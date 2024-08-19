import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
//import { AnyARecord } from 'dns';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogCloseResult } from '@progress/kendo-angular-dialog';
import { Day, firstDayInWeek, getDate } from '@progress/kendo-date-math';
import { Md5 } from 'ts-md5/dist/md5';
import { formatDate } from '@angular/common';
import { tabsCodes, componentConfigDef } from './model';
import * as i0 from "@angular/core";
import * as i1 from "@progress/kendo-angular-notification";
import * as i2 from "@progress/kendo-angular-dialog";
import * as i3 from "@angular/common/http";
import * as i4 from "@progress/kendo-angular-l10n";
//export class starServices extends BehaviorSubject<GridDataResult> {
export class starServices {
    constructor(notificationService, dialogService, http, messages) {
        //super(null);
        //logger.warn("Warning message");
        this.notificationService = notificationService;
        this.dialogService = dialogService;
        this.http = http;
        this.messages = messages;
        this.createdItems = [];
        this.updatedItems = [];
        this.deletedItems = [];
        this.routine_name = "";
        this.saveChangesMsg = "Screen changed, are you sure you to navigate?";
        this.deleteDetailMsg = "Can not delete as detail has data.";
        this.pleaseConfirmMsg = "Please confirm";
        this.deleteConfirmMsg = "Are you sure you want to delete this record?";
        this.nothingToDeletelMsg = "No records to delete.";
        this.fieldsRequiredMsg = "Please enter required fields.";
        this.readOnlyMsg = "Can not save , your authority is readonly.";
        this.noAccessMsg = "You dont have access to this routine.";
        this.standardErrorMsg = "Error performing transaction";
        this.saveMasterMsg = "Save master record first.";
        this.USERNAME = "";
        this.hideAfter = 2000;
        this.StrAuth = "";
        this.MASTER_DB = "";
        this.limit = 1500;
        this.YesNoActions = [
            { text: 'No', primary: false },
            { text: 'Yes', primary: true }
        ];
        this.OkActions = [
            { text: 'Ok', primary: false }
        ];
        this.sessionParams = {};
        //private BASE_URL = 'https://odatasampleservices.azurewebsites.net/V4/Northwind/Northwind.svc/';
        //private BASE_URL = 'http://192.168.1.3:8090/api?_format=json&_limit=50';
        this.EPMENG_URL = ""; //'http://192.168.1.5:8092/format';
        //private EPMENG_URL = 'http://gmashro.com:8092/format';
        this.SERVER_URL = ""; // 'http://localhost:8090';
        //public SERVER_URL = 'http://gmashro.com:8090';
        this.BASE_URL = this.SERVER_URL + '/api?_format=json&_limit=' + this.limit;
        //private BASE_URL = 'http://gmashro.com:8090/api?_format=json&_limit=' + this.limit;
        this.eKycScr = "DSPEKYC";
        this.portalScr = "DSPPORTAL";
        this.syncFlag = 0;
        this.rulesPostQueryDef = {
            rulePtrsArr: [],
            rulesArr: [],
            actionPtrsArr: [],
            actionsArr: []
        };
        this.rulesPreQueryDef = {
            rulePtrsArr: [],
            rulesArr: [],
            actionPtrsArr: [],
            actionsArr: []
        };
        this.hostsArr = [];
        this.hostsMapArr = [];
        this.commitBody = [];
        this.inTrans = false;
        this.Body = [];
        this.commitCommands = ['INSERT', 'UPDATE', 'DELETE'];
    }
    // public query(state: any): void {
    //   let queryName = "";
    //   this.fetch(this, queryName)
    //     .subscribe((x:any) => super.next(x));
    // }
    removeRec(gridData, editedRowIndex) {
        //let result1 = JSON.parse(JSON.stringify(gridData));
        if (typeof editedRowIndex !== "undefined") {
            gridData.data.splice(editedRowIndex, 1);
            gridData.total = gridData.data.length;
            /*  //if (this.paramConfig.DEBUG_FLAG) console.log('remving editedRowIndex:' + editedRowIndex)
              result1.data.splice( editedRowIndex , 1 );
              result1.total = result1.data.length;*/
        }
        return gridData;
    }
    updateRec(gridData, editedRowIndex, NewVal) {
        gridData.data[editedRowIndex] = NewVal;
        return gridData;
    }
    addRec(gridData, NewVal) {
        gridData.data.push(NewVal);
        /* let result ={"data":[], total:0};
         let result1 = JSON.parse(JSON.stringify(gridData));
         NewVal = this.parseToDate(NewVal);
         result1.data.push(NewVal);
         result.data = result1.data;
         result.total = result.data.length;
         return result1;*/
        return gridData;
    }
    formatWhere(NewVal) {
        function isDate(value) {
            return value instanceof Date;
        }
        function FORMAT_ISO_parse(d) {
            var dateIso = d.toISOString();
            var dateIsoArr = dateIso.split("T");
            dateIso = dateIsoArr[0] + " " + dateIsoArr[1];
            dateIso = dateIso.substr(0, 19);
            return dateIso;
        }
        function parseValue(key, value) {
            let phrase = "";
            //if (this.paramConfig.DEBUG_FLAG) console.log("isDate:" , isDate (value), value);
            if (isDate(value)) {
                //value = getDate(value);
                //value = FORMAT_ISO_parse(value);
                value = value.toISOString();
            }
            if (typeof value === 'string') {
                // it's a string
                if (value != "") {
                    let operators = "<>!=";
                    let operatorVal = "";
                    let trimeedVal = value.trim();
                    let firstChar = trimeedVal.charAt(0);
                    let n = operators.search(firstChar);
                    if (n != -1) {
                        if (firstChar == "|")
                            operatorVal = " = '" + value + "' ";
                        else
                            operatorVal = value;
                    }
                    else if (value.toUpperCase().search("%") != -1) {
                        operatorVal = " like '" + value + "' ";
                        //if (this.paramConfig.DEBUG_FLAG) console.log("operatorVal:"+ operatorVal)
                    }
                    else {
                        operatorVal = " = '" + value + "' ";
                    }
                    phrase = key + encodeURIComponent(operatorVal);
                    //phrase = key + operatorVal;
                }
            }
            else {
                // it's something else
                let operatorVal = " = '" + value + "' ";
                phrase = key + encodeURIComponent(operatorVal);
            }
            return phrase;
        }
        let wherePhrase = "";
        let whereClause = "";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("formatWhere:");
        if (this.paramConfig.DEBUG_FLAG)
            console.log(NewVal);
        Object.keys(NewVal).forEach(function (key) {
            let value = NewVal[key];
            //if (this.paramConfig.DEBUG_FLAG) console.log(key + ":" + value);
            if ((value != "") && (value != null)) {
                let phrase = parseValue(key, value);
                if (wherePhrase == "") {
                    wherePhrase = wherePhrase + phrase;
                }
                else {
                    wherePhrase = wherePhrase + " and " + phrase;
                }
            }
        });
        if (wherePhrase != "")
            whereClause = "&_WHERE=" + wherePhrase;
        else
            whereClause = "&_WHERE=";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("whereClause:" + whereClause);
        return whereClause;
    }
    checkDBLoc(theURL) {
        let paramConfig = getParamConfig();
        if (this.paramConfig.DBLoc != "") {
            let userName = paramConfig.USERNAME;
            theURL = theURL + "&DBLoc=" + userName;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("theURL:", theURL);
        return theURL;
    }
    fetch(object, queryName) {
        //const queryStr = `${toODataString(state)}&$count=true`;
        const queryStr = ``;
        this.loading = true;
        let theURL = `${this.BASE_URL}${queryName}`;
        theURL = this.checkDBLoc(theURL);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        return this.http
            .get(`${theURL}`, this.httpOptions)
            .pipe(catchError((err) => {
            return throwError(err);
        }), map((response) => ({ data: response['data'] })), tap(data => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("status data: ", data);
            this.loading = false;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:this.rulesPostQueryDef", this.rulesPostQueryDef);
            let statusRec = {};
            statusRec = this.checkRules(object, this.rulesPostQueryDef, data, "POST_QUERY");
            if (this.paramConfig.DEBUG_FLAG)
                console.log("statusRec:post:POST_QUERY:fetch:", statusRec, statusRec['status']);
            if (statusRec['status'] == -1) {
                this.showNotification("error", "Rule:" + statusRec['msg']);
            }
        }));
    }
    /* public remove( page: any):Observable<any> {
         this.delete(page)
             .subscribe((x:any) => super.next(x));
  
             return 0;
     }
  */
    delete(Page) {
        //const queryStr = `${toODataString(state)}&$count=true`;
        const queryStr = ``;
        this.loading = true;
        let theURL = `${this.BASE_URL}${Page}`;
        theURL = this.checkDBLoc(theURL);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        return this.http
            .delete(`${theURL}`, this.httpOptions)
            .pipe(catchError((err) => {
            return throwError(err);
        }), map((response) => ({ data: response['data'] })), tap(() => this.loading = false));
    }
    post_delete(Page, Body) {
        //const queryStr = `${toODataString(state)}&$count=true`;
        const queryStr = ``;
        this.loading = true;
        //if (this.paramConfig.DEBUG_FLAG) console.log("post:Page:",Page," Body:",Body)
        let theURL = `${this.BASE_URL}${Page}`;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        //if (this.paramConfig.DEBUG_FLAG) console.log("this.StrAuth:" + this.StrAuth);
        return this.http
            .post(`${theURL}`, Body, this.httpOptions)
            .pipe(catchError((err) => {
            return throwError(err);
        }), map((response) => ({ data: response['data'] })), tap(data => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("status data:", data);
            this.loading = false;
        }));
    }
    post(object, Page, Body) {
        //const queryStr = `${toODataString(state)}&$count=true`;
        const queryStr = ``;
        this.loading = true;
        //if (this.paramConfig.DEBUG_FLAG) console.log("post:Page:",Page," Body:",Body)
        let statusRec = {};
        statusRec = this.checkRules(object, this.rulesPreQueryDef, Body, "PRE_QUERY");
        if (this.paramConfig.DEBUG_FLAG)
            console.log("statusRec:post:PRE_QUERY", statusRec, statusRec['status']);
        if (statusRec['status'] == -1) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("statusRec: found -1");
            this.showNotification("error", "Rule:" + statusRec['msg']);
            Body[0]._QUERY = "";
        }
        let theURL = `${this.BASE_URL}${Page}`;
        theURL = this.checkDBLoc(theURL);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        //if (this.paramConfig.DEBUG_FLAG) console.log("this.StrAuth:" , this.StrAuth , theURL);
        //if (this.paramConfig.DEBUG_FLAG) console.log("this.StrAuth: with URL" , this.StrAuth , theURL);
        return this.http
            .post(`${theURL}`, Body, this.httpOptions)
            .pipe(catchError((err) => {
            console.log("statusRec['msg'] :", statusRec['msg'], " err.error :", err.error);
            //if ( (typeof statusRec['msg'] != "undefined") || (statusRec['msg'] != "")) {
            if ((statusRec['msg'] != "")) {
                if (typeof err.error == "undefined") {
                    err = statusRec['msg'];
                }
                else
                    err.error.error = statusRec['msg'];
            }
            return throwError(err);
        }), map((response) => ({ data: response['data'] })), tap(data => {
            //if (this.paramConfig.DEBUG_FLAG) console.log("status data:", data);
            this.loading = false;
            //if (this.paramConfig.DEBUG_FLAG) console.log("test:this.rulesPostQueryDef", this.rulesPostQueryDef)
            this.syncFlag = 0;
            let statusRec = {};
            statusRec = this.checkRules(object, this.rulesPostQueryDef, data, "POST_QUERY");
            if (this.paramConfig.DEBUG_FLAG)
                console.log("statusRec:post:POST_QUERY", statusRec, statusRec['status']);
            if (statusRec['status'] == -1) {
                this.showNotification("error", "Rule:" + statusRec['msg']);
            }
        }));
    }
    /////////////////////////////////////////////////////
    postUpload(Page, Body) {
        //const queryStr = `${toODataString(state)}&$count=true`;
        const queryStr = ``;
        this.loading = true;
        let theURL = Page;
        this.httpOptions = {
            headers: new HttpHeaders({
                'authorization': this.StrAuth
            })
        };
        //if (this.paramConfig.DEBUG_FLAG) console.log("this.StrAuth:" + this.StrAuth);
        return this.http
            .post(`${theURL}`, Body, this.httpOptions)
            .pipe(catchError((err) => {
            return throwError(err);
        }), map((response) => ({ data: response['data'] })), tap(() => this.loading = false));
    }
    /////////////////////////////////////////////////////
    uploadFile(page, filesSet, id) {
        filesSet.forEach(file => {
            // create a new multipart-form for every file
            const formdata = new FormData();
            formdata.append('file', file);
            formdata.append('id', id);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("uploadFile page:" + page);
            let apiURL = this.SERVER_URL + '/api/att' + page;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("apiURL:" + apiURL);
            if (this.paramConfig.DEBUG_FLAG)
                console.log(formdata);
            formdata.forEach(entries => console.log(JSON.stringify(entries)));
            this.postUpload(apiURL, formdata).subscribe(result => {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log('result', result);
            });
        });
    }
    uploadFileOld(file) {
        const formdata = new FormData();
        formdata.append('file', file); //the uploaded file content
        formdata.append('documentVersionId', '123'); //I need to pass some additional info to the server besides the File data
        let apiURL = this.SERVER_URL + '/api?upload=y';
        if (this.paramConfig.DEBUG_FLAG)
            console.log("apiURL:" + apiURL);
        if (this.paramConfig.DEBUG_FLAG)
            console.log(formdata);
        formdata.forEach(entries => console.log(JSON.stringify(entries)));
        //const apiURL = this.api_path + 'Upload';     //calling http://localhost:52333/api/UploadController
        this.postUpload(apiURL, formdata).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log('result', result);
        });
        /*const uploadReq = new HttpRequest('POST', apiURL, formdata, {
           reportProgress: true
        });
        this.httpclient.request(uploadReq).subscribe(event => {
           if (event.type === HttpEventType.UploadProgress) {
               this.progress = Math.round(100 * event.loaded / event.total);
           }
       });
       */
    }
    /////////////////////////////////////////////////////
    hasChanges() {
        return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
    }
    addToBody(NewVal, Body) {
        Body.push(NewVal);
        // if (this.paramConfig.DEBUG_FLAG) console.log('NewVal : HF Please'  + JSON.stringify(NewVal));
        return Body;
    }
    showNotification(styleNote, msg) {
        let hideAfter = this.hideAfter;
        if (styleNote == "error")
            hideAfter = 5000;
        this.notificationService.show({
            content: msg,
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'center', vertical: 'bottom' },
            //            stacking: { stacking: 'down' },
            type: { style: styleNote, icon: true },
            //closable: true,
            hideAfter: hideAfter
        });
    }
    goRecordAct(target, object) {
        let rec;
        if (object.paramConfig.DEBUG_FLAG)
            console.log(target);
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.CurrentRec:" + object.CurrentRec);
        if (object.paramConfig.DEBUG_FLAG)
            console.log(object.executeQueryresult);
        if (target == "first") {
            object.CurrentRec = 0;
        }
        else if (target == "last") {
            object.CurrentRec = object.executeQueryresult.total - 1;
        }
        else if (target == "next") {
            if (object.CurrentRec < object.executeQueryresult.total - 1)
                object.CurrentRec = object.CurrentRec + 1;
        }
        else if (target == "prev") {
            if (object.CurrentRec > 0)
                object.CurrentRec = object.CurrentRec - 1;
        }
        rec = object.executeQueryresult.data[object.CurrentRec];
        if (object.paramConfig.DEBUG_FLAG)
            console.log("------rec:", rec);
        if (object.paramConfig.DEBUG_FLAG)
            console.log(object.form.value);
        if (typeof rec !== "undefined") {
            object.form.patchValue(rec);
            object.form.markAsPristine();
            object.form.markAsUntouched();
            //object.form.reset(rec, {emitEvent: object.emitEvent != null ? object.emitEvent : true});
            if (object.disableEmitReadCompleted != true)
                object.readCompletedOutput.emit(object.form.value);
            if (object.paramConfig.DEBUG_FLAG)
                console.log("ATT:object.callBackFunction:", object.callBackFunction);
            if (typeof object.callBackFunction !== "undefined")
                object.callBackFunction(rec);
        }
        else
            object.clearCompletedOutput.emit([]);
    }
    goRecord(target, object) {
        if (typeof object.executeQueryresult != "undefined") {
            if (this.paramConfig.DEBUG_FLAG)
                console.log(object.form.dirty);
            if (object.form.dirty == true) {
                let dialogStruc = {
                    msg: this.saveChangesMsg,
                    title: this.pleaseConfirmMsg,
                    info: target,
                    object: object,
                    action: this.YesNoActions,
                    callback: this.goRecordAct
                };
                this.showConfirmation(dialogStruc);
            }
            else {
                this.goRecordAct(target, object);
            }
        }
    }
    showConfirmation(dialogStruc) {
        let dialogResult;
        const dialog = this.dialogService.open({
            title: dialogStruc.title,
            content: dialogStruc.msg,
            actions: dialogStruc.action,
            width: 450,
            height: 200,
            minWidth: 250
        });
        dialog.result.subscribe((result) => {
            if (result instanceof DialogCloseResult) {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log('close');
            }
            else {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log('action', result);
            }
            dialogResult = JSON.parse(JSON.stringify(result));
            if (dialogResult.primary == true) {
                if (dialogStruc.hasOwnProperty('callback')) {
                    dialogStruc.callback(dialogStruc.info, dialogStruc.object);
                }
            }
        });
    }
    /**************** Form functions **************/
    executeQuery_form(form, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("star-services executeQuery_form object.form:");
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.isSearch:" + object.isSearch);
        //if (this.paramConfig.DEBUG_FLAG) console.log(object.form.value);
        //if (this.paramConfig.DEBUG_FLAG) console.log(form.value);
        if (typeof object.form !== "undefined") {
            if ((object.form.dirty == true) && (object.isSearch != true)) {
                let dialogStruc = {
                    msg: this.saveChangesMsg,
                    title: this.pleaseConfirmMsg,
                    info: form,
                    object: object,
                    action: this.YesNoActions,
                    callback: this.executeQueryAct_form
                };
                this.showConfirmation(dialogStruc);
            }
            else {
                this.executeQueryAct_form(form, object);
            }
        }
        else {
            this.executeQueryAct_form(form, object);
        }
    }
    // routine_name from : https://www.telerik.com/kendo-angular-ui/components/dateinputs/datepicker/integration-with-json/
    parseToDate(json) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("json:in:", json);
        Object.keys(json).map(key => {
            let Val1 = json[key];
            if (this.paramConfig.DEBUG_FLAG)
                console.log("key:", key, Val1, typeof Val1);
            //let n = key.toUpperCase().search("DATE");
            //if (n != -1){
            if (typeof Val1 != "number") { //it is not a number, check more
                if ((Val1 != null) && (Val1.length > 7)) {
                    const date = new Date(Val1);
                    let checkYYYY = isNaN(parseInt(Val1.substring(0, 4)));
                    let timeVal = date.getTime();
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("timeVal:", timeVal, isNaN(timeVal));
                    if (!isNaN(timeVal) && (timeVal > 0) && !checkYYYY) {
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("it is a date");
                        //if (this.paramConfig.DEBUG_FLAG) console.log("key:"+key + ":" + date.getTime());
                        json[key] = date;
                    }
                }
            }
        });
        if (this.paramConfig.DEBUG_FLAG)
            console.log("json:out:", json);
        return json;
    }
    dateYYYYMMDD(object, json) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("json:", json);
        Object.keys(json).map(key => {
            let n = key.toUpperCase().search("_DATE");
            if (n != -1) {
                let dateOrg = json[key];
                let date = new Date(json[key]);
                //date = toLocalDate(date);
                let timeVal = date.getTime();
                if (!isNaN(timeVal) && (timeVal > 0)) {
                    //if (this.paramConfig.DEBUG_FLAG) console.log("key:"+key + ":" + date.getTime());
                    //let array = dateOrg.split("T")
                    dateOrg = formatDate(dateOrg, object.paramConfig.DateFormat, object.paramConfig.dateLocale);
                    json[key] = dateOrg;
                }
            }
        });
        return json;
    }
    executeQueryAct_form(form, object) {
        if (typeof form === "undefined")
            return;
        let paramConfig = {
            "Name": "childRecords",
            "Val": 0
        };
        setParamConfig(paramConfig);
        if (object.isChild == true) {
            if (object.isSearch != true) {
                //object.form.reset();
                object.form.reset(object.formInitialValues);
                if ((typeof object.masterKeyNameArr != "undefined") && (object.masterKeyNameArr.length != 0)) {
                    for (let i = 0; i < object.masterKeyNameArr.length; i++) {
                        object.formInitialValues[object.masterKeyNameArr[i]] = object.masterKeyArr[i];
                    }
                }
                else {
                    object.formInitialValues[object.masterKeyName] = object.masterKey;
                }
                //object.formInitialValues[object.masterKeyName] = object.masterKey;
                object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("object.masterKeyName:" + object.masterKeyName);
                object.isSearch = true;
                form = object.form.value;
            }
        }
        let Page = "&_query=" + object.getCMD;
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.isSearch:" + object.isSearch);
        if (object.isSearch == true) {
            if (object.paramConfig.DEBUG_FLAG)
                console.log(form.value);
            let NewVal = form;
            object.isSearch = false;
            if ((typeof object.formattedWhere === "undefined") || (object.formattedWhere == null)) {
                Page = Page + object.starServices.formatWhere(NewVal);
            }
            else {
                Page = Page + object.formattedWhere;
                object.formattedWhere = null;
            }
            if ((typeof object.OrderByClause !== "undefined") && (object.OrderByClause != ""))
                Page = Page + "&_ORDERBY=" + object.OrderByClause;
        }
        object.executeQueryresult = [];
        object.executeQueryresult.result = 0;
        object.CurrentRec = 0;
        Page = encodeURI(Page);
        object.starServices.fetch(object, Page).subscribe((result) => {
            if (result != null) {
                for (let i = 0; i < result.data[0].data.length; i++)
                    result.data[0].data[i] = object.starServices.parseToDate(result.data[0].data[i]);
                result = {
                    data: result.data[0].data,
                    total: parseInt(result.data[0].data.length, 10)
                };
                if (object.isMaster)
                    object.starServices.showNotification('success', "Records retrieved : " + result.total);
                object.executeQueryresult = result;
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("object.executeQueryresult:", object.executeQueryresult);
                if (typeof result.data[object.CurrentRec] !== "undefined") {
                    object.form.patchValue(result.data[object.CurrentRec]);
                    object.form.markAsPristine();
                    object.form.markAsUntouched();
                }
                object.form.reset(result.data[object.CurrentRec], { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("form servicereadCompletedOutput");
                if (object.paramConfig.DEBUG_FLAG)
                    console.log(object.readCompletedOutput);
                let paramConfig = {
                    "Name": "childRecords",
                    "Val": result.total
                };
                setParamConfig(paramConfig);
                if (result.total != 0)
                    object.isNew = false;
                if (object.disableEmitReadCompleted != true) {
                    if (result.total != 0) {
                        object.readCompletedOutput.emit(object.form.value);
                    }
                    else
                        object.clearCompletedOutput.emit([]);
                }
                if (typeof object.callBackFunction !== "undefined")
                    object.callBackFunction(result.data[0]);
            }
            this.setPrimarKeyNameArr(object, true);
        }, (err) => {
            //alert('error:' + err.message);
            this.showErrorMsg(object, err);
        });
    }
    execstarServices_form_inTrans(NewVal, object) {
        this.commitBody.push(NewVal);
        if (object.action != "REMOVE") {
            if (typeof object.executeQueryresult !== "undefined") {
                if (object.isNew == true) {
                    object.executeQueryresult.data.push(NewVal);
                    object.executeQueryresult.total = object.executeQueryresult.total + 1;
                }
                else {
                    object.executeQueryresult.data[object.CurrentRec] = NewVal;
                }
            }
            else {
                let NewValArr = [];
                NewValArr.push(NewVal);
                let result = {
                    data: NewValArr,
                    total: 1
                };
                object.executeQueryresult = result;
                object.CurrentRec = 0;
            }
            var data = [];
            data.push(NewVal);
            if (object.isNew == true) {
                object.isNew = false;
                if (typeof object.callBackPost_Insert !== "undefined") {
                    object.callBackPost_Insert.apply(object, data);
                }
            }
            else {
                if (typeof object.callBackPost_update !== "undefined") {
                    object.callBackPost_update.apply(object, data);
                }
            }
        }
        else {
            //REMOVE
            object.executeQueryresult.data.splice(object.CurrentRec, 1);
            object.executeQueryresult.total--;
            if (object.CurrentRec > 0) {
                object.CurrentRec--;
                object.form.reset(object.executeQueryresult.data[object.CurrentRec], { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                if (object.isNew == true)
                    object.isNew = false;
            }
            else {
                object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                object.isNew = true;
            }
            let NewVal1 = [];
            NewVal1.push(NewVal);
            if (typeof object.callBackRemoveAtt !== "undefined")
                object.callBackRemoveAtt(object, NewVal);
            if (typeof object.callBackPost_Remove !== "undefined") {
                // let NewVal1 = [];
                // NewVal1.push(NewVal);
                object.callBackPost_Remove.apply(object, NewVal1);
            }
        }
        if (object.action != "REMOVE") {
            object.form.reset(NewVal, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
        }
        if (object.diableEmitSave == true) { }
        else
            object.saveCompletedOutput.emit(NewVal);
        if (object.isChild == true) {
            let paramConfig = {
                "Name": "childRecords",
                "Val": object.executeQueryresult.total
            };
            setParamConfig(paramConfig);
        }
        object.action = "";
        this.setPrimarKeyNameArr(object, true);
    }
    execstarServices_form(NewVal, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("NewVal:", NewVal);
        object.addToBody(NewVal);
        let Page = "&_trans=Y";
        if (this.inTrans) {
            this.execstarServices_form_inTrans(NewVal, object);
            return;
        }
        this.post(object, Page, object.Body).subscribe(Page => {
            object.Body = [];
            if (this.paramConfig.DEBUG_FLAG)
                console.log("object.executeQueryresult.data:object.CurrentRec:" + object.CurrentRec + " object.action:" + object.action);
            if (this.paramConfig.DEBUG_FLAG)
                console.log(object.executeQueryresult);
            //if (typeof object.executeQueryresult !== "undefined")
            {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("here1");
                if (object.action != "REMOVE") {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log(object.executeQueryresult);
                    if (typeof object.executeQueryresult !== "undefined") {
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("object.isNew:" + object.isNew);
                        if (object.isNew == true) {
                            object.executeQueryresult.data.push(NewVal);
                            object.executeQueryresult.total = object.executeQueryresult.total + 1;
                            //object.CurrentRec++;
                        }
                        else {
                            object.executeQueryresult.data[object.CurrentRec] = NewVal;
                        }
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("object.executeQueryresult post");
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log(object.executeQueryresult);
                    }
                    else {
                        let NewValArr = [];
                        NewValArr.push(NewVal);
                        let result = {
                            data: NewValArr,
                            total: 1
                        };
                        object.executeQueryresult = result;
                        object.CurrentRec = 0;
                    }
                    this.showNotification('success', "Data saved successfully");
                    var data = [];
                    data.push(NewVal);
                    if (object.isNew == true) {
                        object.isNew = false;
                        if (typeof object.callBackPost_Insert !== "undefined") {
                            //object.callBackPost_Insert(object, NewVal);
                            object.callBackPost_Insert.apply(object, data);
                        }
                    }
                    else {
                        if (typeof object.callBackPost_Update !== "undefined") {
                            object.callBackPost_Update.apply(object, data);
                        }
                    }
                }
                else {
                    //REMOVE
                    object.executeQueryresult.data.splice(object.CurrentRec, 1);
                    object.executeQueryresult.total--;
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("object.CurrentRec:" + object.CurrentRec);
                    if (object.CurrentRec > 0) {
                        object.CurrentRec--;
                        object.form.reset(object.executeQueryresult.data[object.CurrentRec], { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                        if (object.isNew == true)
                            object.isNew = false;
                    }
                    else {
                        object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
                        object.isNew = true;
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("object.isNew:" + object.isNew);
                    }
                    let NewVal1 = [];
                    NewVal1.push(NewVal);
                    if (typeof object.callBackRemoveAtt !== "undefined")
                        object.callBackRemoveAtt(object, NewVal1);
                    if (typeof object.callBackPost_Remove !== "undefined") {
                        object.callBackPost_Remove.apply(object, NewVal1);
                    }
                }
            }
            if (this.paramConfig.DEBUG_FLAG)
                console.log("here2");
            if (object.action != "REMOVE") {
                object.form.reset(NewVal, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
            }
            if (object.diableEmitSave == true) { }
            else
                object.saveCompletedOutput.emit(NewVal);
            if (object.isChild == true) {
                let paramConfig = {
                    "Name": "childRecords",
                    "Val": object.executeQueryresult.total
                };
                setParamConfig(paramConfig);
            }
            object.action = "";
            this.setPrimarKeyNameArr(object, true);
        }, err => {
            //alert ('error:' + err.message);
            this.showErrorMsg(object, err);
        });
    }
    saveChanges_form(form, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log('saveChanges_form : object.isNew :' + object.isNew);
        if (this.paramConfig.DEBUG_FLAG)
            console.log(object.componentConfig.routineAuth);
        if (object.componentConfig.routineAuth != null) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("authLevel:" + object.componentConfig.routineAuth.authLevel);
            if (object.componentConfig.routineAuth.authLevel != 2) {
                let dialogStruc = {
                    msg: this.readOnlyMsg,
                    title: "Warning",
                    info: null,
                    object: object,
                    action: this.OkActions,
                    callback: null
                };
                this.showConfirmation(dialogStruc);
                return;
            }
        }
        if ((!object.form.dirty) && object.isChild)
            return;
        if (object.form.invalid) {
            object.submitted = true;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("object.form:", object.form);
            this.showOkMsg(object, this.fieldsRequiredMsg, "Error");
            return;
        }
        let NewVal = {};
        //object.Body = [];   // only one transaction allowed in  form. Moved to form
        //NewVal =  form.value;
        NewVal = Object.assign({}, form.value, {});
        if (this.paramConfig.DEBUG_FLAG)
            console.log("----- NewVal:");
        if (this.paramConfig.DEBUG_FLAG)
            console.log(NewVal);
        if (object.isNew == true)
            NewVal["_QUERY"] = object.insertCMD;
        else
            NewVal["_QUERY"] = object.updateCMD;
        //object.isNew = false;
        this.execstarServices_form(NewVal, object);
    }
    enterQueryAct_form(form, object) {
        object.CurrentRec = 0;
        object.executeQueryresult = [];
        object.executeQueryresult.result = 0;
        object.isSearch = true;
        object.isNew = false;
        if (object.paramConfig.DEBUG_FLAG)
            console.log('enterQuery : object.isSearch:' + object.isSearch);
        object.clearCompletedOutput.emit(object.formInitialValues);
        object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
        object.starServices.setPrimarKeyNameArr(object, false);
    }
    setPrimarKeyNameArr(object, value) {
        if (typeof object.primarKeyReadOnlyArr !== "undefined") {
            let keys = Object.keys(object.primarKeyReadOnlyArr);
            for (let k = 0; k < keys.length; k++) {
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("[keys[k]:", keys[k], " value:", value);
                object.primarKeyReadOnlyArr[keys[k]] = value;
            }
        }
    }
    enterQuery_form(form, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:dirty:", object.form.dirty);
        if (object.form.dirty == true) {
            let dialogStruc = {
                msg: this.saveChangesMsg,
                title: this.pleaseConfirmMsg,
                info: form,
                object: object,
                action: this.YesNoActions,
                callback: this.enterQueryAct_form
            };
            this.showConfirmation(dialogStruc);
        }
        else {
            this.enterQueryAct_form(form, object);
        }
    }
    onCancel_form(e, object) {
        object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
        object.isSearch = false;
        object.isNew = true;
        object.clearCompletedOutput.emit(object.formInitialValues);
        object.executeQueryresult = [];
        object.executeQueryresult.result = 0;
        object.CurrentRec = 0;
    }
    showOkMsg(object, msg, severity) {
        let dialogStruc = {
            msg: msg,
            title: severity,
            info: null,
            object: object,
            action: this.OkActions,
            callback: null
        };
        this.showConfirmation(dialogStruc);
    }
    onRemove_form(form, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.isNew:", object.isNew);
        if (object.isNew == true) {
            this.onCancel_form(null, object);
            return;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.executeQueryresult:");
        if (this.paramConfig.DEBUG_FLAG)
            console.log(object.executeQueryresult);
        if ((typeof object.executeQueryresult !== "undefined") && (object.executeQueryresult.total == 0)) {
            this.showOkMsg(object, this.nothingToDeletelMsg, "Warning");
            return;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log('onRemove : isChild ' + object.isChild + " object.isMaster:" + object.isMaster);
        let NewVal = form.value;
        if (this.paramConfig.DEBUG_FLAG)
            console.log(NewVal);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.executeQueryresult:" + object.executeQueryresult);
        if (object.isChild == false) {
            var paramConfig = getParamConfig();
            if (this.paramConfig.DEBUG_FLAG)
                console.log(paramConfig);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("paramConfig.childRecords:" + paramConfig.childRecords);
            if (typeof paramConfig.childRecords === "undefined") {
                paramConfig.childRecords = 0;
            }
            if ((paramConfig.childRecords != 0) && (object.isMaster == true)) {
                let dialogStruc = {
                    msg: this.deleteDetailMsg,
                    title: "Warning",
                    info: null,
                    object: object,
                    action: this.OkActions,
                    callback: null
                };
                this.showConfirmation(dialogStruc);
                return;
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log(paramConfig);
        let dialogStruc = {
            msg: this.deleteConfirmMsg,
            title: this.pleaseConfirmMsg,
            info: form,
            object: object,
            action: this.YesNoActions,
            callback: this.Remove_formAct
        };
        this.showConfirmation(dialogStruc);
    }
    Remove_formAct(form, object) {
        if (object.paramConfig.DEBUG_FLAG)
            console.log("in Remove_formAct");
        let NewVal = {};
        NewVal = form.value;
        if (object.paramConfig.DEBUG_FLAG)
            console.log(NewVal);
        //object.form.reset(object.formInitialValues);
        object.action = "REMOVE";
        NewVal["_QUERY"] = object.deleteCMD;
        object.starServices.execstarServices_form(NewVal, object);
    }
    onNew_form(e, object) {
        if (object.paramConfig.DEBUG_FLAG)
            console.log("onNew: object.masterKey:" + object.masterKey);
        object.form.reset(object.formInitialValues, { emitEvent: object.emitEvent != null ? object.emitEvent : true });
        object.clearCompletedOutput.emit(object.formInitialValues);
        object.isSearch = false;
        object.isNew = true;
        this.setPrimarKeyNameArr(object, false);
    }
    /******************* Grid functions  ********/
    addHandler_grid(object) {
        if (typeof object.masterKeyNameArr != "undefined") {
            if (object.isChild == true) {
                if (object.masterKeyArr[0] == "") {
                    this.showOkMsg(this, this.saveMasterMsg, "Error");
                    return;
                }
            }
            else {
                if (object.isChild == true) {
                    if (object.masterKey == "") {
                        this.showOkMsg(this, this.saveMasterMsg, "Error");
                        return;
                    }
                }
            }
        }
        if (object.paramConfig.DEBUG_FLAG)
            console.log("test41:object.gridInitialValues:", object.gridInitialValues);
        object.saveCurrent();
        this.setPrimarKeyNameArr(object, false);
        /* object.gridInitialValues.MODULE = object.masterKey;*/
        if ((typeof object.masterKeyNameArr != "undefined") && (object.masterKeyNameArr.length != 0)) {
            this.setPrimarKeyNameArr(object, false);
            if (object.isChild == true) {
                for (let i = 0; i < object.masterKeyNameArr.length; i++) {
                    let readOnly = "is" + object.masterKeyNameArr[i] + "readOnly";
                    if (object.primarKeyReadOnlyArr) {
                        object.primarKeyReadOnlyArr[readOnly] = true;
                    }
                    object.gridInitialValues[object.masterKeyNameArr[i]] = object.masterKeyArr[i];
                }
            }
        }
        else {
            if (object.paramConfig.DEBUG_FLAG)
                console.log("test4:object.masterKeyName:", object.masterKeyName);
            if (object.masterKeyName != "") {
                object.gridInitialValues[object.masterKeyName] = object.masterKey;
            }
        }
        if (object.paramConfig.DEBUG_FLAG)
            console.log("test42:object.gridInitialValues:", object.gridInitialValues);
        object.closeEditor();
        object.formGroup = object.createFormGroupGrid(object.gridInitialValues);
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.formGroup:", object.formGroup);
        object.isNew = true;
        object.grid.addRow(object.formGroup);
        //this.setPrimarKeyNameArr(object, false);
    }
    removeHandler_grid(sender, object) {
        //sender.cancelCell();
        let paramConfig = getParamConfig();
        if (object.paramConfig.DEBUG_FLAG)
            console.log("removeHandler_grid paramConfig:object.isMaster " + object.isMaster);
        if (object.paramConfig.DEBUG_FLAG)
            console.log(paramConfig);
        if ((paramConfig.childRecords != 0) && (object.isMaster == true)) {
            let dialogStruc = {
                msg: this.deleteDetailMsg,
                title: "Warning",
                info: null,
                object: object,
                action: this.OkActions,
                callback: null
            };
            this.showConfirmation(dialogStruc);
            return;
        }
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.editedRowIndex :", object.editedRowIndex);
        if (typeof object.editedRowIndex !== "undefined") {
            let NewVal = {};
            let grid_data = JSON.parse(JSON.stringify(object.grid.data));
            NewVal = grid_data.data[object.editedRowIndex];
            let curCMD = NewVal["_QUERY"];
            if (object.paramConfig.DEBUG_FLAG)
                console.log("check:NewVal:_QUERY", NewVal["_QUERY"]);
            let result1 = object.starServices.removeRec(object.grid.data, object.editedRowIndex);
            object.grid.data = result1;
            if (object.paramConfig.DEBUG_FLAG)
                console.log("check:NewVal:", NewVal);
            NewVal["_QUERY"] = object.deleteCMD;
            if (curCMD != object.insertCMD) {
                object.addToBody(NewVal);
                object.removedRec.push(NewVal);
            }
        }
        else
            object.cancelHandler();
    }
    saveCurrent_grid(object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("saveCurrent_grid:object.formGroup:", object.formGroup);
        if (object.formGroup) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("saveCurrent_grid:object.formGroup:", object.formGroup);
            let NewVal = {};
            NewVal = Object.assign({}, object.formGroup.value);
            if (this.paramConfig.DEBUG_FLAG)
                console.log('check:dirty :', object.formGroup.dirty, " isNew:", object.isNew, " NewVal: ", NewVal);
            if (object.formGroup.dirty === true) {
                if (object.isNew == true) {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("here1 NewVal", NewVal);
                    //let result = object.starServices.addRec(object.grid.data, NewVal) ;
                    // object.grid.data = result;
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log(object.grid.data);
                    if (object.grid.data == null || typeof object.grid.data.data == "undefined")
                        object.grid.data = { data: [], total: 0 };
                    //object.grid.data.data.push(NewVal);
                    object.grid.data.data.splice(0, 0, NewVal);
                    NewVal["_QUERY"] = object.insertCMD;
                }
                else {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log('check:object.grid.data:', object.grid.data, " NewVal:", NewVal);
                    //NewVal = this.parseToDate(NewVal);
                    if (object.grid.data.data[object.editedRowIndex]._QUERY == object.insertCMD) {
                        NewVal["_QUERY"] = object.insertCMD;
                    }
                    else {
                        NewVal["_QUERY"] = object.updateCMD;
                    }
                    object.grid.data.data[object.editedRowIndex] = NewVal;
                    //let result1 = object.starServices.updateRec(object.grid.data , object.editedRowIndex, NewVal );
                    //object.grid.data = result1;
                }
                //object.addToBody(NewVal); // addToBody will be done at saveChanges_grid to avoid duplicte update since object.grid.data.data is getting updated
                if (this.paramConfig.DEBUG_FLAG)
                    console.log(object.grid.data);
            }
            if (this.paramConfig.DEBUG_FLAG)
                console.log("pre close");
            object.closeEditor();
            if (this.paramConfig.DEBUG_FLAG)
                console.log("post close");
        }
    }
    closeEditor_grid(object) {
        console.log("object.formGroup:closeEditor_grid");
        object.grid.closeRow(object.editedRowIndex);
        object.isNew = false;
        object.editedRowIndex = undefined;
        object.formGroup = undefined;
    }
    cancelHandler_grid(object) {
        object.closeEditor();
        object.isSearch = false;
    }
    saveChanges_grid_inTrans(grid, object, NewVal) {
        this.commitBody.push(NewVal);
        if (object.isChild == true) {
            let gridRecords = object.grid.data.data.length;
            let paramConfig = {
                "Name": "childRecords",
                "Val": gridRecords
            };
            setParamConfig(paramConfig);
        }
        if (typeof object.callBackPost_Save !== "undefined") {
            let NewVal1 = [];
            NewVal1.push(NewVal);
            object.callBackPost_Save.apply(object, NewVal1);
        }
        this.setPrimarKeyNameArr(object, true);
        object.saveCompletedOutput.emit(grid);
    }
    saveChanges_grid(grid, object) {
        if ((object.grid.data == null) || (typeof object.grid.data.data == "undefined")) {
            return;
        }
        let Error = false;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("pre object.saveCurrent");
        object.saveCurrent();
        if (object.componentConfig.routineAuth != null) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("authLevel:" + object.componentConfig.routineAuth.authLevel);
            if (object.componentConfig.routineAuth.authLevel != 2) {
                let dialogStruc = {
                    msg: this.readOnlyMsg,
                    title: "Warning",
                    info: null,
                    object: object,
                    action: this.OkActions,
                    callback: null
                };
                this.showConfirmation(dialogStruc);
                return;
            }
        }
        let NewVal = [];
        for (let i = 0; i < object.grid.data.data.length; i++) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("check: object.grid.data.data[i]._QUERY:", object.grid.data.data[i]._QUERY);
            if (typeof object.grid.data.data[i]._QUERY != "undefined") {
                NewVal = object.grid.data.data[i];
                object.addToBody(NewVal);
            }
        }
        if (this.inTrans) {
            this.saveChanges_grid_inTrans(grid, object, NewVal);
            return;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("check: object.Body:", object.Body);
        if (object.Body.length != 0) {
            let Page = "&_trans=Y";
            this.post(object, Page, object.Body).subscribe(Page => {
                object.Body = [];
                for (let i = object.grid.data.data.length - 1; i >= 0; i--) {
                    if (typeof object.grid.data.data[i]._QUERY != "undefined") {
                        object.grid.data.data[i]._QUERY_DONE = object.grid.data.data[i]._QUERY;
                        delete object.grid.data.data[i]._QUERY;
                    }
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("check: object.grid.data.data[i]._QUERY:", object.grid.data.data[i]._QUERY);
                }
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("object.grid.data.data:", object.grid.data.data);
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("object.grid.data.data:.length", object.grid.data.data.length);
                if (object.isChild == true) {
                    let gridRecords = object.grid.data.data.length;
                    let paramConfig = {
                        "Name": "childRecords",
                        "Val": gridRecords
                    };
                    setParamConfig(paramConfig);
                }
                this.showNotification('success', "Data saved successfully");
                if (typeof object.callBackPost_Save !== "undefined") {
                    let NewVal1 = [];
                    NewVal1.push(NewVal);
                    object.callBackPost_Save.apply(object, NewVal1);
                }
                this.setPrimarKeyNameArr(object, true);
                // if (object.diableEmitSave == true) 
                //     {}
                //   else
                object.saveCompletedOutput.emit(grid);
            }, err => {
                for (let i = object.Body.length - 1; i >= 0; i--) {
                    if (object.Body[i]._QUERY != object.deleteCMD) {
                        object.Body.splice(i, 1);
                    }
                }
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("err:", err);
                let errMsg = this.getErrorMsg(err);
                this.showNotification("error", "error:" + errMsg);
                Error = true;
            });
        }
        else {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("object.isMaster:" + object.isMaster);
            if (!object.isMaster)
                this.showNotification('warning', "No changes to save");
        }
        // if (!Error)
        //   object.saveCompletedOutput.emit(grid);
    }
    getErrorMsg(err) {
        let errMsg = "";
        if (typeof err.error.error != "undefined") {
            errMsg = err.error.error;
        }
        else
            errMsg = err.error;
        return errMsg;
    }
    executeQuery_grid(grid, object) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.grid:", object.grid);
        if (typeof object.grid == "undefined")
            return;
        let dirty = false;
        //if (this.paramConfig.DEBUG_FLAG) console.log ("executeQuery_grid:" + object.Body.length + " " + object.grid.isEditing(), "object.Body:",object.Body);
        //if (this.paramConfig.DEBUG_FLAG) console.log("object.Body:",object.Body)
        if ((object.Body.length != 0) || object.grid.isEditing() == true) {
            dirty = true;
        }
        if (dirty == true) {
            let dialogStruc = {
                msg: this.saveChangesMsg,
                title: this.pleaseConfirmMsg,
                info: grid,
                object: object,
                action: this.YesNoActions,
                callback: this.executeQueryAct_grid
            };
            this.showConfirmation(dialogStruc);
        }
        else {
            this.executeQueryAct_grid(grid, object);
        }
    }
    executeQueryAct_grid(grid, object) {
        let paramConfig = {
            "Name": "childRecords",
            "Val": 0
        };
        setParamConfig(paramConfig);
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.isChild:", object.isChild, " object.isSearch :", object.isSearch);
        if (object.isChild == true) {
            if (object.isSearch != true) {
                grid = object.gridInitialValues;
                if ((typeof object.masterKeyNameArr != "undefined") && (object.masterKeyNameArr.length != 0)) {
                    for (let i = 0; i < object.masterKeyNameArr.length; i++) {
                        object.gridInitialValues[object.masterKeyNameArr[i]] = object.masterKeyArr[i];
                    }
                }
                else {
                    object.gridInitialValues[object.masterKeyName] = object.masterKey;
                }
                //grid[object.masterKeyName] = object.masterKey;
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("object.masterKeyName:" + object.masterKeyName);
                if (object.paramConfig.DEBUG_FLAG)
                    console.log(grid);
                object.isSearch = true;
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("---Searching:");
                if (object.paramConfig.DEBUG_FLAG)
                    console.log(grid);
            }
        }
        if (object.paramConfig.DEBUG_FLAG)
            console.log('------------executeQuery object.isSearch :' + object.isSearch + "  object.isChild:" + object.isChild);
        // if (object.paramConfig.DEBUG_FLAG) console.log(object.grid);
        let Page = "&_query=" + object.getCMD;
        if (object.isSearch == true) {
            if (object.paramConfig.DEBUG_FLAG)
                console.log('object.formGroup:', object.formGroup, 'typeof(grid):', typeof (grid.data), ' grid:', grid);
            let NewVal = "";
            if (typeof object.formGroup == "undefined") {
                // a child component
                if (object.paramConfig.DEBUG_FLAG)
                    console.log('grid:', typeof (grid.data));
                if (typeof grid.data == "object")
                    NewVal = grid.data; // passed empty grid
                else
                    NewVal = grid; // used the passed grid param
            }
            else
                NewVal = object.formGroup.value;
            object.isSearch = false;
            if ((typeof object.formattedWhere === "undefined") || (object.formattedWhere == null)) {
                Page = Page + object.starServices.formatWhere(NewVal);
            }
            else {
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("object.formattedWhere", object.formattedWhere);
                Page = Page + object.formattedWhere;
                object.formattedWhere = null;
            }
            if ((typeof object.OrderByClause !== "undefined") && (object.OrderByClause != ""))
                Page = Page + "&_ORDERBY=" + object.OrderByClause;
        }
        Page = encodeURI(Page);
        //if (object.paramConfig.DEBUG_FLAG) console.log('Page:' + Page);
        object.grid.loading = true;
        object.closeEditor();
        object.executeQueryresult = [];
        object.executeQueryresult.result = 0;
        object.CurrentRec = 0;
        object.grid.data = null;
        object.starServices.fetch(object, Page).subscribe((result) => {
            if (result != null) {
                let actualResult = Object.assign({}, result, {});
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("------result.data[0].data :");
                //if (object.paramConfig.DEBUG_FLAG) console.log(result.data[0].data);
                for (let i = 0; i < result.data[0].data.length; i++) {
                    result.data[0].data[i] = object.starServices.parseToDate(result.data[0].data[i]);
                    if (result.data[0].data[i]._QUERY != "undefined") {
                        delete result.data[0].data[i]._QUERY;
                        delete result.data[0].data[i]._QUERY_DONE;
                    }
                }
                if (object.paramConfig.DEBUG_FLAG)
                    console.log(result.data[0].data[0]);
                object.Body = [];
                result = {
                    data: result.data[0].data,
                    total: parseInt(result.data[0].data.length, 10)
                };
                if (object.isMaster)
                    object.starServices.showNotification('success', "Records retrieved : " + result.total);
                object.executeQueryresult = result;
                if (object.isChild == true) {
                    let paramConfig = {
                        "Name": "childRecords",
                        "Val": result.total
                    };
                    setParamConfig(paramConfig);
                }
            }
            object.grid.loading = false;
            object.grid.data = result;
            if (typeof object.callBackFunction !== "undefined")
                object.callBackFunction(result);
            if (object.paramConfig.DEBUG_FLAG)
                console.log("grid servicereadCompletedOutput");
            if (object.paramConfig.DEBUG_FLAG)
                console.log(object.grid.data.data);
            if (object.paramConfig.DEBUG_FLAG)
                console.log("result length:" + result.length);
            if (object.paramConfig.DEBUG_FLAG)
                console.log("result total:" + result.total);
            if (object.paramConfig.DEBUG_FLAG)
                console.log("object.performReadCompletedOutput:" + object.performReadCompletedOutput);
            if ((typeof object.performReadCompletedOutput !== "undefined") || (object.performReadCompletedOutput == false)) {
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("here1");
            }
            else {
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("here2");
                if (object.disableEmitReadCompleted != true) {
                    if (result.total != 0)
                        object.readCompletedOutput.emit(object.grid.data.data[0]);
                    else
                        object.readCompletedOutput.emit([]);
                }
            }
            object.starServices.setPrimarKeyNameArr(object, true);
        }, (err) => {
            object.Body = [];
            object.grid.loading = false;
            object.grid.data = null;
            if (object.paramConfig.DEBUG_FLAG)
                console.log("err:", err);
            object.starServices.showNotification("error", "error:" + err.error.error.code);
        });
        object.docClickSubscription = object.renderer.listen('document', 'click', object.onDocumentClick.bind(object));
    }
    enterQueryAct_grid(grid, object) {
        object.grid.cancel;
        object.grid.data = null;
        object.Body = [];
        object.isSearch = true;
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.isSearch:" + object.isSearch);
        object.addHandler();
        object.clearCompletedOutput.emit(object.formInitialValues);
        object.starServices.setPrimarKeyNameArr(object, false);
    }
    enterQuery_grid(grid, object) {
        let dirty = false;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("pre object.saveCurrent");
        object.saveCurrent();
        let modified = false;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.grid.data");
        if (object.grid.data != null) {
            if (typeof object.grid.data.data !== "undefined") {
                for (let i = 0; i < object.grid.data.data.length; i++) {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("check: i:", i, " object.grid.data.data[i]._QUERY:", object.grid.data.data[i]._QUERY);
                    if (typeof object.grid.data.data[i]._QUERY !== "undefined") {
                        modified = true;
                    }
                }
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("object.saveCurrent :" + object.Body.length + " " + object.grid.isEditing());
        if (object.Body.length != 0) {
            modified = true;
        }
        if ((modified == true) || object.grid.isEditing() == true) {
            dirty = true;
        }
        if (dirty == true) {
            let dialogStruc = {
                msg: this.saveChangesMsg,
                title: this.pleaseConfirmMsg,
                info: grid,
                object: object,
                action: this.YesNoActions,
                callback: this.enterQueryAct_grid
            };
            this.showConfirmation(dialogStruc);
        }
        else {
            this.enterQueryAct_grid(grid, object);
        }
    }
    setStrAuth(user, password) {
        this.StrAuth = user + ":" + password;
        this.StrAuth = btoa(this.StrAuth);
        this.StrAuth = "Basic " + this.StrAuth;
    }
    login(object, user, password) {
        this.paramConfig = getParamConfig();
        //console.log("this.paramConfig:", this.paramConfig)
        this.setStrAuth(user, password);
        //if (this.paramConfig.DEBUG_FLAG) console.log("this.StrAuth:" + this.StrAuth);
        let Page = "";
        let success = false;
        const md5 = new Md5();
        let pass = md5.appendStr(password).end();
        user = user.toUpperCase().trim();
        user = user.trim();
        let NewVal = {
            "USERNAME": user,
            "PASSWORD": pass
        };
        NewVal["_QUERY"] = "VERIFY_ADM_USER";
        object.addToBody(NewVal);
        let paramConfig = {
            "Name": "USERNAME",
            "Val": user
        };
        setParamConfig(paramConfig);
        this.post(object, Page, object.Body).subscribe(result => {
            if (typeof result.data[0].data[0] !== "undefined") {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("Object in login HF", object.Body, user);
                if (result.data[0].data[0].USERNAME == user) {
                    this.USERNAME = user;
                    object.Body = [];
                    let paramConfig = {
                        "Name": "USER_INFO",
                        "Val": result.data[0].data[0]
                    };
                    setParamConfig(paramConfig);
                    this.USER_INFO = result.data[0].data[0];
                    if (this.paramConfig.USER_INFO.MASTER_DB != "") {
                        this.MASTER_DB = this.paramConfig.USER_INFO.MASTER_DB;
                    }
                    success = true;
                    this.loadRules(object);
                    if (object.testEKYC) {
                        object.loginCompletedHandler(null);
                    }
                    else
                        object.loginCompleted.emit(this);
                }
            }
            if (!success)
                this.showNotification("error", "error:" + "Wrong user or password");
        }, err => {
            object.Body = [];
            this.showNotification("error", "error:" + "Wrong user or password");
        });
    }
    /////////////////
    FORMAT_ISO(d) {
        var dateIso = d.toISOString();
        var dateIsoArr = dateIso.split("T");
        dateIso = dateIsoArr[0] + " " + dateIsoArr[1];
        dateIso = dateIso.substr(0, 19);
        return dateIso;
    }
    LogRule(object, ruleLog, msgResponse, status) {
        function prepareDataForDB(dataIn) {
            let dataOut = JSON.stringify(dataIn);
            //console.log("dataIn:", dataIn, " dataOut:", dataOut);
            dataOut = dataOut.split("'").join('"');
            return dataOut;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("-----msgResponse:", msgResponse, "ruleLog:", ruleLog);
        let db = ruleLog.db;
        let d = new Date();
        let dateIso = this.FORMAT_ISO(d);
        let RULE_KEY = ruleLog.rule.RULE_KEY;
        let array = RULE_KEY.split(",");
        //let ruleKey = {};
        let ruleKey = "";
        let ruleKeyName = "";
        for (let i = 0; i < array.length; i++) {
            let elem = array[i];
            let elem_value = ruleLog.queryData[elem];
            if (typeof elem_value !== "undefined") {
                //ruleKey[elem] = elem_value;
                if (ruleKey != "") {
                    ruleKey = ruleKey + "_";
                }
                ruleKey = ruleKey + elem_value;
                if (ruleKeyName != "") {
                    ruleKeyName = ruleKeyName + "_";
                }
                ruleKeyName = ruleKeyName + elem;
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("ruleKey:", ruleKey, " ruleKeyName:", ruleKeyName);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("RULE_KEY:", RULE_KEY);
        let queryData = prepareDataForDB(ruleLog.queryData);
        //let bodyToSend = prepareDataForDB(ruleLog.bodyToSend);
        let bodyToSend = ruleLog.bodyToSend;
        let parametersToSend = prepareDataForDB(ruleLog.parametersToSend);
        // let ruleKeyStr = prepareDataForDB(ruleKey);
        let msgResponseStr = prepareDataForDB(msgResponse);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("queryData:" + queryData);
        //
        let userName = object.paramConfig.USER_INFO.Name;
        object.Body = [];
        let Page = "";
        let NewVal = {
            "RULE_KEY": ruleKey,
            "RULE_KEY_NAME": ruleKeyName,
            "STATUS": status,
            "MODULE": ruleLog.rule.MODULE,
            "RULE_ID": ruleLog.rule.RULE_ID,
            "ACTION_ID": ruleLog.action.ACTION_ID,
            "SENT_DATE": ruleLog.sentDate,
            "MSG_RECEIVED": queryData,
            "PARAMETER_SENT": parametersToSend,
            "BODY_SENT": bodyToSend,
            "MSG_RESPONSE": msgResponseStr,
            "LOGDATE": dateIso,
            "LOGNAME": userName
        };
        NewVal["_QUERY"] = "INSERT_ADM_RULE_LOG";
        //if (this.paramConfig.DEBUG_FLAG) console.log("test:NewVal:", NewVal)
        //if (this.paramConfig.DEBUG_FLAG) console.log("test:object.Body:", object.Body)
        object.addToBody(NewVal);
        this.post(object, Page, object.Body).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:result.data:", result.data);
            object.Body = [];
        }, err => {
            object.Body = [];
            this.showNotification("error", "error:" + err.message);
        });
    }
    performHttpPost(object, bodyToSend, parametersToSend, sendTo, queryData, rule, action, Trigger, hostDef, hostMapDef, headerParam) {
        var valid = false;
        let error = 0;
        let msg = "";
        let options = {
            host: '',
            path: '',
            port: 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Content-Type': 'text/xml; charset=utf-8',
                "authorization": ""
            }
        };
        // if (this.paramConfig.DEBUG_FLAG) console.log("---------------req.url:",req.url);
        // if (this.paramConfig.DEBUG_FLAG) console.log("---------------pathname:",req._parsedUrl.pathname);
        // if (this.paramConfig.DEBUG_FLAG) console.log("---------------path:",req._parsedUrl.path);
        let d = new Date();
        let dateIso = this.FORMAT_ISO(d);
        if (hostDef == null)
            hostDef = "";
        let ruleLog = {
            rule: rule,
            action: action,
            queryData: queryData,
            bodyToSend: bodyToSend,
            parametersToSend: parametersToSend,
            //  "db": db,
            sentDate: dateIso,
            hostDef: hostDef
        };
        if (sendTo == "WF") {
            let url = this.BASE_URL;
            options.headers.authorization = this.StrAuth;
            valid = true;
        }
        else {
            if (hostDef != "") {
                let path = "/" + hostDef.PATH;
                if (parametersToSend != "")
                    path = path + parametersToSend;
                let host = hostDef.HOST;
                let port = parseInt(hostDef.PORT);
                let method = hostDef.HTTP_METHOD;
                options.host = host;
                options.port = port;
                options.path = path;
                options.method = method;
                // let url = "http://" + host + ":" + port  + path + parametersToSend ;
                let url = hostDef.URL;
                //					options.headers.authorization = req.headers.authorization;
                //bodyToSend = "";
                valid = true;
            }
            else {
                error = 100;
                msg = "undefined Host :" + sendTo;
                this.LogRule(object, ruleLog, msg, 100);
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("here2:valid:", valid);
        if (valid) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("options:", options);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("------bodyToSend:" + bodyToSend, "  Trigger:", Trigger);
            let keys = Object.keys(headerParam);
            for (let i = 0; i < keys.length; i++) {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log(keys[i] + " " + headerParam[keys[i]]);
                if (headerParam[keys[i]] != null) {
                    options.headers[keys[i]] = headerParam[keys[i]];
                    //screenConfig[ keys[i] ] = componentConfig[ keys[i] ];
                }
            }
            if (this.paramConfig.DEBUG_FLAG)
                console.log("here2:action.ACTION_CODE:", action.ACTION_CODE);
            if (action.ACTION_CODE == "SEND_WAIT") {
                /*
                let sendingLib = "request";
                status = 1;
                let headers  =  {headers:options.headers};
                if (this.paramConfig.DEBUG_FLAG) console.log("headers:", headers);
                let url = "http://" + host + ":" + port  + path + parametersToSend ;
                if (this.paramConfig.DEBUG_FLAG) console.log("---url:", url);
                if (method == "GET")
                {
                  let res = request(method, url, headers);
                  let result = JSON.parse(res.getBody('utf8'));
                }
                else
                if (method == "POST")
                {
        
                  let dataForSync = { body : bodyToSend, headers:options.headers};
                  let res = request(method, url, dataForSync);
                  if (this.paramConfig.DEBUG_FLAG) console.log("res:", res);
                  let statusCode = res.statusCode;
                  let msgResponse ="";
                  if (statusCode == 200)
                  {
                    let contentType = res.headers['content-type'];
        
                    let msgResponse = res.getBody('utf8');
                    if (this.paramConfig.DEBUG_FLAG) console.log("statusCode:", statusCode," headers:", headers,  " msgResponse:", msgResponse);
                    let n = contentType.search("json");
                    if (n != -1)
                      let result = JSON.stringify(JSON.parse(msgResponse));
                    else
                      let result = msgResponse;
                    if (this.paramConfig.DEBUG_FLAG) console.log("result:" +  result);
                  }
                  else
                  {
                    error = statusCode;
                    let msgResponse = res.body.toString();
                    msg = msgResponse;
                  }
        
                }
                if (error == 0)
                {
                  if ( (hostMapDef != null) &&  (hostMapDef.XSLT_RECEIVE != null) && (hostMapDef.XSLT_RECEIVE != "") )
                  {
                    {
                      //result = xsltmap.mapDataOut(result, hostMapDef.XSLT_RECEIVE);
                      //if (this.paramConfig.DEBUG_FLAG) console.log("result:", result);
        
                    }
                  }
        
                  let status = extractStatus (ruleLog, result);
                  LogRule(ruleLog, result, status );
                  error = status;
                  if (status != 0)
                    msg = result;
                }
                */
            }
            else {
                //async
                function extractStatus(ruleLog, msgResponse) {
                    let successMsg = ruleLog.hostDef.SUCCESS_MSG;
                    //console.log("-------msgResponse:", msgResponse, successMsg);
                    let array = successMsg.split(":");
                    let field = array[0];
                    let value = array[1];
                    let msgResponseArr = msgResponse;
                    msgResponse = JSON.stringify(msgResponseArr);
                    //console.log("field:", field, " value:", value, " msgResponseArr:", msgResponseArr);
                    //console.log("-------msgResponseArr[field]:", msgResponseArr[field], value);
                    let status = 1;
                    if (msgResponseArr[field] == value)
                        status = 0;
                    return status;
                }
                function extractResponseData(msgResponse, responseDataID) {
                    function getKey(Elm, elmVal) {
                        let keys = Object.keys(Elm);
                        let k = 0;
                        let elmObj;
                        while (k < keys.length) {
                            //console.log("[keys[k]:", keys[k]);
                            if (keys[k] == elmVal) {
                                let elmName = keys[k];
                                elmObj = Elm[elmName];
                                //console.log("elmObj:", elmObj);
                                break;
                            }
                            k++;
                        }
                        return elmObj;
                    }
                    let array = responseDataID.split(".");
                    for (let i = 0; i < array.length; i++) {
                        let returnKey = getKey(msgResponse, array[i]);
                        //console.log("returnKey.length:", returnKey.length);
                        if (returnKey.length == 1)
                            msgResponse = returnKey[0];
                        else
                            msgResponse = returnKey;
                        //console.log("msgResponse:", msgResponse);
                    }
                    return msgResponse;
                }
                /*
                function  handleResponseEnd(ruleLog, msgResponse){
                  let status = extractStatus (ruleLog, msgResponse);
                  this.LogRule(ruleLog, msgResponse, status);
        
        
                  //	.RULE_ID + "," +  action.ACTION_ID + "," + users.getUserName() + ","  + dateIso;
                  if (this.paramConfig.DEBUG_FLAG) console.log("-------handleResponse:status:" ,  status);
                }
                */
                function getBody(msgResponse) {
                    //if (this.paramConfig.DEBUG_FLAG) console.log("msgResponse:", msgResponse)
                    //if (this.paramConfig.DEBUG_FLAG) console.log("msgResponse:body", msgResponse.body)
                    return msgResponse.body;
                }
                /*
                      let handleResponse = function(response,  ruleLog){
                        let msgResponse = ''
                        response.on('data', function (chunk) {
                        msgResponse += chunk;
                        });
                        response.on('end', function () {
                         handleResponseEnd(ruleLog, msgResponse);
                         });
              
                      }
                      */
                let headers = {
                    headers: new HttpHeaders()
                        .set('Authorization', this.StrAuth)
                        .set('Content-Type', "application/json")
                };
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("here2:headers:", headers);
                if (bodyToSend == "")
                    bodyToSend = null;
                let bodyToSendKSON = JSON.parse(bodyToSend);
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("here2:bodyToSendKSON:", bodyToSendKSON);
                let url = hostDef.URL + parametersToSend;
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("---url:", url);
                const request = new HttpRequest(options.method, url, bodyToSendKSON, headers);
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("------------request:", request, " bodyToSendKSON:", bodyToSendKSON);
                let msgBodyAll;
                this.syncFlag = 1;
                //https://developpaper.com/getting-started-with-angular-http-client/
                this.http.request(request)
                    .subscribe((response) => {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log(" call successful value returned in body", response);
                    let msgBody = getBody(response);
                    if (typeof msgBody !== "undefined") {
                        msgBodyAll = msgBody;
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("msgBodyAll:", msgBodyAll);
                    }
                }, error => {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("PUT call in error:", error);
                    this.syncFlag = 0;
                    this.showNotification("error", "error calling: " + url + ":" + error.error.error);
                }, () => {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("The  observable is now completed:msgBodyAll:", msgBodyAll);
                    if (typeof msgBodyAll !== "undefined") {
                        let status = extractStatus(ruleLog, msgBodyAll);
                        if (this.paramConfig.DEBUG_FLAG)
                            console.log("-------uleLog.rule:", ruleLog.rule);
                        if (Trigger == "POST_QUERY") {
                            let responseDataID = ruleLog.rule.RESPONSE_DATA_ID;
                            if (this.paramConfig.DEBUG_FLAG)
                                console.log("TABS:responseDataID:", responseDataID);
                            let responseData = extractResponseData(msgBodyAll, responseDataID);
                            if (this.paramConfig.DEBUG_FLAG)
                                console.log("TABS:responseData:", responseData);
                            if (this.paramConfig.DEBUG_FLAG)
                                console.log("TABS:ruleLog.rule.RESPONSE_DATA_NAME:", ruleLog.rule.RESPONSE_DATA_NAME);
                            if (typeof responseData !== "undefined") {
                                object[ruleLog.rule.RESPONSE_DATA_NAME] = responseData;
                                if (this.paramConfig.DEBUG_FLAG)
                                    console.log("TABS:object.tabsAPIResponse:", object.tabsAPIResponse);
                            }
                        }
                        this.syncFlag = 0;
                        this.LogRule(object, ruleLog, msgBodyAll, status);
                    }
                });
                /*
              let reqNew = this.http.request(options, function(response){ handleResponse(response,  ruleLog); });
              reqNew.on('error', function(err) {
                // Handle error
                error = err;
                msg = "Error sending to Host :" +sendTo ;
                if (this.paramConfig.DEBUG_FLAG) console.log( msg + " Error:" + err );
                this.LogRule(ruleLog, msg + " Error:" + err, 400 );
              });
        
              if (this.paramConfig.DEBUG_FLAG) console.log("here1");
              reqNew.write(bodyToSend);
              if (this.paramConfig.DEBUG_FLAG) console.log("here2");
              reqNew.end();
              if (this.paramConfig.DEBUG_FLAG) console.log("here3");
              */
            }
        }
        let statusRec = {
            status: error,
            msg: msg
        };
        /*let status = 1;
        if (!valid){
          statusRec.status = 1;
          statusRec.msg =
        }*/
        if (this.paramConfig.DEBUG_FLAG)
            console.log("valid:", valid, " status:", statusRec);
        return (statusRec);
    }
    sendToServer(object, actionsArr, queryData, rule, action, Trigger, hostsArr, hostsMapArr) {
        function getElmValue(paramData, queryData) {
            function getORDER_FIELDSData(param, orderFields) {
                let val = "";
                if (orderFields != "") {
                    let array = param.split(".");
                    let fieldName = array[1];
                    //console.log("fieldName:", fieldName, " orderFields:", orderFields);
                    if (typeof orderFields !== "undefined") {
                        orderFields = JSON.parse(orderFields);
                        //console.log("orderFields:", orderFields);
                        let fieldsData = orderFields.data;
                        val = fieldsData[fieldName];
                    }
                }
                return val;
            }
            let val = paramData;
            var n = 0;
            n = paramData.search(":");
            if (n != -1) {
                let array = paramData.split(":");
                for (let i = 0; i < array.length; i++) {
                    if (i != 0) {
                        n = array[i].search(" ");
                        //console.log("n:", n, "array[i]:", array[i]);
                        if (n == -1)
                            n = array[i].length;
                        if (n != -1) {
                            let param = array[i].slice(0, n);
                            param = param.trim();
                            //console.log("param:" + param);
                            let nincludes = param.includes(".");
                            //console.log("nincludes:", nincludes);
                            if (nincludes == true) {
                                val = getORDER_FIELDSData(param, queryData.ORDER_FIELDS);
                            }
                            else
                                val = queryData[param];
                            if (typeof val == "string")
                                val = val.trim();
                            //console.log("param:", param, " val:", val);
                        }
                    }
                }
            }
            if (typeof val == "string")
                val = val.split("'").join("");
            return val;
        }
        function getHost(sendTo, hostsArr) {
            let i = 0;
            while (i < hostsArr.length) {
                //console.log("-----------hostsArr[i].HOST_ID :", hostsArr[i].HOST_ID, " sendTo:", sendTo);
                if (hostsArr[i].HOST_ID == sendTo)
                    return hostsArr[i];
                i++;
            }
            return null;
        }
        function getHostMap(hostDef, mapID, hostsMapArr) {
            let i = 0;
            //console.log("-----------mapID:", mapID, " hostDef.MAP_ID:", hostDef.MAP_ID);
            if ((mapID != null) && (mapID != "")) {
                while (i < hostsMapArr.length) {
                    if ((hostsMapArr[i].HOST_ID == hostDef.HOST_ID) && (mapID == hostsMapArr[i].MAP_ID))
                        return hostsMapArr[i];
                    i++;
                }
            }
            return null;
        }
        ////////////////////
        if (this.paramConfig.DEBUG_FLAG)
            console.log("****************actionsArr:", actionsArr);
        let statusRec;
        let sendTo = actionsArr.SEND_TO;
        let qryParam = {};
        let headerParam = {};
        let bodyToSendArr = [];
        let bodyToSend = "";
        let parametersToSend = "";
        let hostDef = getHost(sendTo, hostsArr);
        let hostMapDef = getHostMap(hostDef, action.MAP_ID, hostsMapArr);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("hostMapDef:", hostMapDef);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("****hostDef.HEADER:", hostDef.HEADER);
        if ((hostDef.HEADER != null) && (hostDef.HEADER != "")) {
            let array = hostDef.HEADER.split("\n");
            if (this.paramConfig.DEBUG_FLAG)
                console.log("array:", array, " array.length:", array.length);
            for (let i = 0; i < array.length; i++) {
                let elem = array[i];
                let arrayParam = elem.split(":");
                let param = arrayParam[0];
                param = param.trim();
                let paramData = arrayParam[1];
                paramData = paramData.trim();
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("paramData:", paramData);
                paramData = getElmValue(paramData, queryData);
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("-----------------------------param:", param, " paramData:", paramData);
                headerParam[param] = paramData;
            }
        }
        if ((actionsArr.BODY_DATA != null) && (actionsArr.BODY_DATA != "")) {
            let bodyData = actionsArr.BODY_DATA;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("bodyData:", bodyData);
            let array = bodyData.split(",");
            //if (this.paramConfig.DEBUG_FLAG) console.log("array:", array, " array.length:", array.length);
            for (let i = 0; i < array.length; i++) {
                let elem = array[i];
                let arrayParam = elem.split("=");
                let param = arrayParam[0];
                param = param.trim();
                let paramData = arrayParam[1];
                paramData = paramData.trim();
                //if (this.paramConfig.DEBUG_FLAG) console.log("paramData:", paramData);
                paramData = getElmValue(paramData, queryData);
                //if (this.paramConfig.DEBUG_FLAG) console.log("-----------------------------param:", param, " paramData:", paramData);
                qryParam[param] = paramData;
            }
            //if (this.paramConfig.DEBUG_FLAG) console.log("qryParam:here");
            //if (this.paramConfig.DEBUG_FLAG) console.log("qryParam:", qryParam , " qryParam.length :", Object.keys(qryParam).length);
            bodyToSendArr.push(qryParam);
            //if (this.paramConfig.DEBUG_FLAG) console.log("---hostDef:", hostDef);//fuad
            if (bodyToSendArr.length != 0) {
                /*if ( (hostMapDef != null) &&  (hostMapDef.XSLT_SEND != null) && (hostMapDef.XSLT_SEND != "") )
                {
                  {
                    bodyToSend = xsltmap.mapData(bodyToSendArr, hostMapDef.XSLT_SEND);
        
                  }
                }
                else
                {*/
                bodyToSend = JSON.stringify(bodyToSendArr);
                //}
            }
            /*
            let hexout = hexdump(bodyToSend, 16) ;
            if (this.paramConfig.DEBUG_FLAG) console.log("hexout:",hexout);
            */
        }
        if ((actionsArr.PARAMETER_DATA != null) && (actionsArr.PARAMETER_DATA != "")) {
            let parameterData = actionsArr.PARAMETER_DATA;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("parameterData:", parameterData);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("parameterData.length:", parameterData.length);
            let array = parameterData.split(",");
            if (this.paramConfig.DEBUG_FLAG)
                console.log("array:", array, " array.length:", array.length);
            for (let i = 0; i < array.length; i++) {
                let elem = array[i];
                let arrayParam = elem.split("=");
                let param = arrayParam[0];
                param = param.trim();
                let paramData = arrayParam[1];
                paramData = paramData.trim();
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("paramData:", paramData);
                paramData = getElmValue(paramData, queryData);
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("-----------------------------param:", param, " paramData:", paramData);
                if (parametersToSend == "")
                    parametersToSend = "?" + param + "=" + paramData;
                else
                    parametersToSend = parametersToSend + "&" + param + "=" + paramData;
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("bodyToSend:", bodyToSend);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("parametersToSend:", parametersToSend);
        statusRec = this.performHttpPost(object, bodyToSend, parametersToSend, sendTo, queryData, rule, action, Trigger, hostDef, hostMapDef, headerParam);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("post performHttpPost: status:", statusRec);
        return statusRec;
    }
    performAction(object, qry, ptr, queryData, rule, rulesDef, Trigger, hostsArr, hostsMapArr) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("---performAction:rulesDef:", rulesDef);
        let status = 0;
        let statusRec = {
            status: 0,
            msg: ""
        };
        let actionPtr = rulesDef.actionPtrsArr[qry];
        if (typeof actionPtr !== "undefined") {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("ptr:", ptr);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("actionPtr:", actionPtr);
            let i = ptr;
            let ptr2 = "";
            let ptr1 = actionPtr[i];
            if (typeof actionPtr[i + 1] !== "undefined")
                ptr2 = actionPtr[i + 1];
            else
                ptr2 = rulesDef.actionsArr.length;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("ptr1:", ptr1, " ptr2:", ptr2);
            let j = ptr1;
            let ruleID = rulesDef.actionsArr[j].RULE_ID;
            while ((j < ptr2) && (status == 0)) {
                if (ruleID != rulesDef.actionsArr[j].RULE_ID) {
                    break;
                }
                //if (this.paramConfig.DEBUG_FLAG) console.log("rulesDef.actionsArr:",rulesDef.actionsArr[j]);
                if ((rulesDef.actionsArr[j].ACTION_CODE == "SEND") || (rulesDef.actionsArr[j].ACTION_CODE == "SEND_WAIT")) {
                    statusRec = this.sendToServer(object, rulesDef.actionsArr[j], queryData, rule, rulesDef.actionsArr[j], Trigger, hostsArr, hostsMapArr);
                    status = statusRec.status;
                }
                else if (rulesDef.actionsArr[j].ACTION_CODE == "ERROR") {
                    let statusRec = {
                        status: -1,
                        msg: rulesDef.actionsArr[j].BODY_DATA
                    };
                    return statusRec;
                }
                j++;
            }
        }
        return statusRec;
    }
    checkRulesByTrigger(object, rulesDef, queryData, Trigger, routine_name, hostsArr, hostsMapArr) {
        //if (this.paramConfig.DEBUG_FLAG) console.log("checkRulesByTrigger:rulesDef:", rulesDef, " queryData:", queryData);
        function getFieldData(rule, queryData) {
            let fieldData = "";
            let array = rule.FIELD.split(".");
            console.log("array:", array);
            if (array.length > 1) {
                let orderFields = queryData["ORDER_FIELDS"];
                //console.log("orderFields:",orderFields)
                if (typeof orderFields !== "undefined") {
                    if (orderFields != "") {
                        let fieldsData = JSON.parse(orderFields);
                        //console.log("fieldsData:",fieldsData)
                        let keys = Object.keys(fieldsData);
                        console.log("keys:", keys);
                        for (let j = 0; j < keys.length; j++) {
                            console.log("addOrderFields key:", keys[j]);
                            if (keys[j] == array[0]) {
                                let objData = fieldsData[keys[j]];
                                //console.log("objData:", objData );
                                if (typeof (objData.length) == "undefined") // it is a form (object)
                                    fieldData = objData[array[1]];
                                else { // it is a grid (array)
                                    if (typeof (objData[0]) != "undefined")
                                        fieldData = objData[0][array[1]];
                                }
                                break;
                            }
                        }
                    }
                }
            }
            else {
                fieldData = queryData[rule.FIELD];
            }
            return fieldData;
        }
        function checkRule(rule, queryData) {
            let ruleMatch = false;
            //if (object.paramConfig.DEBUG_FLAG) 
            console.log("------rule:", rule, " queryData:", queryData);
            //let fieldData = queryData[rule.FIELD];
            let fieldData = getFieldData(rule, queryData);
            switch (rule.OPERATION) {
                case "=":
                    if (fieldData == rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case "<":
                    if (fieldData < rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case "<=":
                    if (fieldData <= rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case ">":
                    if (fieldData > rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case ">=":
                    if (fieldData >= rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case "<>":
                    if (fieldData != rule.FIELD_VALUE) {
                        ruleMatch = true;
                    }
                    break;
                case "INSTR":
                    if (rule.FIELD_VALUE.search(fieldData) != -1) {
                        ruleMatch = true;
                    }
                    break;
                default:
                    ruleMatch = false;
            }
            console.log("test3:ruleMatch:", ruleMatch, " fieldData:", fieldData, " OPERATION:", rule.OPERATION, " FIELD_VALUE:", rule.FIELD_VALUE);
            return ruleMatch;
        }
        let status = 0;
        let statusRec = {
            status: 0,
            msg: ""
        };
        let qry = queryData._QUERY;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("-------- _QUERY:", queryData._QUERY, " rulesDef.rulePtrsArr:", rulesDef.rulePtrsArr);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("checking rulesDef.rulePtrsArr:", rulesDef.rulePtrsArr);
        let rulePtr = rulesDef.rulePtrsArr[qry];
        if (this.paramConfig.DEBUG_FLAG)
            console.log("rulePtr:", rulePtr);
        if (typeof rulePtr !== "undefined") {
            //let actionPtr = rulesDef.rulePtrsArr[qry];
            //if (typeof actionPtr !== "undefined")
            {
                let result = false;
                let i = 0;
                //while ( (i<rulePtr.length) && (status == 0) )
                {
                    var ptr1 = rulePtr[i];
                    var ptr2 = rulePtr[rulePtr.length - 1];
                    // if (typeof rulePtr[i+1] !== "undefined")
                    //     var ptr2 = rulePtr[i+1];
                    // else
                    //     //var ptr2 = rulesDef.rulesArr.length
                    //     var ptr2 = ptr1
                    //console.log("ptr1:",ptr1, " ptr2:", ptr2);
                    var j = ptr1;
                    while (j <= ptr2) {
                        //console.log("--------------------rulesDef.rulesArr:", rulesDef.rulesArr[j].RULE_ID, " item:", rulesDef.rulesArr[j].ITEM);
                        var ruleMatch = checkRule(rulesDef.rulesArr[j], queryData);
                        if (ruleMatch == false)
                            break;
                        j++;
                    }
                    console.log("checkRulesByTrigger:Conditions ruleMatch:", ruleMatch, " for rule:", rulesDef.rulesArr[ptr1].RULE_ID);
                    if (ruleMatch == true) {
                        //statusRec = performAction(db,req, qry, i, queryData, rulesDef.rulesArr[ptr1],rulesDef, Trigger );
                        statusRec = this.performAction(object, qry, i, queryData, rulesDef.rulesArr[ptr1], rulesDef, Trigger, hostsArr, hostsMapArr);
                        status = statusRec.status;
                    }
                    //if (ruleMatch == false)
                    //  break;
                    i++;
                }
            }
        }
        return statusRec;
    }
    checkRules(object, rulesDef, actualResult, Trigger) {
        var statusRec = {};
        if (this.paramConfig.isCheckRules == false)
            return statusRec;
        //return;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("checkRules:", Trigger, " routine_name:", this.routine_name, " actualResult:", actualResult);
        if (Trigger == "POST_QUERY") {
            if (typeof actualResult.data[0] !== "undefined") {
                let transData = actualResult.data[0].data;
                for (let i = 0; i < transData.length; i++) {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("checkRules:transData[i]:", transData[i], i);
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("checkRules:actualResult.data[0].query:", actualResult.data[0].query);
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("checkRules:actualResult.data[0] HF please", actualResult.data[0].data);
                    let queryData = transData[i];
                    queryData["_QUERY"] = actualResult.data[0].query;
                    //       if (this.paramConfig.DEBUG_FLAG) console.log("queryData:", queryData)
                    statusRec = this.checkRulesByTrigger(object, rulesDef, queryData, Trigger, this.routine_name, this.hostsArr, this.hostsMapArr);
                    //console.log("statusRec:POST_QUERY:", statusRec);
                    if (statusRec['status'] == -1) {
                        break;
                    }
                }
            }
        }
        else if (Trigger == "PRE_QUERY") {
            if (typeof actualResult !== "undefined") {
                for (let i = 0; i < actualResult.length; i++) {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("actualResult[i]:", actualResult[i]);
                    let queryData = actualResult[i];
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("queryData:", queryData);
                    statusRec = this.checkRulesByTrigger(object, rulesDef, queryData, Trigger, this.routine_name, this.hostsArr, this.hostsMapArr);
                }
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("checkRules:Done", Trigger, " routine_name:", this.routine_name, " actualResult:", actualResult);
        return statusRec;
    }
    //////////////
    storeActionsPtrs(actions, rulesDef) {
        let currentQUERY_DEF = "";
        let currentRULE_ID = "";
        let actionPtrs = [];
        for (let i = 0; i < actions.length; i++) {
            if ((currentQUERY_DEF != actions[i].QUERY_DEF) && (currentRULE_ID != actions[i].RULE_ID)) {
                if (i == 0)
                    actionPtrs.push(i);
                if (currentQUERY_DEF != "") {
                    rulesDef.actionPtrsArr[currentQUERY_DEF] = actionPtrs;
                    actionPtrs = [];
                    actionPtrs.push(i);
                }
                currentQUERY_DEF = actions[i].QUERY_DEF;
                currentRULE_ID = actions[i].RULE_ID;
                //if (this.paramConfig.DEBUG_FLAG) console.log("rulePtrs1:",rulePtrs);
            }
            else if ((currentQUERY_DEF == actions[i].QUERY_DEF) && (currentRULE_ID != actions[i].RULE_ID)) {
                currentRULE_ID = actions[i].RULE_ID;
                actionPtrs.push(i);
            }
            if (this.paramConfig.DEBUG_FLAG)
                console.log("actionPtrs2:", actionPtrs);
        }
        //actionPtrs.push(i);
        rulesDef.actionPtrsArr[currentQUERY_DEF] = actionPtrs;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("rulesDef.actionPtrsArr:", rulesDef.actionPtrsArr);
    }
    storeRulesPtrs(rules, rulesDef) {
        let currentQUERY_DEF = "";
        let currentRULE_ID = "";
        let rulePtrs = [];
        for (let i = 0; i < rules.length; i++) {
            if (this.paramConfig.DEBUG_FLAG)
                console.log(rules[i].QUERY_DEF + " : " + rules[i].RULE_ID + "          " + currentQUERY_DEF + " : " + currentRULE_ID);
            if ((currentQUERY_DEF != rules[i].QUERY_DEF) && (currentRULE_ID != rules[i].RULE_ID)) {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log(" not equal");
                if (i == 0)
                    rulePtrs.push(i);
                if (currentQUERY_DEF != "") {
                    if (this.paramConfig.DEBUG_FLAG)
                        console.log("--storing rulePtrs2:", rulePtrs);
                    rulesDef.rulePtrsArr[currentQUERY_DEF] = rulePtrs;
                    rulePtrs = [];
                    rulePtrs.push(i);
                }
                currentQUERY_DEF = rules[i].QUERY_DEF;
                currentRULE_ID = rules[i].RULE_ID;
                //if (this.paramConfig.DEBUG_FLAG) console.log("rulePtrs1:",rulePtrs);
            }
            else if ((currentQUERY_DEF == rules[i].QUERY_DEF) && (currentRULE_ID != rules[i].RULE_ID)) {
                if (this.paramConfig.DEBUG_FLAG)
                    console.log(" not equal2");
                rulePtrs.push(i);
                currentRULE_ID = rules[i].RULE_ID;
                if (this.paramConfig.DEBUG_FLAG)
                    console.log("rulePtrs2:", rulePtrs);
            }
            if (this.paramConfig.DEBUG_FLAG)
                console.log("rulePtrs2:", rulePtrs);
        }
        //rulePtrs.push(i);
        rulesDef.rulePtrsArr[currentQUERY_DEF] = rulePtrs;
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test3:rulesDef.rulePtrsArr:", rulesDef.rulePtrsArr);
    }
    //////////////
    loadRules(object) {
        object.Body = [];
        let Page = "";
        let NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_DEF_RULE_ITEM";
        NewVal["RULE_TRIGGER"] = "POST_QUERY";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:NewVal:", NewVal);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:object.Body:", object.Body);
        object.addToBody(NewVal);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:object.Body:", object.Body);
        NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_DEF_RULE_ACTION";
        NewVal["RULE_TRIGGER"] = "POST_QUERY";
        object.addToBody(NewVal);
        NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_HOST";
        NewVal["HOST_ID"] = "%";
        object.addToBody(NewVal);
        NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_HOST_MAP";
        NewVal["HOST_ID"] = "%";
        NewVal["MAP_ID"] = "%";
        object.addToBody(NewVal);
        this.post(object, Page, object.Body).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:result.data:", result.data);
            this.rulesPostQueryDef.rulePtrsArr = [];
            this.rulesPostQueryDef.actionPtrsArr = [];
            this.storeRulesPtrs(result.data[0].data, this.rulesPostQueryDef);
            this.rulesPostQueryDef.rulesArr = result.data[0].data;
            this.storeActionsPtrs(result.data[1].data, this.rulesPostQueryDef);
            this.rulesPostQueryDef.actionsArr = result.data[1].data;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:this.rulesPostQueryDef", this.rulesPostQueryDef);
            this.hostsArr = result.data[2].data;
            this.hostsMapArr = result.data[3].data;
            //////////////
            object.Body = [];
        }, err => {
            object.Body = [];
            this.showNotification("error", "error:" + err.message);
        });
        //////////////////////////////
        //////////////
        object.Body = [];
        Page = "";
        NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_DEF_RULE_ITEM";
        NewVal["RULE_TRIGGER"] = "PRE_QUERY";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:NewVal:", NewVal);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:object.Body:", object.Body);
        object.addToBody(NewVal);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("test:object.Body:", object.Body);
        NewVal = {};
        NewVal["_QUERY"] = "GET_ADM_RULE_DEF_RULE_ACTION";
        NewVal["RULE_TRIGGER"] = "PRE_QUERY";
        object.addToBody(NewVal);
        this.post(object, Page, object.Body).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:result.data:", result.data);
            //////////////
            this.rulesPreQueryDef.rulePtrsArr = [];
            this.rulesPreQueryDef.actionPtrsArr = [];
            this.storeRulesPtrs(result.data[0].data, this.rulesPreQueryDef);
            this.rulesPreQueryDef.rulesArr = result.data[0].data;
            this.storeActionsPtrs(result.data[1].data, this.rulesPreQueryDef);
            this.rulesPreQueryDef.actionsArr = result.data[1].data;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("test:this.rulesPreQueryDef", this.rulesPreQueryDef);
            //////////////
            object.Body = [];
        }, err => {
            object.Body = [];
            this.showNotification("error", "error:" + err.message);
        });
    }
    fetchLookups(object, lookupArrDef) {
        let Body = [];
        for (let i = 0; i < lookupArrDef.length; i++) {
            let NewVal = {};
            NewVal["_QUERY"] = "GET_STMT";
            NewVal["_STMT"] = lookupArrDef[i].statment;
            Body = this.addToBody(NewVal, Body);
        }
        let Page = "";
        this.post(object, Page, Body).subscribe(result => {
            for (let i = 0; i < lookupArrDef.length; i++) {
                //if (this.paramConfig.DEBUG_FLAG) console.log("result.data[i].data:",result.data[i].data[0])
                if (typeof result.data[i] !== "undefined") {
                    if (typeof result.data[i].data[0] !== "undefined") {
                        //add empty record at begining of the array for the LOV for insert new record in a grid work properly
                        let keys = Object.keys(result.data[i].data[0]);
                        let emptyRec = {};
                        let hasSpace = false;
                        // let codeTxt = keys[0];
                        // let dataSet = Object.assign([], result.data[i].data);
                        // dataSet.find(elem =>{
                        //   //console.log("elm:",elem);
                        //   if (elem[codeTxt].trim() == ""){
                        //     hasSpace = true;
                        //     return true;
                        //   }
                        // });
                        if (!hasSpace) {
                            for (let k = 0; k < keys.length; k++) {
                                //if (this.paramConfig.DEBUG_FLAG) console.log("[keys[k]:", keys[k]);
                                //console.log("[keys[k]:", keys[k]);
                                emptyRec[keys[k]] = "";
                                //object.primarKeyReadOnlyArr[keys[k]] = value;
                            }
                            //if (this.paramConfig.DEBUG_FLAG) console.log("emptyRec:",emptyRec)
                            //console.log("emptyRec:",emptyRec);
                            result.data[i].data.splice(0, 0, emptyRec);
                        }
                    }
                    object[lookupArrDef[i].lkpArrName] = result.data[i].data;
                    //if (this.paramConfig.DEBUG_FLAG) console.log("lookupArrDef[i].lkpArrName:", lookupArrDef[i].lkpArrName, object[lookupArrDef[i].lkpArrName])
                }
            }
            if (typeof object.fetchLookupsCallBack !== "undefined")
                object.fetchLookupsCallBack();
        }, err => {
            //alert ('error:' + err.message);
            this.showErrorMsg(object, err);
        });
    }
    performPost(object, fn) {
        let Page = "";
        this.post(object, Page, object.Body).subscribe(result => {
            fn(object, result);
            object.Body = [];
        }, err => {
            //alert ('error:' + err.message);
            this.showErrorMsg(object, err);
        });
    }
    setComponentConfig(componentConfig, screenConfig) {
        let keys = Object.keys(componentConfig);
        for (let i = 0; i < keys.length; i++) {
            //if (this.paramConfig.DEBUG_FLAG) console.log( keys[i] + " " + componentConfig[ keys[i] ] ) ;
            if (componentConfig[keys[i]] != null) {
                screenConfig[keys[i]] = componentConfig[keys[i]];
            }
        }
        //if (this.paramConfig.DEBUG_FLAG) console.log(screenConfig);
        return screenConfig;
    }
    getRoutineAuth(menu, routine_name) {
        let i = 0;
        let routineAuth;
        let found = false;
        if (typeof menu !== "undefined") {
            while (i < menu.length) {
                let j = 0;
                while (j < menu[i].children.length) {
                    if (menu[i].children[j].choice == routine_name) {
                        routineAuth = menu[i].children[j];
                        found = true;
                        break;
                    }
                    j++;
                }
                if (found)
                    break;
                i++;
            }
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("routine_name:", routine_name, "routineAuth:", routineAuth, " menu:", menu);
        return (routineAuth);
    }
    actOnParamConfig(object, routine_name) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log("routine_name:" + routine_name);
        let paramConfig = getParamConfig();
        let menu = paramConfig.menu;
        let routineAuth = this.getRoutineAuth(menu, routine_name);
        if (typeof routineAuth !== "undefined") {
            object.title = routineAuth.title + " (" + routineAuth.routineVer + ")";
            object.routineAuth = routineAuth;
            this.routine_name = routine_name;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("object.title:" + object.title);
        }
        else if (routine_name == "DSPEKYC") {
            this.routine_name = routine_name;
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("this.routine_name:" + this.routine_name);
    }
    showErrorMsg(object, serverError) {
        let errorMsg = "";
        if (typeof serverError.error == "undefined") {
            errorMsg = this.standardErrorMsg + " : " + serverError;
        }
        else
            errorMsg = this.standardErrorMsg + " : " + serverError.error.error;
        let dialogStruc = {
            msg: errorMsg,
            title: "Error",
            info: null,
            object: object,
            action: this.OkActions,
            callback: null
        };
        this.showConfirmation(dialogStruc);
    }
    sendGetCommand(url, page) {
        if (this.paramConfig.DEBUG_FLAG)
            console.log(" inside sendGetCommand");
        let theURL = url + page;
        if (this.paramConfig.DEBUG_FLAG)
            console.log(" inside sendGetCommand:theURL:", theURL);
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        if (this.paramConfig.DEBUG_FLAG)
            console.log("sendGetCommand theURL:" + theURL);
        return this.http
            .get(`${theURL}`, this.httpOptions)
            .pipe(catchError((err) => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("server error:", err.message);
            this.showNotification("error", "error:" + err.message);
            return throwError(err);
        }), map(response => response), tap(() => this.loading = false));
    }
    postCommandOptions(Options, page, url, Body) {
        //if (this.paramConfig.DEBUG_FLAG) console.log(" inside postCommand")
        let theURL = url; //this.EPMENG_URL + page;
        let httpOptions = {};
        if (Options == null) {
            httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'authorization': this.StrAuth
                })
            };
        }
        else {
            httpOptions = {
                headers: new HttpHeaders(Options)
            };
        }
        if (this.paramConfig.DEBUG_FLAG)
            console.log("postCommandOptions theURL:", theURL, "Body:", Body);
        return this.http
            .post(`${theURL}`, Body, httpOptions)
            .pipe(catchError((err) => {
            //if (this.paramConfig.DEBUG_FLAG) console.log("server error:", err.message)
            //this.showNotification ("error","error:" + err.message);
            //console.log("err:",err);
            return throwError(err);
            // throwError(err);
            // return JSON.stringify (err);
        }), map(response => response), catchError(err => {
            return err.message; //2
        }), //3
        tap((response) => { this.loading = false; console.log("response:", response); }));
    }
    postCommand(page, url, Body) {
        //if (this.paramConfig.DEBUG_FLAG) console.log(" inside postCommand")
        let theURL = url; //this.EPMENG_URL + page;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.StrAuth
            })
        };
        //if (this.paramConfig.DEBUG_FLAG) console.log("postCommand theURL:" + theURL)
        return this.http
            .post(`${theURL}`, Body, this.httpOptions)
            .pipe(catchError((err) => {
            //if (this.paramConfig.DEBUG_FLAG) console.log("server error:", err.message)
            this.showNotification("error", "error:" + err.message);
            return throwError(err);
        }), map(response => response), tap(() => this.loading = false));
    }
    CapitalizeFirst(str) {
        str = str.toLowerCase();
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    }
    CapitalizeTitle(fieldName) {
        let array = fieldName.split("_");
        if (this.paramConfig.DEBUG_FLAG)
            console.log("array:", array);
        for (let i = 0; i < array.length; i++)
            array[i] = this.CapitalizeFirst(array[i]);
        fieldName = array.join(" ");
        return fieldName;
    }
    prepareLookup(fieldName, paramConfig) {
        let lkpArrName = "lkpArr" + fieldName;
        let lkpDef;
        if (fieldName == "ASSIGNEE") {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("paramConfig.USER_INFO:", paramConfig.USER_INFO);
            let team = paramConfig.USER_INFO.TEAM;
            lkpDef = {
                "statment": "select USERNAME CODE, FULLNAME CODETEXT_LANG from  ADM_USER_INFORMATION where TEAM = '" + team + "' ",
                "lkpArrName": lkpArrName, "fieldName": fieldName
            };
        }
        else {
            lkpDef = {
                "statment": "SELECT CODE,  CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME = '" + fieldName + "' and LANGUAGE_NAME = '" + paramConfig.userLang + "' order by CODETEXT_LANG  ",
                "lkpArrName": lkpArrName, "fieldName": fieldName
            };
        }
        return lkpDef;
    }
    getAssigneeSelect(object, assigneeType) {
        let selectStmt;
        if (assigneeType == "TEAM") {
            selectStmt = "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='TEAM' and LANGUAGE_NAME = '" + object.paramConfig.userLang + "'  order by CODETEXT_LANG ";
        }
        else if (assigneeType == "PERSON") {
            selectStmt = "SELECT USERNAME  CODE, FULLNAME CODETEXT_LANG FROM ADM_USER_INFORMATION WHERE TEAM ='" + object.paramConfig.USER_INFO.TEAM + "' order by CODETEXT_LANG ";
        }
        else if (assigneeType == "NETWORK") {
            selectStmt = "SELECT CODE, CODETEXT_LANG FROM SOM_TABS_CODES WHERE CODENAME ='EXCH_SYST' and LANGUAGE_NAME = '" + object.paramConfig.userLang + "' order by CODETEXT_LANG";
        }
        return selectStmt;
    }
    getFirstWeekDay(object, value) {
        let valueDate;
        let firstWeekDay = Day.Monday;
        if (typeof object.paramConfig.firstWeekDay !== "undefined") {
            firstWeekDay = object.paramConfig.firstWeekDay;
        }
        valueDate = firstDayInWeek(new Date(value), firstWeekDay);
        valueDate = getDate(valueDate);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("valueDate:", valueDate);
        return valueDate;
    }
    setRTL() {
        let paramConfig = getParamConfig();
        let language_name = paramConfig.userLang;
        language_name = language_name.toLowerCase();
        let parg = document.getElementById("mainpage");
        const svc = this.messages;
        //svc.language_name = svc.language_name === 'es' ? 'he' : 'es';
        //svc.language_name = language_name;
        //if (this.paramConfig.DEBUG_FLAG) console.log("setRTL:language_name:", language_name)
        if (language_name == "ar") {
            parg.dir = "rtl";
            this.messages.notify(true);
        }
        else {
            parg.dir = "ltr";
            this.messages.notify(false);
        }
    }
    loadLanguageOld(language_name) {
        language_name = !language_name ? "en" : language_name;
        let file = "assets/lang/" + language_name + ".json";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("loadLanguage:file,", file);
        this.http.get(file).subscribe(data => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:data,", data);
            let paramConfig = {
                "Name": "titles",
                "Val": data
            };
            setParamConfig(paramConfig);
            this.paramConfig = getParamConfig();
            paramConfig = {
                "Name": "userLang",
                "Val": language_name.toUpperCase()
            };
            setParamConfig(paramConfig);
            this.setRTL();
            if (this.paramConfig.DEBUG_FLAG)
                console.log("document.documentElement.dir:", document.documentElement.dir == 'ltr');
        }, err => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:err,", err);
            //alert ('error:' + err.message);
            //this.showErrorMsg(object, err);
        });
    }
    loadLanguage(language) {
        language = !language ? "en" : language;
        let file = "lang/" + language + ".json";
        if (this.paramConfig.DEBUG_FLAG)
            console.log("loadLanguage:file,", file);
        let page = "?getfile=" + file;
        page = this.checkDBLoc(page);
        page = encodeURI(page);
        if (this.paramConfig.DEBUG_FLAG)
            console.log("loadLanguage:page,", page);
        this.paramConfig = getParamConfig();
        if (this.paramConfig.DEBUG_FLAG)
            console.log("this.paramConfig.titles,", this.paramConfig.titles);
        let paramConfig = {
            "Name": "userLang",
            "Val": language.toUpperCase()
        };
        setParamConfig(paramConfig);
        this.sendGetCommand(this.SERVER_URL, page).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:result,", result);
            let data = result.data;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:data,", data);
            let paramConfig = {
                "Name": "titles",
                "Val": data
            };
            setParamConfig(paramConfig);
            this.setRTL();
            if (this.paramConfig.DEBUG_FLAG)
                console.log("document.documentElement.dir:", document.documentElement.dir == 'ltr');
        }, err => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:err,", err);
            //alert ('error:' + err.message);
            //this.showErrorMsg(object, err);
        });
    }
    getNLS(params, id, text) {
        //if (this.paramConfig.DEBUG_FLAG) console.log("getNLS:id,",id);
        if (typeof this.paramConfig !== "undefined") {
            if (typeof this.paramConfig.titles !== "undefined") {
                let array = id.split(".");
                if (array.length == 3) {
                    if (typeof this.paramConfig.titles[array[0]] !== "undefined")
                        if (typeof this.paramConfig.titles[array[0]][array[1]] !== "undefined") {
                            if (typeof this.paramConfig.titles[array[0]][array[1]][array[2]] !== "undefined")
                                if (this.paramConfig.titles[array[0]][array[1]][array[2]] != "")
                                    text = this.paramConfig.titles[array[0]][array[1]][array[2]];
                        }
                    //if (this.paramConfig.DEBUG_FLAG) console.log("getNLS:text,",text);
                }
                else {
                    let nls_title = this.paramConfig.titles[id];
                    if (typeof nls_title !== "undefined") {
                        text = nls_title;
                    }
                }
            }
        }
        if (params.length > 0) {
            let strArray = text.split("##");
            text = "";
            for (let i = 0; i < strArray.length; i++) {
                if (typeof params[i] != "undefined")
                    text = text + strArray[i] + params[i];
                else
                    text = text + strArray[i];
            }
        }
        return text;
    }
    loadStatements(statements) {
        if (statements == "")
            statements = "statements.json";
        let page = "?getfile=" + statements;
        page = this.checkDBLoc(page);
        page = encodeURI(page);
        this.sendGetCommand(this.SERVER_URL, page).subscribe(result => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadStatements:result,", result);
            let data = result.data;
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadStatements:data,", data);
            let lkpArrQUERY_DEF = [];
            Object.keys(data).forEach(function (key) {
                let value = data[key];
                let rec = {
                    CODE: key,
                    CODETEXT_LANG: key,
                    statement: value
                };
                lkpArrQUERY_DEF.push(rec);
            });
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadStatements:data,", data);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadStatements:lkpArrQUERY_DEF,", lkpArrQUERY_DEF);
            let paramConfig = {
                "Name": "statements",
                "Val": data
            };
            setParamConfig(paramConfig);
            paramConfig = {
                "Name": "lkpArrQUERY_DEF",
                "Val": lkpArrQUERY_DEF
            };
            setParamConfig(paramConfig);
        }, err => {
            if (this.paramConfig.DEBUG_FLAG)
                console.log("loadLanguage:err,", err);
        });
    }
    // public loadStatementsOld() {
    //   let file = "assets/" + "statements.json"
    //   if (this.paramConfig.DEBUG_FLAG) console.log("loadStatements:file,", file)
    //   this.http.get(file).subscribe(data => {
    //     let lkpArrQUERY_DEF:any = [];
    //     Object.keys(data).forEach(function (key:any) {
    //       let value = data[key];
    //       let rec = {
    //         CODE: key,
    //         CODETEXT_LANG: key,
    //         statement: value
    //       }
    //       lkpArrQUERY_DEF.push(rec);
    //     });
    //     if (this.paramConfig.DEBUG_FLAG) console.log("loadStatements:data,", data);
    //     if (this.paramConfig.DEBUG_FLAG) console.log("loadStatements:lkpArrQUERY_DEF,", lkpArrQUERY_DEF)
    //     let paramConfig = {
    //       "Name": "statements",
    //       "Val": data
    //     };
    //     setParamConfig(paramConfig);
    //     paramConfig = {
    //       "Name": "lkpArrQUERY_DEF",
    //       "Val": lkpArrQUERY_DEF
    //     };
    //     setParamConfig(paramConfig);
    //   },
    //     err => {
    //       if (this.paramConfig.DEBUG_FLAG) console.log("loadLanguage:err,", err)
    //     })
    // }
    handleFetchedModules(object, data) {
        if (object.paramConfig.DEBUG_FLAG)
            console.log('fetchedModules : ', data[0].data);
        //this.items[0].items =  data;
        object.items = [
            {
                text: 'Select Module',
                items: data[0].data
            }
        ];
        object.setModuleName(object.currentMenu);
        if (object.paramConfig.DEBUG_FLAG)
            console.log("object.items:", object.items, "data[0].data.length:", data[0].data.length);
        if (data[0].data.length == 1) {
            object.showModuleSelection = false;
        }
    }
    fetchMenu(object, handleFetchedData) {
        if ((this.StrAuth == "") || (typeof this.StrAuth === "undefined"))
            return;
        let Page = "";
        this.post(this, Page, object.Body).subscribe(result => {
            handleFetchedData(object, result.data);
            object.Body = [];
        }, err => {
            alert('error:' + err.message);
        });
    }
    setModuleItems(object) {
        if (!object.staticMenu) {
            object.Body = [];
            let NewVal = {
                MENU: 'MAIN',
                CHOICES: object.paramConfig.licensedModules.toUpperCase(),
                LANGUAGE_NAME: object.paramConfig.userLang.toUpperCase(),
            };
            NewVal["_QUERY"] = "GET_ALLOWED_MODULES";
            object.addToBody(NewVal);
            if (this.paramConfig.DEBUG_FLAG)
                console.log("--------object.Body :", object.Body);
            this.fetchMenu(object, this.handleFetchedModules);
        }
    }
    stateChange(object, data) {
        //public stateChange(object:any, data: Array<PanelBarItemModel>): boolean {
        if (object.staticMenu == true) {
            const focusedEvent = data.items.filter(item => item.focused === true)[0];
            if (this.paramConfig.DEBUG_FLAG)
                console.log(" in stateChange : " + focusedEvent.id);
            if (this.paramConfig.DEBUG_FLAG)
                console.log(focusedEvent);
            if (focusedEvent.title == "Formatting Flow") {
                object.showPanelbar = false;
            }
            //this.selectedId = focusedEvent.id;
            //this.router.navigate(['/' + focusedEvent.id]);
            //this.starServices.setRTL();
            return true; //Fuad check if it should return false or true
        }
        const focusedEvent = data.items.filter(item => item.focused === true)[0];
        if (this.paramConfig.DEBUG_FLAG)
            console.log(" in stateChange : ", focusedEvent.id);
        let routineAuth = this.getRoutineAuth(object.menu, focusedEvent.id);
        if (this.paramConfig.DEBUG_FLAG)
            console.log(" in stateChange : ", focusedEvent.id, "routineAuth :", routineAuth);
        if (focusedEvent.id == "PRVFLOW")
            object.showPanelbar = false;
        if (typeof routineAuth !== "undefined") {
            if (this.paramConfig.DEBUG_FLAG)
                console.log(" in stateChange : routineAuth.authLevel:" + routineAuth.authLevel);
            if (routineAuth.authLevel == 0) {
                let dialogStruc = {
                    msg: this.noAccessMsg,
                    title: "Warning",
                    info: null,
                    object: this,
                    action: this.OkActions,
                    callback: null
                };
                this.showConfirmation(dialogStruc);
                return false;
            }
            else {
                object.selectedId = focusedEvent.id;
                this.sessionParams["PrvUserFlow"] = "";
                this.sessionParams["PrvUserCDR"] = "";
                if (object.selectedId == "PRVFLOW") {
                    this.sessionParams["PrvUserFlow"] = "PRV_BLD";
                    this.sessionParams["PrvUserCDR"] = "PRV_CDR";
                    object.showPanelbar = false;
                }
                if (object.selectedId == "CCMCAT") {
                    this.sessionParams["PrvUserFlow"] = "CRC_CAT";
                    this.sessionParams["PrvUserCDR"] = "CRC_USER_INFO";
                    object.showPanelbar = false;
                }
                if (object.selectedId == "CCMGRP") {
                    this.sessionParams["PrvUserFlow"] = "CRC_GROUP";
                    this.sessionParams["PrvUserCDR"] = "CRC_GROUP_INFO";
                    object.showPanelbar = false;
                }
                if (object.selectedId == "CMGCAT") {
                    this.sessionParams["PrvUserFlow"] = "CAM_CAT";
                    this.sessionParams["PrvUserCDR"] = "CAM_USER_INFO";
                    object.showPanelbar = false;
                }
                if (object.selectedId == "CMGGRP") {
                    this.sessionParams["PrvUserFlow"] = "CAM_GROUP";
                    this.sessionParams["PrvUserCDR"] = "CAM_GROUP_INFO";
                    object.showPanelbar = false;
                }
                if (object.selectedId == "BILLING") {
                    this.sessionParams["PrvUserFlow"] = "BILLING";
                    this.sessionParams["PrvUserCDR"] = "BILLING_CDR";
                    object.showPanelbar = false;
                }
                if (object.selectedId.startsWith("PORTAL_")) //Fuad : RND
                 {
                    this.sessionParams["PORTAL_FORM"] = focusedEvent.id;
                    focusedEvent.id = 'DSPPORTAL';
                }
                //FUAD: check if below code till else is needed
                if (object.router.routerState.snapshot.url == ('/' + focusedEvent.id)) {
                    object.router.navigateByUrl('', { skipLocationChange: true }).then(() => object.router.navigate(['/' + focusedEvent.id], { skipLocationChange: true, replaceUrl: true, preserveFragment: false }));
                }
                else
                    object.router.navigate(['/' + focusedEvent.id], { skipLocationChange: true, replaceUrl: true, preserveFragment: false });
                //this.starServices.setRTL();
                //this.showPanelbar = false;
            }
        }
        return false;
    }
    setPanelBar(object) {
        if (!object.staticMenu) {
            object.Body = [];
            let NewVal = {
                MENU: object.currentMenu.toUpperCase(),
                USERNAME: object.paramConfig.USERNAME.toUpperCase(),
                LANGUAGE_NAME: object.paramConfig.userLang.toUpperCase()
            };
            NewVal["_QUERY"] = "GET_MENU_ROUTINES";
            object.addToBody(NewVal);
            let NewVal1 = {
                MENU: "",
                USERNAME: object.paramConfig.USERNAME.toUpperCase()
            };
            NewVal1["_QUERY"] = "GET_ROUTINES_AUTHORITY";
            object.addToBody(NewVal1);
            this.fetchMenu(object, this.handleFetchedPanelBar);
        }
    }
    handleFetchedPanelBar(object, data) {
        function checkAuthData(routine_name, authData) {
            let i = 0;
            let routineAuth;
            while (i < authData.length) {
                if (authData[i].ROUTINE_NAME == routine_name) {
                    routineAuth = authData[i];
                    break;
                }
                i++;
            }
            return routineAuth;
        }
        function formatData(arr, authData) {
            let menu = [];
            let children = [];
            for (let i = 0; i < arr.length; i++) {
                if (object.paramConfig.DEBUG_FLAG)
                    console.log("arr[i]:", arr[i]);
                let type = arr[i].choice_type.charAt(0);
                if (type == "M") {
                    if (children.length != 0) {
                        let item = {
                            title: menuItem.title,
                            choice: menuItem.choice,
                            children: children
                        };
                        menu.push(item);
                        children = [];
                    }
                    var menuItem = {
                        title: arr[i].text,
                        choice: arr[i].choice
                    };
                    //menu.push(item);
                }
                else if (type == "R") {
                    if (object.paramConfig.DEBUG_FLAG)
                        console.log("authData:", authData, "arr[i]:", arr[i]);
                    let routineAuth = checkAuthData(arr[i].choice, authData);
                    if (object.paramConfig.DEBUG_FLAG)
                        console.log("arr[i].choice:" + arr[i].choice + "  routineAuth.DISP_FLAG:" + routineAuth.DISP_FLAG + " routineAuth.AUTHLEVEL :" + routineAuth.AUTHLEVEL);
                    if (routineAuth.DISP_FLAG != "N") // && (routineAuth.AUTHLEVEL != 0) )
                     {
                        let routineItem = {
                            title: arr[i].text,
                            choice: arr[i].choice,
                            authLevel: routineAuth.AUTHLEVEL,
                            routineDesc: routineAuth.ROUTINE_DESC,
                            routineVer: routineAuth.ROUT_VER,
                            routerLink: "/" + arr[i].choice
                        };
                        children.push(routineItem);
                    }
                    if (object.paramConfig.DEBUG_FLAG)
                        console.log("---children:", children);
                }
            }
            if (children.length != 0) {
                let item = {
                    title: menuItem.title,
                    choice: menuItem.choice,
                    children: children
                };
                menu.push(item);
                children = [];
            }
            return menu;
        }
        object.menu = formatData(data[0].data, data[1].data);
        object.panelItems = object.menu;
        let paramConfig = {
            "Name": "menu",
            "Val": object.menu
        };
        setParamConfig(paramConfig);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    beginTrans() {
        this.commitBody = [];
        this.inTrans = true;
    }
    endTrans(object, commit) {
        let Page = "&_trans=Y";
        let tableInfo;
        if (commit && this.commitBody.length != 0) {
            return new Promise(resolve => {
                this.post(this, Page, this.commitBody).subscribe(result => {
                    this.commitBody = [];
                    this.inTrans = false;
                    tableInfo = result.data[0].data;
                    return resolve(tableInfo);
                }, err => {
                    object.FORM_TRIGGER_FAILURE = true;
                    this.commitBody = [];
                    this.inTrans = false;
                    //alert('error:' + err.message);
                    this.showErrorMsg(object, err);
                    return resolve(tableInfo);
                });
            });
        }
        else {
            this.commitBody = [];
            this.inTrans = false;
            return null;
        }
    }
    // public addToBody(NewVal) {
    //   this.Body.push(NewVal);
    // }
    execSQLBody(object, Body, DBLoc) {
        function getFirstWord(str) {
            let myArray = str.split("_");
            return myArray[0];
        }
        object.FORM_TRIGGER_FAILURE = false;
        let Page = "&_trans=N";
        if (DBLoc != "")
            Page = Page + "&DBLoc=" + DBLoc;
        let tableInfo;
        object.NOTFOUND = false;
        if (this.inTrans) {
            let firstWord = getFirstWord(Body[0]._QUERY).toUpperCase();
            let isCommitCommand = this.commitCommands.includes(firstWord);
            if (isCommitCommand) {
                this.commitBody.push(Body[0]);
                return tableInfo;
            }
        }
        return new Promise(resolve => {
            console.log("check:dirty testx execSQLBody 2");
            this.post(this, Page, Body).subscribe(result => {
                console.log("check:dirty testx execSQLBody 3");
                tableInfo = result.data;
                // if (result.data.length == 0)
                //   object.NOTFOUND = true;
                return resolve(tableInfo);
            }, err => {
                object.FORM_TRIGGER_FAILURE = true;
                alert('error:' + err.message);
                return resolve(tableInfo);
            });
        });
    }
    execSQL(object, sqlStmt) {
        function getFirstWord(str) {
            let spaceIndex = str.trim().indexOf(' ');
            return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
        }
        object.FORM_TRIGGER_FAILURE = false;
        let Page = "&_trans=N";
        this.Body = [];
        let NewVal = {};
        NewVal["_QUERY"] = "EXECSQL";
        NewVal["_STMT"] = sqlStmt;
        let tableInfo;
        object.NOTFOUND = false;
        if (this.inTrans) {
            let firstWord = getFirstWord(sqlStmt).toUpperCase();
            let isCommitCommand = this.commitCommands.includes(firstWord);
            if (isCommitCommand) {
                this.commitBody.push(NewVal);
                return tableInfo;
            }
        }
        this.Body = this.addToBody(NewVal, this.Body);
        return new Promise(resolve => {
            this.post(this, Page, this.Body).subscribe(result => {
                this.Body = [];
                tableInfo = result.data[0].data;
                if (result.data[0].rowCount == 0)
                    object.NOTFOUND = true;
                return resolve(tableInfo);
            }, err => {
                object.FORM_TRIGGER_FAILURE = true;
                alert('error:' + err.message);
                return resolve(tableInfo);
            });
        });
    }
    ////////
    att_img_getFileLink(field_data, object) {
        let fileLink = "";
        if ((field_data != "") && (field_data != "[]")) {
            field_data = JSON.parse(field_data);
            //console.log("getFileLink:field_data:", field_data)
            fileLink = object.AttDwnUrl + encodeURI(field_data[0].name);
            //console.log("getFileLink:fileLink:", fileLink)
        }
        return fileLink;
    }
    att_img_getAtt(data, object) {
        let atts = "";
        //console.log("getAtt_data:", data);
        if ((data != "") && (data != "[]")) {
            let vals = [{ name: "",
                    size: "" }
            ];
            vals = JSON.parse(data);
            //console.log("getAtt_data:", vals);
            vals.forEach(val => {
                //console.log("val:", val)
                atts = atts + "<" + val.name + " Size:" + val.size + ">";
            });
        }
        return atts;
    }
    att_img_populateArrs(formGroup, object) {
        for (let i = 0; i < object.att_arr.length; i++) {
            if (formGroup[object.att_arr[i]] != "")
                object.myFiles[object.att_arr[i]] = JSON.parse(formGroup[object.att_arr[i]]);
        }
        for (let i = 0; i < object.img_arr.length; i++) {
            if (formGroup[object.img_arr[i]] != "")
                object.myFiles[object.img_arr[i]] = JSON.parse(formGroup[object.img_arr[i]]);
        }
        for (let i = 0; i < object.att_arr.length; i++) {
            //console.log("object.att_arr[i]:", object.att_arr[i])
            if (formGroup[object.att_arr[i]] != "") {
                let items1 = [];
                let field_data = formGroup[object.att_arr[i]];
                field_data = JSON.parse(field_data);
                for (let j = 0; j < field_data.length; j++) {
                    let item = { title: field_data[j].name, url: object.AttDwnUrl + encodeURI(field_data[i].name) };
                    items1.push(item);
                }
                object.img_gallery[object.att_arr[i]] = items1;
            }
            //console.log("img_gallery:", object.img_gallery)
        }
    }
    att_img_form_openUploadimage(field_id, object) {
        //object.uploadimage = true;
        //console.log("openUploadimage:field_id:", field_id, object.myFiles, object.myFiles[field_id])
        let myFiles = [];
        if (typeof object.myFiles[field_id] != "undefined") {
            myFiles = object.myFiles[field_id];
        }
        let filesDeleted = [];
        if (typeof object.filesDeleted[field_id] != "undefined") {
            filesDeleted = object.filesDeleted[field_id];
        }
        let imageID = field_id;
        var masterParams = {
            "action": "upload",
            "imageID": imageID,
            "myFiles": myFiles,
            "filesDeleted": filesDeleted
        };
        object.DSP_UPLOADConfig = new componentConfigDef();
        object.DSP_UPLOADConfig.masterParams = masterParams;
        console.log("object.DSP_UPLOADConfig.masterParams:", object.DSP_UPLOADConfig.masterParams);
    }
    callGetSaveAttachemts(action, data, object) {
        //console.log("callSaveAttachemts:myFiles:", object.myFiles)
        var masterParams = {
            "action": action,
            "att_arr": object.att_arr,
            "img_arr": object.img_arr,
            "myFiles": object.myFiles,
            "filesDeleted": object.filesDeleted,
            "data": data
        };
        object.DSP_UPLOADConfig = new componentConfigDef();
        object.DSP_UPLOADConfig.masterParams = masterParams;
    }
    async att_img_saveFormCompletedHandler(value, object) {
        //console.log("att_img_saveFormCompletedHandler:value", value);
        let field_id = value.field_id;
        object.myFiles[field_id] = value.myFiles;
        object.filesDeleted[field_id] = value.filesDeleted;
        //console.log("object.myFiles[field_id]:", object.myFiles[field_id])
        object.form.value[field_id] = JSON.stringify(object.myFiles[field_id]);
        object.form.patchValue({ [field_id]: JSON.stringify(object.myFiles[field_id]) });
    }
    att_img_saveGridCompletedHandler(value, object) {
        //console.log("att_img_saveGridCompletedHandler:value", value);
        let field_id = value.field_id;
        object.myFiles[field_id] = value.myFiles;
        object.filesDeleted[field_id] = value.filesDeleted;
        //console.log("object.myFiles[field_id]:", object.myFiles[field_id])
        object.formGroup.patchValue({ [field_id]: JSON.stringify(object.myFiles[field_id]) });
        object.formGroup.markAsDirty();
        //console.log("att_img_saveGridCompletedHandler:object.formGroup.value", object.formGroup.value);
        object.uploadimage = false;
    }
    async att_img_grid_openUploadimage(field_id, object) {
        if (!object.componentConfig.enabled)
            return;
        await object.starServices.sleep(300);
        //console.log("att_img_grid_openUploadimage:object.formGroup:", object.formGroup)
        object.uploadimage = true;
        if (typeof object.formGroup != "undefined") {
            object.myFiles[field_id] = [];
            object.starServices.att_img_populateArrs(object.formGroup.value, object);
            //console.log("openUploadimage:field_id:", field_id, object.myFiles, object.myFiles[field_id])
            let myFiles = [];
            if (typeof object.myFiles[field_id] != "undefined") {
                myFiles = object.myFiles[field_id];
            }
            let filesDeleted = [];
            if (typeof object.filesDeleted[field_id] != "undefined") {
                filesDeleted = object.filesDeleted[field_id];
            }
            let imageID = field_id;
            var masterParams = {
                "action": "upload",
                "imageID": imageID,
                "myFiles": myFiles,
                "filesDeleted": filesDeleted
            };
            object.DSP_UPLOADConfig = new componentConfigDef();
            object.DSP_UPLOADConfig.masterParams = masterParams;
        }
    }
    addNewCode(object, CODENAME) {
        object.grid_som_tabs_codes = new tabsCodes();
        object.grid_som_tabs_codes['CODENAME'] = CODENAME; // for retrieve data
        object.SOM_TABS_CODESConfig = new componentConfigDef();
        let masterParams = {
            action: "ADD",
            CODENAME: CODENAME,
            CODE: object.filterCode,
            CODETEXT_LANG: object.filterCode
        };
        object.SOM_TABS_CODESConfig.masterParams = masterParams; // For add new record
        object.showCodeDetails = true;
    }
    handleFilterCode(object, CODE) {
        if (object.paramConfig.USER_INFO.GROUPNAME == "SYSADM") {
            object.filterCode = CODE;
        }
    }
    hideNoValidLicense() {
        document.documentElement.style.setProperty('ng-reflect-ng-style', '1px');
        const collection = document.getElementsByTagName("div");
        for (let i = 0; i < collection.length; i++) {
            let innerHTML = collection[i].innerHTML;
            let result = innerHTML.includes("ng-reflect-ng-style");
            if (result) {
                result = innerHTML.includes("No valid license found");
                if (result) {
                    //console.log ("innerHTML:",result,innerHTML);
                    collection[i].style.setProperty('display', 'none');
                }
            }
        }
        //console.log ("collection:", collection.length, collection[35])
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: starServices, deps: [{ token: i1.NotificationService }, { token: i2.DialogService }, { token: i3.HttpClient }, { token: i4.MessageService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: starServices, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: starServices, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.NotificationService }, { type: i2.DialogService }, { type: i3.HttpClient }, { type: i4.MessageService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcmxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc3RhcmxpYi9zcmMvbGliL3N0YXJsaWIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFJNUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxtQ0FBbUM7QUFDbkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsVUFBVSxFQUFTLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUE0QixpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzdGLE9BQU8sRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBZSxNQUFNLDJCQUEyQixDQUFDO0FBRXRGLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0MsT0FBTyxFQUFHLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7Ozs7O0FBV3pELHFFQUFxRTtBQUNuRSxNQUFNLE9BQU8sWUFBWTtJQWlEekIsWUFDVSxtQkFBd0MsRUFDeEMsYUFBNEIsRUFDNUIsSUFBZ0IsRUFDaEIsUUFBd0I7UUFFaEMsY0FBYztRQUNkLGlDQUFpQztRQU56Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFuRDFCLGlCQUFZLEdBQVUsRUFBRSxDQUFDO1FB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LEVBQUUsRUFBQyxDQUFDO1lBQ3BDLElBQUksU0FBUyxHQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3ZELElBQUksTUFBTSxFQUFDLENBQUM7Z0JBQ1YsTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxNQUFNLEVBQUMsQ0FBQztvQkFDViw4Q0FBOEM7b0JBQzlDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztZQUVMLENBQUM7UUFFSCxDQUFDO1FBQ0QsZ0VBQWdFO0lBQ3BFLENBQUM7OEdBeHZIYSxZQUFZO2tIQUFaLFlBQVksY0FIYixNQUFNOzsyRkFHTCxZQUFZO2tCQUoxQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEdyaWREYXRhUmVzdWx0IH0gZnJvbSAnQHByb2dyZXNzL2tlbmRvLWFuZ3VsYXItZ3JpZCc7XG5pbXBvcnQgeyB0b09EYXRhU3RyaW5nIH0gZnJvbSAnQHByb2dyZXNzL2tlbmRvLWRhdGEtcXVlcnknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbi8vaW1wb3J0IHsgQW55QVJlY29yZCB9IGZyb20gJ2Rucyc7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCByZXRyeSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICdAcHJvZ3Jlc3Mva2VuZG8tYW5ndWxhci1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSwgRGlhbG9nUmVmLCBEaWFsb2dDbG9zZVJlc3VsdCB9IGZyb20gJ0Bwcm9ncmVzcy9rZW5kby1hbmd1bGFyLWRpYWxvZyc7XG5pbXBvcnQgeyBEYXksIGZpcnN0RGF5SW5XZWVrLCBnZXREYXRlLCB0b0xvY2FsRGF0ZSB9IGZyb20gJ0Bwcm9ncmVzcy9rZW5kby1kYXRlLW1hdGgnO1xuaW1wb3J0IHsgUGFuZWxCYXJJdGVtTW9kZWwsIFBhbmVsQmFyU3RhdGVDaGFuZ2VFdmVudCB9IGZyb20gJ0Bwcm9ncmVzcy9rZW5kby1hbmd1bGFyLWxheW91dCc7XG5pbXBvcnQgeyBNZDUgfSBmcm9tICd0cy1tZDUvZGlzdC9tZDUnO1xuaW1wb3J0IHsgZm9ybWF0RGF0ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBrZXlmcmFtZXMgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7ICB0YWJzQ29kZXMsIGNvbXBvbmVudENvbmZpZ0RlZiB9IGZyb20gJy4vbW9kZWwnO1xuXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJ0Bwcm9ncmVzcy9rZW5kby1hbmd1bGFyLWwxMG4nO1xuaW1wb3J0IHsgTXlNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vbXktbWVzc2FnZS5zZXJ2aWNlJztcbi8vIGltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuZGVjbGFyZSBmdW5jdGlvbiBnZXRQYXJhbUNvbmZpZygpOiBhbnk7XG5kZWNsYXJlIGZ1bmN0aW9uIHNldFBhcmFtQ29uZmlnKHZhcjE6YW55KTphbnk7XG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG4vL2V4cG9ydCBjbGFzcyBzdGFyU2VydmljZXMgZXh0ZW5kcyBCZWhhdmlvclN1YmplY3Q8R3JpZERhdGFSZXN1bHQ+IHtcbiAgZXhwb3J0IGNsYXNzIHN0YXJTZXJ2aWNlcyAge1xuICBwdWJsaWMgcGFyYW1Db25maWc6YW55O1xuICBwcml2YXRlIGNyZWF0ZWRJdGVtczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSB1cGRhdGVkSXRlbXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgZGVsZXRlZEl0ZW1zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgbG9hZGluZzogYW55O1xuICBwdWJsaWMgcm91dGluZV9uYW1lID0gXCJcIjtcbiAgcHVibGljIHNhdmVDaGFuZ2VzTXNnID0gXCJTY3JlZW4gY2hhbmdlZCwgYXJlIHlvdSBzdXJlIHlvdSB0byBuYXZpZ2F0ZT9cIjtcbiAgcHVibGljIGRlbGV0ZURldGFpbE1zZyA9IFwiQ2FuIG5vdCBkZWxldGUgYXMgZGV0YWlsIGhhcyBkYXRhLlwiO1xuICBwdWJsaWMgcGxlYXNlQ29uZmlybU1zZyA9IFwiUGxlYXNlIGNvbmZpcm1cIjtcbiAgcHVibGljIGRlbGV0ZUNvbmZpcm1Nc2cgPSBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyByZWNvcmQ/XCI7XG4gIHB1YmxpYyBub3RoaW5nVG9EZWxldGVsTXNnID0gXCJObyByZWNvcmRzIHRvIGRlbGV0ZS5cIjtcbiAgcHVibGljIGZpZWxkc1JlcXVpcmVkTXNnID0gXCJQbGVhc2UgZW50ZXIgcmVxdWlyZWQgZmllbGRzLlwiXG4gIHB1YmxpYyByZWFkT25seU1zZyA9IFwiQ2FuIG5vdCBzYXZlICwgeW91ciBhdXRob3JpdHkgaXMgcmVhZG9ubHkuXCJcbiAgcHVibGljIG5vQWNjZXNzTXNnID0gXCJZb3UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGlzIHJvdXRpbmUuXCJcbiAgcHVibGljIHN0YW5kYXJkRXJyb3JNc2cgPSBcIkVycm9yIHBlcmZvcm1pbmcgdHJhbnNhY3Rpb25cIlxuICBwdWJsaWMgc2F2ZU1hc3Rlck1zZyA9IFwiU2F2ZSBtYXN0ZXIgcmVjb3JkIGZpcnN0LlwiXG4gIHB1YmxpYyBVU0VSTkFNRSA9IFwiXCI7XG4gIHB1YmxpYyBoaWRlQWZ0ZXIgPSAyMDAwO1xuICBwdWJsaWMgU3RyQXV0aCA9IFwiXCI7XG4gIHB1YmxpYyBVU0VSX0lORk86YW55O1xuICBwdWJsaWMgTUFTVEVSX0RCID0gXCJcIjtcbiAgcHJpdmF0ZSBodHRwT3B0aW9uczphbnk7XG4gIHB1YmxpYyBsaW1pdCA9IDE1MDA7XG4gIHB1YmxpYyBZZXNOb0FjdGlvbnMgPSBbXG4gICAgeyB0ZXh0OiAnTm8nLCBwcmltYXJ5OiBmYWxzZSB9LFxuICAgIHsgdGV4dDogJ1llcycsIHByaW1hcnk6IHRydWUgfVxuICBdO1xuICBwdWJsaWMgT2tBY3Rpb25zID0gW1xuICAgIHsgdGV4dDogJ09rJywgcHJpbWFyeTogZmFsc2UgfVxuICBdO1xuICBwdWJsaWMgc2Vzc2lvblBhcmFtczphbnkgPSB7fTtcblxuXG5cbiAgLy9wcml2YXRlIEJBU0VfVVJMID0gJ2h0dHBzOi8vb2RhdGFzYW1wbGVzZXJ2aWNlcy5henVyZXdlYnNpdGVzLm5ldC9WNC9Ob3J0aHdpbmQvTm9ydGh3aW5kLnN2Yy8nO1xuICAvL3ByaXZhdGUgQkFTRV9VUkwgPSAnaHR0cDovLzE5Mi4xNjguMS4zOjgwOTAvYXBpP19mb3JtYXQ9anNvbiZfbGltaXQ9NTAnO1xuXG4gIHB1YmxpYyBFUE1FTkdfVVJMID0gXCJcIjsgLy8naHR0cDovLzE5Mi4xNjguMS41OjgwOTIvZm9ybWF0JztcbiAgLy9wcml2YXRlIEVQTUVOR19VUkwgPSAnaHR0cDovL2dtYXNocm8uY29tOjgwOTIvZm9ybWF0JztcblxuICBwdWJsaWMgU0VSVkVSX1VSTCA9IFwiXCI7IC8vICdodHRwOi8vbG9jYWxob3N0OjgwOTAnO1xuICAvL3B1YmxpYyBTRVJWRVJfVVJMID0gJ2h0dHA6Ly9nbWFzaHJvLmNvbTo4MDkwJztcblxuICBwdWJsaWMgQkFTRV9VUkwgPSB0aGlzLlNFUlZFUl9VUkwgKyAnL2FwaT9fZm9ybWF0PWpzb24mX2xpbWl0PScgKyB0aGlzLmxpbWl0O1xuICAvL3ByaXZhdGUgQkFTRV9VUkwgPSAnaHR0cDovL2dtYXNocm8uY29tOjgwOTAvYXBpP19mb3JtYXQ9anNvbiZfbGltaXQ9JyArIHRoaXMubGltaXQ7XG4gIHB1YmxpYyBlS3ljU2NyID0gXCJEU1BFS1lDXCI7XG4gIHB1YmxpYyBwb3J0YWxTY3IgPSBcIkRTUFBPUlRBTFwiO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogTm90aWZpY2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgbWVzc2FnZXM6IE1lc3NhZ2VTZXJ2aWNlXG4gICkge1xuICAgIC8vc3VwZXIobnVsbCk7XG4gICAgLy9sb2dnZXIud2FybihcIldhcm5pbmcgbWVzc2FnZVwiKTtcblxuICB9XG5cbiAgLy8gcHVibGljIHF1ZXJ5KHN0YXRlOiBhbnkpOiB2b2lkIHtcbiAgLy8gICBsZXQgcXVlcnlOYW1lID0gXCJcIjtcbiAgLy8gICB0aGlzLmZldGNoKHRoaXMsIHF1ZXJ5TmFtZSlcbiAgLy8gICAgIC5zdWJzY3JpYmUoKHg6YW55KSA9PiBzdXBlci5uZXh0KHgpKTtcbiAgLy8gfVxuICBwdWJsaWMgcmVtb3ZlUmVjKGdyaWREYXRhOiBhbnksIGVkaXRlZFJvd0luZGV4OiBudW1iZXIpIHtcblxuICAgIC8vbGV0IHJlc3VsdDEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdyaWREYXRhKSk7XG4gICAgaWYgKHR5cGVvZiBlZGl0ZWRSb3dJbmRleCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgZ3JpZERhdGEuZGF0YS5zcGxpY2UoZWRpdGVkUm93SW5kZXgsIDEpO1xuICAgICAgZ3JpZERhdGEudG90YWwgPSBncmlkRGF0YS5kYXRhLmxlbmd0aDtcbiAgICAgIC8qICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdyZW12aW5nIGVkaXRlZFJvd0luZGV4OicgKyBlZGl0ZWRSb3dJbmRleClcbiAgICAgICAgcmVzdWx0MS5kYXRhLnNwbGljZSggZWRpdGVkUm93SW5kZXggLCAxICk7XG4gICAgICAgIHJlc3VsdDEudG90YWwgPSByZXN1bHQxLmRhdGEubGVuZ3RoOyovXG4gICAgfVxuXG4gICAgcmV0dXJuIGdyaWREYXRhO1xuICB9XG4gIHB1YmxpYyB1cGRhdGVSZWMoZ3JpZERhdGE6IGFueSwgZWRpdGVkUm93SW5kZXg6IG51bWJlciwgTmV3VmFsOiBhbnkpIHtcbiAgICBncmlkRGF0YS5kYXRhW2VkaXRlZFJvd0luZGV4XSA9IE5ld1ZhbDtcblxuICAgIHJldHVybiBncmlkRGF0YTtcblxuICB9XG4gIHB1YmxpYyBhZGRSZWMoZ3JpZERhdGE6IGFueSwgTmV3VmFsOiBhbnkpIHtcbiAgICBncmlkRGF0YS5kYXRhLnB1c2goTmV3VmFsKTtcbiAgICAvKiBsZXQgcmVzdWx0ID17XCJkYXRhXCI6W10sIHRvdGFsOjB9O1xuICAgICBsZXQgcmVzdWx0MSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ3JpZERhdGEpKTtcbiAgICAgTmV3VmFsID0gdGhpcy5wYXJzZVRvRGF0ZShOZXdWYWwpO1xuICAgICByZXN1bHQxLmRhdGEucHVzaChOZXdWYWwpO1xuICAgICByZXN1bHQuZGF0YSA9IHJlc3VsdDEuZGF0YTtcbiAgICAgcmVzdWx0LnRvdGFsID0gcmVzdWx0LmRhdGEubGVuZ3RoO1xuICAgICByZXR1cm4gcmVzdWx0MTsqL1xuICAgIHJldHVybiBncmlkRGF0YTtcbiAgfVxuICAgIHB1YmxpYyBmb3JtYXRXaGVyZShOZXdWYWw6YW55KXtcbiAgICAgIGZ1bmN0aW9uIGlzRGF0ZSAodmFsdWU6YW55KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gRk9STUFUX0lTT19wYXJzZShkOmFueSkgeyAvLyBUaGlzIGZ1bmN0aW9uIHdhcyBhZGRlZCBmb3IgQ1JNLiBDUk0gZGF0ZXMgc2hvdWxkIGJlIElTT1xuICAgICAgICAgIHZhciBkYXRlSXNvID0gZC50b0lTT1N0cmluZygpO1xuICAgICAgICAgIHZhciBkYXRlSXNvQXJyID0gZGF0ZUlzby5zcGxpdChcIlRcIik7XG4gICAgICAgICAgZGF0ZUlzbyA9IGRhdGVJc29BcnJbMF0gKyBcIiBcIiArIGRhdGVJc29BcnJbMV07XG4gICAgICAgICAgZGF0ZUlzbyA9IGRhdGVJc28uc3Vic3RyKDAsIDE5KTtcbiAgICAgICAgICByZXR1cm4gZGF0ZUlzbztcbiAgICAgICAgfVxuICAgICAgZnVuY3Rpb24gcGFyc2VWYWx1ZShrZXk6YW55LCB2YWx1ZTphbnkpe1xuICAgICAgICBsZXQgcGhyYXNlID0gXCJcIjtcbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImlzRGF0ZTpcIiAsIGlzRGF0ZSAodmFsdWUpLCB2YWx1ZSk7XG5cbiAgICAgICAgaWYgKGlzRGF0ZSAodmFsdWUpKXtcbiAgICAgICAgICAgIC8vdmFsdWUgPSBnZXREYXRlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vdmFsdWUgPSBGT1JNQVRfSVNPX3BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBpdCdzIGEgc3RyaW5nXG4gICAgICAgICAgaWYgKHZhbHVlICE9IFwiXCIgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxldCBvcGVyYXRvcnMgPSBcIjw+IT1cIlxuICAgICAgICAgICAgbGV0IG9wZXJhdG9yVmFsID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0cmltZWVkVmFsID0gdmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgbGV0IGZpcnN0Q2hhciA9IHRyaW1lZWRWYWwuY2hhckF0KDApO1xuICAgICAgICAgICAgbGV0IG4gPSBvcGVyYXRvcnMuc2VhcmNoKGZpcnN0Q2hhcik7XG4gICAgICAgICAgICBpZiAoIG4gIT0gLTEpe1xuICAgICAgICAgICAgICBpZiAoZmlyc3RDaGFyID09IFwifFwiKVxuICAgICAgICAgICAgICAgIG9wZXJhdG9yVmFsID0gXCIgPSAnXCIgICsgdmFsdWUgKyBcIicgXCI7XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvcGVyYXRvclZhbCA9IHZhbHVlO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICggdmFsdWUudG9VcHBlckNhc2UoKS5zZWFyY2goXCIlXCIpICE9IC0xKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvcGVyYXRvclZhbCA9IFwiIGxpa2UgJ1wiICArIHZhbHVlICsgXCInIFwiO1xuICAgICAgICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib3BlcmF0b3JWYWw6XCIrIG9wZXJhdG9yVmFsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvcGVyYXRvclZhbCA9IFwiID0gJ1wiICArIHZhbHVlICsgXCInIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGhyYXNlID0ga2V5ICsgZW5jb2RlVVJJQ29tcG9uZW50KG9wZXJhdG9yVmFsKTtcbiAgICAgICAgICAgIC8vcGhyYXNlID0ga2V5ICsgb3BlcmF0b3JWYWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgIC8vIGl0J3Mgc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBsZXQgb3BlcmF0b3JWYWwgPSBcIiA9ICdcIiAgKyB2YWx1ZSArIFwiJyBcIjtcbiAgICAgICAgICBwaHJhc2UgPSBrZXkgKyBlbmNvZGVVUklDb21wb25lbnQob3BlcmF0b3JWYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBocmFzZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHdoZXJlUGhyYXNlID0gXCJcIjtcbiAgICAgICAgbGV0IHdoZXJlQ2xhdXNlID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJmb3JtYXRXaGVyZTpcIilcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coTmV3VmFsKVxuICAgICAgICBPYmplY3Qua2V5cyhOZXdWYWwpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBOZXdWYWxba2V5XTtcbiAgICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coa2V5ICsgXCI6XCIgKyB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoICh2YWx1ZSAhPSBcIlwiICkgJiYgKHZhbHVlICE9IG51bGwpIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGV0IHBocmFzZSA9IHBhcnNlVmFsdWUoa2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHdoZXJlUGhyYXNlID09IFwiXCIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aGVyZVBocmFzZSA9IHdoZXJlUGhyYXNlICsgICBwaHJhc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlUGhyYXNlID0gd2hlcmVQaHJhc2UgKyBcIiBhbmQgXCIgKyBwaHJhc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAod2hlcmVQaHJhc2UgIT0gXCJcIilcbiAgICAgICAgICAgIHdoZXJlQ2xhdXNlID0gXCImX1dIRVJFPVwiICsgd2hlcmVQaHJhc2U7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHdoZXJlQ2xhdXNlID0gXCImX1dIRVJFPVwiO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwid2hlcmVDbGF1c2U6XCIgKyB3aGVyZUNsYXVzZSk7XG4gICAgICAgIHJldHVybiB3aGVyZUNsYXVzZTtcbiAgICB9XG5cbiAgcHVibGljIGNoZWNrREJMb2ModGhlVVJMOmFueSkge1xuXG4gICAgbGV0IHBhcmFtQ29uZmlnID0gZ2V0UGFyYW1Db25maWcoKTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5EQkxvYyAhPSBcIlwiKXtcbiAgICAgIGxldCB1c2VyTmFtZSA9IHBhcmFtQ29uZmlnLlVTRVJOQU1FO1xuICAgICAgdGhlVVJMID0gdGhlVVJMICsgXCImREJMb2M9XCIgKyB1c2VyTmFtZTtcblxuICAgIH1cbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRoZVVSTDpcIiwgdGhlVVJMKTtcblxuICAgIHJldHVybiB0aGVVUkw7XG4gIH1cblxuICBwdWJsaWMgZmV0Y2gob2JqZWN0OmFueSwgcXVlcnlOYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPEdyaWREYXRhUmVzdWx0PiB7XG4gICAgLy9jb25zdCBxdWVyeVN0ciA9IGAke3RvT0RhdGFTdHJpbmcoc3RhdGUpfSYkY291bnQ9dHJ1ZWA7XG4gICAgY29uc3QgcXVlcnlTdHIgPSBgYDtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIGxldCB0aGVVUkwgPSBgJHt0aGlzLkJBU0VfVVJMfSR7cXVlcnlOYW1lfWA7XG4gICAgdGhlVVJMID0gdGhpcy5jaGVja0RCTG9jKHRoZVVSTCk7XG5cblxuICAgIHRoaXMuaHR0cE9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnYXV0aG9yaXphdGlvbic6IHRoaXMuU3RyQXV0aFxuXG4gICAgICB9KVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLmdldChgJHt0aGVVUkx9YCwgdGhpcy5odHRwT3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChyZXNwb25zZTphbnkpID0+ICg8R3JpZERhdGFSZXN1bHQ+eyBkYXRhOiByZXNwb25zZVsnZGF0YSddIH1cbiAgICAgICAgKSksXG4gICAgICAgIHRhcChkYXRhID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInN0YXR1cyBkYXRhOiBcIiwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0OnRoaXMucnVsZXNQb3N0UXVlcnlEZWZcIiwgdGhpcy5ydWxlc1Bvc3RRdWVyeURlZilcbiAgICAgICAgICAgIGxldCBzdGF0dXNSZWM6YW55ID0ge307XG4gICAgICAgICAgc3RhdHVzUmVjID0gdGhpcy5jaGVja1J1bGVzKG9iamVjdCwgdGhpcy5ydWxlc1Bvc3RRdWVyeURlZiwgZGF0YSxcIlBPU1RfUVVFUllcIik7XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJzdGF0dXNSZWM6cG9zdDpQT1NUX1FVRVJZOmZldGNoOlwiLCBzdGF0dXNSZWMsIHN0YXR1c1JlY1snc3RhdHVzJ10pO1xuICAgICAgICAgIGlmIChzdGF0dXNSZWNbJ3N0YXR1cyddICA9PSAtMSl7XG4gICAgICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24gKFwiZXJyb3JcIixcIlJ1bGU6XCIgKyBzdGF0dXNSZWNbJ21zZyddICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyogcHVibGljIHJlbW92ZSggcGFnZTogYW55KTpPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgIHRoaXMuZGVsZXRlKHBhZ2UpXG4gICAgICAgICAgIC5zdWJzY3JpYmUoKHg6YW55KSA9PiBzdXBlci5uZXh0KHgpKTtcblxuICAgICAgICAgICByZXR1cm4gMDtcbiAgIH1cbiovXG4gIHB1YmxpYyBkZWxldGUoUGFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxHcmlkRGF0YVJlc3VsdD4ge1xuICAgIC8vY29uc3QgcXVlcnlTdHIgPSBgJHt0b09EYXRhU3RyaW5nKHN0YXRlKX0mJGNvdW50PXRydWVgO1xuICAgIGNvbnN0IHF1ZXJ5U3RyID0gYGA7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICBsZXQgdGhlVVJMID0gYCR7dGhpcy5CQVNFX1VSTH0ke1BhZ2V9YDtcbiAgICB0aGVVUkwgPSB0aGlzLmNoZWNrREJMb2ModGhlVVJMKTtcblxuICAgIHRoaXMuaHR0cE9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnYXV0aG9yaXphdGlvbic6IHRoaXMuU3RyQXV0aFxuXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5kZWxldGU8YW55PihgJHt0aGVVUkx9YCwgdGhpcy5odHRwT3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICB9KSxcblxuICAgICAgICBtYXAoKHJlc3BvbnNlOmFueSkgPT4gKDxHcmlkRGF0YVJlc3VsdD57IGRhdGE6IHJlc3BvbnNlWydkYXRhJ10gfVxuICAgICAgICApKSxcblxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpXG4gICAgICApO1xuICB9XG4gIHB1YmxpYyBwb3N0X2RlbGV0ZShQYWdlOiBzdHJpbmcsIEJvZHk6IGFueSk6IE9ic2VydmFibGU8R3JpZERhdGFSZXN1bHQ+IHtcbiAgICAvL2NvbnN0IHF1ZXJ5U3RyID0gYCR7dG9PRGF0YVN0cmluZyhzdGF0ZSl9JiRjb3VudD10cnVlYDtcbiAgICBjb25zdCBxdWVyeVN0ciA9IGBgO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBvc3Q6UGFnZTpcIixQYWdlLFwiIEJvZHk6XCIsQm9keSlcblxuICAgIGxldCB0aGVVUkwgPSBgJHt0aGlzLkJBU0VfVVJMfSR7UGFnZX1gO1xuICAgIHRoaXMuaHR0cE9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnYXV0aG9yaXphdGlvbic6IHRoaXMuU3RyQXV0aFxuXG4gICAgICB9KVxuICAgIH1cbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGhpcy5TdHJBdXRoOlwiICsgdGhpcy5TdHJBdXRoKTtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucG9zdDxhbnk+KGAke3RoZVVSTH1gLCBCb2R5LCB0aGlzLmh0dHBPcHRpb25zKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICAgIH0pLFxuXG4gICAgICAgIG1hcCgocmVzcG9uc2U6YW55KSA9PiAoPEdyaWREYXRhUmVzdWx0PnsgZGF0YTogcmVzcG9uc2VbJ2RhdGEnXSB9XG4gICAgICAgICkpLFxuICAgICAgICB0YXAoZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJzdGF0dXMgZGF0YTpcIiwgZGF0YSk7XG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pXG5cblxuICAgICAgKTtcbiAgfVxuICBwdWJsaWMgc3luY0ZsYWcgPSAwO1xuICBwdWJsaWMgcG9zdChvYmplY3Q6YW55LCBQYWdlOiBzdHJpbmcsIEJvZHk6IGFueSk6IE9ic2VydmFibGU8R3JpZERhdGFSZXN1bHQ+IHtcbiAgICAvL2NvbnN0IHF1ZXJ5U3RyID0gYCR7dG9PRGF0YVN0cmluZyhzdGF0ZSl9JiRjb3VudD10cnVlYDtcbiAgICBjb25zdCBxdWVyeVN0ciA9IGBgO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBvc3Q6UGFnZTpcIixQYWdlLFwiIEJvZHk6XCIsQm9keSlcbiAgICBsZXQgc3RhdHVzUmVjOmFueSA9IHt9O1xuICAgIHN0YXR1c1JlYyA9IHRoaXMuY2hlY2tSdWxlcyhvYmplY3QsIHRoaXMucnVsZXNQcmVRdWVyeURlZiwgQm9keSxcIlBSRV9RVUVSWVwiKTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInN0YXR1c1JlYzpwb3N0OlBSRV9RVUVSWVwiLCBzdGF0dXNSZWMsIHN0YXR1c1JlY1snc3RhdHVzJ10pO1xuICAgIGlmIChzdGF0dXNSZWNbJ3N0YXR1cyddICA9PSAtMSl7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInN0YXR1c1JlYzogZm91bmQgLTFcIik7XG4gICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24gKFwiZXJyb3JcIixcIlJ1bGU6XCIgKyBzdGF0dXNSZWNbJ21zZyddICk7XG4gICAgICBCb2R5WzBdLl9RVUVSWSA9IFwiXCI7XG4gICAgfVxuXG4gICAgbGV0IHRoZVVSTCA9IGAke3RoaXMuQkFTRV9VUkx9JHtQYWdlfWA7XG4gICAgdGhlVVJMID0gdGhpcy5jaGVja0RCTG9jKHRoZVVSTCk7XG4gICAgdGhpcy5odHRwT3B0aW9ucyA9IHtcbiAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdhdXRob3JpemF0aW9uJzogdGhpcy5TdHJBdXRoXG5cbiAgICAgIH0pXG4gICAgfVxuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0aGlzLlN0ckF1dGg6XCIgLCB0aGlzLlN0ckF1dGggLCB0aGVVUkwpO1xuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0aGlzLlN0ckF1dGg6IHdpdGggVVJMXCIgLCB0aGlzLlN0ckF1dGggLCB0aGVVUkwpO1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PGFueT4oYCR7dGhlVVJMfWAsIEJvZHksIHRoaXMuaHR0cE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJzdGF0dXNSZWNbJ21zZyddIDpcIiwgc3RhdHVzUmVjWydtc2cnXSwgXCIgZXJyLmVycm9yIDpcIiwgZXJyLmVycm9yICApXG4gICAgICAgICAgLy9pZiAoICh0eXBlb2Ygc3RhdHVzUmVjWydtc2cnXSAhPSBcInVuZGVmaW5lZFwiKSB8fCAoc3RhdHVzUmVjWydtc2cnXSAhPSBcIlwiKSkge1xuICAgICAgICAgIGlmICggKHN0YXR1c1JlY1snbXNnJ10gIT0gXCJcIikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyLmVycm9yID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICBlcnIgPSBzdGF0dXNSZWNbJ21zZyddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBlcnIuZXJyb3IuZXJyb3IgPSAgc3RhdHVzUmVjWydtc2cnXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgICAgfSksXG5cbiAgICAgICAgbWFwKChyZXNwb25zZTphbnkpID0+ICg8R3JpZERhdGFSZXN1bHQ+eyBkYXRhOiByZXNwb25zZVsnZGF0YSddIH1cbiAgICAgICAgKSksXG4gICAgICAgIHRhcChkYXRhID0+IHtcbiAgICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwic3RhdHVzIGRhdGE6XCIsIGRhdGEpO1xuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0OnRoaXMucnVsZXNQb3N0UXVlcnlEZWZcIiwgdGhpcy5ydWxlc1Bvc3RRdWVyeURlZilcbiAgICAgICAgICB0aGlzLnN5bmNGbGFnID0gMDtcbiAgICAgICAgICBsZXQgc3RhdHVzUmVjOmFueSA9IHt9O1xuICAgICAgICAgICAgICAgIHN0YXR1c1JlYyA9IHRoaXMuY2hlY2tSdWxlcyhvYmplY3QsIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYsIGRhdGEsXCJQT1NUX1FVRVJZXCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwic3RhdHVzUmVjOnBvc3Q6UE9TVF9RVUVSWVwiLCBzdGF0dXNSZWMsIHN0YXR1c1JlY1snc3RhdHVzJ10pXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c1JlY1snc3RhdHVzJ10gID09IC0xKXtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05vdGlmaWNhdGlvbiAoXCJlcnJvclwiLFwiUnVsZTpcIiArIHN0YXR1c1JlY1snbXNnJ10gKTtcbiAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH0pXG5cblxuICAgICAgKTtcbiAgfVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBwdWJsaWMgcG9zdFVwbG9hZChQYWdlOiBzdHJpbmcsIEJvZHk6IGFueSk6IE9ic2VydmFibGU8R3JpZERhdGFSZXN1bHQ+IHtcbiAgICAvL2NvbnN0IHF1ZXJ5U3RyID0gYCR7dG9PRGF0YVN0cmluZyhzdGF0ZSl9JiRjb3VudD10cnVlYDtcbiAgICBjb25zdCBxdWVyeVN0ciA9IGBgO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICBsZXQgdGhlVVJMID0gUGFnZTtcbiAgICB0aGlzLmh0dHBPcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgJ2F1dGhvcml6YXRpb24nOiB0aGlzLlN0ckF1dGhcblxuICAgICAgfSlcbiAgICB9XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRoaXMuU3RyQXV0aDpcIiArIHRoaXMuU3RyQXV0aCk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8YW55PihgJHt0aGVVUkx9YCwgQm9keSwgdGhpcy5odHRwT3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICB9KSxcblxuICAgICAgICBtYXAoKHJlc3BvbnNlOmFueSkgPT4gKDxHcmlkRGF0YVJlc3VsdD57IGRhdGE6IHJlc3BvbnNlWydkYXRhJ10gfVxuICAgICAgICApKSxcblxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpXG4gICAgICApO1xuICB9XG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdXBsb2FkRmlsZShwYWdlOiBhbnksIGZpbGVzU2V0OiBTZXQ8RmlsZT4sIGlkOiBhbnkpOiBhbnkge1xuICAgIGZpbGVzU2V0LmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAvLyBjcmVhdGUgYSBuZXcgbXVsdGlwYXJ0LWZvcm0gZm9yIGV2ZXJ5IGZpbGVcbiAgICAgIGNvbnN0IGZvcm1kYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZm9ybWRhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG4gICAgICBmb3JtZGF0YS5hcHBlbmQoJ2lkJywgaWQpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ1cGxvYWRGaWxlIHBhZ2U6XCIgKyBwYWdlKVxuICAgICAgbGV0IGFwaVVSTCA9IHRoaXMuU0VSVkVSX1VSTCArICcvYXBpL2F0dCcgKyBwYWdlO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJhcGlVUkw6XCIgKyBhcGlVUkwpO1xuXG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhmb3JtZGF0YSk7XG4gICAgICBmb3JtZGF0YS5mb3JFYWNoKGVudHJpZXMgPT4gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZW50cmllcykpKTtcblxuICAgICAgdGhpcy5wb3N0VXBsb2FkKGFwaVVSTCwgZm9ybWRhdGEpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgfVxuXG4gIHVwbG9hZEZpbGVPbGQoZmlsZTogRmlsZSk6IGFueSB7XG4gICAgY29uc3QgZm9ybWRhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybWRhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlIHVwbG9hZGVkIGZpbGUgY29udGVudFxuICAgIGZvcm1kYXRhLmFwcGVuZCgnZG9jdW1lbnRWZXJzaW9uSWQnLCAnMTIzJyk7ICAgICAgIC8vSSBuZWVkIHRvIHBhc3Mgc29tZSBhZGRpdGlvbmFsIGluZm8gdG8gdGhlIHNlcnZlciBiZXNpZGVzIHRoZSBGaWxlIGRhdGFcbiAgICBsZXQgYXBpVVJMID0gdGhpcy5TRVJWRVJfVVJMICsgJy9hcGk/dXBsb2FkPXknO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYXBpVVJMOlwiICsgYXBpVVJMKTtcblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKGZvcm1kYXRhKTtcbiAgICBmb3JtZGF0YS5mb3JFYWNoKGVudHJpZXMgPT4gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZW50cmllcykpKTtcblxuXG4gICAgLy9jb25zdCBhcGlVUkwgPSB0aGlzLmFwaV9wYXRoICsgJ1VwbG9hZCc7ICAgICAvL2NhbGxpbmcgaHR0cDovL2xvY2FsaG9zdDo1MjMzMy9hcGkvVXBsb2FkQ29udHJvbGxlclxuXG4gICAgdGhpcy5wb3N0VXBsb2FkKGFwaVVSTCwgZm9ybWRhdGEpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gICAgfSk7XG4gICAgLypjb25zdCB1cGxvYWRSZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBhcGlVUkwsIGZvcm1kYXRhLCB7XG4gICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWVcbiAgICB9KTtcbiAgICB0aGlzLmh0dHBjbGllbnQucmVxdWVzdCh1cGxvYWRSZXEpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xuICAgICAgIH1cbiAgIH0pO1xuICAgKi9cblxuICB9XG5cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBwdWJsaWMgaGFzQ2hhbmdlcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmRlbGV0ZWRJdGVtcy5sZW5ndGggfHwgdGhpcy51cGRhdGVkSXRlbXMubGVuZ3RoIHx8IHRoaXMuY3JlYXRlZEl0ZW1zLmxlbmd0aCk7XG4gIH1cbiAgcHJpdmF0ZSBhZGRUb0JvZHkoTmV3VmFsOmFueSwgQm9keTphbnkpIHtcbiAgICBCb2R5LnB1c2goTmV3VmFsKTtcbiAgICAvLyBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygnTmV3VmFsIDogSEYgUGxlYXNlJyAgKyBKU09OLnN0cmluZ2lmeShOZXdWYWwpKTtcbiAgICByZXR1cm4gQm9keTtcbiAgfVxuXG5cblxuXG5cbiAgcHVibGljIHNob3dOb3RpZmljYXRpb24oc3R5bGVOb3RlOiBhbnksIG1zZzogYW55KTogdm9pZCB7XG5cbiAgICBsZXQgaGlkZUFmdGVyID0gdGhpcy5oaWRlQWZ0ZXI7XG5cbiAgICBpZiAoc3R5bGVOb3RlID09IFwiZXJyb3JcIilcbiAgICAgIGhpZGVBZnRlciA9IDUwMDA7XG4gICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLnNob3coe1xuICAgICAgY29udGVudDogbXNnLFxuICAgICAgY3NzQ2xhc3M6ICdidXR0b24tbm90aWZpY2F0aW9uJyxcbiAgICAgIGFuaW1hdGlvbjogeyB0eXBlOiAnZmFkZScsIGR1cmF0aW9uOiAyMDAgfSxcbiAgICAgIHBvc2l0aW9uOiB7IGhvcml6b250YWw6ICdjZW50ZXInLCB2ZXJ0aWNhbDogJ2JvdHRvbScgfSxcbiAgICAgIC8vICAgICAgICAgICAgc3RhY2tpbmc6IHsgc3RhY2tpbmc6ICdkb3duJyB9LFxuICAgICAgdHlwZTogeyBzdHlsZTogc3R5bGVOb3RlLCBpY29uOiB0cnVlIH0sXG4gICAgICAvL2Nsb3NhYmxlOiB0cnVlLFxuICAgICAgaGlkZUFmdGVyOiBoaWRlQWZ0ZXJcbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgZ29SZWNvcmRBY3QodGFyZ2V0OiBhbnksIG9iamVjdDogYW55KTogdm9pZCB7XG5cbiAgICBsZXQgcmVjO1xuXG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyh0YXJnZXQpO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuQ3VycmVudFJlYzpcIiArIG9iamVjdC5DdXJyZW50UmVjKTtcbiAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQpO1xuXG4gICAgaWYgKHRhcmdldCA9PSBcImZpcnN0XCIpIHtcbiAgICAgIG9iamVjdC5DdXJyZW50UmVjID0gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAodGFyZ2V0ID09IFwibGFzdFwiKSB7XG4gICAgICBvYmplY3QuQ3VycmVudFJlYyA9IG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWwgLSAxO1xuICAgIH1cbiAgICBlbHNlIGlmICh0YXJnZXQgPT0gXCJuZXh0XCIpIHtcbiAgICAgIGlmIChvYmplY3QuQ3VycmVudFJlYyA8IG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWwgLSAxKVxuICAgICAgICBvYmplY3QuQ3VycmVudFJlYyA9IG9iamVjdC5DdXJyZW50UmVjICsgMTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGFyZ2V0ID09IFwicHJldlwiKSB7XG4gICAgICBpZiAob2JqZWN0LkN1cnJlbnRSZWMgPiAwKVxuICAgICAgICBvYmplY3QuQ3VycmVudFJlYyA9IG9iamVjdC5DdXJyZW50UmVjIC0gMTtcbiAgICB9XG5cbiAgICByZWMgPSBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LmRhdGFbb2JqZWN0LkN1cnJlbnRSZWNdO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS0tLS1yZWM6XCIsIHJlYyk7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhvYmplY3QuZm9ybS52YWx1ZSk7XG4gICAgaWYgKHR5cGVvZiByZWMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9iamVjdC5mb3JtLnBhdGNoVmFsdWUocmVjKTtcbiAgICAgIG9iamVjdC5mb3JtLm1hcmtBc1ByaXN0aW5lKCk7XG4gICAgICBvYmplY3QuZm9ybS5tYXJrQXNVbnRvdWNoZWQoKTtcblxuICAgICAgLy9vYmplY3QuZm9ybS5yZXNldChyZWMsIHtlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlfSk7XG4gICAgICBpZiAob2JqZWN0LmRpc2FibGVFbWl0UmVhZENvbXBsZXRlZCAhPSB0cnVlKVxuICAgICAgICBvYmplY3QucmVhZENvbXBsZXRlZE91dHB1dC5lbWl0KG9iamVjdC5mb3JtLnZhbHVlKTtcbiAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJBVFQ6b2JqZWN0LmNhbGxCYWNrRnVuY3Rpb246XCIsIG9iamVjdC5jYWxsQmFja0Z1bmN0aW9uKVxuICAgICAgaWYgKHR5cGVvZiBvYmplY3QuY2FsbEJhY2tGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgb2JqZWN0LmNhbGxCYWNrRnVuY3Rpb24ocmVjKTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgb2JqZWN0LmNsZWFyQ29tcGxldGVkT3V0cHV0LmVtaXQoW10pO1xuXG4gIH1cbiAgcHVibGljIGdvUmVjb3JkKHRhcmdldDogYW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5mb3JtLmRpcnR5KTtcbiAgICAgIGlmIChvYmplY3QuZm9ybS5kaXJ0eSA9PSB0cnVlKSB7XG4gICAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgICBtc2c6IHRoaXMuc2F2ZUNoYW5nZXNNc2csXG4gICAgICAgICAgdGl0bGU6IHRoaXMucGxlYXNlQ29uZmlybU1zZyxcbiAgICAgICAgICBpbmZvOiB0YXJnZXQsXG4gICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgYWN0aW9uOiB0aGlzLlllc05vQWN0aW9ucyxcbiAgICAgICAgICBjYWxsYmFjazogdGhpcy5nb1JlY29yZEFjdFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuZ29SZWNvcmRBY3QodGFyZ2V0LCBvYmplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcHVibGljIHNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWM6YW55KSB7XG4gICAgbGV0IGRpYWxvZ1Jlc3VsdDtcbiAgICBjb25zdCBkaWFsb2c6IERpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nU2VydmljZS5vcGVuKHtcbiAgICAgIHRpdGxlOiBkaWFsb2dTdHJ1Yy50aXRsZSxcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ1N0cnVjLm1zZyxcbiAgICAgIGFjdGlvbnM6IGRpYWxvZ1N0cnVjLmFjdGlvbixcbiAgICAgIHdpZHRoOiA0NTAsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIG1pbldpZHRoOiAyNTBcbiAgICB9KTtcblxuICAgIGRpYWxvZy5yZXN1bHQuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBEaWFsb2dDbG9zZVJlc3VsdCkge1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygnY2xvc2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdhY3Rpb24nLCByZXN1bHQpO1xuICAgICAgfVxuICAgICAgZGlhbG9nUmVzdWx0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgIGlmIChkaWFsb2dSZXN1bHQucHJpbWFyeSA9PSB0cnVlKSB7XG4gICAgICAgIGlmIChkaWFsb2dTdHJ1Yy5oYXNPd25Qcm9wZXJ0eSgnY2FsbGJhY2snKSkge1xuICAgICAgICAgIGRpYWxvZ1N0cnVjLmNhbGxiYWNrKGRpYWxvZ1N0cnVjLmluZm8sIGRpYWxvZ1N0cnVjLm9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqIEZvcm0gZnVuY3Rpb25zICoqKioqKioqKioqKioqL1xuICBwdWJsaWMgZXhlY3V0ZVF1ZXJ5X2Zvcm0oZm9ybTogYW55LCBvYmplY3Q6YW55KSB7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJzdGFyLXNlcnZpY2VzIGV4ZWN1dGVRdWVyeV9mb3JtIG9iamVjdC5mb3JtOlwiKTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5pc1NlYXJjaDpcIiArIG9iamVjdC5pc1NlYXJjaClcbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5mb3JtLnZhbHVlKTtcbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpO1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0LmZvcm0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICgob2JqZWN0LmZvcm0uZGlydHkgPT0gdHJ1ZSkgJiYgKG9iamVjdC5pc1NlYXJjaCAhPSB0cnVlKSkge1xuICAgICAgICBsZXQgZGlhbG9nU3RydWMgPSB7XG4gICAgICAgICAgbXNnOiB0aGlzLnNhdmVDaGFuZ2VzTXNnLFxuICAgICAgICAgIHRpdGxlOiB0aGlzLnBsZWFzZUNvbmZpcm1Nc2csXG4gICAgICAgICAgaW5mbzogZm9ybSxcbiAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICBhY3Rpb246IHRoaXMuWWVzTm9BY3Rpb25zLFxuICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmV4ZWN1dGVRdWVyeUFjdF9mb3JtXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbihkaWFsb2dTdHJ1Yyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5leGVjdXRlUXVlcnlBY3RfZm9ybShmb3JtLCBvYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZXhlY3V0ZVF1ZXJ5QWN0X2Zvcm0oZm9ybSwgb2JqZWN0KTtcbiAgICB9XG4gIH1cbiAgLy8gcm91dGluZV9uYW1lIGZyb20gOiBodHRwczovL3d3dy50ZWxlcmlrLmNvbS9rZW5kby1hbmd1bGFyLXVpL2NvbXBvbmVudHMvZGF0ZWlucHV0cy9kYXRlcGlja2VyL2ludGVncmF0aW9uLXdpdGgtanNvbi9cblxuICBwdWJsaWMgcGFyc2VUb0RhdGUoanNvbjogYW55KSB7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJqc29uOmluOlwiLCBqc29uKVxuICAgIE9iamVjdC5rZXlzKGpzb24pLm1hcChrZXkgPT4ge1xuICAgICAgbGV0IFZhbDEgPSBqc29uW2tleV07XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImtleTpcIiwga2V5LCBWYWwxLCB0eXBlb2YgVmFsMSk7XG4gICAgICAvL2xldCBuID0ga2V5LnRvVXBwZXJDYXNlKCkuc2VhcmNoKFwiREFURVwiKTtcbiAgICAgIC8vaWYgKG4gIT0gLTEpe1xuICAgICAgaWYgKHR5cGVvZiBWYWwxICE9IFwibnVtYmVyXCIpIHsgICAvL2l0IGlzIG5vdCBhIG51bWJlciwgY2hlY2sgbW9yZVxuICAgICAgICBpZiAoKFZhbDEgIT0gbnVsbCkgJiYgKFZhbDEubGVuZ3RoID4gNykpIHtcbiAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoVmFsMSk7XG4gICAgICAgICAgbGV0IGNoZWNrWVlZWSA9IGlzTmFOKHBhcnNlSW50KFZhbDEuc3Vic3RyaW5nKDAsIDQpKSk7XG4gICAgICAgICAgbGV0IHRpbWVWYWwgPSBkYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRpbWVWYWw6XCIsIHRpbWVWYWwsIGlzTmFOKHRpbWVWYWwpKTtcbiAgICAgICAgICBpZiAoIWlzTmFOKHRpbWVWYWwpICYmICh0aW1lVmFsID4gMCkgJiYgIWNoZWNrWVlZWSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJpdCBpcyBhIGRhdGVcIik7XG4gICAgICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwia2V5OlwiK2tleSArIFwiOlwiICsgZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAganNvbltrZXldID0gZGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImpzb246b3V0OlwiLCBqc29uKVxuICAgIHJldHVybiBqc29uO1xuICB9XG4gIHB1YmxpYyBkYXRlWVlZWU1NREQob2JqZWN0OmFueSwganNvbjogYW55KSB7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJqc29uOlwiLCBqc29uKVxuICAgIE9iamVjdC5rZXlzKGpzb24pLm1hcChrZXkgPT4ge1xuICAgICAgbGV0IG4gPSBrZXkudG9VcHBlckNhc2UoKS5zZWFyY2goXCJfREFURVwiKTtcbiAgICAgIGlmIChuICE9IC0xKSB7XG4gICAgICAgIGxldCBkYXRlT3JnID0ganNvbltrZXldO1xuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKGpzb25ba2V5XSk7XG4gICAgICAgIC8vZGF0ZSA9IHRvTG9jYWxEYXRlKGRhdGUpO1xuICAgICAgICBsZXQgdGltZVZhbCA9IGRhdGUuZ2V0VGltZSgpO1xuICAgICAgICBpZiAoIWlzTmFOKHRpbWVWYWwpICYmICh0aW1lVmFsID4gMCkpIHtcbiAgICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwia2V5OlwiK2tleSArIFwiOlwiICsgZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgIC8vbGV0IGFycmF5ID0gZGF0ZU9yZy5zcGxpdChcIlRcIilcbiAgICAgICAgICBkYXRlT3JnID0gZm9ybWF0RGF0ZShkYXRlT3JnLCBvYmplY3QucGFyYW1Db25maWcuRGF0ZUZvcm1hdCwgb2JqZWN0LnBhcmFtQ29uZmlnLmRhdGVMb2NhbGUpXG4gICAgICAgICAganNvbltrZXldID0gZGF0ZU9yZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgcHVibGljIGV4ZWN1dGVRdWVyeUFjdF9mb3JtKGZvcm06IGFueSwgb2JqZWN0OmFueSkge1xuICAgIGlmICh0eXBlb2YgZm9ybSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgIFwiTmFtZVwiOiBcImNoaWxkUmVjb3Jkc1wiLFxuICAgICAgXCJWYWxcIjogMFxuICAgIH07XG4gICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgIGlmIChvYmplY3QuaXNDaGlsZCA9PSB0cnVlKSB7XG4gICAgICBpZiAob2JqZWN0LmlzU2VhcmNoICE9IHRydWUpIHtcbiAgICAgICAgLy9vYmplY3QuZm9ybS5yZXNldCgpO1xuICAgICAgICBvYmplY3QuZm9ybS5yZXNldChvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXMpO1xuXG4gICAgICAgIGlmICgodHlwZW9mIG9iamVjdC5tYXN0ZXJLZXlOYW1lQXJyICE9IFwidW5kZWZpbmVkXCIpICYmIChvYmplY3QubWFzdGVyS2V5TmFtZUFyci5sZW5ndGggIT0gMCkpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdC5tYXN0ZXJLZXlOYW1lQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXNbb2JqZWN0Lm1hc3RlcktleU5hbWVBcnJbaV1dID0gb2JqZWN0Lm1hc3RlcktleUFycltpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgb2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzW29iamVjdC5tYXN0ZXJLZXlOYW1lXSA9IG9iamVjdC5tYXN0ZXJLZXk7XG4gICAgICAgIH1cblxuICAgICAgICAvL29iamVjdC5mb3JtSW5pdGlhbFZhbHVlc1tvYmplY3QubWFzdGVyS2V5TmFtZV0gPSBvYmplY3QubWFzdGVyS2V5O1xuICAgICAgICBvYmplY3QuZm9ybS5yZXNldChvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXMsIHsgZW1pdEV2ZW50OiBvYmplY3QuZW1pdEV2ZW50ICE9IG51bGwgPyBvYmplY3QuZW1pdEV2ZW50IDogdHJ1ZSB9KTtcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5tYXN0ZXJLZXlOYW1lOlwiICsgb2JqZWN0Lm1hc3RlcktleU5hbWUpO1xuICAgICAgICBvYmplY3QuaXNTZWFyY2ggPSB0cnVlO1xuICAgICAgICBmb3JtID0gb2JqZWN0LmZvcm0udmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IFBhZ2UgPSBcIiZfcXVlcnk9XCIgKyBvYmplY3QuZ2V0Q01EO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuaXNTZWFyY2g6XCIgKyBvYmplY3QuaXNTZWFyY2gpXG4gICAgaWYgKG9iamVjdC5pc1NlYXJjaCA9PSB0cnVlKSB7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTtcbiAgICBsZXQgTmV3VmFsID0gZm9ybTtcbiAgICBvYmplY3QuaXNTZWFyY2ggPSBmYWxzZTtcbiAgICBpZiAoKHR5cGVvZiBvYmplY3QuZm9ybWF0dGVkV2hlcmUgPT09IFwidW5kZWZpbmVkXCIpIHx8IChvYmplY3QuZm9ybWF0dGVkV2hlcmUgPT0gbnVsbCkpIHtcbiAgICAgIFBhZ2UgPSBQYWdlICsgb2JqZWN0LnN0YXJTZXJ2aWNlcy5mb3JtYXRXaGVyZShOZXdWYWwpO1xuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgUGFnZSA9IFBhZ2UgKyBvYmplY3QuZm9ybWF0dGVkV2hlcmU7XG4gICAgICBvYmplY3QuZm9ybWF0dGVkV2hlcmUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoKHR5cGVvZiBvYmplY3QuT3JkZXJCeUNsYXVzZSAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKG9iamVjdC5PcmRlckJ5Q2xhdXNlICE9IFwiXCIpKVxuICAgICAgUGFnZSA9IFBhZ2UgKyBcIiZfT1JERVJCWT1cIiArIG9iamVjdC5PcmRlckJ5Q2xhdXNlO1xuICAgIH1cblxuICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgPSBbXTtcbiAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LnJlc3VsdCA9IDA7XG4gICAgb2JqZWN0LkN1cnJlbnRSZWMgPSAwO1xuXG4gICAgUGFnZSA9IGVuY29kZVVSSShQYWdlKTtcbiAgICBvYmplY3Quc3RhclNlcnZpY2VzLmZldGNoKG9iamVjdCwgUGFnZSkuc3Vic2NyaWJlKChyZXN1bHQ6YW55KSA9PiB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQuZGF0YVswXS5kYXRhLmxlbmd0aDsgaSsrKVxuICAgICAgICAgIHJlc3VsdC5kYXRhWzBdLmRhdGFbaV0gPSBvYmplY3Quc3RhclNlcnZpY2VzLnBhcnNlVG9EYXRlKHJlc3VsdC5kYXRhWzBdLmRhdGFbaV0pO1xuXG5cbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdC5kYXRhWzBdLmRhdGEsXG4gICAgICAgICAgdG90YWw6IHBhcnNlSW50KHJlc3VsdC5kYXRhWzBdLmRhdGEubGVuZ3RoLCAxMClcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqZWN0LmlzTWFzdGVyKVxuICAgICAgICAgIG9iamVjdC5zdGFyU2VydmljZXMuc2hvd05vdGlmaWNhdGlvbignc3VjY2VzcycsIFwiUmVjb3JkcyByZXRyaWV2ZWQgOiBcIiArIHJlc3VsdC50b3RhbCk7XG4gICAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdDpcIiwgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCk7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LmRhdGFbb2JqZWN0LkN1cnJlbnRSZWNdICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgb2JqZWN0LmZvcm0ucGF0Y2hWYWx1ZShyZXN1bHQuZGF0YVtvYmplY3QuQ3VycmVudFJlY10pO1xuICAgICAgICAgIG9iamVjdC5mb3JtLm1hcmtBc1ByaXN0aW5lKCk7XG4gICAgICAgICAgb2JqZWN0LmZvcm0ubWFya0FzVW50b3VjaGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvYmplY3QuZm9ybS5yZXNldChyZXN1bHQuZGF0YVtvYmplY3QuQ3VycmVudFJlY10sIHsgZW1pdEV2ZW50OiBvYmplY3QuZW1pdEV2ZW50ICE9IG51bGwgPyBvYmplY3QuZW1pdEV2ZW50IDogdHJ1ZSB9KTtcblxuICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiZm9ybSBzZXJ2aWNlcmVhZENvbXBsZXRlZE91dHB1dFwiKTtcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhvYmplY3QucmVhZENvbXBsZXRlZE91dHB1dCk7XG4gICAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgICBcIk5hbWVcIjogXCJjaGlsZFJlY29yZHNcIixcbiAgICAgICAgICBcIlZhbFwiOiByZXN1bHQudG90YWxcbiAgICAgICAgfTtcbiAgICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgICBpZiAocmVzdWx0LnRvdGFsICE9IDApXG4gICAgICAgICAgb2JqZWN0LmlzTmV3ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG9iamVjdC5kaXNhYmxlRW1pdFJlYWRDb21wbGV0ZWQgIT0gdHJ1ZSkge1xuICAgICAgICAgIGlmIChyZXN1bHQudG90YWwgIT0gMCkge1xuICAgICAgICAgICAgb2JqZWN0LnJlYWRDb21wbGV0ZWRPdXRwdXQuZW1pdChvYmplY3QuZm9ybS52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9iamVjdC5jbGVhckNvbXBsZXRlZE91dHB1dC5lbWl0KFtdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja0Z1bmN0aW9uICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgIG9iamVjdC5jYWxsQmFja0Z1bmN0aW9uKHJlc3VsdC5kYXRhWzBdKTtcblxuXG4gICAgICB9XG4gICAgICB0aGlzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCB0cnVlKTtcbiAgICB9LFxuICAgICAgKGVycjphbnkpID0+IHtcbiAgICAgICAgLy9hbGVydCgnZXJyb3I6JyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5zaG93RXJyb3JNc2cob2JqZWN0LCBlcnIpO1xuICAgICAgfSk7XG4gIH1cbiAgcHVibGljIGV4ZWNzdGFyU2VydmljZXNfZm9ybV9pblRyYW5zKE5ld1ZhbDphbnksIG9iamVjdDphbnkpIHtcbiAgICB0aGlzLmNvbW1pdEJvZHkucHVzaChOZXdWYWwpO1xuICAgIGlmIChvYmplY3QuYWN0aW9uICE9IFwiUkVNT1ZFXCIpIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAob2JqZWN0LmlzTmV3ID09IHRydWUpIHtcbiAgICAgICAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LmRhdGEucHVzaChOZXdWYWwpO1xuICAgICAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWwgPSBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LnRvdGFsICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LmRhdGFbb2JqZWN0LkN1cnJlbnRSZWNdID0gTmV3VmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbGV0IE5ld1ZhbEFycjphbnkgPSBbXTtcbiAgICAgICAgTmV3VmFsQXJyLnB1c2goTmV3VmFsKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICBkYXRhOiBOZXdWYWxBcnIsXG4gICAgICAgICAgdG90YWw6IDFcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICBvYmplY3QuQ3VycmVudFJlYyA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhOmFueSA9IFtdO1xuICAgICAgZGF0YS5wdXNoKE5ld1ZhbClcbiAgICAgIGlmIChvYmplY3QuaXNOZXcgPT0gdHJ1ZSkge1xuICAgICAgICBvYmplY3QuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QuY2FsbEJhY2tQb3N0X0luc2VydCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIG9iamVjdC5jYWxsQmFja1Bvc3RfSW5zZXJ0LmFwcGx5KG9iamVjdCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja1Bvc3RfdXBkYXRlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgb2JqZWN0LmNhbGxCYWNrUG9zdF91cGRhdGUuYXBwbHkob2JqZWN0LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy9SRU1PVkVcbiAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQuZGF0YS5zcGxpY2Uob2JqZWN0LkN1cnJlbnRSZWMsIDEpO1xuICAgICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC50b3RhbC0tO1xuICAgICAgaWYgKG9iamVjdC5DdXJyZW50UmVjID4gMCkge1xuICAgICAgICBvYmplY3QuQ3VycmVudFJlYy0tO1xuICAgICAgICBvYmplY3QuZm9ybS5yZXNldChvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LmRhdGFbb2JqZWN0LkN1cnJlbnRSZWNdLCB7IGVtaXRFdmVudDogb2JqZWN0LmVtaXRFdmVudCAhPSBudWxsID8gb2JqZWN0LmVtaXRFdmVudCA6IHRydWUgfSk7XG4gICAgICAgIGlmIChvYmplY3QuaXNOZXcgPT0gdHJ1ZSlcbiAgICAgICAgICBvYmplY3QuaXNOZXcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBvYmplY3QuZm9ybS5yZXNldChvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXMsIHsgZW1pdEV2ZW50OiBvYmplY3QuZW1pdEV2ZW50ICE9IG51bGwgPyBvYmplY3QuZW1pdEV2ZW50IDogdHJ1ZSB9KTtcbiAgICAgICAgb2JqZWN0LmlzTmV3ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGxldCBOZXdWYWwxOmFueSA9IFtdO1xuICAgICAgICBOZXdWYWwxLnB1c2goTmV3VmFsKTtcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0LmNhbGxCYWNrUmVtb3ZlQXR0ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICBvYmplY3QuY2FsbEJhY2tSZW1vdmVBdHQob2JqZWN0LCBOZXdWYWwpO1xuICAgICAgaWYgKHR5cGVvZiBvYmplY3QuY2FsbEJhY2tQb3N0X1JlbW92ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBsZXQgTmV3VmFsMSA9IFtdO1xuICAgICAgICAvLyBOZXdWYWwxLnB1c2goTmV3VmFsKTtcbiAgICAgICAgb2JqZWN0LmNhbGxCYWNrUG9zdF9SZW1vdmUuYXBwbHkob2JqZWN0LCBOZXdWYWwxKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmIChvYmplY3QuYWN0aW9uICE9IFwiUkVNT1ZFXCIpIHtcbiAgICAgIG9iamVjdC5mb3JtLnJlc2V0KE5ld1ZhbCwgeyBlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmRpYWJsZUVtaXRTYXZlID09IHRydWUpIHsgfVxuICAgIGVsc2VcbiAgICAgIG9iamVjdC5zYXZlQ29tcGxldGVkT3V0cHV0LmVtaXQoTmV3VmFsKTtcbiAgICBpZiAob2JqZWN0LmlzQ2hpbGQgPT0gdHJ1ZSkge1xuICAgICAgbGV0IHBhcmFtQ29uZmlnID0ge1xuICAgICAgICBcIk5hbWVcIjogXCJjaGlsZFJlY29yZHNcIixcbiAgICAgICAgXCJWYWxcIjogb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC50b3RhbFxuICAgICAgfTtcbiAgICAgIHNldFBhcmFtQ29uZmlnKHBhcmFtQ29uZmlnKTtcbiAgICB9XG4gICAgb2JqZWN0LmFjdGlvbiA9IFwiXCI7XG4gICAgdGhpcy5zZXRQcmltYXJLZXlOYW1lQXJyKG9iamVjdCwgdHJ1ZSk7XG5cbiAgfVxuICBwdWJsaWMgZXhlY3N0YXJTZXJ2aWNlc19mb3JtKE5ld1ZhbDphbnksIG9iamVjdDphbnkpIHtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIk5ld1ZhbDpcIiwgTmV3VmFsKTtcbiAgICBvYmplY3QuYWRkVG9Cb2R5KE5ld1ZhbCk7XG4gICAgbGV0IFBhZ2UgPSBcIiZfdHJhbnM9WVwiO1xuICAgIGlmICh0aGlzLmluVHJhbnMpIHtcbiAgICAgIHRoaXMuZXhlY3N0YXJTZXJ2aWNlc19mb3JtX2luVHJhbnMoTmV3VmFsLCBvYmplY3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucG9zdChvYmplY3QsIFBhZ2UsIG9iamVjdC5Cb2R5KS5zdWJzY3JpYmUoUGFnZSA9PiB7XG4gICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LmRhdGE6b2JqZWN0LkN1cnJlbnRSZWM6XCIgKyBvYmplY3QuQ3VycmVudFJlYyArIFwiIG9iamVjdC5hY3Rpb246XCIgKyBvYmplY3QuYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQpO1xuICAgICAgLy9pZiAodHlwZW9mIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaGVyZTFcIik7XG4gICAgICAgIGlmIChvYmplY3QuYWN0aW9uICE9IFwiUkVNT1ZFXCIpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0KTtcbiAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmlzTmV3OlwiICsgb2JqZWN0LmlzTmV3KVxuICAgICAgICAgICAgaWYgKG9iamVjdC5pc05ldyA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQuZGF0YS5wdXNoKE5ld1ZhbCk7XG4gICAgICAgICAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWwgPSBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LnRvdGFsICsgMTtcbiAgICAgICAgICAgICAgLy9vYmplY3QuQ3VycmVudFJlYysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQuZGF0YVtvYmplY3QuQ3VycmVudFJlY10gPSBOZXdWYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgcG9zdFwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBOZXdWYWxBcnI6YW55ID0gW107XG4gICAgICAgICAgICBOZXdWYWxBcnIucHVzaChOZXdWYWwpO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgZGF0YTogTmV3VmFsQXJyLFxuICAgICAgICAgICAgICB0b3RhbDogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIG9iamVjdC5DdXJyZW50UmVjID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oJ3N1Y2Nlc3MnLCBcIkRhdGEgc2F2ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuICAgICAgICAgIHZhciBkYXRhOmFueSA9IFtdO1xuICAgICAgICAgIGRhdGEucHVzaChOZXdWYWwpXG4gICAgICAgICAgaWYgKG9iamVjdC5pc05ldyA9PSB0cnVlKSB7XG4gICAgICAgICAgICBvYmplY3QuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0LmNhbGxCYWNrUG9zdF9JbnNlcnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgLy9vYmplY3QuY2FsbEJhY2tQb3N0X0luc2VydChvYmplY3QsIE5ld1ZhbCk7XG4gICAgICAgICAgICAgIG9iamVjdC5jYWxsQmFja1Bvc3RfSW5zZXJ0LmFwcGx5KG9iamVjdCwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QuY2FsbEJhY2tQb3N0X1VwZGF0ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBvYmplY3QuY2FsbEJhY2tQb3N0X1VwZGF0ZS5hcHBseShvYmplY3QsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vUkVNT1ZFXG4gICAgICAgICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC5kYXRhLnNwbGljZShvYmplY3QuQ3VycmVudFJlYywgMSk7XG4gICAgICAgICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC50b3RhbC0tO1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LkN1cnJlbnRSZWM6XCIgKyBvYmplY3QuQ3VycmVudFJlYylcbiAgICAgICAgICBpZiAob2JqZWN0LkN1cnJlbnRSZWMgPiAwKSB7XG4gICAgICAgICAgICBvYmplY3QuQ3VycmVudFJlYy0tO1xuICAgICAgICAgICAgb2JqZWN0LmZvcm0ucmVzZXQob2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC5kYXRhW29iamVjdC5DdXJyZW50UmVjXSwgeyBlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlIH0pO1xuICAgICAgICAgICAgaWYgKG9iamVjdC5pc05ldyA9PSB0cnVlKVxuICAgICAgICAgICAgICBvYmplY3QuaXNOZXcgPSBmYWxzZTtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9iamVjdC5mb3JtLnJlc2V0KG9iamVjdC5mb3JtSW5pdGlhbFZhbHVlcywgeyBlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlIH0pO1xuICAgICAgICAgICAgb2JqZWN0LmlzTmV3ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmlzTmV3OlwiICsgb2JqZWN0LmlzTmV3KVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgTmV3VmFsMTphbnkgPSBbXTtcbiAgICAgICAgICBOZXdWYWwxLnB1c2goTmV3VmFsKTtcbiAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja1JlbW92ZUF0dCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIG9iamVjdC5jYWxsQmFja1JlbW92ZUF0dChvYmplY3QsIE5ld1ZhbDEpO1xuICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0LmNhbGxCYWNrUG9zdF9SZW1vdmUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIG9iamVjdC5jYWxsQmFja1Bvc3RfUmVtb3ZlLmFwcGx5KG9iamVjdCwgTmV3VmFsMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaGVyZTJcIik7XG4gICAgICBpZiAob2JqZWN0LmFjdGlvbiAhPSBcIlJFTU9WRVwiKSB7XG4gICAgICAgIG9iamVjdC5mb3JtLnJlc2V0KE5ld1ZhbCwgeyBlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgaWYgKG9iamVjdC5kaWFibGVFbWl0U2F2ZSA9PSB0cnVlKSB7IH1cbiAgICAgIGVsc2VcbiAgICAgICAgb2JqZWN0LnNhdmVDb21wbGV0ZWRPdXRwdXQuZW1pdChOZXdWYWwpO1xuICAgICAgaWYgKG9iamVjdC5pc0NoaWxkID09IHRydWUpIHtcbiAgICAgICAgbGV0IHBhcmFtQ29uZmlnID0ge1xuICAgICAgICAgIFwiTmFtZVwiOiBcImNoaWxkUmVjb3Jkc1wiLFxuICAgICAgICAgIFwiVmFsXCI6IG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWxcbiAgICAgICAgfTtcbiAgICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgfVxuICAgICAgb2JqZWN0LmFjdGlvbiA9IFwiXCI7XG4gICAgICB0aGlzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCB0cnVlKTtcbiAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgLy9hbGVydCAoJ2Vycm9yOicgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yTXNnKG9iamVjdCwgZXJyKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNhdmVDaGFuZ2VzX2Zvcm0oZm9ybTogYW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coJ3NhdmVDaGFuZ2VzX2Zvcm0gOiBvYmplY3QuaXNOZXcgOicgKyBvYmplY3QuaXNOZXcpO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5jb21wb25lbnRDb25maWcucm91dGluZUF1dGgpO1xuICAgIGlmIChvYmplY3QuY29tcG9uZW50Q29uZmlnLnJvdXRpbmVBdXRoICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYXV0aExldmVsOlwiICsgb2JqZWN0LmNvbXBvbmVudENvbmZpZy5yb3V0aW5lQXV0aC5hdXRoTGV2ZWwpO1xuICAgICAgaWYgKG9iamVjdC5jb21wb25lbnRDb25maWcucm91dGluZUF1dGguYXV0aExldmVsICE9IDIpIHtcbiAgICAgICAgbGV0IGRpYWxvZ1N0cnVjID0ge1xuICAgICAgICAgIG1zZzogdGhpcy5yZWFkT25seU1zZyxcbiAgICAgICAgICB0aXRsZTogXCJXYXJuaW5nXCIsXG4gICAgICAgICAgaW5mbzogbnVsbCxcbiAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICBhY3Rpb246IHRoaXMuT2tBY3Rpb25zLFxuICAgICAgICAgIGNhbGxiYWNrOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbihkaWFsb2dTdHJ1Yyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGlmICgoIW9iamVjdC5mb3JtLmRpcnR5KSAmJiBvYmplY3QuaXNDaGlsZClcbiAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0LmZvcm0uaW52YWxpZCkge1xuICAgICAgb2JqZWN0LnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5mb3JtOlwiLG9iamVjdC5mb3JtKTtcbiAgICAgIHRoaXMuc2hvd09rTXNnKG9iamVjdCwgdGhpcy5maWVsZHNSZXF1aXJlZE1zZywgXCJFcnJvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IE5ld1ZhbDphbnk9e307XG4gICAgLy9vYmplY3QuQm9keSA9IFtdOyAgIC8vIG9ubHkgb25lIHRyYW5zYWN0aW9uIGFsbG93ZWQgaW4gIGZvcm0uIE1vdmVkIHRvIGZvcm1cbiAgICAvL05ld1ZhbCA9ICBmb3JtLnZhbHVlO1xuICAgIE5ld1ZhbCA9IE9iamVjdC5hc3NpZ24oe30sIGZvcm0udmFsdWUsIHt9KVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0gTmV3VmFsOlwiKVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKE5ld1ZhbCk7XG5cbiAgICBpZiAob2JqZWN0LmlzTmV3ID09IHRydWUpXG4gICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBvYmplY3QuaW5zZXJ0Q01EO1xuICAgIGVsc2VcbiAgICAgIE5ld1ZhbFtcIl9RVUVSWVwiXSA9IG9iamVjdC51cGRhdGVDTUQ7XG4gICAgLy9vYmplY3QuaXNOZXcgPSBmYWxzZTtcbiAgICB0aGlzLmV4ZWNzdGFyU2VydmljZXNfZm9ybShOZXdWYWwsIG9iamVjdCk7XG4gIH1cbiAgcHVibGljIGVudGVyUXVlcnlBY3RfZm9ybShmb3JtOiBhbnksIG9iamVjdDphbnkpOiB2b2lkIHtcbiAgICBvYmplY3QuQ3VycmVudFJlYyA9IDA7XG4gICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCA9IFtdO1xuICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQucmVzdWx0ID0gMDtcblxuICAgIG9iamVjdC5pc1NlYXJjaCA9IHRydWU7XG4gICAgb2JqZWN0LmlzTmV3ID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygnZW50ZXJRdWVyeSA6IG9iamVjdC5pc1NlYXJjaDonICsgb2JqZWN0LmlzU2VhcmNoKTtcbiAgICBvYmplY3QuY2xlYXJDb21wbGV0ZWRPdXRwdXQuZW1pdChvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXMpO1xuICAgIG9iamVjdC5mb3JtLnJlc2V0KG9iamVjdC5mb3JtSW5pdGlhbFZhbHVlcywgeyBlbWl0RXZlbnQ6IG9iamVjdC5lbWl0RXZlbnQgIT0gbnVsbCA/IG9iamVjdC5lbWl0RXZlbnQgOiB0cnVlIH0pO1xuICAgIG9iamVjdC5zdGFyU2VydmljZXMuc2V0UHJpbWFyS2V5TmFtZUFycihvYmplY3QsIGZhbHNlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRQcmltYXJLZXlOYW1lQXJyKG9iamVjdDphbnksIHZhbHVlOmFueSkge1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0LnByaW1hcktleVJlYWRPbmx5QXJyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdC5wcmltYXJLZXlSZWFkT25seUFycik7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIltrZXlzW2tdOlwiLCBrZXlzW2tdLCBcIiB2YWx1ZTpcIiwgdmFsdWUpO1xuICAgICAgICBvYmplY3QucHJpbWFyS2V5UmVhZE9ubHlBcnJba2V5c1trXV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHB1YmxpYyBlbnRlclF1ZXJ5X2Zvcm0oZm9ybTogYW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0OmRpcnR5OlwiLCBvYmplY3QuZm9ybS5kaXJ0eSk7XG4gICAgaWYgKG9iamVjdC5mb3JtLmRpcnR5ID09IHRydWUpIHtcbiAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgbXNnOiB0aGlzLnNhdmVDaGFuZ2VzTXNnLFxuICAgICAgICB0aXRsZTogdGhpcy5wbGVhc2VDb25maXJtTXNnLFxuICAgICAgICBpbmZvOiBmb3JtLFxuICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgYWN0aW9uOiB0aGlzLlllc05vQWN0aW9ucyxcbiAgICAgICAgY2FsbGJhY2s6IHRoaXMuZW50ZXJRdWVyeUFjdF9mb3JtXG4gICAgICB9O1xuICAgICAgdGhpcy5zaG93Q29uZmlybWF0aW9uKGRpYWxvZ1N0cnVjKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVudGVyUXVlcnlBY3RfZm9ybShmb3JtLCBvYmplY3QpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNhbmNlbF9mb3JtKGU6YW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgb2JqZWN0LmZvcm0ucmVzZXQob2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzLCB7IGVtaXRFdmVudDogb2JqZWN0LmVtaXRFdmVudCAhPSBudWxsID8gb2JqZWN0LmVtaXRFdmVudCA6IHRydWUgfSk7XG4gICAgb2JqZWN0LmlzU2VhcmNoID0gZmFsc2U7XG4gICAgb2JqZWN0LmlzTmV3ID0gdHJ1ZTtcbiAgICBvYmplY3QuY2xlYXJDb21wbGV0ZWRPdXRwdXQuZW1pdChvYmplY3QuZm9ybUluaXRpYWxWYWx1ZXMpO1xuICAgIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQgPSBbXTtcbiAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0LnJlc3VsdCA9IDA7XG4gICAgb2JqZWN0LkN1cnJlbnRSZWMgPSAwO1xuXG4gIH1cbiAgcHVibGljIHNob3dPa01zZyhvYmplY3Q6YW55LCBtc2c6YW55LCBzZXZlcml0eTphbnkpIHtcbiAgICBsZXQgZGlhbG9nU3RydWMgPSB7XG4gICAgICBtc2c6IG1zZyxcbiAgICAgIHRpdGxlOiBzZXZlcml0eSxcbiAgICAgIGluZm86IG51bGwsXG4gICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgIGFjdGlvbjogdGhpcy5Pa0FjdGlvbnMsXG4gICAgICBjYWxsYmFjazogbnVsbFxuICAgIH07XG4gICAgdGhpcy5zaG93Q29uZmlybWF0aW9uKGRpYWxvZ1N0cnVjKTtcbiAgfVxuICBwdWJsaWMgb25SZW1vdmVfZm9ybShmb3JtOmFueSwgb2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmlzTmV3OlwiLCBvYmplY3QuaXNOZXcpXG4gICAgaWYgKG9iamVjdC5pc05ldyA9PSB0cnVlKSB7XG4gICAgICB0aGlzLm9uQ2FuY2VsX2Zvcm0obnVsbCwgb2JqZWN0KVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdDpcIik7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cob2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCk7XG4gICAgaWYgKCh0eXBlb2Ygb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQudG90YWwgPT0gMCkpIHtcbiAgICAgIHRoaXMuc2hvd09rTXNnKG9iamVjdCwgdGhpcy5ub3RoaW5nVG9EZWxldGVsTXNnLCBcIldhcm5pbmdcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdvblJlbW92ZSA6IGlzQ2hpbGQgJyArIG9iamVjdC5pc0NoaWxkICsgXCIgb2JqZWN0LmlzTWFzdGVyOlwiICsgb2JqZWN0LmlzTWFzdGVyKTtcbiAgICBsZXQgTmV3VmFsID0gZm9ybS52YWx1ZTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhOZXdWYWwpO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdDpcIiArIG9iamVjdC5leGVjdXRlUXVlcnlyZXN1bHQpXG4gICAgaWYgKG9iamVjdC5pc0NoaWxkID09IGZhbHNlKSB7XG4gICAgICB2YXIgcGFyYW1Db25maWcgPSBnZXRQYXJhbUNvbmZpZygpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cocGFyYW1Db25maWcpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwYXJhbUNvbmZpZy5jaGlsZFJlY29yZHM6XCIgKyBwYXJhbUNvbmZpZy5jaGlsZFJlY29yZHMpXG4gICAgICBpZiAodHlwZW9mIHBhcmFtQ29uZmlnLmNoaWxkUmVjb3JkcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBwYXJhbUNvbmZpZy5jaGlsZFJlY29yZHMgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHBhcmFtQ29uZmlnLmNoaWxkUmVjb3JkcyAhPSAwKSAmJiAob2JqZWN0LmlzTWFzdGVyID09IHRydWUpKSB7XG4gICAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgICBtc2c6IHRoaXMuZGVsZXRlRGV0YWlsTXNnLFxuICAgICAgICAgIHRpdGxlOiBcIldhcm5pbmdcIixcbiAgICAgICAgICBpbmZvOiBudWxsLFxuICAgICAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAgIGFjdGlvbjogdGhpcy5Pa0FjdGlvbnMsXG4gICAgICAgICAgY2FsbGJhY2s6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zaG93Q29uZmlybWF0aW9uKGRpYWxvZ1N0cnVjKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG5cbiAgICB9XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cocGFyYW1Db25maWcpO1xuXG4gICAgbGV0IGRpYWxvZ1N0cnVjID0ge1xuICAgICAgbXNnOiB0aGlzLmRlbGV0ZUNvbmZpcm1Nc2csXG4gICAgICB0aXRsZTogdGhpcy5wbGVhc2VDb25maXJtTXNnLFxuICAgICAgaW5mbzogZm9ybSxcbiAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgYWN0aW9uOiB0aGlzLlllc05vQWN0aW9ucyxcbiAgICAgIGNhbGxiYWNrOiB0aGlzLlJlbW92ZV9mb3JtQWN0XG4gICAgfTtcbiAgICB0aGlzLnNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWMpO1xuXG5cbiAgfVxuICBwdWJsaWMgUmVtb3ZlX2Zvcm1BY3QoZm9ybTphbnksIG9iamVjdDphbnkpIHtcbiAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaW4gUmVtb3ZlX2Zvcm1BY3RcIik7XG4gICAgbGV0IE5ld1ZhbDphbnkgPXt9O1xuICAgIE5ld1ZhbCA9IGZvcm0udmFsdWU7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhOZXdWYWwpO1xuICAgIC8vb2JqZWN0LmZvcm0ucmVzZXQob2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzKTtcbiAgICBvYmplY3QuYWN0aW9uID0gXCJSRU1PVkVcIjtcblxuICAgIE5ld1ZhbFtcIl9RVUVSWVwiXSA9IG9iamVjdC5kZWxldGVDTUQ7XG4gICAgb2JqZWN0LnN0YXJTZXJ2aWNlcy5leGVjc3RhclNlcnZpY2VzX2Zvcm0oTmV3VmFsLCBvYmplY3QpO1xuICB9XG5cblxuICBwdWJsaWMgb25OZXdfZm9ybShlOmFueSwgb2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvbk5ldzogb2JqZWN0Lm1hc3RlcktleTpcIiArIG9iamVjdC5tYXN0ZXJLZXkpO1xuXG4gICAgb2JqZWN0LmZvcm0ucmVzZXQob2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzLCB7IGVtaXRFdmVudDogb2JqZWN0LmVtaXRFdmVudCAhPSBudWxsID8gb2JqZWN0LmVtaXRFdmVudCA6IHRydWUgfSk7XG4gICAgb2JqZWN0LmNsZWFyQ29tcGxldGVkT3V0cHV0LmVtaXQob2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzKTtcbiAgICBvYmplY3QuaXNTZWFyY2ggPSBmYWxzZTtcbiAgICBvYmplY3QuaXNOZXcgPSB0cnVlO1xuICAgIHRoaXMuc2V0UHJpbWFyS2V5TmFtZUFycihvYmplY3QsIGZhbHNlKTtcbiAgfVxuICAvKioqKioqKioqKioqKioqKioqKiBHcmlkIGZ1bmN0aW9ucyAgKioqKioqKiovXG4gIHB1YmxpYyBhZGRIYW5kbGVyX2dyaWQob2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm1hc3RlcktleU5hbWVBcnIgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKG9iamVjdC5pc0NoaWxkID09IHRydWUpIHtcbiAgICAgICAgaWYgKG9iamVjdC5tYXN0ZXJLZXlBcnJbMF0gPT0gXCJcIikge1xuICAgICAgICAgIHRoaXMuc2hvd09rTXNnKHRoaXMsIHRoaXMuc2F2ZU1hc3Rlck1zZywgXCJFcnJvclwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqZWN0LmlzQ2hpbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgIGlmIChvYmplY3QubWFzdGVyS2V5ID09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd09rTXNnKHRoaXMsIHRoaXMuc2F2ZU1hc3Rlck1zZywgXCJFcnJvclwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDQxOm9iamVjdC5ncmlkSW5pdGlhbFZhbHVlczpcIiwgb2JqZWN0LmdyaWRJbml0aWFsVmFsdWVzKTtcbiAgICBvYmplY3Quc2F2ZUN1cnJlbnQoKTtcbiAgICB0aGlzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCBmYWxzZSk7XG4gICAgLyogb2JqZWN0LmdyaWRJbml0aWFsVmFsdWVzLk1PRFVMRSA9IG9iamVjdC5tYXN0ZXJLZXk7Ki9cbiAgICBpZiAoICh0eXBlb2Ygb2JqZWN0Lm1hc3RlcktleU5hbWVBcnIgIT0gXCJ1bmRlZmluZWRcIikgJiYgKG9iamVjdC5tYXN0ZXJLZXlOYW1lQXJyLmxlbmd0aCAhPSAwKSApXG4gICAge1xuICAgICAgdGhpcy5zZXRQcmltYXJLZXlOYW1lQXJyKG9iamVjdCwgZmFsc2UpO1xuICAgICAgaWYob2JqZWN0LmlzQ2hpbGQgPT0gdHJ1ZSl7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPCBvYmplY3QubWFzdGVyS2V5TmFtZUFyci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgbGV0IHJlYWRPbmx5ID0gXCJpc1wiK29iamVjdC5tYXN0ZXJLZXlOYW1lQXJyW2ldICsgXCJyZWFkT25seVwiO1xuICAgICAgICAgIGlmIChvYmplY3QucHJpbWFyS2V5UmVhZE9ubHlBcnIpe1xuICAgICAgICAgICAgb2JqZWN0LnByaW1hcktleVJlYWRPbmx5QXJyW3JlYWRPbmx5XSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9iamVjdC5ncmlkSW5pdGlhbFZhbHVlc1tvYmplY3QubWFzdGVyS2V5TmFtZUFycltpXV0gPSBvYmplY3QubWFzdGVyS2V5QXJyW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDQ6b2JqZWN0Lm1hc3RlcktleU5hbWU6XCIsIG9iamVjdC5tYXN0ZXJLZXlOYW1lKTtcbiAgICAgIGlmIChvYmplY3QubWFzdGVyS2V5TmFtZSAhPSBcIlwiKXtcbiAgICAgICAgb2JqZWN0LmdyaWRJbml0aWFsVmFsdWVzW29iamVjdC5tYXN0ZXJLZXlOYW1lXSA9IG9iamVjdC5tYXN0ZXJLZXk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0NDI6b2JqZWN0LmdyaWRJbml0aWFsVmFsdWVzOlwiLCBvYmplY3QuZ3JpZEluaXRpYWxWYWx1ZXMpO1xuICAgIG9iamVjdC5jbG9zZUVkaXRvcigpO1xuICAgIG9iamVjdC5mb3JtR3JvdXAgPSBvYmplY3QuY3JlYXRlRm9ybUdyb3VwR3JpZChcbiAgICAgIG9iamVjdC5ncmlkSW5pdGlhbFZhbHVlc1xuICAgICk7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5mb3JtR3JvdXA6XCIsIG9iamVjdC5mb3JtR3JvdXApXG4gICAgb2JqZWN0LmlzTmV3ID0gdHJ1ZTtcbiAgICBvYmplY3QuZ3JpZC5hZGRSb3cob2JqZWN0LmZvcm1Hcm91cCk7XG4gICAgLy90aGlzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZUhhbmRsZXJfZ3JpZChzZW5kZXI6YW55LCBvYmplY3Q6YW55KSB7XG4gICAgLy9zZW5kZXIuY2FuY2VsQ2VsbCgpO1xuICAgIGxldCBwYXJhbUNvbmZpZyA9IGdldFBhcmFtQ29uZmlnKCk7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJlbW92ZUhhbmRsZXJfZ3JpZCBwYXJhbUNvbmZpZzpvYmplY3QuaXNNYXN0ZXIgXCIgKyBvYmplY3QuaXNNYXN0ZXIpO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cocGFyYW1Db25maWcpO1xuICAgIGlmICgocGFyYW1Db25maWcuY2hpbGRSZWNvcmRzICE9IDApICYmIChvYmplY3QuaXNNYXN0ZXIgPT0gdHJ1ZSkpIHtcbiAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgbXNnOiB0aGlzLmRlbGV0ZURldGFpbE1zZyxcbiAgICAgICAgdGl0bGU6IFwiV2FybmluZ1wiLFxuICAgICAgICBpbmZvOiBudWxsLFxuICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgYWN0aW9uOiB0aGlzLk9rQWN0aW9ucyxcbiAgICAgICAgY2FsbGJhY2s6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLnNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmVkaXRlZFJvd0luZGV4IDpcIiwgb2JqZWN0LmVkaXRlZFJvd0luZGV4KVxuICAgIGlmICh0eXBlb2Ygb2JqZWN0LmVkaXRlZFJvd0luZGV4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBsZXQgTmV3VmFsOmFueSA9IHt9O1xuICAgICAgbGV0IGdyaWRfZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0LmdyaWQuZGF0YSkpO1xuXG4gICAgICBOZXdWYWwgPSBncmlkX2RhdGEuZGF0YVtvYmplY3QuZWRpdGVkUm93SW5kZXhdO1xuICAgICAgbGV0IGN1ckNNRCA9IE5ld1ZhbFtcIl9RVUVSWVwiXTtcbiAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVjazpOZXdWYWw6X1FVRVJZXCIsIE5ld1ZhbFtcIl9RVUVSWVwiXSlcbiAgICAgIGxldCByZXN1bHQxID0gb2JqZWN0LnN0YXJTZXJ2aWNlcy5yZW1vdmVSZWMob2JqZWN0LmdyaWQuZGF0YSwgb2JqZWN0LmVkaXRlZFJvd0luZGV4KTtcbiAgICAgIG9iamVjdC5ncmlkLmRhdGEgPSByZXN1bHQxO1xuICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImNoZWNrOk5ld1ZhbDpcIiwgTmV3VmFsKVxuXG4gICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBvYmplY3QuZGVsZXRlQ01EO1xuICAgICAgaWYgKGN1ckNNRCAhPSBvYmplY3QuaW5zZXJ0Q01EKSB7XG4gICAgICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcbiAgICAgICAgICBvYmplY3QucmVtb3ZlZFJlYy5wdXNoKE5ld1ZhbCk7XG4gICAgICB9XG5cbiAgICB9XG4gICAgZWxzZVxuICAgICAgb2JqZWN0LmNhbmNlbEhhbmRsZXIoKTtcblxuXG4gIH1cbiAgcHVibGljIHNhdmVDdXJyZW50X2dyaWQob2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwic2F2ZUN1cnJlbnRfZ3JpZDpvYmplY3QuZm9ybUdyb3VwOlwiLCBvYmplY3QuZm9ybUdyb3VwKTtcblxuXG4gICAgaWYgKG9iamVjdC5mb3JtR3JvdXApIHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwic2F2ZUN1cnJlbnRfZ3JpZDpvYmplY3QuZm9ybUdyb3VwOlwiLCBvYmplY3QuZm9ybUdyb3VwKTtcbiAgICAgIGxldCBOZXdWYWw6YW55ID0ge307XG4gICAgICBOZXdWYWwgPSBPYmplY3QuYXNzaWduKHt9LCBvYmplY3QuZm9ybUdyb3VwLnZhbHVlKTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdjaGVjazpkaXJ0eSA6Jywgb2JqZWN0LmZvcm1Hcm91cC5kaXJ0eSwgXCIgaXNOZXc6XCIsIG9iamVjdC5pc05ldywgXCIgTmV3VmFsOiBcIiwgTmV3VmFsKTtcbiAgICAgIGlmIChvYmplY3QuZm9ybUdyb3VwLmRpcnR5ID09PSB0cnVlKSB7XG4gICAgICAgIGlmIChvYmplY3QuaXNOZXcgPT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaGVyZTEgTmV3VmFsXCIsIE5ld1ZhbCk7XG4gICAgICAgICAgLy9sZXQgcmVzdWx0ID0gb2JqZWN0LnN0YXJTZXJ2aWNlcy5hZGRSZWMob2JqZWN0LmdyaWQuZGF0YSwgTmV3VmFsKSA7XG4gICAgICAgICAgLy8gb2JqZWN0LmdyaWQuZGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhvYmplY3QuZ3JpZC5kYXRhKTtcblxuICAgICAgICAgIGlmIChvYmplY3QuZ3JpZC5kYXRhID09IG51bGwgfHwgdHlwZW9mIG9iamVjdC5ncmlkLmRhdGEuZGF0YSA9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgb2JqZWN0LmdyaWQuZGF0YSA9IHsgZGF0YTogW10sIHRvdGFsOiAwIH07XG4gICAgICAgICAgLy9vYmplY3QuZ3JpZC5kYXRhLmRhdGEucHVzaChOZXdWYWwpO1xuICAgICAgICAgIG9iamVjdC5ncmlkLmRhdGEuZGF0YS5zcGxpY2UoMCwgMCwgTmV3VmFsKTtcbiAgICAgICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBvYmplY3QuaW5zZXJ0Q01EO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coJ2NoZWNrOm9iamVjdC5ncmlkLmRhdGE6Jywgb2JqZWN0LmdyaWQuZGF0YSwgXCIgTmV3VmFsOlwiLCBOZXdWYWwpO1xuICAgICAgICAgIC8vTmV3VmFsID0gdGhpcy5wYXJzZVRvRGF0ZShOZXdWYWwpO1xuICAgICAgICAgIGlmIChvYmplY3QuZ3JpZC5kYXRhLmRhdGFbb2JqZWN0LmVkaXRlZFJvd0luZGV4XS5fUVVFUlkgPT0gb2JqZWN0Lmluc2VydENNRCkge1xuICAgICAgICAgICAgTmV3VmFsW1wiX1FVRVJZXCJdID0gb2JqZWN0Lmluc2VydENNRDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBvYmplY3QudXBkYXRlQ01EO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYmplY3QuZ3JpZC5kYXRhLmRhdGFbb2JqZWN0LmVkaXRlZFJvd0luZGV4XSA9IE5ld1ZhbDtcbiAgICAgICAgICAvL2xldCByZXN1bHQxID0gb2JqZWN0LnN0YXJTZXJ2aWNlcy51cGRhdGVSZWMob2JqZWN0LmdyaWQuZGF0YSAsIG9iamVjdC5lZGl0ZWRSb3dJbmRleCwgTmV3VmFsICk7XG4gICAgICAgICAgLy9vYmplY3QuZ3JpZC5kYXRhID0gcmVzdWx0MTtcbiAgICAgICAgfVxuICAgICAgICAvL29iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTsgLy8gYWRkVG9Cb2R5IHdpbGwgYmUgZG9uZSBhdCBzYXZlQ2hhbmdlc19ncmlkIHRvIGF2b2lkIGR1cGxpY3RlIHVwZGF0ZSBzaW5jZSBvYmplY3QuZ3JpZC5kYXRhLmRhdGEgaXMgZ2V0dGluZyB1cGRhdGVkXG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKG9iamVjdC5ncmlkLmRhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwcmUgY2xvc2VcIilcbiAgICAgIG9iamVjdC5jbG9zZUVkaXRvcigpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwb3N0IGNsb3NlXCIpXG4gICAgfVxuICB9XG4gIHB1YmxpYyBjbG9zZUVkaXRvcl9ncmlkKG9iamVjdDphbnkpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcIm9iamVjdC5mb3JtR3JvdXA6Y2xvc2VFZGl0b3JfZ3JpZFwiKVxuICAgIG9iamVjdC5ncmlkLmNsb3NlUm93KG9iamVjdC5lZGl0ZWRSb3dJbmRleCk7XG4gICAgb2JqZWN0LmlzTmV3ID0gZmFsc2U7XG4gICAgb2JqZWN0LmVkaXRlZFJvd0luZGV4ID0gdW5kZWZpbmVkO1xuICAgIG9iamVjdC5mb3JtR3JvdXAgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcHVibGljIGNhbmNlbEhhbmRsZXJfZ3JpZChvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgb2JqZWN0LmNsb3NlRWRpdG9yKCk7XG4gICAgb2JqZWN0LmlzU2VhcmNoID0gZmFsc2U7XG4gIH1cbiAgcHVibGljIHNhdmVDaGFuZ2VzX2dyaWRfaW5UcmFucyhncmlkOmFueSwgb2JqZWN0OmFueSwgTmV3VmFsOmFueSkge1xuICAgIHRoaXMuY29tbWl0Qm9keS5wdXNoKE5ld1ZhbCk7XG4gICAgaWYgKG9iamVjdC5pc0NoaWxkID09IHRydWUpIHtcbiAgICAgIGxldCBncmlkUmVjb3JkcyA9IG9iamVjdC5ncmlkLmRhdGEuZGF0YS5sZW5ndGg7XG4gICAgICBsZXQgcGFyYW1Db25maWcgPSB7XG4gICAgICAgIFwiTmFtZVwiOiBcImNoaWxkUmVjb3Jkc1wiLFxuICAgICAgICBcIlZhbFwiOiBncmlkUmVjb3Jkc1xuICAgICAgfTtcbiAgICAgIHNldFBhcmFtQ29uZmlnKHBhcmFtQ29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja1Bvc3RfU2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgbGV0IE5ld1ZhbDE6YW55ID0gW107XG4gICAgICBOZXdWYWwxLnB1c2goTmV3VmFsKTtcbiAgICAgIG9iamVjdC5jYWxsQmFja1Bvc3RfU2F2ZS5hcHBseShvYmplY3QsIE5ld1ZhbDEpO1xuICAgIH1cbiAgICB0aGlzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCB0cnVlKTtcbiAgICBvYmplY3Quc2F2ZUNvbXBsZXRlZE91dHB1dC5lbWl0KGdyaWQpO1xuICB9XG4gIHB1YmxpYyBzYXZlQ2hhbmdlc19ncmlkKGdyaWQ6IGFueSwgb2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGlmICgob2JqZWN0LmdyaWQuZGF0YSA9PSBudWxsKSB8fCAodHlwZW9mIG9iamVjdC5ncmlkLmRhdGEuZGF0YSA9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgRXJyb3IgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInByZSBvYmplY3Quc2F2ZUN1cnJlbnRcIik7XG4gICAgb2JqZWN0LnNhdmVDdXJyZW50KCk7XG5cbiAgICBpZiAob2JqZWN0LmNvbXBvbmVudENvbmZpZy5yb3V0aW5lQXV0aCAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImF1dGhMZXZlbDpcIiArIG9iamVjdC5jb21wb25lbnRDb25maWcucm91dGluZUF1dGguYXV0aExldmVsKTtcbiAgICAgIGlmIChvYmplY3QuY29tcG9uZW50Q29uZmlnLnJvdXRpbmVBdXRoLmF1dGhMZXZlbCAhPSAyKSB7XG4gICAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgICBtc2c6IHRoaXMucmVhZE9ubHlNc2csXG4gICAgICAgICAgdGl0bGU6IFwiV2FybmluZ1wiLFxuICAgICAgICAgIGluZm86IG51bGwsXG4gICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgYWN0aW9uOiB0aGlzLk9rQWN0aW9ucyxcbiAgICAgICAgICBjYWxsYmFjazogbnVsbFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBOZXdWYWwgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdC5ncmlkLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVjazogb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWTpcIiwgb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWSlcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIE5ld1ZhbCA9IG9iamVjdC5ncmlkLmRhdGEuZGF0YVtpXTtcbiAgICAgICAgb2JqZWN0LmFkZFRvQm9keShOZXdWYWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pblRyYW5zKSB7XG4gICAgICB0aGlzLnNhdmVDaGFuZ2VzX2dyaWRfaW5UcmFucyhncmlkLCBvYmplY3QsIE5ld1ZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiY2hlY2s6IG9iamVjdC5Cb2R5OlwiLCBvYmplY3QuQm9keSk7XG4gICAgaWYgKG9iamVjdC5Cb2R5Lmxlbmd0aCAhPSAwKSB7XG4gICAgICBsZXQgUGFnZSA9IFwiJl90cmFucz1ZXCI7XG4gICAgICB0aGlzLnBvc3Qob2JqZWN0LCBQYWdlLCBvYmplY3QuQm9keSkuc3Vic2NyaWJlKFBhZ2UgPT4ge1xuICAgICAgICBvYmplY3QuQm9keSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBvYmplY3QuZ3JpZC5kYXRhLmRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5ncmlkLmRhdGEuZGF0YVtpXS5fUVVFUlkgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICBvYmplY3QuZ3JpZC5kYXRhLmRhdGFbaV0uX1FVRVJZX0RPTkUgPSBvYmplY3QuZ3JpZC5kYXRhLmRhdGFbaV0uX1FVRVJZO1xuICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVjazogb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWTpcIiwgb2JqZWN0LmdyaWQuZGF0YS5kYXRhW2ldLl9RVUVSWSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmdyaWQuZGF0YS5kYXRhOlwiLCBvYmplY3QuZ3JpZC5kYXRhLmRhdGEpXG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmdyaWQuZGF0YS5kYXRhOi5sZW5ndGhcIiwgb2JqZWN0LmdyaWQuZGF0YS5kYXRhLmxlbmd0aClcbiAgICAgICAgaWYgKG9iamVjdC5pc0NoaWxkID09IHRydWUpIHtcbiAgICAgICAgICBsZXQgZ3JpZFJlY29yZHMgPSBvYmplY3QuZ3JpZC5kYXRhLmRhdGEubGVuZ3RoO1xuICAgICAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgICAgIFwiTmFtZVwiOiBcImNoaWxkUmVjb3Jkc1wiLFxuICAgICAgICAgICAgXCJWYWxcIjogZ3JpZFJlY29yZHNcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldFBhcmFtQ29uZmlnKHBhcmFtQ29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oJ3N1Y2Nlc3MnLCBcIkRhdGEgc2F2ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja1Bvc3RfU2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGxldCBOZXdWYWwxOmFueSA9IFtdO1xuICAgICAgICAgIE5ld1ZhbDEucHVzaChOZXdWYWwpO1xuICAgICAgICAgIG9iamVjdC5jYWxsQmFja1Bvc3RfU2F2ZS5hcHBseShvYmplY3QsIE5ld1ZhbDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0UHJpbWFyS2V5TmFtZUFycihvYmplY3QsIHRydWUpO1xuICAgICAgICAvLyBpZiAob2JqZWN0LmRpYWJsZUVtaXRTYXZlID09IHRydWUpIFxuICAgICAgICAvLyAgICAge31cbiAgICAgICAgLy8gICBlbHNlXG4gICAgICAgIG9iamVjdC5zYXZlQ29tcGxldGVkT3V0cHV0LmVtaXQoZ3JpZCk7XG4gICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIGZvciAobGV0IGkgPSBvYmplY3QuQm9keS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5Cb2R5W2ldLl9RVUVSWSAhPSBvYmplY3QuZGVsZXRlQ01EKSB7XG4gICAgICAgICAgICAgIG9iamVjdC5Cb2R5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJlcnI6XCIsIGVycilcbiAgICAgICAgICBsZXQgZXJyTXNnID0gdGhpcy5nZXRFcnJvck1zZyhlcnIpO1xuICAgICAgICAgIHRoaXMuc2hvd05vdGlmaWNhdGlvbihcImVycm9yXCIsIFwiZXJyb3I6XCIgKyBlcnJNc2cpO1xuICAgICAgICAgIEVycm9yID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuaXNNYXN0ZXI6XCIgKyBvYmplY3QuaXNNYXN0ZXIpO1xuICAgICAgaWYgKCFvYmplY3QuaXNNYXN0ZXIpXG4gICAgICAgIHRoaXMuc2hvd05vdGlmaWNhdGlvbignd2FybmluZycsIFwiTm8gY2hhbmdlcyB0byBzYXZlXCIpO1xuICAgIH1cbiAgICAvLyBpZiAoIUVycm9yKVxuICAgIC8vICAgb2JqZWN0LnNhdmVDb21wbGV0ZWRPdXRwdXQuZW1pdChncmlkKTtcbiAgfVxuICBwdWJsaWMgZ2V0RXJyb3JNc2coZXJyOmFueSlcbiAgICB7XG4gICAgICBsZXQgZXJyTXNnID0gXCJcIjtcbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiBlcnIuZXJyb3IuZXJyb3IgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIGVyck1zZyA9IGVyci5lcnJvci5lcnJvcjtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgZXJyTXNnID0gZXJyLmVycm9yO1xuXG4gICAgICAgIHJldHVybiBlcnJNc2c7XG5cbiAgICB9XG5cblxuXG4gIHB1YmxpYyBleGVjdXRlUXVlcnlfZ3JpZChncmlkOiBhbnksIG9iamVjdDphbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5ncmlkOlwiLCBvYmplY3QuZ3JpZClcbiAgICBpZiAodHlwZW9mIG9iamVjdC5ncmlkID09IFwidW5kZWZpbmVkXCIpXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgZGlydHkgPSBmYWxzZTtcbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nIChcImV4ZWN1dGVRdWVyeV9ncmlkOlwiICsgb2JqZWN0LkJvZHkubGVuZ3RoICsgXCIgXCIgKyBvYmplY3QuZ3JpZC5pc0VkaXRpbmcoKSwgXCJvYmplY3QuQm9keTpcIixvYmplY3QuQm9keSk7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC5Cb2R5OlwiLG9iamVjdC5Cb2R5KVxuICAgIGlmICgob2JqZWN0LkJvZHkubGVuZ3RoICE9IDApIHx8IG9iamVjdC5ncmlkLmlzRWRpdGluZygpID09IHRydWUpIHtcbiAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGRpcnR5ID09IHRydWUpIHtcbiAgICAgIGxldCBkaWFsb2dTdHJ1YyA9IHtcbiAgICAgICAgbXNnOiB0aGlzLnNhdmVDaGFuZ2VzTXNnLFxuICAgICAgICB0aXRsZTogdGhpcy5wbGVhc2VDb25maXJtTXNnLFxuICAgICAgICBpbmZvOiBncmlkLFxuICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgYWN0aW9uOiB0aGlzLlllc05vQWN0aW9ucyxcbiAgICAgICAgY2FsbGJhY2s6IHRoaXMuZXhlY3V0ZVF1ZXJ5QWN0X2dyaWRcbiAgICAgIH07XG4gICAgICB0aGlzLnNob3dDb25maXJtYXRpb24oZGlhbG9nU3RydWMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZXhlY3V0ZVF1ZXJ5QWN0X2dyaWQoZ3JpZCwgb2JqZWN0KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGV4ZWN1dGVRdWVyeUFjdF9ncmlkKGdyaWQ6IGFueSwgb2JqZWN0OmFueSk6IHZvaWQge1xuICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgIFwiTmFtZVwiOiBcImNoaWxkUmVjb3Jkc1wiLFxuICAgICAgXCJWYWxcIjogMFxuICAgIH07XG4gICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuaXNDaGlsZDpcIiwgb2JqZWN0LmlzQ2hpbGQsIFwiIG9iamVjdC5pc1NlYXJjaCA6XCIsIG9iamVjdC5pc1NlYXJjaClcbiAgICBpZiAob2JqZWN0LmlzQ2hpbGQgPT0gdHJ1ZSkge1xuICAgICAgaWYgKG9iamVjdC5pc1NlYXJjaCAhPSB0cnVlKSB7XG4gICAgICAgIGdyaWQgPSBvYmplY3QuZ3JpZEluaXRpYWxWYWx1ZXM7XG5cbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqZWN0Lm1hc3RlcktleU5hbWVBcnIgIT0gXCJ1bmRlZmluZWRcIikgJiYgKG9iamVjdC5tYXN0ZXJLZXlOYW1lQXJyLmxlbmd0aCAhPSAwKSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0Lm1hc3RlcktleU5hbWVBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9iamVjdC5ncmlkSW5pdGlhbFZhbHVlc1tvYmplY3QubWFzdGVyS2V5TmFtZUFycltpXV0gPSBvYmplY3QubWFzdGVyS2V5QXJyW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvYmplY3QuZ3JpZEluaXRpYWxWYWx1ZXNbb2JqZWN0Lm1hc3RlcktleU5hbWVdID0gb2JqZWN0Lm1hc3RlcktleTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZ3JpZFtvYmplY3QubWFzdGVyS2V5TmFtZV0gPSBvYmplY3QubWFzdGVyS2V5O1xuICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0Lm1hc3RlcktleU5hbWU6XCIgKyBvYmplY3QubWFzdGVyS2V5TmFtZSk7XG4gICAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coZ3JpZCk7XG4gICAgICAgIG9iamVjdC5pc1NlYXJjaCA9IHRydWU7XG4gICAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS1TZWFyY2hpbmc6XCIpO1xuICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKGdyaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLWV4ZWN1dGVRdWVyeSBvYmplY3QuaXNTZWFyY2ggOicgKyBvYmplY3QuaXNTZWFyY2ggKyBcIiAgb2JqZWN0LmlzQ2hpbGQ6XCIgKyBvYmplY3QuaXNDaGlsZCk7XG4gICAgLy8gaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhvYmplY3QuZ3JpZCk7XG5cbiAgICBsZXQgUGFnZSA9IFwiJl9xdWVyeT1cIiArIG9iamVjdC5nZXRDTUQ7XG4gICAgaWYgKG9iamVjdC5pc1NlYXJjaCA9PSB0cnVlKSB7XG4gICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdvYmplY3QuZm9ybUdyb3VwOicsIG9iamVjdC5mb3JtR3JvdXAsICd0eXBlb2YoZ3JpZCk6JywgdHlwZW9mIChncmlkLmRhdGEpLCAnIGdyaWQ6JywgZ3JpZClcbiAgICAgIGxldCBOZXdWYWwgPSBcIlwiO1xuICAgICAgaWYgKHR5cGVvZiBvYmplY3QuZm9ybUdyb3VwID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gYSBjaGlsZCBjb21wb25lbnRcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygnZ3JpZDonLCB0eXBlb2YgKGdyaWQuZGF0YSkpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZ3JpZC5kYXRhID09IFwib2JqZWN0XCIpXG4gICAgICAgICAgTmV3VmFsID0gZ3JpZC5kYXRhOyAvLyBwYXNzZWQgZW1wdHkgZ3JpZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgTmV3VmFsID0gZ3JpZDsgLy8gdXNlZCB0aGUgcGFzc2VkIGdyaWQgcGFyYW1cbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgTmV3VmFsID0gb2JqZWN0LmZvcm1Hcm91cC52YWx1ZTtcblxuICAgICAgb2JqZWN0LmlzU2VhcmNoID0gZmFsc2U7XG4gICAgICBpZiAoKHR5cGVvZiBvYmplY3QuZm9ybWF0dGVkV2hlcmUgPT09IFwidW5kZWZpbmVkXCIpIHx8IChvYmplY3QuZm9ybWF0dGVkV2hlcmUgPT0gbnVsbCkpIHtcbiAgICAgICAgUGFnZSA9IFBhZ2UgKyBvYmplY3Quc3RhclNlcnZpY2VzLmZvcm1hdFdoZXJlKE5ld1ZhbCk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmZvcm1hdHRlZFdoZXJlXCIsIG9iamVjdC5mb3JtYXR0ZWRXaGVyZSlcblxuICAgICAgICBQYWdlID0gUGFnZSArIG9iamVjdC5mb3JtYXR0ZWRXaGVyZTtcbiAgICAgICAgb2JqZWN0LmZvcm1hdHRlZFdoZXJlID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICgodHlwZW9mIG9iamVjdC5PcmRlckJ5Q2xhdXNlICE9PSBcInVuZGVmaW5lZFwiKSAmJiAob2JqZWN0Lk9yZGVyQnlDbGF1c2UgIT0gXCJcIikpXG4gICAgICAgIFBhZ2UgPSBQYWdlICsgXCImX09SREVSQlk9XCIgKyBvYmplY3QuT3JkZXJCeUNsYXVzZTtcblxuXG4gICAgfVxuICAgIFBhZ2UgPSBlbmNvZGVVUkkoUGFnZSk7XG4gICAgLy9pZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCdQYWdlOicgKyBQYWdlKTtcbiAgICBvYmplY3QuZ3JpZC5sb2FkaW5nID0gdHJ1ZTtcbiAgICBvYmplY3QuY2xvc2VFZGl0b3IoKTtcbiAgICBvYmplY3QuZXhlY3V0ZVF1ZXJ5cmVzdWx0ID0gW107XG4gICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdC5yZXN1bHQgPSAwO1xuICAgIG9iamVjdC5DdXJyZW50UmVjID0gMDtcbiAgICBvYmplY3QuZ3JpZC5kYXRhID0gbnVsbDtcblxuXG4gICAgb2JqZWN0LnN0YXJTZXJ2aWNlcy5mZXRjaChvYmplY3QsIFBhZ2UpLnN1YnNjcmliZSgocmVzdWx0OmFueSkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIGxldCBhY3R1YWxSZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCByZXN1bHQsIHt9KVxuICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tcmVzdWx0LmRhdGFbMF0uZGF0YSA6XCIpO1xuICAgICAgICAvL2lmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cocmVzdWx0LmRhdGFbMF0uZGF0YSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0LmRhdGFbMF0uZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc3VsdC5kYXRhWzBdLmRhdGFbaV0gPSBvYmplY3Quc3RhclNlcnZpY2VzLnBhcnNlVG9EYXRlKHJlc3VsdC5kYXRhWzBdLmRhdGFbaV0pO1xuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVswXS5kYXRhW2ldLl9RVUVSWSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkZWxldGUgcmVzdWx0LmRhdGFbMF0uZGF0YVtpXS5fUVVFUlk7XG4gICAgICAgICAgICBkZWxldGUgcmVzdWx0LmRhdGFbMF0uZGF0YVtpXS5fUVVFUllfRE9ORTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YVswXS5kYXRhWzBdKTtcblxuICAgICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0LmRhdGFbMF0uZGF0YSxcbiAgICAgICAgICB0b3RhbDogcGFyc2VJbnQocmVzdWx0LmRhdGFbMF0uZGF0YS5sZW5ndGgsIDEwKVxuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3QuaXNNYXN0ZXIpXG4gICAgICAgICAgb2JqZWN0LnN0YXJTZXJ2aWNlcy5zaG93Tm90aWZpY2F0aW9uKCdzdWNjZXNzJywgXCJSZWNvcmRzIHJldHJpZXZlZCA6IFwiICsgcmVzdWx0LnRvdGFsKTtcbiAgICAgICAgb2JqZWN0LmV4ZWN1dGVRdWVyeXJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgaWYgKG9iamVjdC5pc0NoaWxkID09IHRydWUpIHtcbiAgICAgICAgICBsZXQgcGFyYW1Db25maWcgPSB7XG4gICAgICAgICAgICBcIk5hbWVcIjogXCJjaGlsZFJlY29yZHNcIixcbiAgICAgICAgICAgIFwiVmFsXCI6IHJlc3VsdC50b3RhbFxuICAgICAgICAgIH07XG4gICAgICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgICB9XG5cblxuXG4gICAgICB9XG4gICAgICBvYmplY3QuZ3JpZC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICBvYmplY3QuZ3JpZC5kYXRhID0gcmVzdWx0O1xuXG4gICAgICBpZiAodHlwZW9mIG9iamVjdC5jYWxsQmFja0Z1bmN0aW9uICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICBvYmplY3QuY2FsbEJhY2tGdW5jdGlvbihyZXN1bHQpO1xuXG4gICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiZ3JpZCBzZXJ2aWNlcmVhZENvbXBsZXRlZE91dHB1dFwiKTtcbiAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2cob2JqZWN0LmdyaWQuZGF0YS5kYXRhKTtcbiAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJyZXN1bHQgbGVuZ3RoOlwiICsgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicmVzdWx0IHRvdGFsOlwiICsgcmVzdWx0LnRvdGFsKTtcbiAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QucGVyZm9ybVJlYWRDb21wbGV0ZWRPdXRwdXQ6XCIgKyBvYmplY3QucGVyZm9ybVJlYWRDb21wbGV0ZWRPdXRwdXQpXG4gICAgICBpZiAoKHR5cGVvZiBvYmplY3QucGVyZm9ybVJlYWRDb21wbGV0ZWRPdXRwdXQgIT09IFwidW5kZWZpbmVkXCIpIHx8IChvYmplY3QucGVyZm9ybVJlYWRDb21wbGV0ZWRPdXRwdXQgPT0gZmFsc2UpKSB7XG4gICAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlMVwiKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlMlwiKVxuICAgICAgICBpZiAob2JqZWN0LmRpc2FibGVFbWl0UmVhZENvbXBsZXRlZCAhPSB0cnVlKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC50b3RhbCAhPSAwKVxuICAgICAgICAgICAgb2JqZWN0LnJlYWRDb21wbGV0ZWRPdXRwdXQuZW1pdChvYmplY3QuZ3JpZC5kYXRhLmRhdGFbMF0pO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9iamVjdC5yZWFkQ29tcGxldGVkT3V0cHV0LmVtaXQoW10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmplY3Quc3RhclNlcnZpY2VzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCB0cnVlKTtcbiAgICB9LFxuICAgICAgKGVycjphbnkpID0+IHtcbiAgICAgICAgb2JqZWN0LkJvZHkgPSBbXTtcbiAgICAgICAgb2JqZWN0LmdyaWQubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBvYmplY3QuZ3JpZC5kYXRhID0gbnVsbDtcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImVycjpcIiwgZXJyKVxuICAgICAgICBvYmplY3Quc3RhclNlcnZpY2VzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yOlwiICsgZXJyLmVycm9yLmVycm9yLmNvZGUpO1xuICAgICAgfSk7XG4gICAgb2JqZWN0LmRvY0NsaWNrU3Vic2NyaXB0aW9uID0gb2JqZWN0LnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnY2xpY2snLCBvYmplY3Qub25Eb2N1bWVudENsaWNrLmJpbmQob2JqZWN0KSk7XG4gIH1cblxuXG4gIHB1YmxpYyBlbnRlclF1ZXJ5QWN0X2dyaWQoZ3JpZDogYW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgb2JqZWN0LmdyaWQuY2FuY2VsO1xuICAgIG9iamVjdC5ncmlkLmRhdGEgPSBudWxsO1xuICAgIG9iamVjdC5Cb2R5ID0gW107XG5cbiAgICBvYmplY3QuaXNTZWFyY2ggPSB0cnVlO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuaXNTZWFyY2g6XCIgKyBvYmplY3QuaXNTZWFyY2gpO1xuICAgIG9iamVjdC5hZGRIYW5kbGVyKCk7XG4gICAgb2JqZWN0LmNsZWFyQ29tcGxldGVkT3V0cHV0LmVtaXQob2JqZWN0LmZvcm1Jbml0aWFsVmFsdWVzKTtcbiAgICBvYmplY3Quc3RhclNlcnZpY2VzLnNldFByaW1hcktleU5hbWVBcnIob2JqZWN0LCBmYWxzZSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBlbnRlclF1ZXJ5X2dyaWQoZ3JpZDogYW55LCBvYmplY3Q6YW55KTogdm9pZCB7XG4gICAgbGV0IGRpcnR5ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwcmUgb2JqZWN0LnNhdmVDdXJyZW50XCIpO1xuICAgIG9iamVjdC5zYXZlQ3VycmVudCgpO1xuICAgIGxldCBtb2RpZmllZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LmdyaWQuZGF0YVwiKTtcbiAgICBpZiAob2JqZWN0LmdyaWQuZGF0YSAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIG9iamVjdC5ncmlkLmRhdGEuZGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdC5ncmlkLmRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiY2hlY2s6IGk6XCIsIGksIFwiIG9iamVjdC5ncmlkLmRhdGEuZGF0YVtpXS5fUVVFUlk6XCIsIG9iamVjdC5ncmlkLmRhdGEuZGF0YVtpXS5fUVVFUlkpXG4gICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QuZ3JpZC5kYXRhLmRhdGFbaV0uX1FVRVJZICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBtb2RpZmllZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwib2JqZWN0LnNhdmVDdXJyZW50IDpcIiArIG9iamVjdC5Cb2R5Lmxlbmd0aCArIFwiIFwiICsgb2JqZWN0LmdyaWQuaXNFZGl0aW5nKCkpO1xuICAgIGlmIChvYmplY3QuQm9keS5sZW5ndGggIT0gMCkge1xuICAgICAgbW9kaWZpZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgobW9kaWZpZWQgPT0gdHJ1ZSkgfHwgb2JqZWN0LmdyaWQuaXNFZGl0aW5nKCkgPT0gdHJ1ZSkge1xuICAgICAgZGlydHkgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkaXJ0eSA9PSB0cnVlKSB7XG4gICAgICBsZXQgZGlhbG9nU3RydWMgPSB7XG4gICAgICAgIG1zZzogdGhpcy5zYXZlQ2hhbmdlc01zZyxcbiAgICAgICAgdGl0bGU6IHRoaXMucGxlYXNlQ29uZmlybU1zZyxcbiAgICAgICAgaW5mbzogZ3JpZCxcbiAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgIGFjdGlvbjogdGhpcy5ZZXNOb0FjdGlvbnMsXG4gICAgICAgIGNhbGxiYWNrOiB0aGlzLmVudGVyUXVlcnlBY3RfZ3JpZFxuICAgICAgfTtcbiAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbihkaWFsb2dTdHJ1Yyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbnRlclF1ZXJ5QWN0X2dyaWQoZ3JpZCwgb2JqZWN0KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIHNldFN0ckF1dGgodXNlcjphbnksIHBhc3N3b3JkOmFueSkge1xuICAgIHRoaXMuU3RyQXV0aCA9IHVzZXIgKyBcIjpcIiArIHBhc3N3b3JkO1xuICAgIHRoaXMuU3RyQXV0aCA9IGJ0b2EodGhpcy5TdHJBdXRoKTtcbiAgICB0aGlzLlN0ckF1dGggPSBcIkJhc2ljIFwiICsgdGhpcy5TdHJBdXRoO1xuXG4gIH1cbiAgcHVibGljIGxvZ2luKG9iamVjdDphbnksIHVzZXI6YW55LCBwYXNzd29yZDphbnkpIHtcbiAgICB0aGlzLnBhcmFtQ29uZmlnID0gZ2V0UGFyYW1Db25maWcoKTtcbiAgICAvL2NvbnNvbGUubG9nKFwidGhpcy5wYXJhbUNvbmZpZzpcIiwgdGhpcy5wYXJhbUNvbmZpZylcbiAgICB0aGlzLnNldFN0ckF1dGgodXNlciwgcGFzc3dvcmQpO1xuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0aGlzLlN0ckF1dGg6XCIgKyB0aGlzLlN0ckF1dGgpO1xuXG5cbiAgICBsZXQgUGFnZSA9IFwiXCI7XG4gICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICBjb25zdCBtZDUgPSBuZXcgTWQ1KCk7XG4gICAgbGV0IHBhc3MgPSBtZDUuYXBwZW5kU3RyKHBhc3N3b3JkKS5lbmQoKTtcbiAgICB1c2VyID0gdXNlci50b1VwcGVyQ2FzZSgpLnRyaW0oKTtcbiAgICB1c2VyID0gdXNlci50cmltKCk7XG4gICAgbGV0IE5ld1ZhbDphbnkgPSB7XG4gICAgICBcIlVTRVJOQU1FXCI6IHVzZXIsXG4gICAgICBcIlBBU1NXT1JEXCI6IHBhc3NcbiAgICB9O1xuXG5cbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIlZFUklGWV9BRE1fVVNFUlwiO1xuICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcblxuICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgIFwiTmFtZVwiOiBcIlVTRVJOQU1FXCIsXG4gICAgICBcIlZhbFwiOiB1c2VyXG4gICAgfTtcbiAgICBzZXRQYXJhbUNvbmZpZyhwYXJhbUNvbmZpZyk7XG5cbiAgICB0aGlzLnBvc3Qob2JqZWN0LCBQYWdlLCBvYmplY3QuQm9keSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAodHlwZW9mIHJlc3VsdC5kYXRhWzBdLmRhdGFbMF0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJPYmplY3QgaW4gbG9naW4gSEZcIiwgb2JqZWN0LkJvZHksIHVzZXIpO1xuICAgICAgICBpZiAocmVzdWx0LmRhdGFbMF0uZGF0YVswXS5VU0VSTkFNRSA9PSB1c2VyKSB7XG4gICAgICAgICAgdGhpcy5VU0VSTkFNRSA9IHVzZXI7XG4gICAgICAgICAgb2JqZWN0LkJvZHkgPSBbXTtcblxuICAgICAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgICAgIFwiTmFtZVwiOiBcIlVTRVJfSU5GT1wiLFxuICAgICAgICAgICAgXCJWYWxcIjogcmVzdWx0LmRhdGFbMF0uZGF0YVswXVxuICAgICAgICAgIH07XG4gICAgICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgICAgIHRoaXMuVVNFUl9JTkZPID0gcmVzdWx0LmRhdGFbMF0uZGF0YVswXTtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5VU0VSX0lORk8uTUFTVEVSX0RCICE9IFwiXCIpe1xuICAgICAgICAgICAgdGhpcy5NQVNURVJfREIgPSB0aGlzLnBhcmFtQ29uZmlnLlVTRVJfSU5GTy5NQVNURVJfREI7XG4gICAgICAgICAgfVxuXG5cblxuICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICAgIHRoaXMubG9hZFJ1bGVzKG9iamVjdCk7XG4gICAgICAgICAgaWYgKG9iamVjdC50ZXN0RUtZQykge1xuICAgICAgICAgICAgb2JqZWN0LmxvZ2luQ29tcGxldGVkSGFuZGxlcihudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2JqZWN0LmxvZ2luQ29tcGxldGVkLmVtaXQodGhpcyk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzdWNjZXNzKVxuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yOlwiICsgXCJXcm9uZyB1c2VyIG9yIHBhc3N3b3JkXCIpO1xuXG5cblxuICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yOlwiICsgXCJXcm9uZyB1c2VyIG9yIHBhc3N3b3JkXCIpO1xuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcnVsZXNQb3N0UXVlcnlEZWYgPSB7XG4gICAgcnVsZVB0cnNBcnI6IFtdLFxuICAgIHJ1bGVzQXJyOiBbXSxcbiAgICBhY3Rpb25QdHJzQXJyOiBbXSxcbiAgICBhY3Rpb25zQXJyOiBbXVxuICB9O1xuICBwdWJsaWMgcnVsZXNQcmVRdWVyeURlZiA9IHtcbiAgICBydWxlUHRyc0FycjogW10sXG4gICAgcnVsZXNBcnI6IFtdLFxuICAgIGFjdGlvblB0cnNBcnI6IFtdLFxuICAgIGFjdGlvbnNBcnI6IFtdXG4gIH07XG4gIHB1YmxpYyBob3N0c0FyciA9IFtdO1xuICBwdWJsaWMgaG9zdHNNYXBBcnIgPSBbXTtcbiAgLy8vLy8vLy8vLy8vLy8vLy9cbiAgcHVibGljIEZPUk1BVF9JU08oZDphbnkpIHtcbiAgICB2YXIgZGF0ZUlzbyA9IGQudG9JU09TdHJpbmcoKTtcbiAgICB2YXIgZGF0ZUlzb0FyciA9IGRhdGVJc28uc3BsaXQoXCJUXCIpO1xuICAgIGRhdGVJc28gPSBkYXRlSXNvQXJyWzBdICsgXCIgXCIgKyBkYXRlSXNvQXJyWzFdO1xuICAgIGRhdGVJc28gPSBkYXRlSXNvLnN1YnN0cigwLCAxOSk7XG4gICAgcmV0dXJuIGRhdGVJc287XG4gIH1cbiAgcHVibGljIExvZ1J1bGUob2JqZWN0OmFueSwgcnVsZUxvZzphbnksIG1zZ1Jlc3BvbnNlOmFueSwgc3RhdHVzOmFueSkge1xuICAgIGZ1bmN0aW9uIHByZXBhcmVEYXRhRm9yREIoZGF0YUluOmFueSkge1xuXG4gICAgICBsZXQgZGF0YU91dCA9IEpTT04uc3RyaW5naWZ5KGRhdGFJbik7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZGF0YUluOlwiLCBkYXRhSW4sIFwiIGRhdGFPdXQ6XCIsIGRhdGFPdXQpO1xuICAgICAgZGF0YU91dCA9IGRhdGFPdXQuc3BsaXQoXCInXCIpLmpvaW4oJ1wiJyk7XG4gICAgICByZXR1cm4gZGF0YU91dDtcblxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS1tc2dSZXNwb25zZTpcIiwgbXNnUmVzcG9uc2UsIFwicnVsZUxvZzpcIiwgcnVsZUxvZyk7XG4gICAgbGV0IGRiID0gcnVsZUxvZy5kYjtcbiAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGRhdGVJc28gPSB0aGlzLkZPUk1BVF9JU08oZCk7XG5cbiAgICBsZXQgUlVMRV9LRVkgPSBydWxlTG9nLnJ1bGUuUlVMRV9LRVk7XG5cbiAgICBsZXQgYXJyYXkgPSBSVUxFX0tFWS5zcGxpdChcIixcIik7XG4gICAgLy9sZXQgcnVsZUtleSA9IHt9O1xuICAgIGxldCBydWxlS2V5ID0gXCJcIjtcbiAgICBsZXQgcnVsZUtleU5hbWUgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbGVtID0gYXJyYXlbaV07XG4gICAgICBsZXQgZWxlbV92YWx1ZSA9IHJ1bGVMb2cucXVlcnlEYXRhW2VsZW1dO1xuICAgICAgaWYgKHR5cGVvZiBlbGVtX3ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vcnVsZUtleVtlbGVtXSA9IGVsZW1fdmFsdWU7XG4gICAgICAgIGlmIChydWxlS2V5ICE9IFwiXCIpIHtcbiAgICAgICAgICBydWxlS2V5ID0gcnVsZUtleSArIFwiX1wiO1xuICAgICAgICB9XG4gICAgICAgIHJ1bGVLZXkgPSBydWxlS2V5ICsgZWxlbV92YWx1ZTtcblxuICAgICAgICBpZiAocnVsZUtleU5hbWUgIT0gXCJcIikge1xuICAgICAgICAgIHJ1bGVLZXlOYW1lID0gcnVsZUtleU5hbWUgKyBcIl9cIjtcbiAgICAgICAgfVxuICAgICAgICBydWxlS2V5TmFtZSA9IHJ1bGVLZXlOYW1lICsgZWxlbTtcbiAgICAgIH1cblxuICAgIH1cbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJ1bGVLZXk6XCIsIHJ1bGVLZXksIFwiIHJ1bGVLZXlOYW1lOlwiLCBydWxlS2V5TmFtZSk7XG5cblxuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJSVUxFX0tFWTpcIiwgUlVMRV9LRVkpO1xuXG5cblxuICAgIGxldCBxdWVyeURhdGEgPSBwcmVwYXJlRGF0YUZvckRCKHJ1bGVMb2cucXVlcnlEYXRhKTtcbiAgICAvL2xldCBib2R5VG9TZW5kID0gcHJlcGFyZURhdGFGb3JEQihydWxlTG9nLmJvZHlUb1NlbmQpO1xuICAgIGxldCBib2R5VG9TZW5kID0gcnVsZUxvZy5ib2R5VG9TZW5kO1xuICAgIGxldCBwYXJhbWV0ZXJzVG9TZW5kID0gcHJlcGFyZURhdGFGb3JEQihydWxlTG9nLnBhcmFtZXRlcnNUb1NlbmQpO1xuICAgIC8vIGxldCBydWxlS2V5U3RyID0gcHJlcGFyZURhdGFGb3JEQihydWxlS2V5KTtcbiAgICBsZXQgbXNnUmVzcG9uc2VTdHIgPSBwcmVwYXJlRGF0YUZvckRCKG1zZ1Jlc3BvbnNlKTtcblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicXVlcnlEYXRhOlwiICsgcXVlcnlEYXRhKTtcblxuICAgIC8vXG4gICAgbGV0IHVzZXJOYW1lID0gb2JqZWN0LnBhcmFtQ29uZmlnLlVTRVJfSU5GTy5OYW1lO1xuICAgIG9iamVjdC5Cb2R5ID0gW107XG4gICAgbGV0IFBhZ2UgPSBcIlwiO1xuICAgIGxldCBOZXdWYWw6YW55ID0ge1xuICAgICAgXCJSVUxFX0tFWVwiOiBydWxlS2V5LFxuICAgICAgXCJSVUxFX0tFWV9OQU1FXCI6IHJ1bGVLZXlOYW1lLFxuICAgICAgXCJTVEFUVVNcIjogc3RhdHVzLFxuICAgICAgXCJNT0RVTEVcIjogcnVsZUxvZy5ydWxlLk1PRFVMRSxcbiAgICAgIFwiUlVMRV9JRFwiOiBydWxlTG9nLnJ1bGUuUlVMRV9JRCxcbiAgICAgIFwiQUNUSU9OX0lEXCI6IHJ1bGVMb2cuYWN0aW9uLkFDVElPTl9JRCxcbiAgICAgIFwiU0VOVF9EQVRFXCI6IHJ1bGVMb2cuc2VudERhdGUsXG4gICAgICBcIk1TR19SRUNFSVZFRFwiOiBxdWVyeURhdGEsXG4gICAgICBcIlBBUkFNRVRFUl9TRU5UXCI6IHBhcmFtZXRlcnNUb1NlbmQsXG4gICAgICBcIkJPRFlfU0VOVFwiOiBib2R5VG9TZW5kLFxuICAgICAgXCJNU0dfUkVTUE9OU0VcIjogbXNnUmVzcG9uc2VTdHIsXG4gICAgICBcIkxPR0RBVEVcIjogZGF0ZUlzbyxcbiAgICAgIFwiTE9HTkFNRVwiOiB1c2VyTmFtZVxuXG4gICAgfTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIklOU0VSVF9BRE1fUlVMRV9MT0dcIjtcblxuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Ok5ld1ZhbDpcIiwgTmV3VmFsKVxuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Om9iamVjdC5Cb2R5OlwiLCBvYmplY3QuQm9keSlcbiAgICBvYmplY3QuYWRkVG9Cb2R5KE5ld1ZhbCk7XG5cblxuICAgIHRoaXMucG9zdChvYmplY3QsIFBhZ2UsIG9iamVjdC5Cb2R5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDpyZXN1bHQuZGF0YTpcIiwgcmVzdWx0LmRhdGEpO1xuICAgICAgb2JqZWN0LkJvZHkgPSBbXTtcbiAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgb2JqZWN0LkJvZHkgPSBbXTtcbiAgICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uKFwiZXJyb3JcIiwgXCJlcnJvcjpcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuXG5cblxuICB9XG4gIHB1YmxpYyBwZXJmb3JtSHR0cFBvc3Qob2JqZWN0OmFueSwgYm9keVRvU2VuZDphbnksIHBhcmFtZXRlcnNUb1NlbmQ6YW55LCBzZW5kVG86YW55LCBxdWVyeURhdGE6YW55LCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6YW55LCBhY3Rpb246YW55LCBUcmlnZ2VyOmFueSwgaG9zdERlZjphbnksIGhvc3RNYXBEZWY6YW55LCBoZWFkZXJQYXJhbTphbnkpIHtcblxuICAgIHZhciB2YWxpZCA9IGZhbHNlO1xuICAgIGxldCBlcnJvciA9IDA7XG4gICAgbGV0IG1zZyA9IFwiXCI7XG5cbiAgICBsZXQgb3B0aW9uczphbnkgPSB7XG4gICAgICBob3N0OiAnJyxcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgcG9ydDogODAsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgLy8nQ29udGVudC1UeXBlJzogJ3RleHQveG1sOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgXCJhdXRob3JpemF0aW9uXCI6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS1yZXEudXJsOlwiLHJlcS51cmwpO1xuICAgIC8vIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tcGF0aG5hbWU6XCIscmVxLl9wYXJzZWRVcmwucGF0aG5hbWUpO1xuICAgIC8vIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tcGF0aDpcIixyZXEuX3BhcnNlZFVybC5wYXRoKTtcbiAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGRhdGVJc28gPSB0aGlzLkZPUk1BVF9JU08oZCk7XG4gICAgaWYgKGhvc3REZWYgPT0gbnVsbClcbiAgICAgIGhvc3REZWYgPSBcIlwiO1xuXG4gICAgbGV0IHJ1bGVMb2cgPSB7XG4gICAgICBydWxlOiBydWxlLFxuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBxdWVyeURhdGE6IHF1ZXJ5RGF0YSxcbiAgICAgIGJvZHlUb1NlbmQ6IGJvZHlUb1NlbmQsXG4gICAgICBwYXJhbWV0ZXJzVG9TZW5kOiBwYXJhbWV0ZXJzVG9TZW5kLFxuICAgICAgLy8gIFwiZGJcIjogZGIsXG4gICAgICBzZW50RGF0ZTogZGF0ZUlzbyxcbiAgICAgIGhvc3REZWY6IGhvc3REZWZcbiAgICB9O1xuICAgIGlmIChzZW5kVG8gPT0gXCJXRlwiKSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5CQVNFX1VSTDtcblxuICAgICAgb3B0aW9ucy5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSB0aGlzLlN0ckF1dGg7XG5cbiAgICAgIHZhbGlkID0gdHJ1ZTtcblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmIChob3N0RGVmICE9IFwiXCIpIHtcbiAgICAgICAgbGV0IHBhdGggPSBcIi9cIiArIGhvc3REZWYuUEFUSDtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnNUb1NlbmQgIT0gXCJcIilcbiAgICAgICAgICBwYXRoID0gcGF0aCArIHBhcmFtZXRlcnNUb1NlbmQ7XG4gICAgICAgIGxldCBob3N0ID0gaG9zdERlZi5IT1NUO1xuICAgICAgICBsZXQgcG9ydCA9IHBhcnNlSW50KGhvc3REZWYuUE9SVCk7XG4gICAgICAgIGxldCBtZXRob2QgPSBob3N0RGVmLkhUVFBfTUVUSE9EO1xuXG4gICAgICAgIG9wdGlvbnMuaG9zdCA9IGhvc3Q7XG4gICAgICAgIG9wdGlvbnMucG9ydCA9IHBvcnQ7XG4gICAgICAgIG9wdGlvbnMucGF0aCA9IHBhdGg7XG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICAvLyBsZXQgdXJsID0gXCJodHRwOi8vXCIgKyBob3N0ICsgXCI6XCIgKyBwb3J0ICArIHBhdGggKyBwYXJhbWV0ZXJzVG9TZW5kIDtcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gaG9zdERlZi5VUkw7XG4gICAgICAgIC8vXHRcdFx0XHRcdG9wdGlvbnMuaGVhZGVycy5hdXRob3JpemF0aW9uID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbjtcbiAgICAgICAgLy9ib2R5VG9TZW5kID0gXCJcIjtcblxuXG4gICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlcnJvciA9IDEwMDtcbiAgICAgICAgbXNnID0gXCJ1bmRlZmluZWQgSG9zdCA6XCIgKyBzZW5kVG87XG4gICAgICAgIHRoaXMuTG9nUnVsZShvYmplY3QsIHJ1bGVMb2csIG1zZywgMTAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlMjp2YWxpZDpcIiwgdmFsaWQpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvcHRpb25zOlwiLCBvcHRpb25zKTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tYm9keVRvU2VuZDpcIiArIGJvZHlUb1NlbmQsIFwiICBUcmlnZ2VyOlwiLCBUcmlnZ2VyKTtcblxuICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJQYXJhbSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coa2V5c1tpXSArIFwiIFwiICsgaGVhZGVyUGFyYW1ba2V5c1tpXV0pO1xuICAgICAgICBpZiAoaGVhZGVyUGFyYW1ba2V5c1tpXV0gIT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMuaGVhZGVyc1trZXlzW2ldXSA9IGhlYWRlclBhcmFtW2tleXNbaV1dO1xuXG4gICAgICAgICAgLy9zY3JlZW5Db25maWdbIGtleXNbaV0gXSA9IGNvbXBvbmVudENvbmZpZ1sga2V5c1tpXSBdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaGVyZTI6YWN0aW9uLkFDVElPTl9DT0RFOlwiLCBhY3Rpb24uQUNUSU9OX0NPREUpO1xuICAgICAgaWYgKGFjdGlvbi5BQ1RJT05fQ09ERSA9PSBcIlNFTkRfV0FJVFwiKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGxldCBzZW5kaW5nTGliID0gXCJyZXF1ZXN0XCI7XG4gICAgICAgIHN0YXR1cyA9IDE7XG4gICAgICAgIGxldCBoZWFkZXJzICA9ICB7aGVhZGVyczpvcHRpb25zLmhlYWRlcnN9O1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImhlYWRlcnM6XCIsIGhlYWRlcnMpO1xuICAgICAgICBsZXQgdXJsID0gXCJodHRwOi8vXCIgKyBob3N0ICsgXCI6XCIgKyBwb3J0ICArIHBhdGggKyBwYXJhbWV0ZXJzVG9TZW5kIDtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS11cmw6XCIsIHVybCk7XG4gICAgICAgIGlmIChtZXRob2QgPT0gXCJHRVRcIilcbiAgICAgICAge1xuICAgICAgICAgIGxldCByZXMgPSByZXF1ZXN0KG1ldGhvZCwgdXJsLCBoZWFkZXJzKTtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXMuZ2V0Qm9keSgndXRmOCcpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIGlmIChtZXRob2QgPT0gXCJQT1NUXCIpXG4gICAgICAgIHtcblxuICAgICAgICAgIGxldCBkYXRhRm9yU3luYyA9IHsgYm9keSA6IGJvZHlUb1NlbmQsIGhlYWRlcnM6b3B0aW9ucy5oZWFkZXJzfTtcbiAgICAgICAgICBsZXQgcmVzID0gcmVxdWVzdChtZXRob2QsIHVybCwgZGF0YUZvclN5bmMpO1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicmVzOlwiLCByZXMpO1xuICAgICAgICAgIGxldCBzdGF0dXNDb2RlID0gcmVzLnN0YXR1c0NvZGU7XG4gICAgICAgICAgbGV0IG1zZ1Jlc3BvbnNlID1cIlwiO1xuICAgICAgICAgIGlmIChzdGF0dXNDb2RlID09IDIwMClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByZXMuaGVhZGVyc1snY29udGVudC10eXBlJ107XG5cbiAgICAgICAgICAgIGxldCBtc2dSZXNwb25zZSA9IHJlcy5nZXRCb2R5KCd1dGY4Jyk7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInN0YXR1c0NvZGU6XCIsIHN0YXR1c0NvZGUsXCIgaGVhZGVyczpcIiwgaGVhZGVycywgIFwiIG1zZ1Jlc3BvbnNlOlwiLCBtc2dSZXNwb25zZSk7XG4gICAgICAgICAgICBsZXQgbiA9IGNvbnRlbnRUeXBlLnNlYXJjaChcImpzb25cIik7XG4gICAgICAgICAgICBpZiAobiAhPSAtMSlcbiAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UobXNnUmVzcG9uc2UpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG1zZ1Jlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJyZXN1bHQ6XCIgKyAgcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yID0gc3RhdHVzQ29kZTtcbiAgICAgICAgICAgIGxldCBtc2dSZXNwb25zZSA9IHJlcy5ib2R5LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBtc2cgPSBtc2dSZXNwb25zZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgPT0gMClcbiAgICAgICAge1xuICAgICAgICAgIGlmICggKGhvc3RNYXBEZWYgIT0gbnVsbCkgJiYgIChob3N0TWFwRGVmLlhTTFRfUkVDRUlWRSAhPSBudWxsKSAmJiAoaG9zdE1hcERlZi5YU0xUX1JFQ0VJVkUgIT0gXCJcIikgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy9yZXN1bHQgPSB4c2x0bWFwLm1hcERhdGFPdXQocmVzdWx0LCBob3N0TWFwRGVmLlhTTFRfUkVDRUlWRSk7XG4gICAgICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJyZXN1bHQ6XCIsIHJlc3VsdCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgc3RhdHVzID0gZXh0cmFjdFN0YXR1cyAocnVsZUxvZywgcmVzdWx0KTtcbiAgICAgICAgICBMb2dSdWxlKHJ1bGVMb2csIHJlc3VsdCwgc3RhdHVzICk7XG4gICAgICAgICAgZXJyb3IgPSBzdGF0dXM7XG4gICAgICAgICAgaWYgKHN0YXR1cyAhPSAwKVxuICAgICAgICAgICAgbXNnID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgICovXG5cblxuXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy9hc3luY1xuICAgICAgICBmdW5jdGlvbiBleHRyYWN0U3RhdHVzKHJ1bGVMb2c6YW55LCBtc2dSZXNwb25zZTphbnkpIHtcbiAgICAgICAgICBsZXQgc3VjY2Vzc01zZyA9IHJ1bGVMb2cuaG9zdERlZi5TVUNDRVNTX01TRztcbiAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCItLS0tLS0tbXNnUmVzcG9uc2U6XCIsIG1zZ1Jlc3BvbnNlLCBzdWNjZXNzTXNnKTtcbiAgICAgICAgICBsZXQgYXJyYXkgPSBzdWNjZXNzTXNnLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICBsZXQgZmllbGQgPSBhcnJheVswXTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBhcnJheVsxXTtcblxuICAgICAgICAgIGxldCBtc2dSZXNwb25zZUFyciA9IG1zZ1Jlc3BvbnNlO1xuICAgICAgICAgIG1zZ1Jlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkobXNnUmVzcG9uc2VBcnIpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJmaWVsZDpcIiwgZmllbGQsIFwiIHZhbHVlOlwiLCB2YWx1ZSwgXCIgbXNnUmVzcG9uc2VBcnI6XCIsIG1zZ1Jlc3BvbnNlQXJyKTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLW1zZ1Jlc3BvbnNlQXJyW2ZpZWxkXTpcIiwgbXNnUmVzcG9uc2VBcnJbZmllbGRdLCB2YWx1ZSk7XG4gICAgICAgICAgbGV0IHN0YXR1cyA9IDE7XG4gICAgICAgICAgaWYgKG1zZ1Jlc3BvbnNlQXJyW2ZpZWxkXSA9PSB2YWx1ZSlcbiAgICAgICAgICAgIHN0YXR1cyA9IDA7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RSZXNwb25zZURhdGEobXNnUmVzcG9uc2U6YW55LCByZXNwb25zZURhdGFJRDphbnkpIHtcbiAgICAgICAgICBmdW5jdGlvbiBnZXRLZXkoRWxtOmFueSwgZWxtVmFsOmFueSkge1xuICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhFbG0pO1xuICAgICAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICAgICAgbGV0IGVsbU9iajtcbiAgICAgICAgICAgIHdoaWxlIChrIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJba2V5c1trXTpcIiwga2V5c1trXSk7XG4gICAgICAgICAgICAgIGlmIChrZXlzW2tdID09IGVsbVZhbCkge1xuICAgICAgICAgICAgICAgIGxldCBlbG1OYW1lID0ga2V5c1trXTtcbiAgICAgICAgICAgICAgICBlbG1PYmogPSBFbG1bZWxtTmFtZV07XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImVsbU9iajpcIiwgZWxtT2JqKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWxtT2JqO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgICAgbGV0IGFycmF5ID0gcmVzcG9uc2VEYXRhSUQuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCByZXR1cm5LZXkgPSBnZXRLZXkobXNnUmVzcG9uc2UsIGFycmF5W2ldKVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJldHVybktleS5sZW5ndGg6XCIsIHJldHVybktleS5sZW5ndGgpO1xuICAgICAgICAgICAgaWYgKHJldHVybktleS5sZW5ndGggPT0gMSlcbiAgICAgICAgICAgICAgbXNnUmVzcG9uc2UgPSByZXR1cm5LZXlbMF07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG1zZ1Jlc3BvbnNlID0gcmV0dXJuS2V5O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibXNnUmVzcG9uc2U6XCIsIG1zZ1Jlc3BvbnNlKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbXNnUmVzcG9uc2U7XG5cblxuXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICBmdW5jdGlvbiAgaGFuZGxlUmVzcG9uc2VFbmQocnVsZUxvZywgbXNnUmVzcG9uc2Upe1xuICAgICAgICAgIGxldCBzdGF0dXMgPSBleHRyYWN0U3RhdHVzIChydWxlTG9nLCBtc2dSZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5Mb2dSdWxlKHJ1bGVMb2csIG1zZ1Jlc3BvbnNlLCBzdGF0dXMpO1xuXG5cbiAgICAgICAgICAvL1x0LlJVTEVfSUQgKyBcIixcIiArICBhY3Rpb24uQUNUSU9OX0lEICsgXCIsXCIgKyB1c2Vycy5nZXRVc2VyTmFtZSgpICsgXCIsXCIgICsgZGF0ZUlzbztcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tLS0tLS1oYW5kbGVSZXNwb25zZTpzdGF0dXM6XCIgLCAgc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRCb2R5KG1zZ1Jlc3BvbnNlOmFueSkge1xuICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJtc2dSZXNwb25zZTpcIiwgbXNnUmVzcG9uc2UpXG4gICAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm1zZ1Jlc3BvbnNlOmJvZHlcIiwgbXNnUmVzcG9uc2UuYm9keSlcbiAgICAgICAgICByZXR1cm4gbXNnUmVzcG9uc2UuYm9keVxuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAgICAgIGxldCBoYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlc3BvbnNlLCAgcnVsZUxvZyl7XG4gICAgICAgICAgICAgICAgbGV0IG1zZ1Jlc3BvbnNlID0gJydcbiAgICAgICAgICAgICAgICByZXNwb25zZS5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgICAgICAgICAgICAgIG1zZ1Jlc3BvbnNlICs9IGNodW5rO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgIGhhbmRsZVJlc3BvbnNlRW5kKHJ1bGVMb2csIG1zZ1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgfSk7XG4gICAgICBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAqL1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0ge1xuICAgICAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycygpXG4gICAgICAgICAgICAuc2V0KCdBdXRob3JpemF0aW9uJywgdGhpcy5TdHJBdXRoKVxuICAgICAgICAgICAgLnNldCgnQ29udGVudC1UeXBlJywgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlMjpoZWFkZXJzOlwiLCBoZWFkZXJzKTtcbiAgICAgICAgaWYgKGJvZHlUb1NlbmQgPT0gXCJcIilcbiAgICAgICAgICBib2R5VG9TZW5kID0gbnVsbDtcbiAgICAgICAgbGV0IGJvZHlUb1NlbmRLU09OID0gSlNPTi5wYXJzZShib2R5VG9TZW5kKTtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlMjpib2R5VG9TZW5kS1NPTjpcIiwgYm9keVRvU2VuZEtTT04pO1xuXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGhvc3REZWYuVVJMICsgcGFyYW1ldGVyc1RvU2VuZDtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS11cmw6XCIsIHVybCk7XG5cblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IEh0dHBSZXF1ZXN0KFxuICAgICAgICAgIG9wdGlvbnMubWV0aG9kLCB1cmwsIGJvZHlUb1NlbmRLU09OLCBoZWFkZXJzKTtcblxuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLXJlcXVlc3Q6XCIsIHJlcXVlc3QsIFwiIGJvZHlUb1NlbmRLU09OOlwiLCBib2R5VG9TZW5kS1NPTilcbiAgICAgICAgbGV0IG1zZ0JvZHlBbGw6YW55O1xuICAgICAgICB0aGlzLnN5bmNGbGFnID0gMTtcbiAgICAgICAgLy9odHRwczovL2RldmVsb3BwYXBlci5jb20vZ2V0dGluZy1zdGFydGVkLXdpdGgtYW5ndWxhci1odHRwLWNsaWVudC9cbiAgICAgICAgdGhpcy5odHRwLnJlcXVlc3QocmVxdWVzdClcbiAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIgY2FsbCBzdWNjZXNzZnVsIHZhbHVlIHJldHVybmVkIGluIGJvZHlcIixcbiAgICAgICAgICAgICAgICByZXNwb25zZSk7XG4gICAgICAgICAgICAgIGxldCBtc2dCb2R5ID0gZ2V0Qm9keShyZXNwb25zZSlcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2dCb2R5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgbXNnQm9keUFsbCA9IG1zZ0JvZHk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJtc2dCb2R5QWxsOlwiLCBtc2dCb2R5QWxsKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIlBVVCBjYWxsIGluIGVycm9yOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgIHRoaXMuc3luY0ZsYWcgPSAwO1xuICAgICAgICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yIGNhbGxpbmc6IFwiICsgdXJsICsgXCI6XCIgKyBlcnJvci5lcnJvci5lcnJvcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIlRoZSAgb2JzZXJ2YWJsZSBpcyBub3cgY29tcGxldGVkOm1zZ0JvZHlBbGw6XCIsIG1zZ0JvZHlBbGwpO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG1zZ0JvZHlBbGwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdHVzID0gZXh0cmFjdFN0YXR1cyhydWxlTG9nLCBtc2dCb2R5QWxsKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tLS0tLS11bGVMb2cucnVsZTpcIiwgcnVsZUxvZy5ydWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChUcmlnZ2VyID09IFwiUE9TVF9RVUVSWVwiKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhSUQgPSBydWxlTG9nLnJ1bGUuUkVTUE9OU0VfREFUQV9JRDtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiVEFCUzpyZXNwb25zZURhdGFJRDpcIiwgcmVzcG9uc2VEYXRhSUQpO1xuXG4gICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhID0gZXh0cmFjdFJlc3BvbnNlRGF0YShtc2dCb2R5QWxsLCByZXNwb25zZURhdGFJRCk7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIlRBQlM6cmVzcG9uc2VEYXRhOlwiLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJUQUJTOnJ1bGVMb2cucnVsZS5SRVNQT05TRV9EQVRBX05BTUU6XCIsIHJ1bGVMb2cucnVsZS5SRVNQT05TRV9EQVRBX05BTUUpO1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNwb25zZURhdGEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W3J1bGVMb2cucnVsZS5SRVNQT05TRV9EQVRBX05BTUVdID0gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIlRBQlM6b2JqZWN0LnRhYnNBUElSZXNwb25zZTpcIiwgb2JqZWN0LnRhYnNBUElSZXNwb25zZSlcblxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN5bmNGbGFnID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLkxvZ1J1bGUob2JqZWN0LCBydWxlTG9nLCBtc2dCb2R5QWxsLCBzdGF0dXMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICk7XG4gICAgICAgIC8qXG4gICAgICBsZXQgcmVxTmV3ID0gdGhpcy5odHRwLnJlcXVlc3Qob3B0aW9ucywgZnVuY3Rpb24ocmVzcG9uc2UpeyBoYW5kbGVSZXNwb25zZShyZXNwb25zZSwgIHJ1bGVMb2cpOyB9KTtcbiAgICAgIHJlcU5ldy5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgLy8gSGFuZGxlIGVycm9yXG4gICAgICAgIGVycm9yID0gZXJyO1xuICAgICAgICBtc2cgPSBcIkVycm9yIHNlbmRpbmcgdG8gSG9zdCA6XCIgK3NlbmRUbyA7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKCBtc2cgKyBcIiBFcnJvcjpcIiArIGVyciApO1xuICAgICAgICB0aGlzLkxvZ1J1bGUocnVsZUxvZywgbXNnICsgXCIgRXJyb3I6XCIgKyBlcnIsIDQwMCApO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiaGVyZTFcIik7XG4gICAgICByZXFOZXcud3JpdGUoYm9keVRvU2VuZCk7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImhlcmUyXCIpO1xuICAgICAgcmVxTmV3LmVuZCgpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJoZXJlM1wiKTtcbiAgICAgICovXG4gICAgICB9XG5cbiAgICB9XG4gICAgbGV0IHN0YXR1c1JlYyA9IHtcbiAgICAgIHN0YXR1czogZXJyb3IsXG4gICAgICBtc2c6IG1zZ1xuICAgIH07XG5cbiAgICAvKmxldCBzdGF0dXMgPSAxO1xuICAgIGlmICghdmFsaWQpe1xuICAgICAgc3RhdHVzUmVjLnN0YXR1cyA9IDE7XG4gICAgICBzdGF0dXNSZWMubXNnID1cbiAgICB9Ki9cbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInZhbGlkOlwiLCB2YWxpZCwgXCIgc3RhdHVzOlwiLCBzdGF0dXNSZWMpO1xuXG4gICAgcmV0dXJuIChzdGF0dXNSZWMpO1xuXG4gIH1cbiAgcHVibGljIHNlbmRUb1NlcnZlcihvYmplY3Q6YW55LCBhY3Rpb25zQXJyOmFueSwgcXVlcnlEYXRhOmFueSwgcnVsZTphbnksIGFjdGlvbjphbnksIFRyaWdnZXI6YW55LCBob3N0c0FycjphbnksIGhvc3RzTWFwQXJyOmFueSkge1xuICAgIGZ1bmN0aW9uIGdldEVsbVZhbHVlKHBhcmFtRGF0YTphbnksIHF1ZXJ5RGF0YTphbnkpIHtcbiAgICAgIGZ1bmN0aW9uIGdldE9SREVSX0ZJRUxEU0RhdGEocGFyYW06YW55LCBvcmRlckZpZWxkczphbnkpIHtcbiAgICAgICAgbGV0IHZhbCA9IFwiXCI7XG4gICAgICAgIGlmIChvcmRlckZpZWxkcyAhPSBcIlwiKSB7XG4gICAgICAgICAgbGV0IGFycmF5ID0gcGFyYW0uc3BsaXQoXCIuXCIpO1xuICAgICAgICAgIGxldCBmaWVsZE5hbWUgPSBhcnJheVsxXTtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZmllbGROYW1lOlwiLCBmaWVsZE5hbWUsIFwiIG9yZGVyRmllbGRzOlwiLCBvcmRlckZpZWxkcyk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBvcmRlckZpZWxkcyAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICBvcmRlckZpZWxkcyA9IEpTT04ucGFyc2Uob3JkZXJGaWVsZHMpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm9yZGVyRmllbGRzOlwiLCBvcmRlckZpZWxkcyk7XG4gICAgICAgICAgICBsZXQgZmllbGRzRGF0YSA9IG9yZGVyRmllbGRzLmRhdGE7XG4gICAgICAgICAgICB2YWwgPSBmaWVsZHNEYXRhW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICAgIGxldCB2YWwgPSBwYXJhbURhdGE7XG4gICAgICB2YXIgbiA9IDA7XG5cbiAgICAgIG4gPSBwYXJhbURhdGEuc2VhcmNoKFwiOlwiKTtcbiAgICAgIGlmIChuICE9IC0xKSB7XG4gICAgICAgIGxldCBhcnJheSA9IHBhcmFtRGF0YS5zcGxpdChcIjpcIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSAhPSAwKSB7XG4gICAgICAgICAgICBuID0gYXJyYXlbaV0uc2VhcmNoKFwiIFwiKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJuOlwiLCBuLCBcImFycmF5W2ldOlwiLCBhcnJheVtpXSk7XG4gICAgICAgICAgICBpZiAobiA9PSAtMSlcbiAgICAgICAgICAgICAgbiA9IGFycmF5W2ldLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChuICE9IC0xKSB7XG4gICAgICAgICAgICAgIGxldCBwYXJhbSA9IGFycmF5W2ldLnNsaWNlKDAsIG4pO1xuICAgICAgICAgICAgICBwYXJhbSA9IHBhcmFtLnRyaW0oKTtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInBhcmFtOlwiICsgcGFyYW0pO1xuXG4gICAgICAgICAgICAgIGxldCBuaW5jbHVkZXM6YW55ID0gcGFyYW0uaW5jbHVkZXMoXCIuXCIpO1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibmluY2x1ZGVzOlwiLCBuaW5jbHVkZXMpO1xuICAgICAgICAgICAgICBpZiAobmluY2x1ZGVzID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBnZXRPUkRFUl9GSUVMRFNEYXRhKHBhcmFtLCBxdWVyeURhdGEuT1JERVJfRklFTERTKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdmFsID0gcXVlcnlEYXRhW3BhcmFtXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicGFyYW06XCIsIHBhcmFtLCBcIiB2YWw6XCIsIHZhbCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdmFsID09IFwic3RyaW5nXCIpXG4gICAgICAgIHZhbCA9IHZhbC5zcGxpdChcIidcIikuam9pbihcIlwiKTtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEhvc3Qoc2VuZFRvOmFueSwgaG9zdHNBcnI6YW55KSB7XG4gICAgICBsZXQgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IGhvc3RzQXJyLmxlbmd0aCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS1ob3N0c0FycltpXS5IT1NUX0lEIDpcIiwgaG9zdHNBcnJbaV0uSE9TVF9JRCwgXCIgc2VuZFRvOlwiLCBzZW5kVG8pO1xuICAgICAgICBpZiAoaG9zdHNBcnJbaV0uSE9TVF9JRCA9PSBzZW5kVG8pXG4gICAgICAgICAgcmV0dXJuIGhvc3RzQXJyW2ldO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRIb3N0TWFwKGhvc3REZWY6YW55LCBtYXBJRDphbnksIGhvc3RzTWFwQXJyOmFueSkge1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tbWFwSUQ6XCIsIG1hcElELCBcIiBob3N0RGVmLk1BUF9JRDpcIiwgaG9zdERlZi5NQVBfSUQpO1xuICAgICAgaWYgKChtYXBJRCAhPSBudWxsKSAmJiAobWFwSUQgIT0gXCJcIikpIHtcbiAgICAgICAgd2hpbGUgKGkgPCBob3N0c01hcEFyci5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoKGhvc3RzTWFwQXJyW2ldLkhPU1RfSUQgPT0gaG9zdERlZi5IT1NUX0lEKSAmJiAobWFwSUQgPT0gaG9zdHNNYXBBcnJbaV0uTUFQX0lEKSlcbiAgICAgICAgICAgIHJldHVybiBob3N0c01hcEFycltpXTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqYWN0aW9uc0FycjpcIiwgYWN0aW9uc0Fycik7XG4gICAgbGV0IHN0YXR1c1JlYztcbiAgICBsZXQgc2VuZFRvID0gYWN0aW9uc0Fyci5TRU5EX1RPO1xuICAgIGxldCBxcnlQYXJhbTphbnkgPSB7fTtcbiAgICBsZXQgaGVhZGVyUGFyYW06YW55ID0ge307XG4gICAgbGV0IGJvZHlUb1NlbmRBcnI6YW55ID0gW107XG4gICAgbGV0IGJvZHlUb1NlbmQgPSBcIlwiO1xuICAgIGxldCBwYXJhbWV0ZXJzVG9TZW5kID0gXCJcIjtcbiAgICBsZXQgaG9zdERlZiA9IGdldEhvc3Qoc2VuZFRvLCBob3N0c0Fycik7XG4gICAgbGV0IGhvc3RNYXBEZWYgPSBnZXRIb3N0TWFwKGhvc3REZWYsIGFjdGlvbi5NQVBfSUQsIGhvc3RzTWFwQXJyKTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImhvc3RNYXBEZWY6XCIsIGhvc3RNYXBEZWYpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIqKioqaG9zdERlZi5IRUFERVI6XCIsIGhvc3REZWYuSEVBREVSKTtcblxuICAgIGlmICgoaG9zdERlZi5IRUFERVIgIT0gbnVsbCkgJiYgKGhvc3REZWYuSEVBREVSICE9IFwiXCIpKSB7XG4gICAgICBsZXQgYXJyYXkgPSBob3N0RGVmLkhFQURFUi5zcGxpdChcIlxcblwiKTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYXJyYXk6XCIsIGFycmF5LCBcIiBhcnJheS5sZW5ndGg6XCIsIGFycmF5Lmxlbmd0aCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGVsZW0gPSBhcnJheVtpXTtcbiAgICAgICAgbGV0IGFycmF5UGFyYW0gPSBlbGVtLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgbGV0IHBhcmFtID0gYXJyYXlQYXJhbVswXTtcbiAgICAgICAgcGFyYW0gPSBwYXJhbS50cmltKCk7XG4gICAgICAgIGxldCBwYXJhbURhdGEgPSBhcnJheVBhcmFtWzFdO1xuICAgICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEudHJpbSgpO1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBhcmFtRGF0YTpcIiwgcGFyYW1EYXRhKTtcbiAgICAgICAgcGFyYW1EYXRhID0gZ2V0RWxtVmFsdWUocGFyYW1EYXRhLCBxdWVyeURhdGEpO1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tcGFyYW06XCIsIHBhcmFtLCBcIiBwYXJhbURhdGE6XCIsIHBhcmFtRGF0YSk7XG4gICAgICAgIGhlYWRlclBhcmFtW3BhcmFtXSA9IHBhcmFtRGF0YTtcbiAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgaWYgKChhY3Rpb25zQXJyLkJPRFlfREFUQSAhPSBudWxsKSAmJiAoYWN0aW9uc0Fyci5CT0RZX0RBVEEgIT0gXCJcIikpIHtcbiAgICAgIGxldCBib2R5RGF0YSA9IGFjdGlvbnNBcnIuQk9EWV9EQVRBO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJib2R5RGF0YTpcIiwgYm9keURhdGEpO1xuICAgICAgbGV0IGFycmF5ID0gYm9keURhdGEuc3BsaXQoXCIsXCIpO1xuICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImFycmF5OlwiLCBhcnJheSwgXCIgYXJyYXkubGVuZ3RoOlwiLCBhcnJheS5sZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBlbGVtID0gYXJyYXlbaV07XG4gICAgICAgIGxldCBhcnJheVBhcmFtID0gZWxlbS5zcGxpdChcIj1cIik7XG4gICAgICAgIGxldCBwYXJhbSA9IGFycmF5UGFyYW1bMF07XG4gICAgICAgIHBhcmFtID0gcGFyYW0udHJpbSgpO1xuICAgICAgICBsZXQgcGFyYW1EYXRhID0gYXJyYXlQYXJhbVsxXTtcbiAgICAgICAgcGFyYW1EYXRhID0gcGFyYW1EYXRhLnRyaW0oKTtcbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBhcmFtRGF0YTpcIiwgcGFyYW1EYXRhKTtcbiAgICAgICAgcGFyYW1EYXRhID0gZ2V0RWxtVmFsdWUocGFyYW1EYXRhLCBxdWVyeURhdGEpO1xuICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1wYXJhbTpcIiwgcGFyYW0sIFwiIHBhcmFtRGF0YTpcIiwgcGFyYW1EYXRhKTtcbiAgICAgICAgcXJ5UGFyYW1bcGFyYW1dID0gcGFyYW1EYXRhO1xuICAgICAgfVxuICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInFyeVBhcmFtOmhlcmVcIik7XG4gICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicXJ5UGFyYW06XCIsIHFyeVBhcmFtICwgXCIgcXJ5UGFyYW0ubGVuZ3RoIDpcIiwgT2JqZWN0LmtleXMocXJ5UGFyYW0pLmxlbmd0aCk7XG4gICAgICBib2R5VG9TZW5kQXJyLnB1c2gocXJ5UGFyYW0pO1xuICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tLWhvc3REZWY6XCIsIGhvc3REZWYpOy8vZnVhZFxuXG4gICAgICBpZiAoYm9keVRvU2VuZEFyci5sZW5ndGggIT0gMCkge1xuICAgICAgICAvKmlmICggKGhvc3RNYXBEZWYgIT0gbnVsbCkgJiYgIChob3N0TWFwRGVmLlhTTFRfU0VORCAhPSBudWxsKSAmJiAoaG9zdE1hcERlZi5YU0xUX1NFTkQgIT0gXCJcIikgKVxuICAgICAgICB7XG4gICAgICAgICAge1xuICAgICAgICAgICAgYm9keVRvU2VuZCA9IHhzbHRtYXAubWFwRGF0YShib2R5VG9TZW5kQXJyLCBob3N0TWFwRGVmLlhTTFRfU0VORCk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7Ki9cbiAgICAgICAgYm9keVRvU2VuZCA9IEpTT04uc3RyaW5naWZ5KGJvZHlUb1NlbmRBcnIpXG4gICAgICAgIC8vfVxuICAgICAgfVxuICAgICAgLypcbiAgICAgIGxldCBoZXhvdXQgPSBoZXhkdW1wKGJvZHlUb1NlbmQsIDE2KSA7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImhleG91dDpcIixoZXhvdXQpO1xuICAgICAgKi9cbiAgICB9XG5cbiAgICBpZiAoKGFjdGlvbnNBcnIuUEFSQU1FVEVSX0RBVEEgIT0gbnVsbCkgJiYgKGFjdGlvbnNBcnIuUEFSQU1FVEVSX0RBVEEgIT0gXCJcIikpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJEYXRhID0gYWN0aW9uc0Fyci5QQVJBTUVURVJfREFUQTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicGFyYW1ldGVyRGF0YTpcIiwgcGFyYW1ldGVyRGF0YSk7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBhcmFtZXRlckRhdGEubGVuZ3RoOlwiLCBwYXJhbWV0ZXJEYXRhLmxlbmd0aCk7XG5cblxuICAgICAgbGV0IGFycmF5ID0gcGFyYW1ldGVyRGF0YS5zcGxpdChcIixcIik7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImFycmF5OlwiLCBhcnJheSwgXCIgYXJyYXkubGVuZ3RoOlwiLCBhcnJheS5sZW5ndGgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZWxlbSA9IGFycmF5W2ldO1xuICAgICAgICBsZXQgYXJyYXlQYXJhbSA9IGVsZW0uc3BsaXQoXCI9XCIpO1xuICAgICAgICBsZXQgcGFyYW0gPSBhcnJheVBhcmFtWzBdO1xuICAgICAgICBwYXJhbSA9IHBhcmFtLnRyaW0oKTtcbiAgICAgICAgbGV0IHBhcmFtRGF0YSA9IGFycmF5UGFyYW1bMV07XG4gICAgICAgIHBhcmFtRGF0YSA9IHBhcmFtRGF0YS50cmltKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicGFyYW1EYXRhOlwiLCBwYXJhbURhdGEpO1xuICAgICAgICBwYXJhbURhdGEgPSBnZXRFbG1WYWx1ZShwYXJhbURhdGEsIHF1ZXJ5RGF0YSk7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1wYXJhbTpcIiwgcGFyYW0sIFwiIHBhcmFtRGF0YTpcIiwgcGFyYW1EYXRhKTtcbiAgICAgICAgaWYgKHBhcmFtZXRlcnNUb1NlbmQgPT0gXCJcIilcbiAgICAgICAgICBwYXJhbWV0ZXJzVG9TZW5kID0gXCI/XCIgKyBwYXJhbSArIFwiPVwiICsgcGFyYW1EYXRhO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyYW1ldGVyc1RvU2VuZCA9IHBhcmFtZXRlcnNUb1NlbmQgKyBcIiZcIiArIHBhcmFtICsgXCI9XCIgKyBwYXJhbURhdGE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJib2R5VG9TZW5kOlwiLCBib2R5VG9TZW5kKTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInBhcmFtZXRlcnNUb1NlbmQ6XCIsIHBhcmFtZXRlcnNUb1NlbmQpO1xuXG4gICAgc3RhdHVzUmVjID0gdGhpcy5wZXJmb3JtSHR0cFBvc3Qob2JqZWN0LCBib2R5VG9TZW5kLCBwYXJhbWV0ZXJzVG9TZW5kLCBzZW5kVG8sIHF1ZXJ5RGF0YSwgcnVsZSwgYWN0aW9uLCBUcmlnZ2VyLCBob3N0RGVmLCBob3N0TWFwRGVmLCBoZWFkZXJQYXJhbSk7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwb3N0IHBlcmZvcm1IdHRwUG9zdDogc3RhdHVzOlwiLCBzdGF0dXNSZWMpO1xuICAgIHJldHVybiBzdGF0dXNSZWM7XG5cblxuXG5cblxuICB9XG4gIHB1YmxpYyBwZXJmb3JtQWN0aW9uKG9iamVjdDphbnksIHFyeTphbnksIHB0cjphbnksIHF1ZXJ5RGF0YTphbnksIHJ1bGU6YW55LCBydWxlc0RlZjphbnksIFRyaWdnZXI6YW55LCBob3N0c0FycjphbnksIGhvc3RzTWFwQXJyOmFueSkge1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tcGVyZm9ybUFjdGlvbjpydWxlc0RlZjpcIiwgcnVsZXNEZWYpO1xuICAgIGxldCBzdGF0dXMgPSAwO1xuICAgIGxldCBzdGF0dXNSZWMgPSB7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBtc2c6IFwiXCJcbiAgICB9O1xuXG4gICAgbGV0IGFjdGlvblB0ciA9IHJ1bGVzRGVmLmFjdGlvblB0cnNBcnJbcXJ5XTtcbiAgICBpZiAodHlwZW9mIGFjdGlvblB0ciAhPT0gXCJ1bmRlZmluZWRcIikge1xuXG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInB0cjpcIiwgcHRyKTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYWN0aW9uUHRyOlwiLCBhY3Rpb25QdHIpO1xuICAgICAgbGV0IGkgPSBwdHI7XG4gICAgICBsZXQgcHRyMiA9IFwiXCI7XG5cbiAgICAgIGxldCBwdHIxID0gYWN0aW9uUHRyW2ldO1xuXG4gICAgICBpZiAodHlwZW9mIGFjdGlvblB0cltpICsgMV0gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHB0cjIgPSBhY3Rpb25QdHJbaSArIDFdO1xuICAgICAgZWxzZVxuICAgICAgICBwdHIyID0gcnVsZXNEZWYuYWN0aW9uc0Fyci5sZW5ndGhcblxuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwdHIxOlwiLCBwdHIxLCBcIiBwdHIyOlwiLCBwdHIyKTtcbiAgICAgIGxldCBqID0gcHRyMTtcbiAgICAgIGxldCBydWxlSUQgPSBydWxlc0RlZi5hY3Rpb25zQXJyW2pdLlJVTEVfSUQ7XG4gICAgICB3aGlsZSAoKGogPCBwdHIyKSAmJiAoc3RhdHVzID09IDApKSB7XG4gICAgICAgIGlmIChydWxlSUQgIT0gcnVsZXNEZWYuYWN0aW9uc0FycltqXS5SVUxFX0lEKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJ1bGVzRGVmLmFjdGlvbnNBcnI6XCIscnVsZXNEZWYuYWN0aW9uc0FycltqXSk7XG4gICAgICAgIGlmICgocnVsZXNEZWYuYWN0aW9uc0FycltqXS5BQ1RJT05fQ09ERSA9PSBcIlNFTkRcIikgfHwgKHJ1bGVzRGVmLmFjdGlvbnNBcnJbal0uQUNUSU9OX0NPREUgPT0gXCJTRU5EX1dBSVRcIikpIHtcbiAgICAgICAgICBzdGF0dXNSZWMgPSB0aGlzLnNlbmRUb1NlcnZlcihvYmplY3QsIHJ1bGVzRGVmLmFjdGlvbnNBcnJbal0sIHF1ZXJ5RGF0YSwgcnVsZSwgcnVsZXNEZWYuYWN0aW9uc0FycltqXSwgVHJpZ2dlciwgaG9zdHNBcnIsIGhvc3RzTWFwQXJyKTtcbiAgICAgICAgICBzdGF0dXMgPSBzdGF0dXNSZWMuc3RhdHVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCBydWxlc0RlZi5hY3Rpb25zQXJyW2pdLkFDVElPTl9DT0RFID09IFwiRVJST1JcIiApIHtcbiAgICAgICAgICBsZXQgc3RhdHVzUmVjID17XG4gICAgICAgICAgICBzdGF0dXMgOiAtMSxcbiAgICAgICAgICAgIG1zZyA6IHJ1bGVzRGVmLmFjdGlvbnNBcnJbal0uQk9EWV9EQVRBXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gc3RhdHVzUmVjO1xuICAgICAgICB9XG4gICAgICAgIGorKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXR1c1JlYztcblxuICB9XG5cbiAgcHVibGljIGNoZWNrUnVsZXNCeVRyaWdnZXIob2JqZWN0OmFueSwgcnVsZXNEZWY6YW55LCBxdWVyeURhdGE6YW55LCBUcmlnZ2VyOmFueSwgcm91dGluZV9uYW1lOmFueSwgaG9zdHNBcnI6YW55LCBob3N0c01hcEFycjphbnkpIHtcbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiY2hlY2tSdWxlc0J5VHJpZ2dlcjpydWxlc0RlZjpcIiwgcnVsZXNEZWYsIFwiIHF1ZXJ5RGF0YTpcIiwgcXVlcnlEYXRhKTtcbiAgICBmdW5jdGlvbiBnZXRGaWVsZERhdGEocnVsZTphbnksIHF1ZXJ5RGF0YTphbnkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgZmllbGREYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgYXJyYXkgPSBydWxlLkZJRUxELnNwbGl0IChcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhcnJheTpcIixhcnJheSlcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3JkZXJGaWVsZHMgPSBxdWVyeURhdGFbXCJPUkRFUl9GSUVMRFNcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwib3JkZXJGaWVsZHM6XCIsb3JkZXJGaWVsZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9yZGVyRmllbGRzICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yZGVyRmllbGRzICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmllbGRzRGF0YSA9IEpTT04ucGFyc2Uob3JkZXJGaWVsZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJmaWVsZHNEYXRhOlwiLGZpZWxkc0RhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhmaWVsZHNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtleXM6XCIsa2V5cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0wOyBqPCBrZXlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZGRPcmRlckZpZWxkcyBrZXk6XCIsIGtleXNbal0gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXlzW2pdID09IGFycmF5WzBdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9iakRhdGEgPSBmaWVsZHNEYXRhW2tleXNbal1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwib2JqRGF0YTpcIiwgb2JqRGF0YSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChvYmpEYXRhLmxlbmd0aCkgPT0gXCJ1bmRlZmluZWRcIikgIC8vIGl0IGlzIGEgZm9ybSAob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGREYXRhID0gb2JqRGF0YVthcnJheVsxXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBpdCBpcyBhIGdyaWQgKGFycmF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKG9iakRhdGFbMF0pICE9IFwidW5kZWZpbmVkXCIpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGREYXRhID0gb2JqRGF0YVswXVthcnJheVsxXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkRGF0YSA9IHF1ZXJ5RGF0YVtydWxlLkZJRUxEXSA7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZERhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNoZWNrUnVsZShydWxlOmFueSwgcXVlcnlEYXRhOmFueSl7XG4gICAgICBsZXQgcnVsZU1hdGNoID0gZmFsc2U7XG4gICAgICAvL2lmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tcnVsZTpcIiwgcnVsZSwgXCIgcXVlcnlEYXRhOlwiLCBxdWVyeURhdGEpO1xuICAgICAgLy9sZXQgZmllbGREYXRhID0gcXVlcnlEYXRhW3J1bGUuRklFTERdO1xuICAgICAgbGV0IGZpZWxkRGF0YSA9IGdldEZpZWxkRGF0YShydWxlLCBxdWVyeURhdGEpO1xuXG4gICAgICBzd2l0Y2ggKHJ1bGUuT1BFUkFUSU9OKSB7XG4gICAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgICAgaWYgKGZpZWxkRGF0YSA9PSBydWxlLkZJRUxEX1ZBTFVFKSB7XG4gICAgICAgICAgICBydWxlTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIjxcIjpcbiAgICAgICAgICBpZiAoZmllbGREYXRhIDwgcnVsZS5GSUVMRF9WQUxVRSkge1xuICAgICAgICAgICAgcnVsZU1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCI8PVwiOlxuICAgICAgICAgIGlmIChmaWVsZERhdGEgPD0gcnVsZS5GSUVMRF9WQUxVRSkge1xuICAgICAgICAgICAgcnVsZU1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgICAgaWYgKGZpZWxkRGF0YSA+IHJ1bGUuRklFTERfVkFMVUUpIHtcbiAgICAgICAgICAgIHJ1bGVNYXRjaCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiPj1cIjpcbiAgICAgICAgICBpZiAoZmllbGREYXRhID49IHJ1bGUuRklFTERfVkFMVUUpIHtcbiAgICAgICAgICAgIHJ1bGVNYXRjaCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiPD5cIjpcbiAgICAgICAgICBpZiAoZmllbGREYXRhICE9IHJ1bGUuRklFTERfVkFMVUUpIHtcbiAgICAgICAgICAgIHJ1bGVNYXRjaCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiSU5TVFJcIjpcbiAgICAgICAgICBpZiAocnVsZS5GSUVMRF9WQUxVRS5zZWFyY2goZmllbGREYXRhKSAhPSAtMSkge1xuICAgICAgICAgICAgcnVsZU1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcnVsZU1hdGNoID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhcInRlc3QzOnJ1bGVNYXRjaDpcIiwgcnVsZU1hdGNoLCBcIiBmaWVsZERhdGE6XCIsIGZpZWxkRGF0YSwgXCIgT1BFUkFUSU9OOlwiLCBydWxlLk9QRVJBVElPTiwgXCIgRklFTERfVkFMVUU6XCIsIHJ1bGUuRklFTERfVkFMVUUpO1xuICAgICAgcmV0dXJuIHJ1bGVNYXRjaDtcblxuICAgIH1cblxuICAgIGxldCBzdGF0dXMgPSAwO1xuICAgIGxldCBzdGF0dXNSZWMgPSB7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBtc2c6IFwiXCJcbiAgICB9O1xuXG4gICAgbGV0IHFyeSA9IHF1ZXJ5RGF0YS5fUVVFUlk7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS0tLS0tLSBfUVVFUlk6XCIsIHF1ZXJ5RGF0YS5fUVVFUlksIFwiIHJ1bGVzRGVmLnJ1bGVQdHJzQXJyOlwiLCBydWxlc0RlZi5ydWxlUHRyc0Fycik7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVja2luZyBydWxlc0RlZi5ydWxlUHRyc0FycjpcIiwgcnVsZXNEZWYucnVsZVB0cnNBcnIpO1xuICAgIGxldCBydWxlUHRyID0gcnVsZXNEZWYucnVsZVB0cnNBcnJbcXJ5XTtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJ1bGVQdHI6XCIsIHJ1bGVQdHIpO1xuXG4gICAgaWYgKHR5cGVvZiBydWxlUHRyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAvL2xldCBhY3Rpb25QdHIgPSBydWxlc0RlZi5ydWxlUHRyc0FycltxcnldO1xuICAgICAgLy9pZiAodHlwZW9mIGFjdGlvblB0ciAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgLy93aGlsZSAoIChpPHJ1bGVQdHIubGVuZ3RoKSAmJiAoc3RhdHVzID09IDApIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcHRyMSA9IHJ1bGVQdHJbaV07XG4gICAgICAgICAgICB2YXIgcHRyMiA9IHJ1bGVQdHJbcnVsZVB0ci5sZW5ndGggLTFdO1xuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiBydWxlUHRyW2krMV0gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAvLyAgICAgdmFyIHB0cjIgPSBydWxlUHRyW2krMV07XG4gICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICAvLyAgICAgLy92YXIgcHRyMiA9IHJ1bGVzRGVmLnJ1bGVzQXJyLmxlbmd0aFxuICAgICAgICAgICAgLy8gICAgIHZhciBwdHIyID0gcHRyMVxuXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdHIxOlwiLHB0cjEsIFwiIHB0cjI6XCIsIHB0cjIpO1xuICAgICAgICAgICAgICB2YXIgaiA9IHB0cjE7XG4gICAgICAgICAgICAgIHdoaWxlICggaiA8PSBwdHIyKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS1ydWxlc0RlZi5ydWxlc0FycjpcIiwgcnVsZXNEZWYucnVsZXNBcnJbal0uUlVMRV9JRCwgXCIgaXRlbTpcIiwgcnVsZXNEZWYucnVsZXNBcnJbal0uSVRFTSk7XG4gICAgICAgICAgICAgICAgICB2YXIgcnVsZU1hdGNoOmFueSA9IGNoZWNrUnVsZShydWxlc0RlZi5ydWxlc0FycltqXSwgcXVlcnlEYXRhKTtcbiAgICAgICAgICAgICAgICAgIGlmIChydWxlTWF0Y2ggPT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVja1J1bGVzQnlUcmlnZ2VyOkNvbmRpdGlvbnMgcnVsZU1hdGNoOlwiLCBydWxlTWF0Y2gsIFwiIGZvciBydWxlOlwiLCBydWxlc0RlZi5ydWxlc0FycltwdHIxXS5SVUxFX0lEKTtcbiAgICAgICAgICAgICAgaWYgKHJ1bGVNYXRjaCA9PSB0cnVlKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAvL3N0YXR1c1JlYyA9IHBlcmZvcm1BY3Rpb24oZGIscmVxLCBxcnksIGksIHF1ZXJ5RGF0YSwgcnVsZXNEZWYucnVsZXNBcnJbcHRyMV0scnVsZXNEZWYsIFRyaWdnZXIgKTtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c1JlYyA9IHRoaXMucGVyZm9ybUFjdGlvbiggIG9iamVjdCwgcXJ5LCBpLCBxdWVyeURhdGEsIHJ1bGVzRGVmLnJ1bGVzQXJyW3B0cjFdLHJ1bGVzRGVmLCBUcmlnZ2VyICxob3N0c0FyciwgaG9zdHNNYXBBcnIpO1xuICAgICAgICAgICAgICAgICAgc3RhdHVzID0gc3RhdHVzUmVjLnN0YXR1cztcblxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy9pZiAocnVsZU1hdGNoID09IGZhbHNlKVxuICAgICAgICAgICAgICAvLyAgYnJlYWs7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICB9XG5cblxuICAgIH1cbiAgICByZXR1cm4gc3RhdHVzUmVjO1xuICB9XG5cbiAgcHVibGljIGNoZWNrUnVsZXMob2JqZWN0OmFueSwgcnVsZXNEZWY6YW55LCBhY3R1YWxSZXN1bHQ6YW55LCBUcmlnZ2VyOmFueSkge1xuICAgIHZhciBzdGF0dXNSZWM6YW55ID0ge307XG4gICAgaWYodGhpcy5wYXJhbUNvbmZpZy5pc0NoZWNrUnVsZXMgPT0gZmFsc2UpXG4gICAgICByZXR1cm4gc3RhdHVzUmVjO1xuXG4gICAgLy9yZXR1cm47XG5cblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiY2hlY2tSdWxlczpcIiwgVHJpZ2dlciwgXCIgcm91dGluZV9uYW1lOlwiLCB0aGlzLnJvdXRpbmVfbmFtZSwgXCIgYWN0dWFsUmVzdWx0OlwiLCBhY3R1YWxSZXN1bHQpXG5cbiAgICBpZiAoVHJpZ2dlciA9PSBcIlBPU1RfUVVFUllcIikge1xuICAgICAgaWYgKHR5cGVvZiBhY3R1YWxSZXN1bHQuZGF0YVswXSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBsZXQgdHJhbnNEYXRhID0gYWN0dWFsUmVzdWx0LmRhdGFbMF0uZGF0YTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImNoZWNrUnVsZXM6dHJhbnNEYXRhW2ldOlwiLCB0cmFuc0RhdGFbaV0sIGkpO1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiY2hlY2tSdWxlczphY3R1YWxSZXN1bHQuZGF0YVswXS5xdWVyeTpcIiwgYWN0dWFsUmVzdWx0LmRhdGFbMF0ucXVlcnkpXG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVja1J1bGVzOmFjdHVhbFJlc3VsdC5kYXRhWzBdIEhGIHBsZWFzZVwiLCBhY3R1YWxSZXN1bHQuZGF0YVswXS5kYXRhKTtcbiAgICAgICAgICBsZXQgcXVlcnlEYXRhID0gdHJhbnNEYXRhW2ldO1xuICAgICAgICAgIHF1ZXJ5RGF0YVtcIl9RVUVSWVwiXSA9IGFjdHVhbFJlc3VsdC5kYXRhWzBdLnF1ZXJ5O1xuICAgICAgICAgIC8vICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicXVlcnlEYXRhOlwiLCBxdWVyeURhdGEpXG4gICAgICAgICAgICBzdGF0dXNSZWMgPSB0aGlzLmNoZWNrUnVsZXNCeVRyaWdnZXIob2JqZWN0LCBydWxlc0RlZiwgcXVlcnlEYXRhLCBUcmlnZ2VyLCB0aGlzLnJvdXRpbmVfbmFtZSwgdGhpcy5ob3N0c0FyciwgdGhpcy5ob3N0c01hcEFycik7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInN0YXR1c1JlYzpQT1NUX1FVRVJZOlwiLCBzdGF0dXNSZWMpO1xuICAgICAgICAgIGlmIChzdGF0dXNSZWNbJ3N0YXR1cyddICA9PSAtMSl7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoVHJpZ2dlciA9PSBcIlBSRV9RVUVSWVwiKSB7XG5cbiAgICAgIGlmICh0eXBlb2YgYWN0dWFsUmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0dWFsUmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJhY3R1YWxSZXN1bHRbaV06XCIsIGFjdHVhbFJlc3VsdFtpXSlcbiAgICAgICAgICBsZXQgcXVlcnlEYXRhID0gYWN0dWFsUmVzdWx0W2ldO1xuICAgICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicXVlcnlEYXRhOlwiLCBxdWVyeURhdGEpXG4gICAgICAgICAgICBzdGF0dXNSZWMgPSB0aGlzLmNoZWNrUnVsZXNCeVRyaWdnZXIob2JqZWN0LCBydWxlc0RlZiwgcXVlcnlEYXRhLCBUcmlnZ2VyLCB0aGlzLnJvdXRpbmVfbmFtZSwgdGhpcy5ob3N0c0FyciwgdGhpcy5ob3N0c01hcEFycik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJjaGVja1J1bGVzOkRvbmVcIiwgVHJpZ2dlciwgXCIgcm91dGluZV9uYW1lOlwiLCB0aGlzLnJvdXRpbmVfbmFtZSwgXCIgYWN0dWFsUmVzdWx0OlwiLCBhY3R1YWxSZXN1bHQpO1xuICAgIHJldHVybiBzdGF0dXNSZWM7XG5cbiAgfVxuICAvLy8vLy8vLy8vLy8vL1xuICBwdWJsaWMgc3RvcmVBY3Rpb25zUHRycyhhY3Rpb25zOmFueSwgcnVsZXNEZWY6YW55KSB7XG4gICAgbGV0IGN1cnJlbnRRVUVSWV9ERUYgPSBcIlwiO1xuICAgIGxldCBjdXJyZW50UlVMRV9JRCA9IFwiXCI7XG4gICAgbGV0IGFjdGlvblB0cnM6YW55ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICgoY3VycmVudFFVRVJZX0RFRiAhPSBhY3Rpb25zW2ldLlFVRVJZX0RFRikgJiYgKGN1cnJlbnRSVUxFX0lEICE9IGFjdGlvbnNbaV0uUlVMRV9JRCkpIHtcbiAgICAgICAgaWYgKGkgPT0gMClcbiAgICAgICAgICBhY3Rpb25QdHJzLnB1c2goaSk7XG4gICAgICAgIGlmIChjdXJyZW50UVVFUllfREVGICE9IFwiXCIpIHtcbiAgICAgICAgICBydWxlc0RlZi5hY3Rpb25QdHJzQXJyW2N1cnJlbnRRVUVSWV9ERUZdID0gYWN0aW9uUHRycztcbiAgICAgICAgICBhY3Rpb25QdHJzID0gW107XG4gICAgICAgICAgYWN0aW9uUHRycy5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFFVRVJZX0RFRiA9IGFjdGlvbnNbaV0uUVVFUllfREVGO1xuICAgICAgICBjdXJyZW50UlVMRV9JRCA9IGFjdGlvbnNbaV0uUlVMRV9JRDtcbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJ1bGVQdHJzMTpcIixydWxlUHRycyk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKChjdXJyZW50UVVFUllfREVGID09IGFjdGlvbnNbaV0uUVVFUllfREVGKSAmJiAoY3VycmVudFJVTEVfSUQgIT0gYWN0aW9uc1tpXS5SVUxFX0lEKSkge1xuICAgICAgICBjdXJyZW50UlVMRV9JRCA9IGFjdGlvbnNbaV0uUlVMRV9JRDtcbiAgICAgICAgYWN0aW9uUHRycy5wdXNoKGkpO1xuXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImFjdGlvblB0cnMyOlwiLCBhY3Rpb25QdHJzKTtcbiAgICB9XG4gICAgLy9hY3Rpb25QdHJzLnB1c2goaSk7XG4gICAgcnVsZXNEZWYuYWN0aW9uUHRyc0FycltjdXJyZW50UVVFUllfREVGXSA9IGFjdGlvblB0cnM7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJydWxlc0RlZi5hY3Rpb25QdHJzQXJyOlwiLCBydWxlc0RlZi5hY3Rpb25QdHJzQXJyKTtcbiAgfVxuXG5cblxuICBwdWJsaWMgc3RvcmVSdWxlc1B0cnMocnVsZXM6YW55LCBydWxlc0RlZjphbnkpIHtcbiAgICBsZXQgY3VycmVudFFVRVJZX0RFRiA9IFwiXCI7XG4gICAgbGV0IGN1cnJlbnRSVUxFX0lEID0gXCJcIjtcbiAgICBsZXQgcnVsZVB0cnM6YW55ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhydWxlc1tpXS5RVUVSWV9ERUYgKyBcIiA6IFwiICsgcnVsZXNbaV0uUlVMRV9JRCArIFwiICAgICAgICAgIFwiICsgY3VycmVudFFVRVJZX0RFRiArIFwiIDogXCIgKyBjdXJyZW50UlVMRV9JRCk7XG4gICAgICBpZiAoKGN1cnJlbnRRVUVSWV9ERUYgIT0gcnVsZXNbaV0uUVVFUllfREVGKSAmJiAoY3VycmVudFJVTEVfSUQgIT0gcnVsZXNbaV0uUlVMRV9JRCkpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIgbm90IGVxdWFsXCIpO1xuICAgICAgICBpZiAoaSA9PSAwKVxuICAgICAgICAgIHJ1bGVQdHJzLnB1c2goaSk7XG4gICAgICAgIGlmIChjdXJyZW50UVVFUllfREVGICE9IFwiXCIpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIi0tc3RvcmluZyBydWxlUHRyczI6XCIsIHJ1bGVQdHJzKTtcbiAgICAgICAgICBydWxlc0RlZi5ydWxlUHRyc0FycltjdXJyZW50UVVFUllfREVGXSA9IHJ1bGVQdHJzO1xuICAgICAgICAgIHJ1bGVQdHJzID0gW107XG4gICAgICAgICAgcnVsZVB0cnMucHVzaChpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRRVUVSWV9ERUYgPSBydWxlc1tpXS5RVUVSWV9ERUY7XG4gICAgICAgIGN1cnJlbnRSVUxFX0lEID0gcnVsZXNbaV0uUlVMRV9JRDtcbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJ1bGVQdHJzMTpcIixydWxlUHRycyk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKChjdXJyZW50UVVFUllfREVGID09IHJ1bGVzW2ldLlFVRVJZX0RFRikgJiYgKGN1cnJlbnRSVUxFX0lEICE9IHJ1bGVzW2ldLlJVTEVfSUQpKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiIG5vdCBlcXVhbDJcIik7XG4gICAgICAgIHJ1bGVQdHJzLnB1c2goaSk7XG4gICAgICAgIGN1cnJlbnRSVUxFX0lEID0gcnVsZXNbaV0uUlVMRV9JRDtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJydWxlUHRyczI6XCIsIHJ1bGVQdHJzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicnVsZVB0cnMyOlwiLCBydWxlUHRycyk7XG4gICAgfVxuICAgIC8vcnVsZVB0cnMucHVzaChpKTtcbiAgICBydWxlc0RlZi5ydWxlUHRyc0FycltjdXJyZW50UVVFUllfREVGXSA9IHJ1bGVQdHJzO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDM6cnVsZXNEZWYucnVsZVB0cnNBcnI6XCIsIHJ1bGVzRGVmLnJ1bGVQdHJzQXJyKTtcbiAgfVxuXG4gIC8vLy8vLy8vLy8vLy8vXG4gIHB1YmxpYyBsb2FkUnVsZXMob2JqZWN0OmFueSkge1xuXG4gICAgb2JqZWN0LkJvZHkgPSBbXTtcbiAgICBsZXQgUGFnZSA9IFwiXCI7XG4gICAgbGV0IE5ld1ZhbDphbnkgPSB7fTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9BRE1fUlVMRV9ERUZfUlVMRV9JVEVNXCI7XG4gICAgTmV3VmFsW1wiUlVMRV9UUklHR0VSXCJdID0gXCJQT1NUX1FVRVJZXCI7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Ok5ld1ZhbDpcIiwgTmV3VmFsKVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDpvYmplY3QuQm9keTpcIiwgb2JqZWN0LkJvZHkpXG4gICAgb2JqZWN0LmFkZFRvQm9keShOZXdWYWwpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Om9iamVjdC5Cb2R5OlwiLCBvYmplY3QuQm9keSlcbiAgICBOZXdWYWwgPSB7fTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9BRE1fUlVMRV9ERUZfUlVMRV9BQ1RJT05cIjtcbiAgICBOZXdWYWxbXCJSVUxFX1RSSUdHRVJcIl0gPSBcIlBPU1RfUVVFUllcIjtcbiAgICBvYmplY3QuYWRkVG9Cb2R5KE5ld1ZhbCk7XG5cbiAgICBOZXdWYWwgPSB7fTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9BRE1fUlVMRV9IT1NUXCI7XG4gICAgTmV3VmFsW1wiSE9TVF9JRFwiXSA9IFwiJVwiO1xuICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcblxuICAgIE5ld1ZhbCA9IHt9O1xuICAgIE5ld1ZhbFtcIl9RVUVSWVwiXSA9IFwiR0VUX0FETV9SVUxFX0hPU1RfTUFQXCI7XG4gICAgTmV3VmFsW1wiSE9TVF9JRFwiXSA9IFwiJVwiO1xuICAgIE5ld1ZhbFtcIk1BUF9JRFwiXSA9IFwiJVwiO1xuICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcblxuICAgIHRoaXMucG9zdChvYmplY3QsIFBhZ2UsIG9iamVjdC5Cb2R5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDpyZXN1bHQuZGF0YTpcIiwgcmVzdWx0LmRhdGEpO1xuXG5cbiAgICAgIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYucnVsZVB0cnNBcnIgPSBbXTtcbiAgICAgIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYuYWN0aW9uUHRyc0FyciA9IFtdO1xuXG4gICAgICB0aGlzLnN0b3JlUnVsZXNQdHJzKHJlc3VsdC5kYXRhWzBdLmRhdGEsIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYpXG4gICAgICB0aGlzLnJ1bGVzUG9zdFF1ZXJ5RGVmLnJ1bGVzQXJyID0gcmVzdWx0LmRhdGFbMF0uZGF0YTtcblxuICAgICAgdGhpcy5zdG9yZUFjdGlvbnNQdHJzKHJlc3VsdC5kYXRhWzFdLmRhdGEsIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYpO1xuICAgICAgdGhpcy5ydWxlc1Bvc3RRdWVyeURlZi5hY3Rpb25zQXJyID0gcmVzdWx0LmRhdGFbMV0uZGF0YTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDp0aGlzLnJ1bGVzUG9zdFF1ZXJ5RGVmXCIsIHRoaXMucnVsZXNQb3N0UXVlcnlEZWYpXG5cbiAgICAgIHRoaXMuaG9zdHNBcnIgPSByZXN1bHQuZGF0YVsyXS5kYXRhO1xuICAgICAgdGhpcy5ob3N0c01hcEFyciA9IHJlc3VsdC5kYXRhWzNdLmRhdGE7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yOlwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSk7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIG9iamVjdC5Cb2R5ID0gW107XG4gICAgUGFnZSA9IFwiXCI7XG4gICAgTmV3VmFsID0ge307XG4gICAgTmV3VmFsW1wiX1FVRVJZXCJdID0gXCJHRVRfQURNX1JVTEVfREVGX1JVTEVfSVRFTVwiO1xuICAgIE5ld1ZhbFtcIlJVTEVfVFJJR0dFUlwiXSA9IFwiUFJFX1FVRVJZXCI7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Ok5ld1ZhbDpcIiwgTmV3VmFsKVxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDpvYmplY3QuQm9keTpcIiwgb2JqZWN0LkJvZHkpXG4gICAgb2JqZWN0LmFkZFRvQm9keShOZXdWYWwpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJ0ZXN0Om9iamVjdC5Cb2R5OlwiLCBvYmplY3QuQm9keSlcbiAgICBOZXdWYWwgPSB7fTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9BRE1fUlVMRV9ERUZfUlVMRV9BQ1RJT05cIjtcbiAgICBOZXdWYWxbXCJSVUxFX1RSSUdHRVJcIl0gPSBcIlBSRV9RVUVSWVwiO1xuICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcblxuXG5cbiAgICB0aGlzLnBvc3Qob2JqZWN0LCBQYWdlLCBvYmplY3QuQm9keSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRlc3Q6cmVzdWx0LmRhdGE6XCIsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgLy8vLy8vLy8vLy8vLy9cbiAgICAgIHRoaXMucnVsZXNQcmVRdWVyeURlZi5ydWxlUHRyc0FyciA9IFtdO1xuICAgICAgdGhpcy5ydWxlc1ByZVF1ZXJ5RGVmLmFjdGlvblB0cnNBcnIgPSBbXTtcblxuICAgICAgdGhpcy5zdG9yZVJ1bGVzUHRycyhyZXN1bHQuZGF0YVswXS5kYXRhLCB0aGlzLnJ1bGVzUHJlUXVlcnlEZWYpXG4gICAgICB0aGlzLnJ1bGVzUHJlUXVlcnlEZWYucnVsZXNBcnIgPSByZXN1bHQuZGF0YVswXS5kYXRhO1xuXG4gICAgICB0aGlzLnN0b3JlQWN0aW9uc1B0cnMocmVzdWx0LmRhdGFbMV0uZGF0YSwgdGhpcy5ydWxlc1ByZVF1ZXJ5RGVmKTtcbiAgICAgIHRoaXMucnVsZXNQcmVRdWVyeURlZi5hY3Rpb25zQXJyID0gcmVzdWx0LmRhdGFbMV0uZGF0YTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidGVzdDp0aGlzLnJ1bGVzUHJlUXVlcnlEZWZcIiwgdGhpcy5ydWxlc1ByZVF1ZXJ5RGVmKVxuXG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vXG4gICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgICAgICB0aGlzLnNob3dOb3RpZmljYXRpb24oXCJlcnJvclwiLCBcImVycm9yOlwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgfSk7XG5cbiAgfVxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgcHVibGljIGZldGNoTG9va3VwcyhvYmplY3Q6YW55LCBsb29rdXBBcnJEZWY6YW55KSB7XG4gICAgbGV0IEJvZHkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvb2t1cEFyckRlZi5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IE5ld1ZhbDphbnkgPSB7fTtcbiAgICAgIE5ld1ZhbFtcIl9RVUVSWVwiXSA9IFwiR0VUX1NUTVRcIjtcbiAgICAgIE5ld1ZhbFtcIl9TVE1UXCJdID0gbG9va3VwQXJyRGVmW2ldLnN0YXRtZW50O1xuICAgICAgQm9keSA9IHRoaXMuYWRkVG9Cb2R5KE5ld1ZhbCwgQm9keSk7XG4gICAgfVxuXG4gICAgbGV0IFBhZ2UgPSBcIlwiO1xuICAgIHRoaXMucG9zdChvYmplY3QsIFBhZ2UsIEJvZHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29rdXBBcnJEZWYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJlc3VsdC5kYXRhW2ldLmRhdGE6XCIscmVzdWx0LmRhdGFbaV0uZGF0YVswXSlcbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQuZGF0YVtpXSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LmRhdGFbaV0uZGF0YVswXSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgLy9hZGQgZW1wdHkgcmVjb3JkIGF0IGJlZ2luaW5nIG9mIHRoZSBhcnJheSBmb3IgdGhlIExPViBmb3IgaW5zZXJ0IG5ldyByZWNvcmQgaW4gYSBncmlkIHdvcmsgcHJvcGVybHlcbiAgICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMocmVzdWx0LmRhdGFbaV0uZGF0YVswXSk7XG4gICAgICAgICAgICBsZXQgZW1wdHlSZWM6YW55ID0ge307XG5cbiAgICAgICAgICAgIGxldCBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gbGV0IGNvZGVUeHQgPSBrZXlzWzBdO1xuICAgICAgICAgICAgLy8gbGV0IGRhdGFTZXQgPSBPYmplY3QuYXNzaWduKFtdLCByZXN1bHQuZGF0YVtpXS5kYXRhKTtcblxuICAgICAgICAgICAgLy8gZGF0YVNldC5maW5kKGVsZW0gPT57XG4gICAgICAgICAgICAvLyAgIC8vY29uc29sZS5sb2coXCJlbG06XCIsZWxlbSk7XG4gICAgICAgICAgICAvLyAgIGlmIChlbGVtW2NvZGVUeHRdLnRyaW0oKSA9PSBcIlwiKXtcbiAgICAgICAgICAgIC8vICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0pO1xuXG5cbiAgICAgICAgICAgIGlmICghaGFzU3BhY2UpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIltrZXlzW2tdOlwiLCBrZXlzW2tdKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiW2tleXNba106XCIsIGtleXNba10pO1xuICAgICAgICAgICAgICAgIGVtcHR5UmVjW2tleXNba11dID0gXCJcIjtcbiAgICAgICAgICAgICAgICAvL29iamVjdC5wcmltYXJLZXlSZWFkT25seUFycltrZXlzW2tdXSA9IHZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJlbXB0eVJlYzpcIixlbXB0eVJlYylcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImVtcHR5UmVjOlwiLGVtcHR5UmVjKTtcbiAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uZGF0YS5zcGxpY2UoMCwgMCwgZW1wdHlSZWMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBvYmplY3RbbG9va3VwQXJyRGVmW2ldLmxrcEFyck5hbWVdID0gcmVzdWx0LmRhdGFbaV0uZGF0YTtcbiAgICAgICAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9va3VwQXJyRGVmW2ldLmxrcEFyck5hbWU6XCIsIGxvb2t1cEFyckRlZltpXS5sa3BBcnJOYW1lLCBvYmplY3RbbG9va3VwQXJyRGVmW2ldLmxrcEFyck5hbWVdKVxuXG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmplY3QuZmV0Y2hMb29rdXBzQ2FsbEJhY2sgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIG9iamVjdC5mZXRjaExvb2t1cHNDYWxsQmFjaygpO1xuXG4gICAgfSxcbiAgICAgIGVyciA9PiB7XG4gICAgICAgIC8vYWxlcnQgKCdlcnJvcjonICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnNob3dFcnJvck1zZyhvYmplY3QsIGVycik7XG4gICAgICB9KTtcbiAgfVxuICBwdWJsaWMgcGVyZm9ybVBvc3Qob2JqZWN0OmFueSwgZm46YW55KSB7XG4gICAgbGV0IFBhZ2UgPSBcIlwiO1xuICAgIHRoaXMucG9zdChvYmplY3QsIFBhZ2UsIG9iamVjdC5Cb2R5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGZuKG9iamVjdCwgcmVzdWx0KTtcbiAgICAgIG9iamVjdC5Cb2R5ID0gW107XG4gICAgfSxcbiAgICAgIGVyciA9PiB7XG4gICAgICAgIC8vYWxlcnQgKCdlcnJvcjonICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnNob3dFcnJvck1zZyhvYmplY3QsIGVycik7XG4gICAgICB9KTtcbiAgfVxuXG5cbiAgcHVibGljIHNldENvbXBvbmVudENvbmZpZyhjb21wb25lbnRDb25maWc6YW55LCBzY3JlZW5Db25maWc6YW55KSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhjb21wb25lbnRDb25maWcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygga2V5c1tpXSArIFwiIFwiICsgY29tcG9uZW50Q29uZmlnWyBrZXlzW2ldIF0gKSA7XG4gICAgICBpZiAoY29tcG9uZW50Q29uZmlnW2tleXNbaV1dICE9IG51bGwpIHtcbiAgICAgICAgc2NyZWVuQ29uZmlnW2tleXNbaV1dID0gY29tcG9uZW50Q29uZmlnW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKHNjcmVlbkNvbmZpZyk7XG4gICAgcmV0dXJuIHNjcmVlbkNvbmZpZztcbiAgfVxuICBwdWJsaWMgZ2V0Um91dGluZUF1dGgobWVudTphbnksIHJvdXRpbmVfbmFtZTphbnkpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IHJvdXRpbmVBdXRoO1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2YgbWVudSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgd2hpbGUgKGkgPCBtZW51Lmxlbmd0aCkge1xuICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgIHdoaWxlIChqIDwgbWVudVtpXS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAobWVudVtpXS5jaGlsZHJlbltqXS5jaG9pY2UgPT0gcm91dGluZV9uYW1lKSB7XG4gICAgICAgICAgICByb3V0aW5lQXV0aCA9IG1lbnVbaV0uY2hpbGRyZW5bal07XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaisrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3VuZClcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJvdXRpbmVfbmFtZTpcIiwgcm91dGluZV9uYW1lLCBcInJvdXRpbmVBdXRoOlwiLCByb3V0aW5lQXV0aCwgXCIgbWVudTpcIiwgbWVudSk7XG5cblxuICAgIHJldHVybiAocm91dGluZUF1dGgpO1xuICB9XG4gIHB1YmxpYyBhY3RPblBhcmFtQ29uZmlnKG9iamVjdDphbnksIHJvdXRpbmVfbmFtZTphbnkpIHtcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInJvdXRpbmVfbmFtZTpcIiArIHJvdXRpbmVfbmFtZSlcbiAgICBsZXQgcGFyYW1Db25maWcgPSBnZXRQYXJhbUNvbmZpZygpO1xuICAgIGxldCBtZW51ID0gcGFyYW1Db25maWcubWVudTtcbiAgICBsZXQgcm91dGluZUF1dGggPSB0aGlzLmdldFJvdXRpbmVBdXRoKG1lbnUsIHJvdXRpbmVfbmFtZSk7XG5cbiAgICBpZiAodHlwZW9mIHJvdXRpbmVBdXRoICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBvYmplY3QudGl0bGUgPSByb3V0aW5lQXV0aC50aXRsZSArIFwiIChcIiArIHJvdXRpbmVBdXRoLnJvdXRpbmVWZXIgKyBcIilcIjtcbiAgICAgIG9iamVjdC5yb3V0aW5lQXV0aCA9IHJvdXRpbmVBdXRoO1xuICAgICAgdGhpcy5yb3V0aW5lX25hbWUgPSByb3V0aW5lX25hbWU7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIm9iamVjdC50aXRsZTpcIiArIG9iamVjdC50aXRsZSlcbiAgICB9XG4gICAgZWxzZVxuICAgICAgaWYgKHJvdXRpbmVfbmFtZSA9PSBcIkRTUEVLWUNcIikge1xuICAgICAgICB0aGlzLnJvdXRpbmVfbmFtZSA9IHJvdXRpbmVfbmFtZTtcbiAgICAgIH1cbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRoaXMucm91dGluZV9uYW1lOlwiICsgdGhpcy5yb3V0aW5lX25hbWUpXG4gIH1cblxuICBwdWJsaWMgc2hvd0Vycm9yTXNnKG9iamVjdDphbnksIHNlcnZlckVycm9yOmFueSkge1xuICAgIGxldCBlcnJvck1zZyA9IFwiXCI7XG4gICAgaWYgKHR5cGVvZiBzZXJ2ZXJFcnJvci5lcnJvciA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBlcnJvck1zZyA9IHRoaXMuc3RhbmRhcmRFcnJvck1zZyArIFwiIDogXCIgKyBzZXJ2ZXJFcnJvcjtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgZXJyb3JNc2cgPSB0aGlzLnN0YW5kYXJkRXJyb3JNc2cgKyBcIiA6IFwiICsgc2VydmVyRXJyb3IuZXJyb3IuZXJyb3I7XG4gICAgbGV0IGRpYWxvZ1N0cnVjID0ge1xuICAgICAgbXNnOiBlcnJvck1zZyxcbiAgICAgIHRpdGxlOiBcIkVycm9yXCIsXG4gICAgICBpbmZvOiBudWxsLFxuICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICBhY3Rpb246IHRoaXMuT2tBY3Rpb25zLFxuICAgICAgY2FsbGJhY2s6IG51bGxcbiAgICB9O1xuICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbihkaWFsb2dTdHJ1Yyk7XG5cbiAgfVxuICBwdWJsaWMgc2VuZEdldENvbW1hbmQodXJsOmFueSwgcGFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxHcmlkRGF0YVJlc3VsdD4ge1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiIGluc2lkZSBzZW5kR2V0Q29tbWFuZFwiKVxuICAgIGxldCB0aGVVUkwgPSB1cmwgKyBwYWdlO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiIGluc2lkZSBzZW5kR2V0Q29tbWFuZDp0aGVVUkw6XCIsIHRoZVVSTClcbiAgICB0aGlzLmh0dHBPcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ2F1dGhvcml6YXRpb24nOiB0aGlzLlN0ckF1dGhcblxuICAgICAgfSlcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJzZW5kR2V0Q29tbWFuZCB0aGVVUkw6XCIgKyB0aGVVUkwpXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLmdldChgJHt0aGVVUkx9YCwgdGhpcy5odHRwT3B0aW9ucylcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInNlcnZlciBlcnJvcjpcIiwgZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uKFwiZXJyb3JcIiwgXCJlcnJvcjpcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKHJlc3BvbnNlID0+IChcbiAgICAgICAgICA8YW55PnJlc3BvbnNlXG4gICAgICAgICkpLFxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpXG4gICAgICApO1xuICB9XG4gIHB1YmxpYyBwb3N0Q29tbWFuZE9wdGlvbnMoT3B0aW9uczphbnkscGFnZTogc3RyaW5nLCB1cmw6YW55LCBCb2R5OmFueSk6IE9ic2VydmFibGU8R3JpZERhdGFSZXN1bHQ+IHtcbiAgICAvL2lmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiIGluc2lkZSBwb3N0Q29tbWFuZFwiKVxuICAgIGxldCB0aGVVUkwgPSB1cmw7IC8vdGhpcy5FUE1FTkdfVVJMICsgcGFnZTtcbiAgICBsZXQgaHR0cE9wdGlvbnMgPSB7fTtcbiAgICBpZiAoT3B0aW9ucyA9PSBudWxsKXtcbiAgICAgICBodHRwT3B0aW9ucyA9IHtcbiAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdhdXRob3JpemF0aW9uJzogdGhpcy5TdHJBdXRoXG4gICAgICB9KVxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICBodHRwT3B0aW9ucyA9IHtcbiAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKFxuICAgICAgICAgIE9wdGlvbnNcbiAgICAgICAgICApXG4gICAgICB9O1xuICAgIH1cbiAgICBcblxuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicG9zdENvbW1hbmRPcHRpb25zIHRoZVVSTDpcIiAsIHRoZVVSTCwgXCJCb2R5OlwiLEJvZHkgKVxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgICAgLnBvc3QoYCR7dGhlVVJMfWAsQm9keSwgaHR0cE9wdGlvbnMpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJzZXJ2ZXIgZXJyb3I6XCIsIGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgICAvL3RoaXMuc2hvd05vdGlmaWNhdGlvbiAoXCJlcnJvclwiLFwiZXJyb3I6XCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJlcnI6XCIsZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIC8vIHRocm93RXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkgKGVycik7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IChcbiAgICAgICAgICAgICAgPGFueT5yZXNwb25zZVxuICAgICAgICAgICAgKSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVyciA9PiB7Ly9GdWFkOmNoZWNrIGlmIHRob3NlIDMgbGluZXMgYXJlIG5lZWRlZFxuICAgICAgICAgICAgICByZXR1cm4gZXJyLm1lc3NhZ2U7Ly8yXG4gICAgICAgICAgfSksICAgICAgICAgICAgICAgICAgICAvLzNcbiAgICAgICAgICAgIHRhcCgocmVzcG9uc2UpID0+IHt0aGlzLmxvYWRpbmcgPSBmYWxzZTsgY29uc29sZS5sb2coXCJyZXNwb25zZTpcIixyZXNwb25zZSl9KVxuICAgICAgICk7XG4gIH1cbiAgcHVibGljIHBvc3RDb21tYW5kKHBhZ2U6IHN0cmluZywgdXJsOmFueSwgQm9keTphbnkpOiBPYnNlcnZhYmxlPEdyaWREYXRhUmVzdWx0PiB7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIiBpbnNpZGUgcG9zdENvbW1hbmRcIilcbiAgICBsZXQgdGhlVVJMID0gdXJsOyAvL3RoaXMuRVBNRU5HX1VSTCArIHBhZ2U7XG4gICAgdGhpcy5odHRwT3B0aW9ucyA9IHtcbiAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdhdXRob3JpemF0aW9uJzogdGhpcy5TdHJBdXRoXG5cbiAgICAgIH0pXG4gICAgfTtcblxuICAgIC8vaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJwb3N0Q29tbWFuZCB0aGVVUkw6XCIgKyB0aGVVUkwpXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnBvc3QoYCR7dGhlVVJMfWAsIEJvZHksIHRoaXMuaHR0cE9wdGlvbnMpXG4gICAgICAucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInNlcnZlciBlcnJvcjpcIiwgZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uKFwiZXJyb3JcIiwgXCJlcnJvcjpcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKHJlc3BvbnNlID0+IChcbiAgICAgICAgICA8YW55PnJlc3BvbnNlXG4gICAgICAgICkpLFxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpXG4gICAgICApO1xuICB9XG4gIHB1YmxpYyBDYXBpdGFsaXplRmlyc3Qoc3RyOmFueSkge1xuICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgc3RyID0gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBwdWJsaWMgQ2FwaXRhbGl6ZVRpdGxlKGZpZWxkTmFtZTphbnkpIHtcblxuICAgIGxldCBhcnJheSA9IGZpZWxkTmFtZS5zcGxpdChcIl9cIik7XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJhcnJheTpcIiwgYXJyYXkpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcbiAgICAgIGFycmF5W2ldID0gdGhpcy5DYXBpdGFsaXplRmlyc3QoYXJyYXlbaV0pXG5cbiAgICBmaWVsZE5hbWUgPSBhcnJheS5qb2luKFwiIFwiKTtcbiAgICByZXR1cm4gZmllbGROYW1lO1xuICB9XG4gIHB1YmxpYyBwcmVwYXJlTG9va3VwKGZpZWxkTmFtZTphbnksIHBhcmFtQ29uZmlnOmFueSkge1xuXG4gICAgbGV0IGxrcEFyck5hbWUgPSBcImxrcEFyclwiICsgZmllbGROYW1lO1xuICAgIGxldCBsa3BEZWY7XG4gICAgaWYgKGZpZWxkTmFtZSA9PSBcIkFTU0lHTkVFXCIpIHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwicGFyYW1Db25maWcuVVNFUl9JTkZPOlwiLCBwYXJhbUNvbmZpZy5VU0VSX0lORk8pO1xuXG4gICAgICBsZXQgdGVhbSA9IHBhcmFtQ29uZmlnLlVTRVJfSU5GTy5URUFNO1xuXG4gICAgICBsa3BEZWYgPSB7XG4gICAgICAgIFwic3RhdG1lbnRcIjogXCJzZWxlY3QgVVNFUk5BTUUgQ09ERSwgRlVMTE5BTUUgQ09ERVRFWFRfTEFORyBmcm9tICBBRE1fVVNFUl9JTkZPUk1BVElPTiB3aGVyZSBURUFNID0gJ1wiICsgdGVhbSArIFwiJyBcIixcbiAgICAgICAgXCJsa3BBcnJOYW1lXCI6IGxrcEFyck5hbWUsIFwiZmllbGROYW1lXCI6IGZpZWxkTmFtZVxuICAgICAgfTtcblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxrcERlZiA9IHtcbiAgICAgICAgXCJzdGF0bWVudFwiOiBcIlNFTEVDVCBDT0RFLCAgQ09ERVRFWFRfTEFORyBGUk9NIFNPTV9UQUJTX0NPREVTIFdIRVJFIENPREVOQU1FID0gJ1wiICsgZmllbGROYW1lICsgXCInIGFuZCBMQU5HVUFHRV9OQU1FID0gJ1wiICsgcGFyYW1Db25maWcudXNlckxhbmcgKyBcIicgb3JkZXIgYnkgQ09ERVRFWFRfTEFORyAgXCIsXG4gICAgICAgIFwibGtwQXJyTmFtZVwiOiBsa3BBcnJOYW1lLCBcImZpZWxkTmFtZVwiOiBmaWVsZE5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBsa3BEZWY7XG5cbiAgfVxuICBwdWJsaWMgZ2V0QXNzaWduZWVTZWxlY3Qob2JqZWN0OmFueSwgYXNzaWduZWVUeXBlOmFueSkge1xuICAgIGxldCBzZWxlY3RTdG10O1xuXG4gICAgaWYgKGFzc2lnbmVlVHlwZSA9PSBcIlRFQU1cIikge1xuICAgICAgc2VsZWN0U3RtdCA9IFwiU0VMRUNUIENPREUsIENPREVURVhUX0xBTkcgRlJPTSBTT01fVEFCU19DT0RFUyBXSEVSRSBDT0RFTkFNRSA9J1RFQU0nIGFuZCBMQU5HVUFHRV9OQU1FID0gJ1wiICsgb2JqZWN0LnBhcmFtQ29uZmlnLnVzZXJMYW5nICsgXCInICBvcmRlciBieSBDT0RFVEVYVF9MQU5HIFwiXG4gICAgfVxuICAgIGVsc2UgaWYgKGFzc2lnbmVlVHlwZSA9PSBcIlBFUlNPTlwiKSB7XG4gICAgICBzZWxlY3RTdG10ID0gXCJTRUxFQ1QgVVNFUk5BTUUgIENPREUsIEZVTExOQU1FIENPREVURVhUX0xBTkcgRlJPTSBBRE1fVVNFUl9JTkZPUk1BVElPTiBXSEVSRSBURUFNID0nXCIgKyBvYmplY3QucGFyYW1Db25maWcuVVNFUl9JTkZPLlRFQU0gKyBcIicgb3JkZXIgYnkgQ09ERVRFWFRfTEFORyBcIlxuICAgIH1cbiAgICBlbHNlIGlmIChhc3NpZ25lZVR5cGUgPT0gXCJORVRXT1JLXCIpIHtcbiAgICAgIHNlbGVjdFN0bXQgPSBcIlNFTEVDVCBDT0RFLCBDT0RFVEVYVF9MQU5HIEZST00gU09NX1RBQlNfQ09ERVMgV0hFUkUgQ09ERU5BTUUgPSdFWENIX1NZU1QnIGFuZCBMQU5HVUFHRV9OQU1FID0gJ1wiICsgb2JqZWN0LnBhcmFtQ29uZmlnLnVzZXJMYW5nICsgXCInIG9yZGVyIGJ5IENPREVURVhUX0xBTkdcIlxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0U3RtdDtcbiAgfVxuICBwdWJsaWMgZ2V0Rmlyc3RXZWVrRGF5KG9iamVjdDphbnksIHZhbHVlOmFueSkge1xuICAgIGxldCB2YWx1ZURhdGU6IERhdGVcbiAgICBsZXQgZmlyc3RXZWVrRGF5OmFueSA9IERheS5Nb25kYXk7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QucGFyYW1Db25maWcuZmlyc3RXZWVrRGF5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBmaXJzdFdlZWtEYXkgPSBvYmplY3QucGFyYW1Db25maWcuZmlyc3RXZWVrRGF5O1xuICAgIH1cbiAgICB2YWx1ZURhdGUgPSBmaXJzdERheUluV2VlayhuZXcgRGF0ZSh2YWx1ZSksIGZpcnN0V2Vla0RheSk7XG4gICAgdmFsdWVEYXRlID0gZ2V0RGF0ZSh2YWx1ZURhdGUpO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwidmFsdWVEYXRlOlwiLCB2YWx1ZURhdGUpXG4gICAgcmV0dXJuIHZhbHVlRGF0ZTtcblxuICB9XG4gIHB1YmxpYyBzZXRSVEwoKSB7XG4gICAgbGV0IHBhcmFtQ29uZmlnID0gZ2V0UGFyYW1Db25maWcoKTtcbiAgICBsZXQgbGFuZ3VhZ2VfbmFtZSA9IHBhcmFtQ29uZmlnLnVzZXJMYW5nO1xuICAgIGxhbmd1YWdlX25hbWUgPSBsYW5ndWFnZV9uYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgcGFyZzphbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5wYWdlXCIpO1xuICAgIGNvbnN0IHN2YyA9IDxNeU1lc3NhZ2VTZXJ2aWNlPnRoaXMubWVzc2FnZXM7XG4gICAgLy9zdmMubGFuZ3VhZ2VfbmFtZSA9IHN2Yy5sYW5ndWFnZV9uYW1lID09PSAnZXMnID8gJ2hlJyA6ICdlcyc7XG4gICAgLy9zdmMubGFuZ3VhZ2VfbmFtZSA9IGxhbmd1YWdlX25hbWU7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInNldFJUTDpsYW5ndWFnZV9uYW1lOlwiLCBsYW5ndWFnZV9uYW1lKVxuICAgIGlmIChsYW5ndWFnZV9uYW1lID09IFwiYXJcIikge1xuICAgICAgcGFyZy5kaXIgPSBcInJ0bFwiO1xuICAgICAgdGhpcy5tZXNzYWdlcy5ub3RpZnkodHJ1ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcGFyZy5kaXIgPSBcImx0clwiO1xuICAgICAgdGhpcy5tZXNzYWdlcy5ub3RpZnkoZmFsc2UpO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgbG9hZExhbmd1YWdlT2xkKGxhbmd1YWdlX25hbWU6YW55KSB7XG4gICAgbGFuZ3VhZ2VfbmFtZSA9ICFsYW5ndWFnZV9uYW1lID8gXCJlblwiIDogbGFuZ3VhZ2VfbmFtZVxuICAgIGxldCBmaWxlID0gXCJhc3NldHMvbGFuZy9cIiArIGxhbmd1YWdlX25hbWUgKyBcIi5qc29uXCJcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRMYW5ndWFnZTpmaWxlLFwiLCBmaWxlKVxuICAgIHRoaXMuaHR0cC5nZXQoZmlsZSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkTGFuZ3VhZ2U6ZGF0YSxcIiwgZGF0YSlcbiAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgXCJOYW1lXCI6IFwidGl0bGVzXCIsXG4gICAgICAgIFwiVmFsXCI6IGRhdGFcbiAgICAgIH07XG4gICAgICBzZXRQYXJhbUNvbmZpZyhwYXJhbUNvbmZpZyk7XG4gICAgICB0aGlzLnBhcmFtQ29uZmlnID0gZ2V0UGFyYW1Db25maWcoKTtcbiAgICAgIHBhcmFtQ29uZmlnID0ge1xuICAgICAgICBcIk5hbWVcIjogXCJ1c2VyTGFuZ1wiLFxuICAgICAgICBcIlZhbFwiOiBsYW5ndWFnZV9uYW1lLnRvVXBwZXJDYXNlKClcbiAgICAgIH07XG4gICAgICBzZXRQYXJhbUNvbmZpZyhwYXJhbUNvbmZpZyk7XG4gICAgICB0aGlzLnNldFJUTCgpO1xuXG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXI6XCIsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPT0gJ2x0cicpO1xuICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRMYW5ndWFnZTplcnIsXCIsIGVycilcbiAgICAgICAgLy9hbGVydCAoJ2Vycm9yOicgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIC8vdGhpcy5zaG93RXJyb3JNc2cob2JqZWN0LCBlcnIpO1xuICAgICAgfSlcbiAgfVxuICBwdWJsaWMgbG9hZExhbmd1YWdlKGxhbmd1YWdlOmFueSl7XG4gICAgbGFuZ3VhZ2UgPSAhbGFuZ3VhZ2UgPyBcImVuXCIgOiBsYW5ndWFnZVxuICAgIGxldCBmaWxlID0gXCJsYW5nL1wiICsgbGFuZ3VhZ2UgKyBcIi5qc29uXCJcbiAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRMYW5ndWFnZTpmaWxlLFwiLGZpbGUpXG4gICAgbGV0IHBhZ2UgPSBcIj9nZXRmaWxlPVwiICsgZmlsZTtcbiAgICBwYWdlID0gdGhpcy5jaGVja0RCTG9jKHBhZ2UpO1xuICAgIHBhZ2UgPSBlbmNvZGVVUkkocGFnZSk7XG4gICAgXG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkTGFuZ3VhZ2U6cGFnZSxcIixwYWdlKVxuICAgICAgdGhpcy5wYXJhbUNvbmZpZyA9IGdldFBhcmFtQ29uZmlnKCk7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcInRoaXMucGFyYW1Db25maWcudGl0bGVzLFwiLHRoaXMucGFyYW1Db25maWcudGl0bGVzKTtcbiAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgXCJOYW1lXCI6IFwidXNlckxhbmdcIixcbiAgICAgICAgXCJWYWxcIjogbGFuZ3VhZ2UudG9VcHBlckNhc2UoKVxuICAgICAgfTtcbiAgICAgIHNldFBhcmFtQ29uZmlnKHBhcmFtQ29uZmlnKTtcblxuICAgIHRoaXMuc2VuZEdldENvbW1hbmQodGhpcy5TRVJWRVJfVVJMICwgcGFnZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRMYW5ndWFnZTpyZXN1bHQsXCIscmVzdWx0KTtcbiAgICAgIGxldCBkYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRMYW5ndWFnZTpkYXRhLFwiLGRhdGEpXG4gICAgICBsZXQgcGFyYW1Db25maWcgPSB7XG4gICAgICAgIFwiTmFtZVwiOiBcInRpdGxlc1wiLFxuICAgICAgICBcIlZhbFwiOiBkYXRhXG4gICAgICB9O1xuICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgdGhpcy5zZXRSVEwoKTtcblxuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyOlwiLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyID09ICdsdHInICApO1xuICAgIH0sXG4gICAgZXJyID0+IHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9hZExhbmd1YWdlOmVycixcIixlcnIpXG4gICAgICAvL2FsZXJ0ICgnZXJyb3I6JyArIGVyci5tZXNzYWdlKTtcbiAgICAgIC8vdGhpcy5zaG93RXJyb3JNc2cob2JqZWN0LCBlcnIpO1xuICAgIH0pXG4gIH1cbiAgcHVibGljIGdldE5MUyhwYXJhbXM6YW55LCBpZDphbnksIHRleHQ6YW55KSB7XG4gICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImdldE5MUzppZCxcIixpZCk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucGFyYW1Db25maWcgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJhbUNvbmZpZy50aXRsZXMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgbGV0IGFycmF5ID0gaWQuc3BsaXQoXCIuXCIpO1xuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFyYW1Db25maWcudGl0bGVzIFthcnJheVswXV0gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhcmFtQ29uZmlnLnRpdGxlc1thcnJheVswXV1bYXJyYXlbMV1dICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFyYW1Db25maWcudGl0bGVzW2FycmF5WzBdXVthcnJheVsxXV1bYXJyYXlbMl1dICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy50aXRsZXNbYXJyYXlbMF1dW2FycmF5WzFdXVthcnJheVsyXV0gIT0gXCJcIilcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGhpcy5wYXJhbUNvbmZpZy50aXRsZXNbYXJyYXlbMF1dW2FycmF5WzFdXVthcnJheVsyXV1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy9pZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImdldE5MUzp0ZXh0LFwiLHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxldCBubHNfdGl0bGUgPSB0aGlzLnBhcmFtQ29uZmlnLnRpdGxlc1tpZF07XG4gICAgICAgICAgaWYgKHR5cGVvZiBubHNfdGl0bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRleHQgPSBubHNfdGl0bGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHN0ckFycmF5ID0gdGV4dC5zcGxpdChcIiMjXCIpO1xuICAgICAgdGV4dCA9IFwiXCI7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXNbaV0gIT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICB0ZXh0ID0gdGV4dCArIHN0ckFycmF5W2ldICsgcGFyYW1zW2ldO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGV4dCA9IHRleHQgKyBzdHJBcnJheVtpXTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiB0ZXh0O1xuICB9XG4gIHB1YmxpYyBsb2FkU3RhdGVtZW50cyhzdGF0ZW1lbnRzOmFueSl7XG4gICAgaWYgKHN0YXRlbWVudHMgPT0gXCJcIilcbiAgICAgIHN0YXRlbWVudHMgPSBcInN0YXRlbWVudHMuanNvblwiO1xuICAgIGxldCBwYWdlID0gXCI/Z2V0ZmlsZT1cIiArIHN0YXRlbWVudHM7XG4gICAgcGFnZSA9IHRoaXMuY2hlY2tEQkxvYyhwYWdlKTtcbiAgICBwYWdlID0gZW5jb2RlVVJJKHBhZ2UpO1xuICAgIHRoaXMuc2VuZEdldENvbW1hbmQodGhpcy5TRVJWRVJfVVJMLCBwYWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9hZFN0YXRlbWVudHM6cmVzdWx0LFwiLCByZXN1bHQpO1xuICAgICAgbGV0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9hZFN0YXRlbWVudHM6ZGF0YSxcIiwgZGF0YSk7XG4gICAgICBsZXQgbGtwQXJyUVVFUllfREVGOmFueSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5OmFueSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW2tleV07XG4gICAgICAgIGxldCByZWMgPSB7XG4gICAgICAgICAgQ09ERToga2V5LFxuICAgICAgICAgIENPREVURVhUX0xBTkc6IGtleSxcbiAgICAgICAgICBzdGF0ZW1lbnQ6IHZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgbGtwQXJyUVVFUllfREVGLnB1c2gocmVjKTtcblxuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImxvYWRTdGF0ZW1lbnRzOmRhdGEsXCIsIGRhdGEpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkU3RhdGVtZW50czpsa3BBcnJRVUVSWV9ERUYsXCIsIGxrcEFyclFVRVJZX0RFRilcbiAgICAgIGxldCBwYXJhbUNvbmZpZyA9IHtcbiAgICAgICAgXCJOYW1lXCI6IFwic3RhdGVtZW50c1wiLFxuICAgICAgICBcIlZhbFwiOiBkYXRhXG4gICAgICB9O1xuICAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuICAgICAgcGFyYW1Db25maWcgPSB7XG4gICAgICAgIFwiTmFtZVwiOiBcImxrcEFyclFVRVJZX0RFRlwiLFxuICAgICAgICBcIlZhbFwiOiBsa3BBcnJRVUVSWV9ERUZcbiAgICAgIH07XG4gICAgICBzZXRQYXJhbUNvbmZpZyhwYXJhbUNvbmZpZyk7XG5cbiAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkTGFuZ3VhZ2U6ZXJyLFwiLCBlcnIpXG5cblxuXG4gICAgICB9KVxuICB9XG4gIC8vIHB1YmxpYyBsb2FkU3RhdGVtZW50c09sZCgpIHtcblxuICAvLyAgIGxldCBmaWxlID0gXCJhc3NldHMvXCIgKyBcInN0YXRlbWVudHMuanNvblwiXG4gIC8vICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkU3RhdGVtZW50czpmaWxlLFwiLCBmaWxlKVxuICAvLyAgIHRoaXMuaHR0cC5nZXQoZmlsZSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAvLyAgICAgbGV0IGxrcEFyclFVRVJZX0RFRjphbnkgPSBbXTtcbiAgLy8gICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goZnVuY3Rpb24gKGtleTphbnkpIHtcbiAgLy8gICAgICAgbGV0IHZhbHVlID0gZGF0YVtrZXldO1xuICAvLyAgICAgICBsZXQgcmVjID0ge1xuICAvLyAgICAgICAgIENPREU6IGtleSxcbiAgLy8gICAgICAgICBDT0RFVEVYVF9MQU5HOiBrZXksXG4gIC8vICAgICAgICAgc3RhdGVtZW50OiB2YWx1ZVxuICAvLyAgICAgICB9XG4gIC8vICAgICAgIGxrcEFyclFVRVJZX0RFRi5wdXNoKHJlYyk7XG5cbiAgLy8gICAgIH0pO1xuICAvLyAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJsb2FkU3RhdGVtZW50czpkYXRhLFwiLCBkYXRhKTtcbiAgLy8gICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9hZFN0YXRlbWVudHM6bGtwQXJyUVVFUllfREVGLFwiLCBsa3BBcnJRVUVSWV9ERUYpXG4gIC8vICAgICBsZXQgcGFyYW1Db25maWcgPSB7XG4gIC8vICAgICAgIFwiTmFtZVwiOiBcInN0YXRlbWVudHNcIixcbiAgLy8gICAgICAgXCJWYWxcIjogZGF0YVxuICAvLyAgICAgfTtcbiAgLy8gICAgIHNldFBhcmFtQ29uZmlnKHBhcmFtQ29uZmlnKTtcbiAgLy8gICAgIHBhcmFtQ29uZmlnID0ge1xuICAvLyAgICAgICBcIk5hbWVcIjogXCJsa3BBcnJRVUVSWV9ERUZcIixcbiAgLy8gICAgICAgXCJWYWxcIjogbGtwQXJyUVVFUllfREVGXG4gIC8vICAgICB9O1xuICAvLyAgICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuXG4gIC8vICAgfSxcbiAgLy8gICAgIGVyciA9PiB7XG4gIC8vICAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwibG9hZExhbmd1YWdlOmVycixcIiwgZXJyKVxuXG5cblxuICAvLyAgICAgfSlcbiAgLy8gfVxuXG5cbiAgcHVibGljIGhhbmRsZUZldGNoZWRNb2R1bGVzKG9iamVjdDphbnksIGRhdGE6YW55KSB7XG4gICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZygnZmV0Y2hlZE1vZHVsZXMgOiAnLCBkYXRhWzBdLmRhdGEpO1xuICAgIC8vdGhpcy5pdGVtc1swXS5pdGVtcyA9ICBkYXRhO1xuICAgIG9iamVjdC5pdGVtcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ1NlbGVjdCBNb2R1bGUnLFxuICAgICAgICBpdGVtczogZGF0YVswXS5kYXRhXG4gICAgICB9XTtcbiAgICBvYmplY3Quc2V0TW9kdWxlTmFtZShvYmplY3QuY3VycmVudE1lbnUpO1xuICAgIGlmIChvYmplY3QucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCJvYmplY3QuaXRlbXM6XCIsIG9iamVjdC5pdGVtcywgXCJkYXRhWzBdLmRhdGEubGVuZ3RoOlwiLCBkYXRhWzBdLmRhdGEubGVuZ3RoKVxuICAgIGlmIChkYXRhWzBdLmRhdGEubGVuZ3RoID09IDEpIHtcbiAgICAgIG9iamVjdC5zaG93TW9kdWxlU2VsZWN0aW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZldGNoTWVudShvYmplY3Q6YW55LCBoYW5kbGVGZXRjaGVkRGF0YTphbnkpIHtcbiAgICBpZiAoKHRoaXMuU3RyQXV0aCA9PSBcIlwiKSB8fCAodHlwZW9mIHRoaXMuU3RyQXV0aCA9PT0gXCJ1bmRlZmluZWRcIikpXG4gICAgICByZXR1cm47XG5cblxuICAgIGxldCBQYWdlID0gXCJcIjtcbiAgICB0aGlzLnBvc3QodGhpcywgUGFnZSwgb2JqZWN0LkJvZHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuXG4gICAgICBoYW5kbGVGZXRjaGVkRGF0YShvYmplY3QsIHJlc3VsdC5kYXRhKTtcblxuXG4gICAgICBvYmplY3QuQm9keSA9IFtdO1xuICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBhbGVydCgnZXJyb3I6JyArIGVyci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICB9XG4gIHB1YmxpYyBzZXRNb2R1bGVJdGVtcyhvYmplY3Q6YW55KSB7XG5cblxuICAgIGlmICghb2JqZWN0LnN0YXRpY01lbnUpIHtcbiAgICAgIG9iamVjdC5Cb2R5ID0gW107XG4gICAgICBsZXQgTmV3VmFsOmFueSA9IHtcbiAgICAgICAgTUVOVTogJ01BSU4nLFxuICAgICAgICBDSE9JQ0VTIDogb2JqZWN0LnBhcmFtQ29uZmlnLmxpY2Vuc2VkTW9kdWxlcy50b1VwcGVyQ2FzZSgpLFxuICAgICAgICBMQU5HVUFHRV9OQU1FIDogb2JqZWN0LnBhcmFtQ29uZmlnLnVzZXJMYW5nLnRvVXBwZXJDYXNlKCksXG4gICAgICB9O1xuXG4gICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9BTExPV0VEX01PRFVMRVNcIjtcblxuICAgICAgb2JqZWN0LmFkZFRvQm9keShOZXdWYWwpO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCItLS0tLS0tLW9iamVjdC5Cb2R5IDpcIiwgb2JqZWN0LkJvZHkpXG5cblxuICAgICAgdGhpcy5mZXRjaE1lbnUob2JqZWN0LCB0aGlzLmhhbmRsZUZldGNoZWRNb2R1bGVzKTtcbiAgICB9XG4gIH1cbiAgcHVibGljIHN0YXRlQ2hhbmdlKG9iamVjdDphbnksIGRhdGE6IFBhbmVsQmFyU3RhdGVDaGFuZ2VFdmVudCk6IGJvb2xlYW4ge1xuICAvL3B1YmxpYyBzdGF0ZUNoYW5nZShvYmplY3Q6YW55LCBkYXRhOiBBcnJheTxQYW5lbEJhckl0ZW1Nb2RlbD4pOiBib29sZWFuIHtcblxuICAgIGlmIChvYmplY3Quc3RhdGljTWVudSA9PSB0cnVlKSB7XG4gICAgICBjb25zdCBmb2N1c2VkRXZlbnQ6IFBhbmVsQmFySXRlbU1vZGVsID0gZGF0YS5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmZvY3VzZWQgPT09IHRydWUpWzBdO1xuICAgICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIgaW4gc3RhdGVDaGFuZ2UgOiBcIiArIGZvY3VzZWRFdmVudC5pZClcbiAgICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKGZvY3VzZWRFdmVudClcbiAgICAgIGlmIChmb2N1c2VkRXZlbnQudGl0bGUgPT0gXCJGb3JtYXR0aW5nIEZsb3dcIikge1xuICAgICAgICBvYmplY3Quc2hvd1BhbmVsYmFyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvL3RoaXMuc2VsZWN0ZWRJZCA9IGZvY3VzZWRFdmVudC5pZDtcbiAgICAgIC8vdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvJyArIGZvY3VzZWRFdmVudC5pZF0pO1xuICAgICAgLy90aGlzLnN0YXJTZXJ2aWNlcy5zZXRSVEwoKTtcbiAgICAgIHJldHVybiB0cnVlOyAgLy9GdWFkIGNoZWNrIGlmIGl0IHNob3VsZCByZXR1cm4gZmFsc2Ugb3IgdHJ1ZVxuXG4gICAgfVxuICAgIGNvbnN0IGZvY3VzZWRFdmVudDogUGFuZWxCYXJJdGVtTW9kZWwgPSBkYXRhLml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uZm9jdXNlZCA9PT0gdHJ1ZSlbMF07XG4gICAgaWYgKHRoaXMucGFyYW1Db25maWcuREVCVUdfRkxBRykgY29uc29sZS5sb2coXCIgaW4gc3RhdGVDaGFuZ2UgOiBcIiAsIGZvY3VzZWRFdmVudC5pZClcbiAgICBsZXQgcm91dGluZUF1dGggPSB0aGlzLmdldFJvdXRpbmVBdXRoKG9iamVjdC5tZW51LCBmb2N1c2VkRXZlbnQuaWQpO1xuICAgIGlmICh0aGlzLnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiIGluIHN0YXRlQ2hhbmdlIDogXCIgLCBmb2N1c2VkRXZlbnQuaWQgLCBcInJvdXRpbmVBdXRoIDpcIiAsIHJvdXRpbmVBdXRoKVxuXG4gICAgaWYgKGZvY3VzZWRFdmVudC5pZCA9PSBcIlBSVkZMT1dcIilcbiAgICAgICBvYmplY3Quc2hvd1BhbmVsYmFyID0gZmFsc2U7XG5cbiAgICBpZiAodHlwZW9mIHJvdXRpbmVBdXRoICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAodGhpcy5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcIiBpbiBzdGF0ZUNoYW5nZSA6IHJvdXRpbmVBdXRoLmF1dGhMZXZlbDpcIiArIHJvdXRpbmVBdXRoLmF1dGhMZXZlbClcbiAgICAgIGlmIChyb3V0aW5lQXV0aC5hdXRoTGV2ZWwgPT0gMCkge1xuICAgICAgICBsZXQgZGlhbG9nU3RydWMgPSB7XG4gICAgICAgICAgbXNnOiB0aGlzLm5vQWNjZXNzTXNnLFxuICAgICAgICAgIHRpdGxlOiBcIldhcm5pbmdcIixcbiAgICAgICAgICBpbmZvOiBudWxsLFxuICAgICAgICAgIG9iamVjdDogdGhpcyxcbiAgICAgICAgICBhY3Rpb246IHRoaXMuT2tBY3Rpb25zLFxuICAgICAgICAgIGNhbGxiYWNrOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2hvd0NvbmZpcm1hdGlvbihkaWFsb2dTdHJ1Yyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBvYmplY3Quc2VsZWN0ZWRJZCA9IGZvY3VzZWRFdmVudC5pZDtcbiAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIlwiO1xuICAgICAgICB0aGlzLnNlc3Npb25QYXJhbXNbXCJQcnZVc2VyQ0RSXCJdID0gXCJcIjtcbiBcbiAgICAgICAgaWYgKG9iamVjdC5zZWxlY3RlZElkID09IFwiUFJWRkxPV1wiKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIlBSVl9CTERcIjtcbiAgICAgICAgICB0aGlzLnNlc3Npb25QYXJhbXNbXCJQcnZVc2VyQ0RSXCJdID0gXCJQUlZfQ0RSXCI7XG4gICAgICAgICAgb2JqZWN0LnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3Quc2VsZWN0ZWRJZCA9PSBcIkNDTUNBVFwiKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIkNSQ19DQVRcIjtcbiAgICAgICAgICB0aGlzLnNlc3Npb25QYXJhbXNbXCJQcnZVc2VyQ0RSXCJdID0gXCJDUkNfVVNFUl9JTkZPXCI7XG4gICAgICAgICAgb2JqZWN0LnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3Quc2VsZWN0ZWRJZCA9PSBcIkNDTUdSUFwiKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIkNSQ19HUk9VUFwiO1xuICAgICAgICAgIHRoaXMuc2Vzc2lvblBhcmFtc1tcIlBydlVzZXJDRFJcIl0gPSBcIkNSQ19HUk9VUF9JTkZPXCI7XG4gICAgICAgICAgb2JqZWN0LnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3Quc2VsZWN0ZWRJZCA9PSBcIkNNR0NBVFwiKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIkNBTV9DQVRcIjtcbiAgICAgICAgICB0aGlzLnNlc3Npb25QYXJhbXNbXCJQcnZVc2VyQ0RSXCJdID0gXCJDQU1fVVNFUl9JTkZPXCI7XG4gICAgICAgICAgb2JqZWN0LnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3Quc2VsZWN0ZWRJZCA9PSBcIkNNR0dSUFwiKSB7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckZsb3dcIl0gPSBcIkNBTV9HUk9VUFwiO1xuICAgICAgICAgIHRoaXMuc2Vzc2lvblBhcmFtc1tcIlBydlVzZXJDRFJcIl0gPSBcIkNBTV9HUk9VUF9JTkZPXCI7XG4gICAgICAgICAgb2JqZWN0LnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYmplY3Quc2VsZWN0ZWRJZCA9PSBcIkJJTExJTkdcIikge1xuICAgICAgICAgIHRoaXMuc2Vzc2lvblBhcmFtc1tcIlBydlVzZXJGbG93XCJdID0gXCJCSUxMSU5HXCI7XG4gICAgICAgICAgdGhpcy5zZXNzaW9uUGFyYW1zW1wiUHJ2VXNlckNEUlwiXSA9IFwiQklMTElOR19DRFJcIjtcbiAgICAgICAgICBvYmplY3Quc2hvd1BhbmVsYmFyID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqZWN0LnNlbGVjdGVkSWQuc3RhcnRzV2l0aChcIlBPUlRBTF9cIikpLy9GdWFkIDogUk5EXG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnNlc3Npb25QYXJhbXNbXCJQT1JUQUxfRk9STVwiXSA9IGZvY3VzZWRFdmVudC5pZDtcbiAgICAgICAgICBmb2N1c2VkRXZlbnQuaWQgPSAnRFNQUE9SVEFMJztcbiAgICAgICAgfVxuICAgICAgICAvL0ZVQUQ6IGNoZWNrIGlmIGJlbG93IGNvZGUgdGlsbCBlbHNlIGlzIG5lZWRlZFxuICAgICAgICBpZiAob2JqZWN0LnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdC51cmwgPT0gKCcvJyArIGZvY3VzZWRFdmVudC5pZCkpIHtcbiAgICAgICAgICBvYmplY3Qucm91dGVyLm5hdmlnYXRlQnlVcmwoJycsIHsgc2tpcExvY2F0aW9uQ2hhbmdlOiB0cnVlIH0pLnRoZW4oKCkgPT5cbiAgICAgICAgICAgIG9iamVjdC5yb3V0ZXIubmF2aWdhdGUoWycvJyArIGZvY3VzZWRFdmVudC5pZF0sIHsgc2tpcExvY2F0aW9uQ2hhbmdlOiB0cnVlLCByZXBsYWNlVXJsOiB0cnVlLCBwcmVzZXJ2ZUZyYWdtZW50OiBmYWxzZSB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9iamVjdC5yb3V0ZXIubmF2aWdhdGUoWycvJyArIGZvY3VzZWRFdmVudC5pZF0sIHsgc2tpcExvY2F0aW9uQ2hhbmdlOiB0cnVlLCByZXBsYWNlVXJsOiB0cnVlLCBwcmVzZXJ2ZUZyYWdtZW50OiBmYWxzZSB9KTtcblxuXG4gICAgICAgIC8vdGhpcy5zdGFyU2VydmljZXMuc2V0UlRMKCk7XG5cbiAgICAgICAgLy90aGlzLnNob3dQYW5lbGJhciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBwdWJsaWMgc2V0UGFuZWxCYXIob2JqZWN0OmFueSkge1xuXG4gICAgaWYgKCFvYmplY3Quc3RhdGljTWVudSkge1xuICAgICAgb2JqZWN0LkJvZHkgPSBbXTtcbiAgICAgIGxldCBOZXdWYWw6YW55ID0ge1xuICAgICAgICBNRU5VIDogb2JqZWN0LmN1cnJlbnRNZW51LnRvVXBwZXJDYXNlKCksXG4gICAgICBVU0VSTkFNRSA6IG9iamVjdC5wYXJhbUNvbmZpZy5VU0VSTkFNRS50b1VwcGVyQ2FzZSgpLFxuICAgICAgTEFOR1VBR0VfTkFNRSA6IG9iamVjdC5wYXJhbUNvbmZpZy51c2VyTGFuZy50b1VwcGVyQ2FzZSgpXG4gICAgICB9O1xuXG4gICAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkdFVF9NRU5VX1JPVVRJTkVTXCI7XG5cbiAgICAgIG9iamVjdC5hZGRUb0JvZHkoTmV3VmFsKTtcblxuICAgICAgbGV0IE5ld1ZhbDE6YW55ID0ge1xuICAgICAgICBNRU5VOiBcIlwiLFxuICAgICAgICBVU0VSTkFNRTogb2JqZWN0LnBhcmFtQ29uZmlnLlVTRVJOQU1FLnRvVXBwZXJDYXNlKClcbiAgICAgIH07XG5cbiAgICAgIE5ld1ZhbDFbXCJfUVVFUllcIl0gPSBcIkdFVF9ST1VUSU5FU19BVVRIT1JJVFlcIjtcblxuICAgICAgb2JqZWN0LmFkZFRvQm9keShOZXdWYWwxKTtcblxuICAgICAgdGhpcy5mZXRjaE1lbnUob2JqZWN0LCB0aGlzLmhhbmRsZUZldGNoZWRQYW5lbEJhcik7XG4gICAgfVxuICB9XG5cblxuXG4gIHB1YmxpYyBoYW5kbGVGZXRjaGVkUGFuZWxCYXIob2JqZWN0OmFueSwgZGF0YTphbnkpIHtcbiAgICBmdW5jdGlvbiBjaGVja0F1dGhEYXRhKHJvdXRpbmVfbmFtZTphbnksIGF1dGhEYXRhOmFueSkge1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgbGV0IHJvdXRpbmVBdXRoO1xuICAgICAgd2hpbGUgKGkgPCBhdXRoRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGF1dGhEYXRhW2ldLlJPVVRJTkVfTkFNRSA9PSByb3V0aW5lX25hbWUpIHtcbiAgICAgICAgICByb3V0aW5lQXV0aCA9IGF1dGhEYXRhW2ldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiByb3V0aW5lQXV0aDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9ybWF0RGF0YShhcnI6YW55LCBhdXRoRGF0YTphbnkpIHtcbiAgICAgIGxldCBtZW51OmFueSA9IFtdO1xuICAgICAgbGV0IGNoaWxkcmVuOmFueSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG9iamVjdC5wYXJhbUNvbmZpZy5ERUJVR19GTEFHKSBjb25zb2xlLmxvZyhcImFycltpXTpcIiwgYXJyW2ldKTtcbiAgICAgICAgbGV0IHR5cGUgPSBhcnJbaV0uY2hvaWNlX3R5cGUuY2hhckF0KDApO1xuICAgICAgICBpZiAodHlwZSA9PSBcIk1cIikge1xuICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiBtZW51SXRlbS50aXRsZSxcbiAgICAgICAgICAgICAgY2hvaWNlOiBtZW51SXRlbS5jaG9pY2UsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lbnUucHVzaChpdGVtKTtcbiAgICAgICAgICAgIGNoaWxkcmVuID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBtZW51SXRlbTphbnkgPSB7XG4gICAgICAgICAgICB0aXRsZTogYXJyW2ldLnRleHQsXG4gICAgICAgICAgICBjaG9pY2U6IGFycltpXS5jaG9pY2VcbiAgICAgICAgICB9O1xuICAgICAgICAgIC8vbWVudS5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJSXCIpIHtcbiAgICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYXV0aERhdGE6XCIsIGF1dGhEYXRhLCBcImFycltpXTpcIiwgYXJyW2ldKTtcbiAgICAgICAgICBsZXQgcm91dGluZUF1dGggPSBjaGVja0F1dGhEYXRhKGFycltpXS5jaG9pY2UsIGF1dGhEYXRhKTtcbiAgICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiYXJyW2ldLmNob2ljZTpcIiArIGFycltpXS5jaG9pY2UgKyBcIiAgcm91dGluZUF1dGguRElTUF9GTEFHOlwiICsgcm91dGluZUF1dGguRElTUF9GTEFHICsgXCIgcm91dGluZUF1dGguQVVUSExFVkVMIDpcIiArIHJvdXRpbmVBdXRoLkFVVEhMRVZFTClcbiAgICAgICAgICBpZiAocm91dGluZUF1dGguRElTUF9GTEFHICE9IFwiTlwiKSAvLyAmJiAocm91dGluZUF1dGguQVVUSExFVkVMICE9IDApIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgcm91dGluZUl0ZW0gPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiBhcnJbaV0udGV4dCxcbiAgICAgICAgICAgICAgY2hvaWNlOiBhcnJbaV0uY2hvaWNlLFxuICAgICAgICAgICAgICBhdXRoTGV2ZWw6IHJvdXRpbmVBdXRoLkFVVEhMRVZFTCxcbiAgICAgICAgICAgICAgcm91dGluZURlc2M6IHJvdXRpbmVBdXRoLlJPVVRJTkVfREVTQyxcbiAgICAgICAgICAgICAgcm91dGluZVZlcjogcm91dGluZUF1dGguUk9VVF9WRVIsXG4gICAgICAgICAgICAgIHJvdXRlckxpbms6IFwiL1wiICsgYXJyW2ldLmNob2ljZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gocm91dGluZUl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLkRFQlVHX0ZMQUcpIGNvbnNvbGUubG9nKFwiLS0tY2hpbGRyZW46XCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIGxldCBpdGVtID0ge1xuICAgICAgICAgIHRpdGxlOiBtZW51SXRlbS50aXRsZSxcbiAgICAgICAgICBjaG9pY2U6IG1lbnVJdGVtLmNob2ljZSxcbiAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW5cbiAgICAgICAgfTtcbiAgICAgICAgbWVudS5wdXNoKGl0ZW0pO1xuICAgICAgICBjaGlsZHJlbiA9IFtdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVudTtcbiAgICB9XG5cbiAgICBvYmplY3QubWVudSA9IGZvcm1hdERhdGEoZGF0YVswXS5kYXRhLCBkYXRhWzFdLmRhdGEpO1xuXG4gICAgb2JqZWN0LnBhbmVsSXRlbXMgPSBvYmplY3QubWVudTtcbiAgICBsZXQgcGFyYW1Db25maWcgPSB7XG4gICAgICBcIk5hbWVcIjogXCJtZW51XCIsXG4gICAgICBcIlZhbFwiOiBvYmplY3QubWVudVxuICAgIH07XG4gICAgc2V0UGFyYW1Db25maWcocGFyYW1Db25maWcpO1xuXG5cbiAgfVxuICBcbnB1YmxpYyAgc2xlZXAobXM6YW55KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cbiAgcHJpdmF0ZSBjb21taXRCb2R5OmFueSA9IFtdO1xuICBwdWJsaWMgaW5UcmFucyA9IGZhbHNlO1xuICBwcml2YXRlIEJvZHk6YW55ID0gW107XG4gIHB1YmxpYyBjb21taXRDb21tYW5kcyA9IFsnSU5TRVJUJywgJ1VQREFURScsICdERUxFVEUnXTtcblxuICBwdWJsaWMgYmVnaW5UcmFucygpIHtcbiAgICB0aGlzLmNvbW1pdEJvZHkgPSBbXTtcbiAgICB0aGlzLmluVHJhbnMgPSB0cnVlO1xuXG4gIH1cbiAgcHVibGljIGVuZFRyYW5zKG9iamVjdDphbnksIGNvbW1pdDphbnkpIHtcbiAgICBsZXQgUGFnZSA9IFwiJl90cmFucz1ZXCI7XG4gICAgbGV0IHRhYmxlSW5mbzphbnk7XG4gICAgaWYgKGNvbW1pdCAmJiB0aGlzLmNvbW1pdEJvZHkubGVuZ3RoICE9IDApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpcy5wb3N0KHRoaXMsIFBhZ2UsIHRoaXMuY29tbWl0Qm9keSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgICAgdGhpcy5jb21taXRCb2R5ID0gW107XG4gICAgICAgICAgdGhpcy5pblRyYW5zID0gZmFsc2U7XG5cbiAgICAgICAgICB0YWJsZUluZm8gPSByZXN1bHQuZGF0YVswXS5kYXRhO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKHRhYmxlSW5mbyk7XG4gICAgICAgIH0sXG4gICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgIG9iamVjdC5GT1JNX1RSSUdHRVJfRkFJTFVSRSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbW1pdEJvZHkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaW5UcmFucyA9IGZhbHNlO1xuICAgICAgICAgICAgLy9hbGVydCgnZXJyb3I6JyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yTXNnKG9iamVjdCwgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRhYmxlSW5mbyk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNvbW1pdEJvZHkgPSBbXTtcbiAgICAgIHRoaXMuaW5UcmFucyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG5cbiAgfVxuICAvLyBwdWJsaWMgYWRkVG9Cb2R5KE5ld1ZhbCkge1xuICAvLyAgIHRoaXMuQm9keS5wdXNoKE5ld1ZhbCk7XG4gIC8vIH1cbiAgcHVibGljIGV4ZWNTUUxCb2R5KG9iamVjdDphbnksIEJvZHk6YW55LERCTG9jOmFueSkge1xuICBmdW5jdGlvbiBnZXRGaXJzdFdvcmQoc3RyOmFueSkge1xuICAgIGxldCBteUFycmF5ID0gc3RyLnNwbGl0KFwiX1wiKTtcbiAgICByZXR1cm4gbXlBcnJheVswXTtcbiAgfVxuICBcbiAgb2JqZWN0LkZPUk1fVFJJR0dFUl9GQUlMVVJFID0gZmFsc2U7XG4gIGxldCBQYWdlID0gXCImX3RyYW5zPU5cIjtcbiAgaWYgKERCTG9jICE9IFwiXCIpXG4gICAgUGFnZSA9IFBhZ2UgKyBcIiZEQkxvYz1cIiArIERCTG9jO1xuICBsZXQgdGFibGVJbmZvOmFueTtcblxuICBvYmplY3QuTk9URk9VTkQgPSBmYWxzZTtcbiAgaWYgKHRoaXMuaW5UcmFucykge1xuICAgIGxldCBmaXJzdFdvcmQgPSBnZXRGaXJzdFdvcmQoQm9keVswXS5fUVVFUlkpLnRvVXBwZXJDYXNlKCk7XG4gICAgXG4gICAgbGV0IGlzQ29tbWl0Q29tbWFuZCA9IHRoaXMuY29tbWl0Q29tbWFuZHMuaW5jbHVkZXMoZmlyc3RXb3JkKTtcbiAgICBpZiAoaXNDb21taXRDb21tYW5kKSB7XG4gICAgICB0aGlzLmNvbW1pdEJvZHkucHVzaChCb2R5WzBdKTtcbiAgICAgIHJldHVybiB0YWJsZUluZm87XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIGNvbnNvbGUubG9nIChcImNoZWNrOmRpcnR5IHRlc3R4IGV4ZWNTUUxCb2R5IDJcIik7XG4gICAgdGhpcy5wb3N0KHRoaXMsIFBhZ2UsIEJvZHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgY29uc29sZS5sb2cgKFwiY2hlY2s6ZGlydHkgdGVzdHggZXhlY1NRTEJvZHkgM1wiKTtcbiAgICAgIHRhYmxlSW5mbyA9IHJlc3VsdC5kYXRhO1xuICAgICAgLy8gaWYgKHJlc3VsdC5kYXRhLmxlbmd0aCA9PSAwKVxuICAgICAgLy8gICBvYmplY3QuTk9URk9VTkQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHJlc29sdmUodGFibGVJbmZvKTtcbiAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgb2JqZWN0LkZPUk1fVFJJR0dFUl9GQUlMVVJFID0gdHJ1ZTtcbiAgICAgICAgYWxlcnQoJ2Vycm9yOicgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHRhYmxlSW5mbyk7XG4gICAgICB9KTtcbiAgfSk7XG5cblxufVxuICBwdWJsaWMgZXhlY1NRTChvYmplY3Q6YW55LCBzcWxTdG10OmFueSkge1xuICAgIGZ1bmN0aW9uIGdldEZpcnN0V29yZChzdHI6YW55KSB7XG4gICAgICBsZXQgc3BhY2VJbmRleCA9IHN0ci50cmltKCkuaW5kZXhPZignICcpO1xuICAgICAgcmV0dXJuIHNwYWNlSW5kZXggPT09IC0xID8gc3RyIDogc3RyLnN1YnN0cigwLCBzcGFjZUluZGV4KTtcbiAgICB9XG5cbiAgICBvYmplY3QuRk9STV9UUklHR0VSX0ZBSUxVUkUgPSBmYWxzZTtcbiAgICBsZXQgUGFnZSA9IFwiJl90cmFucz1OXCI7XG4gICAgdGhpcy5Cb2R5ID0gW107XG4gICAgbGV0IE5ld1ZhbDphbnkgPSB7fTtcbiAgICBOZXdWYWxbXCJfUVVFUllcIl0gPSBcIkVYRUNTUUxcIjtcbiAgICBOZXdWYWxbXCJfU1RNVFwiXSA9IHNxbFN0bXQ7XG4gICAgbGV0IHRhYmxlSW5mbzphbnk7XG5cbiAgICBvYmplY3QuTk9URk9VTkQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5pblRyYW5zKSB7XG4gICAgICBsZXQgZmlyc3RXb3JkID0gZ2V0Rmlyc3RXb3JkKHNxbFN0bXQpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgIGxldCBpc0NvbW1pdENvbW1hbmQgPSB0aGlzLmNvbW1pdENvbW1hbmRzLmluY2x1ZGVzKGZpcnN0V29yZCk7XG4gICAgICBpZiAoaXNDb21taXRDb21tYW5kKSB7XG4gICAgICAgIHRoaXMuY29tbWl0Qm9keS5wdXNoKE5ld1ZhbCk7XG4gICAgICAgIHJldHVybiB0YWJsZUluZm87XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuQm9keSA9IHRoaXMuYWRkVG9Cb2R5KE5ld1ZhbCwgdGhpcy5Cb2R5KTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMucG9zdCh0aGlzLCBQYWdlLCB0aGlzLkJvZHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLkJvZHkgPSBbXTtcbiAgICAgICAgdGFibGVJbmZvID0gcmVzdWx0LmRhdGFbMF0uZGF0YTtcbiAgICAgICAgaWYgKHJlc3VsdC5kYXRhWzBdLnJvd0NvdW50ID09IDApXG4gICAgICAgICAgb2JqZWN0Lk5PVEZPVU5EID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUodGFibGVJbmZvKTtcbiAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgb2JqZWN0LkZPUk1fVFJJR0dFUl9GQUlMVVJFID0gdHJ1ZTtcbiAgICAgICAgICBhbGVydCgnZXJyb3I6JyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0YWJsZUluZm8pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG5cbi8vLy8vLy8vXG4gXG5wdWJsaWMgYXR0X2ltZ19nZXRGaWxlTGluayhmaWVsZF9kYXRhOmFueSxvYmplY3Q6YW55KSB7XG4gIGxldCBmaWxlTGluayA9IFwiXCI7XG4gIGlmICgoZmllbGRfZGF0YSAhPSBcIlwiKSAmJiAoZmllbGRfZGF0YSAhPSBcIltdXCIpKSB7XG4gICAgZmllbGRfZGF0YSA9IEpTT04ucGFyc2UoZmllbGRfZGF0YSk7XG4gICAgLy9jb25zb2xlLmxvZyhcImdldEZpbGVMaW5rOmZpZWxkX2RhdGE6XCIsIGZpZWxkX2RhdGEpXG4gICAgZmlsZUxpbmsgPSBvYmplY3QuQXR0RHduVXJsICsgZW5jb2RlVVJJKGZpZWxkX2RhdGFbMF0ubmFtZSk7XG4gICAgLy9jb25zb2xlLmxvZyhcImdldEZpbGVMaW5rOmZpbGVMaW5rOlwiLCBmaWxlTGluaylcbiAgfVxuICByZXR1cm4gZmlsZUxpbms7XG59XG5wdWJsaWMgYXR0X2ltZ19nZXRBdHQoZGF0YTphbnksb2JqZWN0OmFueSkge1xuICBsZXQgYXR0cyA9IFwiXCI7XG4gIC8vY29uc29sZS5sb2coXCJnZXRBdHRfZGF0YTpcIiwgZGF0YSk7XG4gIGlmICgoZGF0YSAhPSBcIlwiKSAmJiAoZGF0YSAhPSBcIltdXCIpKSB7XG4gICAgbGV0IHZhbHMgPVxuICAgICAgW3tuYW1lOlwiXCIsXG4gICAgICBzaXplOlwiXCJ9XG4gICAgICBdO1xuICAgIHZhbHMgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIC8vY29uc29sZS5sb2coXCJnZXRBdHRfZGF0YTpcIiwgdmFscyk7XG4gICAgdmFscy5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKFwidmFsOlwiLCB2YWwpXG4gICAgICBhdHRzID0gYXR0cyArIFwiPFwiICsgdmFsLm5hbWUgKyBcIiBTaXplOlwiICsgdmFsLnNpemUgKyBcIj5cIjtcbiAgICB9KVxuICB9XG4gIHJldHVybiBhdHRzO1xufVxucHVibGljIGF0dF9pbWdfcG9wdWxhdGVBcnJzKGZvcm1Hcm91cDphbnksb2JqZWN0OmFueSl7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0LmF0dF9hcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZm9ybUdyb3VwW29iamVjdC5hdHRfYXJyW2ldXSAhPSBcIlwiKSBvYmplY3QubXlGaWxlc1tvYmplY3QuYXR0X2FycltpXV0gPSBKU09OLnBhcnNlKGZvcm1Hcm91cFtvYmplY3QuYXR0X2FycltpXV0pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0LmltZ19hcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZm9ybUdyb3VwW29iamVjdC5pbWdfYXJyW2ldXSAhPSBcIlwiKSBvYmplY3QubXlGaWxlc1tvYmplY3QuaW1nX2FycltpXV0gPSBKU09OLnBhcnNlKGZvcm1Hcm91cFtvYmplY3QuaW1nX2FycltpXV0pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0LmF0dF9hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NvbnNvbGUubG9nKFwib2JqZWN0LmF0dF9hcnJbaV06XCIsIG9iamVjdC5hdHRfYXJyW2ldKVxuICAgIGlmIChmb3JtR3JvdXBbb2JqZWN0LmF0dF9hcnJbaV1dICE9IFwiXCIpIHtcbiAgICAgIGxldCBpdGVtczE6YW55ID1bXTtcbiAgICAgIGxldCBmaWVsZF9kYXRhID0gZm9ybUdyb3VwW29iamVjdC5hdHRfYXJyW2ldXTtcbiAgICAgIGZpZWxkX2RhdGEgPSBKU09OLnBhcnNlKGZpZWxkX2RhdGEpO1xuICAgICAgXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZpZWxkX2RhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IGl0ZW0gPVxuICAgICAgICAgIHsgdGl0bGU6IGZpZWxkX2RhdGFbal0ubmFtZSwgdXJsOiBvYmplY3QuQXR0RHduVXJsICsgZW5jb2RlVVJJKGZpZWxkX2RhdGFbaV0ubmFtZSkgfVxuICAgICAgICBpdGVtczEucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICAgIG9iamVjdC5pbWdfZ2FsbGVyeVtvYmplY3QuYXR0X2FycltpXV0gPSBpdGVtczE7XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coXCJpbWdfZ2FsbGVyeTpcIiwgb2JqZWN0LmltZ19nYWxsZXJ5KVxuICB9XG59XG5wdWJsaWMgYXR0X2ltZ19mb3JtX29wZW5VcGxvYWRpbWFnZShmaWVsZF9pZDphbnksb2JqZWN0OmFueSkge1xuICAvL29iamVjdC51cGxvYWRpbWFnZSA9IHRydWU7XG4gIC8vY29uc29sZS5sb2coXCJvcGVuVXBsb2FkaW1hZ2U6ZmllbGRfaWQ6XCIsIGZpZWxkX2lkLCBvYmplY3QubXlGaWxlcywgb2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdKVxuICBsZXQgbXlGaWxlcyA9IFtdO1xuICBpZiAodHlwZW9mIG9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbXlGaWxlcyA9IG9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXTtcbiAgfVxuICBsZXQgZmlsZXNEZWxldGVkID0gW107XG4gIGlmICh0eXBlb2Ygb2JqZWN0LmZpbGVzRGVsZXRlZFtmaWVsZF9pZF0gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGZpbGVzRGVsZXRlZCA9IG9iamVjdC5maWxlc0RlbGV0ZWRbZmllbGRfaWRdO1xuICB9XG5cbiAgbGV0IGltYWdlSUQgPSBmaWVsZF9pZDtcbiAgdmFyIG1hc3RlclBhcmFtcyA9IHtcbiAgICBcImFjdGlvblwiOiBcInVwbG9hZFwiLFxuICAgIFwiaW1hZ2VJRFwiOiBpbWFnZUlELFxuICAgIFwibXlGaWxlc1wiOiBteUZpbGVzLFxuICAgIFwiZmlsZXNEZWxldGVkXCI6IGZpbGVzRGVsZXRlZFxuICB9XG5cblxuICBvYmplY3QuRFNQX1VQTE9BRENvbmZpZyA9IG5ldyBjb21wb25lbnRDb25maWdEZWYoKVxuICBvYmplY3QuRFNQX1VQTE9BRENvbmZpZy5tYXN0ZXJQYXJhbXMgPSBtYXN0ZXJQYXJhbXNcbiAgY29uc29sZS5sb2coXCJvYmplY3QuRFNQX1VQTE9BRENvbmZpZy5tYXN0ZXJQYXJhbXM6XCIsIG9iamVjdC5EU1BfVVBMT0FEQ29uZmlnLm1hc3RlclBhcmFtcylcbn1cbnB1YmxpYyBjYWxsR2V0U2F2ZUF0dGFjaGVtdHMoYWN0aW9uOmFueSxkYXRhOmFueSxvYmplY3Q6YW55KSB7XG4gIC8vY29uc29sZS5sb2coXCJjYWxsU2F2ZUF0dGFjaGVtdHM6bXlGaWxlczpcIiwgb2JqZWN0Lm15RmlsZXMpXG4gIHZhciBtYXN0ZXJQYXJhbXMgPSB7XG4gICAgXCJhY3Rpb25cIjogYWN0aW9uLFxuICAgIFwiYXR0X2FyclwiOiBvYmplY3QuYXR0X2FycixcbiAgICBcImltZ19hcnJcIjogb2JqZWN0LmltZ19hcnIsXG4gICAgXCJteUZpbGVzXCI6IG9iamVjdC5teUZpbGVzLFxuICAgIFwiZmlsZXNEZWxldGVkXCI6IG9iamVjdC5maWxlc0RlbGV0ZWQsXG4gICAgXCJkYXRhXCI6IGRhdGFcbiAgfVxuXG4gIG9iamVjdC5EU1BfVVBMT0FEQ29uZmlnID0gbmV3IGNvbXBvbmVudENvbmZpZ0RlZigpXG4gIG9iamVjdC5EU1BfVVBMT0FEQ29uZmlnLm1hc3RlclBhcmFtcyA9IG1hc3RlclBhcmFtc1xuXG59XG5hc3luYyBhdHRfaW1nX3NhdmVGb3JtQ29tcGxldGVkSGFuZGxlcih2YWx1ZTphbnksb2JqZWN0OmFueSkge1xuICAvL2NvbnNvbGUubG9nKFwiYXR0X2ltZ19zYXZlRm9ybUNvbXBsZXRlZEhhbmRsZXI6dmFsdWVcIiwgdmFsdWUpO1xuICBsZXQgZmllbGRfaWQgPSB2YWx1ZS5maWVsZF9pZDtcbiAgb2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdID0gdmFsdWUubXlGaWxlcztcbiAgb2JqZWN0LmZpbGVzRGVsZXRlZFtmaWVsZF9pZF0gPSB2YWx1ZS5maWxlc0RlbGV0ZWQ7XG4gIC8vY29uc29sZS5sb2coXCJvYmplY3QubXlGaWxlc1tmaWVsZF9pZF06XCIsIG9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXSlcbiAgb2JqZWN0LmZvcm0udmFsdWVbZmllbGRfaWRdID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdKTtcbiAgb2JqZWN0LmZvcm0ucGF0Y2hWYWx1ZSh7IFtmaWVsZF9pZF06IEpTT04uc3RyaW5naWZ5KG9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXSkgfSk7XG59XG5wdWJsaWMgYXR0X2ltZ19zYXZlR3JpZENvbXBsZXRlZEhhbmRsZXIodmFsdWU6YW55LG9iamVjdDphbnkpIHtcbiAgXG4gIC8vY29uc29sZS5sb2coXCJhdHRfaW1nX3NhdmVHcmlkQ29tcGxldGVkSGFuZGxlcjp2YWx1ZVwiLCB2YWx1ZSk7XG4gIGxldCBmaWVsZF9pZCA9IHZhbHVlLmZpZWxkX2lkO1xuICBvYmplY3QubXlGaWxlc1tmaWVsZF9pZF0gPSB2YWx1ZS5teUZpbGVzO1xuICBvYmplY3QuZmlsZXNEZWxldGVkW2ZpZWxkX2lkXSA9IHZhbHVlLmZpbGVzRGVsZXRlZDtcbiAgLy9jb25zb2xlLmxvZyhcIm9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXTpcIiwgb2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdKVxuICBvYmplY3QuZm9ybUdyb3VwLnBhdGNoVmFsdWUoeyBbZmllbGRfaWRdOiBKU09OLnN0cmluZ2lmeShvYmplY3QubXlGaWxlc1tmaWVsZF9pZF0pIH0pO1xuICBvYmplY3QuZm9ybUdyb3VwLm1hcmtBc0RpcnR5KCk7XG4gIC8vY29uc29sZS5sb2coXCJhdHRfaW1nX3NhdmVHcmlkQ29tcGxldGVkSGFuZGxlcjpvYmplY3QuZm9ybUdyb3VwLnZhbHVlXCIsIG9iamVjdC5mb3JtR3JvdXAudmFsdWUpO1xuICBvYmplY3QudXBsb2FkaW1hZ2U9ZmFsc2U7XG59XG5wdWJsaWMgYXN5bmMgYXR0X2ltZ19ncmlkX29wZW5VcGxvYWRpbWFnZShmaWVsZF9pZDphbnksb2JqZWN0OmFueSkge1xuICBpZiAoIW9iamVjdC5jb21wb25lbnRDb25maWcuZW5hYmxlZCkgcmV0dXJuO1xuICBhd2FpdCBvYmplY3Quc3RhclNlcnZpY2VzLnNsZWVwKDMwMCk7XG4gIC8vY29uc29sZS5sb2coXCJhdHRfaW1nX2dyaWRfb3BlblVwbG9hZGltYWdlOm9iamVjdC5mb3JtR3JvdXA6XCIsIG9iamVjdC5mb3JtR3JvdXApXG4gIG9iamVjdC51cGxvYWRpbWFnZSA9IHRydWU7XG4gIGlmICh0eXBlb2Ygb2JqZWN0LmZvcm1Hcm91cCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgb2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdID1bXTtcbiAgICBvYmplY3Quc3RhclNlcnZpY2VzLmF0dF9pbWdfcG9wdWxhdGVBcnJzKG9iamVjdC5mb3JtR3JvdXAudmFsdWUsb2JqZWN0KTtcbiAgICAvL2NvbnNvbGUubG9nKFwib3BlblVwbG9hZGltYWdlOmZpZWxkX2lkOlwiLCBmaWVsZF9pZCwgb2JqZWN0Lm15RmlsZXMsIG9iamVjdC5teUZpbGVzW2ZpZWxkX2lkXSlcbiAgICBsZXQgbXlGaWxlcyA9IFtdO1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm15RmlsZXNbZmllbGRfaWRdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG15RmlsZXMgPSBvYmplY3QubXlGaWxlc1tmaWVsZF9pZF07XG4gICAgfVxuICAgIGxldCBmaWxlc0RlbGV0ZWQgPSBbXTtcbiAgICBpZiAodHlwZW9mIG9iamVjdC5maWxlc0RlbGV0ZWRbZmllbGRfaWRdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGZpbGVzRGVsZXRlZCA9IG9iamVjdC5maWxlc0RlbGV0ZWRbZmllbGRfaWRdO1xuICAgIH1cblxuICAgIGxldCBpbWFnZUlEID0gZmllbGRfaWQ7XG4gICAgdmFyIG1hc3RlclBhcmFtcyA9IHtcbiAgICAgIFwiYWN0aW9uXCI6IFwidXBsb2FkXCIsXG4gICAgICBcImltYWdlSURcIjogaW1hZ2VJRCxcbiAgICAgIFwibXlGaWxlc1wiOiBteUZpbGVzLFxuICAgICAgXCJmaWxlc0RlbGV0ZWRcIjogZmlsZXNEZWxldGVkXG4gICAgfVxuXG4gICAgb2JqZWN0LkRTUF9VUExPQURDb25maWcgPSBuZXcgY29tcG9uZW50Q29uZmlnRGVmKClcbiAgICBvYmplY3QuRFNQX1VQTE9BRENvbmZpZy5tYXN0ZXJQYXJhbXMgPSBtYXN0ZXJQYXJhbXNcbiAgfVxufVxucHVibGljIGFkZE5ld0NvZGUob2JqZWN0OmFueSwgQ09ERU5BTUU6YW55KTogdm9pZCB7XG4gIG9iamVjdC5ncmlkX3NvbV90YWJzX2NvZGVzID0gbmV3IHRhYnNDb2RlcygpO1xuICBvYmplY3QuZ3JpZF9zb21fdGFic19jb2Rlc1snQ09ERU5BTUUnXSA9IENPREVOQU1FOyAvLyBmb3IgcmV0cmlldmUgZGF0YVxuICBcbiAgXG4gIG9iamVjdC5TT01fVEFCU19DT0RFU0NvbmZpZyA9ICBuZXcgY29tcG9uZW50Q29uZmlnRGVmKCk7XG4gIGxldCBtYXN0ZXJQYXJhbXMgPSB7XG4gICAgYWN0aW9uOiBcIkFERFwiLFxuICAgIENPREVOQU1FOkNPREVOQU1FLFxuICAgIENPREU6b2JqZWN0LmZpbHRlckNvZGUsXG4gICAgQ09ERVRFWFRfTEFORyA6IG9iamVjdC5maWx0ZXJDb2RlXG4gIH1cbiAgb2JqZWN0LlNPTV9UQUJTX0NPREVTQ29uZmlnLm1hc3RlclBhcmFtcyA9IG1hc3RlclBhcmFtczsgLy8gRm9yIGFkZCBuZXcgcmVjb3JkXG4gIG9iamVjdC5zaG93Q29kZURldGFpbHM9dHJ1ZTtcbn1cblxucHVibGljIGhhbmRsZUZpbHRlckNvZGUob2JqZWN0OmFueSxDT0RFOmFueSkge1xuICBpZiAob2JqZWN0LnBhcmFtQ29uZmlnLlVTRVJfSU5GTy5HUk9VUE5BTUUgPT0gXCJTWVNBRE1cIil7XG4gICAgb2JqZWN0LmZpbHRlckNvZGUgPSBDT0RFO1xuICB9XG4gfVxuIHB1YmxpYyBoaWRlTm9WYWxpZExpY2Vuc2UoKVxuIHtcbiAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnbmctcmVmbGVjdC1uZy1zdHlsZScsICcxcHgnKTtcbiAgICAgY29uc3QgY29sbGVjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpOyBcbiAgICAgZm9yIChsZXQgaT0wO2k8Y29sbGVjdGlvbi5sZW5ndGg7aSsrKXtcbiAgICAgICBsZXQgaW5uZXJIVE1MOmFueSA9IGNvbGxlY3Rpb25baV0uaW5uZXJIVE1MO1xuICAgICAgIGxldCByZXN1bHQgPSBpbm5lckhUTUwuaW5jbHVkZXMoXCJuZy1yZWZsZWN0LW5nLXN0eWxlXCIpO1xuICAgICAgIGlmIChyZXN1bHQpe1xuICAgICAgICAgcmVzdWx0ID0gaW5uZXJIVE1MLmluY2x1ZGVzKFwiTm8gdmFsaWQgbGljZW5zZSBmb3VuZFwiKTtcbiAgICAgICAgIGlmIChyZXN1bHQpe1xuICAgICAgICAgICAvL2NvbnNvbGUubG9nIChcImlubmVySFRNTDpcIixyZXN1bHQsaW5uZXJIVE1MKTtcbiAgICAgICAgICAgY29sbGVjdGlvbltpXS5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgIH1cbiBcbiAgICAgICB9XG4gICAgICAgXG4gICAgIH1cbiAgICAgLy9jb25zb2xlLmxvZyAoXCJjb2xsZWN0aW9uOlwiLCBjb2xsZWN0aW9uLmxlbmd0aCwgY29sbGVjdGlvblszNV0pXG4gfSAgXG4gXG59XG5cbi8qXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3Mgc3RhclNlcnZpY2VzIGV4dGVuZHMgc3Rhcl9TZXJ2aWNlcyB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgbm90aWZpY2F0aW9uU2VydmljZTpOb3RpZmljYXRpb25TZXJ2aWNlLFxuICAgICAgICBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlLFxuICAgICAgICBodHRwOiBIdHRwQ2xpZW50LCAgIG1lc3NhZ2VzOiBNZXNzYWdlU2VydmljZSkge1xuICAgICAgICAvL2xldCBQYWdlID0gZW5jb2RlVVJJIChcIiZfcXVlcnk9R0VUX0VJTV9DT01NQU5EUyZTUENfRlVOQ1RJT049JyUnJkVYQ1NZU1RFTT0nU01OU18zJyZFUVVJUElEPSclJ1wiKTtcbiAgICAgICAgbGV0IFBhZ2UgPSBlbmNvZGVVUkkgKFwiXCIpO1xuXG5cbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICBub3RpZmljYXRpb25TZXJ2aWNlLFxuICAgICAgICAgICAgZGlhbG9nU2VydmljZSxcbiAgICAgICAgICAgIGh0dHAsIFBhZ2UsIG1lc3NhZ2VzKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBxdWVyeUZvckNhdGVnb3J5KHsgQ2F0ZWdvcnlJRCB9OiB7IENhdGVnb3J5SUQ6IG51bWJlciB9LCBzdGF0ZT86IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnF1ZXJ5KE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ0NhdGVnb3J5SUQnLCBvcGVyYXRvcjogJ2VxJywgdmFsdWU6IENhdGVnb3J5SURcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBsb2dpYzogJ2FuZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBxdWVyeUZvclByb2R1Y3ROYW1lKFByb2R1Y3ROYW1lOiBzdHJpbmcsIHN0YXRlPzogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucXVlcnkoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnUHJvZHVjdE5hbWUnLCBvcGVyYXRvcjogJ2NvbnRhaW5zJywgdmFsdWU6IFByb2R1Y3ROYW1lXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgbG9naWM6ICdhbmQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbn1cblxuKi9cbiJdfQ==