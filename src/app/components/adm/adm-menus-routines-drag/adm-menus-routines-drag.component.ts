import { Component, OnInit} from '@angular/core';
import { menus, routines, componentConfigDef } from '@modeldir/model';
import { starServices } from 'starlib';
import { DropPosition, TreeItemDropEvent } from '@progress/kendo-angular-treeview';

declare function getParamConfig(): any;


@Component({
  selector: 'app-adm-menus-routines-drag',
  templateUrl: './adm-menus-routines-drag.component.html',
  styleUrls: ['./adm-menus-routines-drag.component.css']
})
export class AdmMenusRoutinesDragComponent implements OnInit {
  public showToolBar = false;
  public form_MENUS: menus;
  public form_ROUTINES: routines;

  public MENUSFormConfig: componentConfigDef;
  public ROUTINESFormConfig: componentConfigDef;
  public componentConfig: componentConfigDef;
  public paramConfig;
  public title = "Menus Routines Drag";
  public routineAuth = null;

  public panelItems = [];
  public menu;

  public currentMainMenu = ""
  public mainMenus = []
  public selectedMenuItems = []

  public selectMenuObject
  public allRoutines

  constructor(public starServices: starServices) {
    this.paramConfig = getParamConfig();
    this.componentConfig = new componentConfigDef();
  }

  public ngAfterViewInit() {
    this.starServices.setRTL();
  }

  ngOnInit(): void {
    this.starServices.actOnParamConfig(this, 'SOMMNUDRAG');
    this.starServices.fetchLookups(this, this.lookupArrDef);
    // this.form_MENUS = new menus();

    this.form_ROUTINES = new routines();
    this.MENUSFormConfig = new componentConfigDef();
    this.MENUSFormConfig.masterParams = {
      hideOthers: true
    }
    this.MENUSFormConfig.isMaster = true;
    this.MENUSFormConfig.routineAuth = this.routineAuth;

    this.ROUTINESFormConfig = new componentConfigDef();
    this.ROUTINESFormConfig.routineAuth = this.routineAuth;
    this.loadMenu();

   
  }
  public loadMenu(){
    let body = [
      {
        "_QUERY": "GET_MENU_ROUTINES",
        "MENU": "MAIN",
        "USERNAME": "%",
        "LANGUAGE_NAME":this.LangName,
        "CHOICES":"%"

      },
    ]

    this.starServices.post(this, "&_trans=Y", body).subscribe(res => {
      this.mainMenus = [
        {
          text: "Select module",
          items: res.data[0].data.map(e => {
            return {
              id: e["choice"],
              text: e["text"]
            }
          })
        }
      ]
      console.log("this.mainMenus:", this.mainMenus);
      this.currentMainMenu = this.mainMenus[0]["items"][0]["text"]

      body = [
        {
          "_QUERY": "GET_MENU_ROUTINES",
          "MENU": this.mainMenus[0]["items"][0]["choice_type"],
          "USERNAME": "%",
          "LANGUAGE_NAME":this.LangName,
          "CHOICES":"%"
        },
        {
          "_QUERY": "GET_ROUTINES_AUTHORITY",
          "MENU": "",
          "USERNAME": "%",
          "LANGUAGE_NAME":this.LangName,
          "CHOICES":"%"
        },
      ]

      this.starServices.post(this, "&_trans=Y", body).subscribe(res2 => {
        this.starServices.handleFetchedPanelBar(this, res2.data)
      })
    })
  }
  public readCompletedHandler(form_MENUS) {
    this.form_ROUTINES = new routines();
    this.form_ROUTINES.CHOICE = form_MENUS.CHOICE;
  }

  public clearCompletedHandler(form_MENUS) {
    this.form_ROUTINES = new routines();
  }

  public saveCompletedHandler(form_MENUS) {
    this.ROUTINESFormConfig = new componentConfigDef();
    this.ROUTINESFormConfig.masterSaved = form_MENUS;
    this.ROUTINESFormConfig.masterKey = form_MENUS.CHOICE;
  }

  public handleDrop(event: TreeItemDropEvent): void {
    let source = event.sourceItem.item.dataItem
    let dest = event.destinationItem.item.dataItem

    const invalidCategoryDropTarget = event.dropPosition === DropPosition.Over || (dest.children === undefined);
    const invalidProductDropTarget = (event.dropPosition === DropPosition.Over && (dest.children === undefined) ||
      (event.dropPosition !== DropPosition.Over && (dest.children !== undefined)));

    if ((source.children !== undefined && invalidCategoryDropTarget) || source.children === undefined && invalidProductDropTarget) {
      event.setValid(false);
      return;
    }

    event.setValid(true);
    
    setTimeout(() => {
      let body = [];
      this.panelItems.forEach(menuItem => {
        for (let i = 0; i < menuItem.children.length; i++) {
          let routine_name = this.allRoutines.find(e => e["CHOICE_TYPE"] == menuItem.children[i].choice)
          body.push({
            "_QUERY": "UPDATE_MENUS_MENU",
            ...routine_name,
            "LINE": i + 1,
            "MENU": menuItem.choice,
            "OLD_MENU": routine_name.MENU
          })
        }
      })

        this.starServices.post(this, "&_trans=Y", body).subscribe(res2 => {
          this.starServices.showNotification('success', "Sorted successfully");
        }, err => this.starServices.showNotification('error', err))
    }, 300);
  }
 public     LangName = "EN";
  selectMainMenu(menu) {
    console.log("menu:",menu);
    
    this.panelItems = []
    this.menu = null
    this.currentMainMenu = menu.item.text
    this.selectMenuObject = null

    let body = [
      {
        "_QUERY": "GET_MENU_ROUTINES",
        "MENU": menu.item.id,
        "USERNAME": "%",
        "LANGUAGE_NAME":this.LangName,
        "CHOICES":"%"
      },
      {
        "_QUERY": "GET_ROUTINES_AUTHORITY",
        "USERNAME": "%"
      },
      {
        "_QUERY": "GET_MENUS_QUERY"
      },
    ]

    this.starServices.post(this, "&_trans=Y", body).subscribe(res => {
      this.starServices.handleFetchedPanelBar(this, res.data)
      this.allRoutines = res.data[2].data;
    })
  }

  selectMenuItem() {
    setTimeout(() => {

      if (this.selectedMenuItems.length > 0) {
        let indeces = this.selectedMenuItems[0].split('_')
        let selectedItem = indeces.length == 1 ? this.panelItems[indeces[0]] : this.panelItems[indeces[0]].children[indeces[1]]

        if (this.selectMenuObject && this.selectMenuObject.choice == selectedItem.choice)
          return

        this.selectMenuObject = selectedItem

        let menu = new menus()
        menu.CHOICE = selectedItem.choice
        menu.LANGUAGE_NAME = this.LangName
        this.form_MENUS = menu
      }

    }, 200)
  }
  public langitems =[];
  public onSelectLang(e: any): void {
    if (this.paramConfig.DEBUG_FLAG) console.log(" in onSelect");
    if (this.paramConfig.DEBUG_FLAG) console.log(e.item);
    if (typeof e.item.id !== "undefined") {
      this.LangName =  e.item.id.toUpperCase();
      this.loadMenu();
      
   
    }

  }
  public userLang = "EN" ; 
  public lookupArrDef =[{
    "statment":"SELECT CODE id, CODETEXT_LANG text FROM SOM_TABS_CODES WHERE  CODENAME = 'LANGUAGE' AND LANGUAGE_NAME = 'EN' order by CODETEXT_LANG ",
    "lkpArrName": "lkpArrLANGS"
  }];
  
  public lkpArrLANGS = [];

  public fetchLookupsCallBack() {

   // this.langitems[0].items = this.lkpArrLANGS[0];
    console.log ("bug:this.lkpArrLANGS:",this.lkpArrLANGS);
    this.langitems =
      [{
        text: this.starServices.getNLS([],'SELECT_LANGUAGE','Select Language'),
        items: [{ text: 'English', id: "en" }
      //  , { text: 'Arabic', id: "ar" }, { text: 'German', id: "de" }
      ]
      }];
  
    this.langitems[0].items= this.lkpArrLANGS;
  }
}
