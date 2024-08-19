import { Component, Injectable} from '@angular/core';
import {
  PanelBarExpandMode,
  PanelBarStateChangeEvent,
} from "@progress/kendo-angular-layout";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';
//import { MessageService } from '@progress/kendo-angular-l10n';
import { Router } from '@angular/router';

import { PanelBarItemModel } from '@progress/kendo-angular-layout';
import { starServices } from 'starlib';

import { environment } from '../../src/environments/environment';
import {   componentConfigDef } from '@modeldir/model';
import { StarNotifyService } from './services/starnotification.service';

declare function getParamConfig():any;
declare function setParamConfig(var1:any):any;

@Component({
  //providers: [ MessageService ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  public router: Router;
  public  selectedId = '';
  public  MenuWithLogin = true;
  public  showPanelbar : boolean = true;
  public  showMenuButton : boolean = true;
  public showLogn : boolean = false;
  public showModuleSelection : boolean = true;
  public expandMode: PanelBarExpandMode = 0; //Single
  

  public staticMenu : boolean = false; //////////////////
  
  public paramConfig;
  public  currentMenu = "PROVISION";
  private Body =[];
  
  public testEKYC = false;
  
  private user = "ekyc";
  private password = "ekyc";
  private ekycPathName = "/DSPEKYC";
  
  private limit = 1000;
  
  constructor(/*private messages: MessageService, */private location: Location, private starNotify: StarNotifyService, router: Router, public starServices: starServices) {
    
   

    this.router = router;
      this.paramConfig = getParamConfig();

      var EPMENG_URL = environment.EPMENG_URL;
      var SERVER_URL = environment.SERVER_URL;
      var BASE_URL = SERVER_URL + '/api?_format=json&_limit=' + this.starServices.limit;
      this.starServices.BASE_URL = BASE_URL;
      this.starServices.EPMENG_URL = EPMENG_URL;
      this.starServices.SERVER_URL = SERVER_URL;

      
      //var href =  window.location.href;
      //var pathname =  window.location.pathname ;
      var href = this.location.path();
      //if (this.paramConfig.DEBUG_FLAG) console.log ("test:constructor:", href, " pathname:", pathname);
      var array = href.split("?");
      if (typeof array[1] !== "undefined"){
        if  (!array[1].startsWith("link")) {
        
          //let buff =  Buffer.alloc(array[1].length, array[1], 'base64');
          //let text = buff.toString('ascii');
          var text = atob(array[1]);

          if (this.paramConfig.DEBUG_FLAG) console.log("text:"+text);
          if  (text.startsWith("link")) {
            array[1] = text;
            href = array.join("?") ;
          }
        }
      }
      

      /*
      //alert ( href);
      var url = new URL(href);
      //var url1 = this.location.normalize(href);
      var link = url.searchParams.get("link");

      if ( ( link != null) && (link.toUpperCase() == this.starServices.eKycScr )) {
        var orderno = url.searchParams.get("orderno");
        var woorderno = url.searchParams.get("woorderno");
        var msgstatus = url.searchParams.get("status");
        var external_id = url.searchParams.get("external_id");
        if (this.paramConfig.DEBUG_FLAG) console.log("external_id:",external_id);
        if (external_id != null)
          orderno = external_id;
        var language_name = url.searchParams.get("language_name");
        var step = url.searchParams.get("step");
        var lang = url.searchParams.get("lang");
        if (this.paramConfig.DEBUG_FLAG) console.log("lang:", lang)
        if ( lang !== null){
          this.starServices.loadLanguage(lang);
          }

        this.starServices.sessionParams["orderno"] = orderno;
        this.starServices.sessionParams["woorderno"] = woorderno;
        this.starServices.sessionParams["status"] = msgstatus;
        this.starServices.sessionParams["external_id"] = external_id;
        this.starServices.sessionParams["language_name"] = language_name;
        this.starServices.sessionParams["step"] = step;
        this.starServices.sessionParams["href"] = href;

        this.testEKYC = true;


   
      }
      */
 
      if (this.testEKYC){
        var href =  window.location.href;
        this.showPanelbar = false;
        this.MenuWithLogin = false;
        }

        
      if (this.MenuWithLogin == false){
        this.showLogn = false;
        this.showMenuButton = true;
        this.showPanelbar = true;
       }
       else
       {
        this.showLogn = true;
        this.showMenuButton = false;
        this.showPanelbar = false;
       }
      

  }
    public setStyles(element: string, color: string) {
        document.documentElement.style.setProperty(element, color);
    }
  public panelItems = [];
  public menu;
  public items = [];
  public moduleName = "";
  /*
   {
    text: 'Select Module',
    items: [{ text: 'Provisoining', id:"PROVISION" }, { text: 'System Admin', id:"SETTINGS" }]
  }];
*/
public langitems =
   [{
    text: 'Select Language',
    items: [{ text: 'English', id:"en" }, { text: 'Arabic', id:"ar" }]
  }];
  public themeitems =
   [{
    text: 'Select Theme',
    items: [
      { text: 'Blue', id:"BLUE" }, 
      { text: 'Green', id:"GREEN" }
    ]
  }];
  

  public ngOnInit(): void {
  
  //if (this.paramConfig.DEBUG_FLAG) console.log ("test:hello1");
  //if (this.paramConfig.DEBUG_FLAG) console.log ("test:hello2");
  this.currentMenu = this.paramConfig.defaultModule;

  if (this.testEKYC){
    this.starServices.login(this,"EKYC", "ekyc");
  }
  

  }
  public kendoThemes =
  {
   GREEN: [
     { "--kendo-component-bg": '#18af25' }, 
     { "--kendo-component-text": '#000000' }, 
     { "--kendo-component-text": '#000000' }, 
     { "--kendo-component-border": '#d6d6d6' }, 
     { "--kendo-component-header-bg": '#d5f8c0' }, 
     { "--kendo-component-header-text": '#000000' }, 
     { "--kendo-body-bg": '#18af25' }, 
     { "--kendo-toolbar-bg": '#18af25' }, 
   ]
  };
  public onSelectTheme(e: any): void {
   
    let curTheme ={};
    console.log(e.item);
    if (typeof e.item.id !== "undefined"){
      if (e.item.id == "GREEN"){
        curTheme = this.kendoThemes['GREEN'][0];
      }
     this.setStyles('--kendo-component-bg', curTheme['--kendo-component-bg']);
     this.setStyles('--kendo-component-text', curTheme['--kendo-component-text']);
     this.setStyles('--kendo-component-border', curTheme['--kendo-component-border']);
     this.setStyles('--kendo-component-header-bg', curTheme['--kendo-component-header-bg']);
     this.setStyles('--kendo-component-header-text', curTheme['--kendo-component-header-bg']);
     this.setStyles('--kendo-body-bg', curTheme['--kendo-body-bg']);
    this.setStyles('--kendo-toolbar-bg', curTheme['--kendo-toolbar-bg']);

    }
    
  }
  public onSelectLang(e: any): void {
 
    
    
    
    if (this.paramConfig.DEBUG_FLAG) console.log(" in onSelect");
    if (this.paramConfig.DEBUG_FLAG) console.log(e.item);
    if (typeof e.item.id !== "undefined"){
      /*
      if (e.item.id == "ar")
        this.messages.notify(true);
      else
        this.messages.notify(false);
        */
      this.starServices.loadLanguage(e.item.id);
      //this.paramConfig = getParamConfig();
      if (this.paramConfig.DEBUG_FLAG) console.log("this.paramConfig.userLang:",this.paramConfig.userLang);
      this.starServices.setModuleItems(this);
      this.starServices.setPanelBar (this);

      let componentConfig = new componentConfigDef();
      componentConfig.eventTo = this.children;
      componentConfig.languageChanged = this.paramConfig.userLang;
      console.log("test:userLang:",this.paramConfig.userLang);
     this.callStarNotify(componentConfig);
    }

  }

  public children = ["any"];

 callStarNotify(componentConfig:any) {
    componentConfig.eventFrom = this.constructor.name;
    console.log("test:sending event");
    this.starNotify.sendEvent<componentConfigDef>('componentConfigDef', componentConfig);
  }

  public onSelect(e: any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log(" in onSelect");
    if (this.paramConfig.DEBUG_FLAG) console.log(e.item);
    /*const subscription = e.sender.close.subscribe(args => args.preventDefault());
    setTimeout(() => {
        subscription.unsubscribe();
    });*/
    if (typeof e.item.id !== "undefined")
    {
      this.currentMenu = e.item.id;
      this.setModuleName(this.currentMenu);
      this.starServices.setPanelBar (this);
      
    }
}


  public loginCompletedHandler (someValue:any){
    
    if (this.testEKYC){
      this.router.navigate(['/' + this.starServices.eKycScr], { skipLocationChange: true });
      //this.starServices.setRTL();

      return;
    }
    
    this.router.navigate(['/PRVDASH'], { skipLocationChange: true });
    //this.starServices.setRTL();


    this.showLogn = false;
    this.showMenuButton = true;
    this.showPanelbar = true;
    this.starServices.loadLanguage("en");
    
    let stmtFile ="statements.json";
    if (this.paramConfig.DBLoc != ""){
      stmtFile = this.paramConfig.DBLoc + ".json";
    }
    this.starServices.loadStatements(stmtFile);
    
    //this.setModuleItems();
    this.starServices.setModuleItems(this);
    this.starServices.setPanelBar (this);
    
  

  }
  public togglePanel(): void {
    this.showPanelbar = !this.showPanelbar;

  }
  public logoff (){
    this.showLogn = true;
    this.showMenuButton = false;
    this.showPanelbar = false;
    this.router.navigate(['']);


  }
  public addToBody(NewVal:any){
    this.Body.push(NewVal);
    //if (this.paramConfig.DEBUG_FLAG) console.log('test:this.Body : '  + JSON.stringify(this.Body));
  }

  

  public setModuleName(id:any){
    if (this.paramConfig.DEBUG_FLAG) console.log("setModuleName:id:",id)
    if (this.paramConfig.DEBUG_FLAG) console.log("setModuleName:this.items.items:",this.items[0].items)
    var rec = this.items[0].items.find((x:any) => x.id === id);
    this.moduleName = rec.text;
    if (this.paramConfig.DEBUG_FLAG) console.log("setModuleName:this.moduleName:",this.moduleName)
  }

  public divClicked(){
    // this.showPanelbar = false;
  }


}



@Injectable()
export class UploadInterceptor implements HttpInterceptor {
 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url === 'saveUrl') {
      const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) => of(<HttpProgressEvent>{
        type: HttpEventType.UploadProgress,
        loaded: x,
        total: 100
      }).pipe(delay(1000)));

      const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
      events.push(success);

      return concat(...events);
    }

    if (req.url === 'removeUrl') {
        return of(new HttpResponse({ status: 200 }));
    }

    return next.handle(req);
  }


}
