import { Component, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AddEvent, GridComponent } from '@progress/kendo-angular-grid';
import {  componentConfigDef } from '@modeldir/model';
import { ruleDef } from '@modeldir/model';
import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { starServices } from 'starlib';
import { StarNotifyService } from '../../../services/starnotification.service';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';


const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

const createFormGroup = dataItem => new FormGroup({
  'MODULE': new FormControl(dataItem.MODULE, Validators.required),
  'FLOW_DESCRIPTION': new FormControl(dataItem.FLOW_DESCRIPTION),
  'MASTER_MODULE': new FormControl(dataItem.MASTER_MODULE),
  'MASTER_DB': new FormControl(dataItem.MASTER_DB),
  'ITEM_LEVEL': new FormControl(dataItem.ITEM_LEVEL),
  'CDR_TYPE': new FormControl(dataItem.CDR_TYPE),
  'COMMIT_FLOW': new FormControl(dataItem.COMMIT_FLOW),
  'COMMIT_STEP': new FormControl(dataItem.COMMIT_STEP),
  'COMMIT_RECORDS': new FormControl(dataItem.COMMIT_RECORDS),
  'FLOW_COMMENT': new FormControl(dataItem.FLOW_COMMENT),
  'FLOW_CATEGORY': new FormControl(dataItem.FLOW_CATEGORY)
});



const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
declare function getParamConfig(): any;


@Component({
  selector: 'adm-rules-flow',
  templateUrl: './adm-rules-tree.component.html',
  styleUrls: ['./adm-rules-tree.component.css']
})
export class AdmRulesTreeComponent implements OnInit, OnDestroy {
  //export class TestTreeComponent implements OnInit,OnDestroy {
  @ViewChild(GridComponent)

  public grid: GridComponent;
  @Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  // issues with RATING no proper parent, and ASNERICSON, KNETSRV, PAYGATE, RECON_SF, PAY_REV, ONE_INV, Significs gives error
  public sourceOpened = false;
  //public MODULE = "PRV_BLD";
  public cdrType2 = "PRV_CDR";
  public cdrType1 = "";
  private editedRowIndex: number;
  private formInitialValues = new ruleDef();
  private Body = [];

  public gridLgcHead: any[];
  public ITEM_MODULETitle = "Source"
  public showToolBar = true;
  private isNew: boolean;
  public isSTM_CDR_TYPE_1Enable: boolean = true;
  public isFilterable: boolean = false;
  public isColumnMenu: boolean = false;
  public isChild: boolean = false;
  public enableAppID: boolean = false;

  public showSteps: boolean = true;
  //  public showGridLgcHead: boolean = false;
  public showLgc: boolean = false;
  //  public showGridLgcGroup: boolean = false;
  public showApp: boolean = false;
  public showTable: boolean = false;
  public showTableCreate: boolean = false;
  public showSettingsDetail: boolean = false;
  public showSettingsUser: boolean = false;
  
  public showSqlWB: boolean = false;

  public showComp: boolean = false;
  public showAtt: boolean = false;
  public showScreen: boolean = false;
  public showCompAtt: boolean = false;
  public showCompItemAtt: boolean = false;
  public showItemAtt: boolean = false;
  public showScreenGrid: boolean = false;
  public showComps: boolean = false;
  public showCompsBuilt: boolean = false;
  public showLangs: boolean = false;
  public showCompLangs: boolean = false;
  public showScreenLangs: boolean = false;



  public showTables: boolean = false;
  public showScreens: boolean = false;
  public showFormDrag = false;
  public masterParams;








  //  public showGridCepJoinsDetails: boolean = false;
  //public LKP_LIKE = ["LKP","SND", "RCV", "SRV", "UPD", "DEL", "LOG", "FLOW", "TRANS", "MAP"];
  public form_ADM_RULE_DEF: ruleDef;
  public masterSaved = null;
  public currentOrder = null;

  /*= [
    {"ProductID": "Increment CMDNO and reset CMDTXT"}
  ]*/

  public gridDataLgcDetail: any[] = [
    { "ProductID": "customer numnber = 1" },
    { "ProductID": "and" },
    { "ProductID": "   customer id  = 1123" }
  ]
  public gridDataLgcGroup: any[] = [
    { "ProductID": "set customer status = ok" }
  ]
  public gridCepJoinsDef: any[] = [];
  public gridCepJoinsDetailsData: any[] = [];

  public data: any = [];
  public serverData: any = [];
  public default_MASTER_DB = "";

  private masterKey = "";
  private masterKeyName = "STM_CDR_TYPE_1";
  private insertCMD = "INSERT_CEP_JOIN_DETAILS";
  private updateCMD = "UPDATE_CEP_JOIN_DETAILS";
  private deleteCMD = "DELETE_CEP_JOIN_DETAILS";
  private getCMD = "GET_CEP_JOIN_DETAILS_QUERY";

  public executeQueryresult: any;
  public title = "Flow";
  public PDFfileName = this.title + ".PDF";
  public ExcelfileName = this.title + ".xlsx";

  public paramConfig;
  public componentConfig: componentConfigDef;
  private docClickSubscription: any;
  public formGroup: FormGroup; // for the grid

  public form: FormGroup;

  public APG_APPFormConfig: componentConfigDef;
  



 









  public MODULE = "";
  public routine_name = "PRVFLOW";
  public compSelector = 'adm-rules-flow';

  constructor(private starNotify: StarNotifyService, public starServices: starServices, private renderer: Renderer2) {


    this.paramConfig = getParamConfig();
    //this.MODULE = this.paramConfig.PrvUserFlow;
    //this.cdrType2 = this.paramConfig.PrvUserCDR;
    this.MODULE = this.starServices.sessionParams["PrvUserFlow"];
    this.cdrType2 = this.starServices.sessionParams["PrvUserCDR"];
    if (this.paramConfig.DEBUG_FLAG) console.log("this.MODULE:", this.MODULE)
    if (this.MODULE != "PRV_BLD") {
      this.enableAppID = true;
      this.routine_name = "ADMFLOW"
    }
    else {
      this.starServices.sessionParams["PrvUserFlow"] = "";
      this.starServices.sessionParams["PrvUserCDR"] = "";

    }



    this.componentConfig = new componentConfigDef();
    this.componentConfig.gridHeight = 500;
    this.componentConfig.showTitle = true;


  }
  private componentConfigChangeEvent: Subscription;
  public ngAfterViewInit() {
    this.starServices.setRTL();
    this.WHEN_NEW_FORM_INSTANCE();
    this.setlookupArrDef();
    if (this.paramConfig.DEBUG_FLAG) console.log("ngOnInit:flow");

  }
  public ngOnInit(): void {
    this.form = createFormGroup(
      this.formInitialValues
    );
    this.starServices.actOnParamConfig(this, this.routine_name);


    this.starServices.fetchLookups(this, this.lookupArrDef);
    if (this.paramConfig.DEBUG_FLAG) console.log("this.MODULE:", this.MODULE);
    if (typeof this.MODULE !== "undefined") {
      this.executeQuery(this.MODULE);
    }
    //  this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));

    // this.form_EMP_STEPS = new steps ();
    //this.grid_LGC_HEAD = new head ();
    //this.form_ADM_RULE_DEF= new joinsDef ();
    
    // Subscribing the event.
    this.componentConfigChangeEvent = this.starNotify.subscribeEvent<componentConfigDef>('componentConfigDef', componentConfig => {
      if (componentConfig.eventFrom != this.compSelector) {
        if (this.paramConfig.DEBUG_FLAG) console.log(":refresh:this.compSelector:", this.compSelector, " componentConfig.eventTo:", componentConfig.eventTo)
        if (componentConfig.eventTo.includes(this.compSelector) || componentConfig.eventTo.includes("any")) {
          this.handleComponentConfig(componentConfig);
        }
      }
    });
    if (this.paramConfig.DEBUG_FLAG) console.log("trace:this.selectedKeys:",this.selectedKeys)
  }
  public ngOnDestroy(): void {
    if (typeof this.componentConfigChangeEvent !== "undefined") this.componentConfigChangeEvent.unsubscribe();
    // this.docClickSubscription();
  }
  callStarNotify(componentConfig) {
    componentConfig.eventFrom = this.constructor.name;
    this.starNotify.sendEvent<componentConfigDef>('componentConfigDef', componentConfig);
  }
  //////////////////////////////////////////
  public buildTree(treeData) {
    var parents = 0;
    var itemsMain = {
      "text": "main",
      items: []
    };
    var parentArr = [];

    for (var i = 0; i < treeData.length; i++) {
      treeData[i].PROCESSING_ORDER = i + 1;
      //treeData[i].STEP_ID = i + 1;
      treeData[i].ITEM_LEVEL = parseInt(treeData[i].ITEM_LEVEL);
      treeData[i].DISABLED = 0;
      treeData[i].parent = "";
      treeData[i].isParent = "";
    }
    for (var i = 0; i < treeData.length; i++) {
      if ((i != 0) && (treeData[i].ITEM_LEVEL > treeData[i - 1].ITEM_LEVEL)) {
        treeData[i].parent = treeData[i - 1].STEP_ID;
        treeData[i - 1].isParent = "Y";
        parentArr.push(treeData[i - 1].STEP_ID);
      }
      else {
        if ((i != 0) && (treeData[i].ITEM_LEVEL == treeData[i - 1].ITEM_LEVEL) && (treeData[i - 1].parent != "")) {
          treeData[i].parent = treeData[i - 1].parent;
          //treeData[i].parent = parentArr[ treeData[i].ITEM_LEVEL -1];
        }
      }

      if ((i != 0) && (treeData[i].ITEM_LEVEL < treeData[i - 1].ITEM_LEVEL)) {
        while (parentArr.length > treeData[i].ITEM_LEVEL - 1)
          parentArr.pop();
        let parent = parentArr[parentArr.length - 1];

        treeData[i].parent = parentArr[parentArr.length - 1];
        //if (this.paramConfig.DEBUG_FLAG) console.log("i:parentArr:", i, treeData[i].DESCRIPTION, treeData[i].ITEM_LEVEL - 1, parentArr, parent);
      }

    }

    if (this.paramConfig.DEBUG_FLAG) console.log("Testing treeData:", treeData);

    function getChild(i, treeData, parentID) {
      let items = [];
      while (i < treeData.length) {
        if (treeData[i].parent == parentID) {
          var Elm = {
            "i": i, "text": treeData[i].DESCRIPTION, "type": treeData[i].ITEM_TYPE, "id": treeData[i].STEP_ID,
            "level": treeData[i].ITEM_LEVEL, "disabled": treeData[i].DISABLED, "order": treeData[i].PROCESSING_ORDER
            , items: []
          };
          if (treeData[i].isParent == "Y") {
            //console.log("getting children  for ", treeData[i].DESCRIPTION);
            let items = getChild(i + 1, treeData, treeData[i].STEP_ID);
            Elm.items = items;
          }
          items.push(Elm);
        }
        i++;
      }
      return items;
    }

    for (var i = 0; i < treeData.length; i++) {
      if ((treeData[i].parent == "") || (typeof treeData[i].parent === "undefined")) {
        var Elm = {
          "i": i, "text": treeData[i].DESCRIPTION, "type": treeData[i].ITEM_TYPE, "id": treeData[i].STEP_ID,
          "level": treeData[i].ITEM_LEVEL, "disabled": treeData[i].DISABLED, "order": treeData[i].PROCESSING_ORDER
          , items: []
        };
        if (treeData[i].isParent == "Y") {
          if (this.paramConfig.DEBUG_FLAG) console.log("getting children  for ", treeData[i].DESCRIPTION);
          let items = getChild(i + 1, treeData, treeData[i].STEP_ID);
          Elm.items = items;
        }
        itemsMain.items.push(Elm);
      }
    }


    if (this.paramConfig.DEBUG_FLAG) console.log("---itemsMain");


    if (this.paramConfig.DEBUG_FLAG) console.log("itemsMain.items:", itemsMain.items);
    return itemsMain.items;

  }
  public ITEM_TYPE = "";
  public ITEM_ID = "";
  public index = -1;
  //public expandedKeys: any[] = ['1','0'];
  public expandedKeys: any[] = [];

  public get_ids(data) {
    this.selectedKeys = [];

    if (this.ITEM_TYPE == "")
      return;
    this.index = -1;
    if (typeof data !== "undefined") {
      var i = 0;
      if (this.paramConfig.DEBUG_FLAG) console.log("trace:data:i:", i, this.ITEM_TYPE, this.ITEM_ID, data.length)
      while (i < data.length && this.index == -1) {
        if (this.paramConfig.DEBUG_FLAG) console.log("trace:data:i:", i, data[i])
        if (data[i].type == this.ITEM_TYPE) {
          if (data[i].text == this.ITEM_ID) {
            if (this.paramConfig.DEBUG_FLAG) console.log("trace:found :i: ", i, data[i]);
            this.index = data[i].i;
            break;
          }
        }
        else {
          if (this.index == -1) {
            let dataChild = data[i].items;
            var j = 0;
            while (j < dataChild.length) {
              if (this.paramConfig.DEBUG_FLAG) console.log("trace:dataChild:j:", j, dataChild[j])
              if (dataChild[j].type == this.ITEM_TYPE) {
                if (dataChild[j].text == this.ITEM_ID) {
                  if (this.paramConfig.DEBUG_FLAG) console.log("trace:found :j: ", j, data[i].i ,dataChild[j].i);
                  this.index =  dataChild[j].i;
                  if (!this.expandedKeys.includes(data[i].i))
                    this.expandedKeys.push(data[i].i);
                  if (this.paramConfig.DEBUG_FLAG) console.log("trace:this.index : data[i].i:", this.index, data[i].i), this.expandedKeys;
                  break;
                }
              }
              j++;
            }
          }
        }
        i++;
      }
    }
    if (this.index != -1) {
      
      this.selectedKeys = [this.index];
      if (this.paramConfig.DEBUG_FLAG) console.log("trace:this.selectedKeys:",this.selectedKeys)
    }
  }
  public executeQuery(MODULE: any): void {
    var getCMD = "GET_RULE_TREE";
    let userName = this.starServices.MASTER_DB;

    var page = "&_query=" + getCMD + "&MODULE=" + this.MODULE ;

    page = encodeURI(page);


    this.starServices.fetch(this, page).subscribe(result => {
      if (this.paramConfig.DEBUG_FLAG) console.log("executeQuery result:");
      if (this.paramConfig.DEBUG_FLAG) console.log(result.data[0].data);
      if (result != null) {
        this.serverData = result.data[0].data;
        this.data = this.buildTree(result.data[0].data);
        if (this.paramConfig.DEBUG_FLAG) console.log("trace:this.data:", this.data)
        if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys[0]:", this.selectedKeys)

        this.get_ids(this.data);

        if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys[0]:" + JSON.stringify(this.selectedKeys));
        if (this.paramConfig.DEBUG_FLAG) console.log("this.currentOrder:" + this.currentOrder)
        var treeID = 0;
        if (typeof this.data !== "undefined") {
          if (this.currentOrder != null) {
            var i = 0;
            while (i < this.data.length) {
              if (this.paramConfig.DEBUG_FLAG) console.log("currentOrder:", this.data[i].order, this.currentOrder)
              if (this.data[i].order == this.currentOrder) {
                treeID = i;
                break;
              }
              i++;
            }
          }
        }
        // this.selectedKeys = [];
        // this.selectedKeys.push(treeID);
        // if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys:", this.selectedKeys, " treeID:", treeID);
        // this.actonSelection(treeID);

        // var masterParams = {
        //   MODULE: this.MODULE,
        //   USERNAME: this.starServices.MASTER_DB
        // }
        // this.APG_APPFormConfig = new componentConfigDef();
        // this.APG_APPFormConfig.masterParams = masterParams;
        if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys:", this.selectedKeys);
        let index = -1;
        let itemType = "";
        if (this.selectedKeys.length == 0){
          let whereClause = " MODULE = '" + this.MODULE + "' AND USERNAME= '" + this.starServices.MASTER_DB + "' ";
          var Page = "&_WHERE=" + whereClause;
          this.APG_APPFormConfig = new componentConfigDef();
          this.APG_APPFormConfig.formattedWhere = Page;
          index = -1;
          itemType = "APP";
          if (typeof this.masterParams != "undefined") {
            if (this.masterParams.length != 0) {
              let screen = this.masterParams.screen;
              let i = 0;
              while (i < this.serverData.length) {
                if (this.serverData[i].ITEM_TYPE == screen) {
                  itemType = this.serverData[i].ITEM_TYPE;
                  index = i;
                  this.masterParams = {};
                  break;
                }
                i++;
              }
            }
          }
        }
        else{
          itemType = this.ITEM_TYPE;
          index = this.index;
        }


        this.showHideComponents(itemType, index);
      }


    },
      err => {
        alert('error:' + err.message);
      });

    //this.starServices.executeQuery_form( form, this);
  }
  public iconClass({ text, type, items }: any): any {
    //if (this.paramConfig.DEBUG_FLAG) console.log("iconClass:" + type + " " + text +  " items:" + items)
    return {
      'k-i-filter': type == 'LGC',
      'k-i-folder': type == 'GRP',
      'k-i-eye': type == 'CDR_G',

      'k-i-find': type == 'LKP',
      //'k-i-file-add': type == 'LOG' ,
      'k-i-plus-circle': type == 'LOG',

      'k-i-save': type == 'UPD',
      'k-i-group': type == 'FLOW',
      'k-i-arrow-chevron-right': type == 'CALL',
      'k-i-arrow-chevron-left': type == 'RET',
      'k-i-cancel': type == 'ABRT',


      'k-i-arrow-60-down': type == 'SND',
      'k-i-arrow-60-up': type == 'RCV',
      'k-i-arrows-no-change': type == 'SRV',

      'k-i-delete': type == 'DEL',
      'k-i-close-circle': type == 'EXP',
      'k-i-graph': type == 'STM',

      'k-i-copy': type == 'CPY',
      'k-i-move': type == 'MOV',
      'k-i-file-error': type == 'SNS',
      'k-i-exe': type == 'SYS',
      'k-i-logout': type == 'TRANS',

      //  'k-i-question': items !== undefined,
      'k-icon': true
    };
  }
  async getCompInfo(MODULE, userName, compID) {
    let body = [
      {
        "_QUERY": "GET_APG_COMP",
        "MODULE": MODULE,
        "USERNAME": userName,
        "COMP_ID": compID
      }
    ]

    let compType = ""
    let data = await this.starServices.execSQLBody(this, body, "");
    if (this.paramConfig.DEBUG_FLAG) console.log("getCompType:data[0].data:", data[0].data[0] );
    if (typeof data[0].data[0] != "undefined") {
      compType = data[0].data[0].COMP_TYPE;
      return data[0].data[0];
    }

  }

  async getCompBuiltType(MODULE, userName, compID) {
    let body = [
      {
        "_QUERY": "GET_APG_COMP_BUILT",
        "MODULE": MODULE,
        "USERNAME": userName,
        "COMP_ID": compID
      }
    ]

    let compType = ""
    let data = await this.starServices.execSQLBody(this, body, "");
    if (this.paramConfig.DEBUG_FLAG) console.log("getCompType:data[0].data:", data[0].data[0] );
    if (typeof data[0].data[0] != "undefined") {
      compType = data[0].data[0].COMP_TYPE;
    }
    return compType;
  }

  async home(){
   
  }

  public hideAll(){
    this.showApp = false;
    this.showSqlWB = false;
    
  }
  async showHideComponents(ITEM_TYPE, treeNode) {
    if (this.paramConfig.DEBUG_FLAG) console.log("showHideComponents:ITEM_TYPE:", ITEM_TYPE);
    this.hideAll();
 

    if (ITEM_TYPE == "RULE_TRIGGER") {
      this.showApp = true;
      await this.starServices.sleep(300);
      let stepID = this.serverData[treeNode].STEP_ID;
      let array = stepID.split("|");
      let ruleID = array[2];
      let formattedWhere_rule = "&_WHERE=" + "  RULE_ID= '" + ruleID + "'";
      let masterParams = {
        showForm: true,
        formattedWhere_rule: formattedWhere_rule
      }
      this.APG_APPFormConfig = new componentConfigDef();
      this.APG_APPFormConfig.masterParams = masterParams;
    }
    else  if (ITEM_TYPE == "QUERY_DEF") {
        this.showSqlWB = true;
        await this.starServices.sleep(300);
      let stepID = this.serverData[treeNode].STEP_ID;
      let array = stepID.split("|");
      let ruleID = array[2];
      let formattedWhere_rule = "&_WHERE=" + "  RULE_ID= '" + ruleID + "'";
      let masterParams = {
        showForm: false,
        formattedWhere_rule: formattedWhere_rule
      }
      this.APG_APPFormConfig = new componentConfigDef();
      this.APG_APPFormConfig.masterParams = masterParams;
      }
    


  }
  public keys: string[] = [];

  public selectedKeys: any[] = []; //fuad

  public actonSelection(i) {
    if (this.paramConfig.DEBUG_FLAG) console.log("this.serverData[i]:", this.serverData[i]);

    var masterParams = {
      MODULE: this.MODULE,
      USERNAME: this.starServices.MASTER_DB
    }


    // this.APG_TABLE_TABLE_COLUMNSFormConfig = new componentConfigDef();
    // this.APG_TABLE_TABLE_COLUMNSFormConfig.masterParams = masterParams;

    // this.APG_APP_COMPFormConfig = new componentConfigDef();
    // this.APG_APP_COMPFormConfig.masterParams = masterParams;

    // this.APG_COMP_ATTGridConfig = new componentConfigDef();
    // this.APG_COMP_ATTGridConfig.masterParams = masterParams;

    // this.APG_SCREEN_COMPConfig = new componentConfigDef();
    // this.APG_SCREEN_COMPConfig.masterParams = masterParams;

    // this.APG_COMP_ATTFormConfig = new componentConfigDef();
    // this.APG_COMP_ATTFormConfig.masterParams = masterParams;


    //this.showHideComponents("APP");


    // var masterKeyArr = [this.serverData[i].MODULE, this.serverData[i].STEP_ID];
    // var masterKeyNameArr = ["MODULE", "STEP_ID"];

    // this.form_EMP_STEPS = new steps();

    // for (var j = 0; j < masterKeyNameArr.length; j++) {
    //   if (this.paramConfig.DEBUG_FLAG) console.log(masterKeyNameArr[j] + ":" + masterKeyArr[j])
    //   this.form_EMP_STEPS[masterKeyNameArr[j]] = masterKeyArr[j];
    // }
    // this.form_EMP_STEPS.CDR_TYPE = this.cdrType2;

    // this.APG_APP_TREEFormConfig = new componentConfigDef();
    // this.APG_APP_TREEFormConfig.masterKeyArr = masterKeyArr;
    // this.APG_APP_TREEFormConfig.masterKeyNameArr = masterKeyNameArr;
    // var prevOrder = -1;
    // var nextOrder = -1;
    // if (i != 0) {
    //   if (this.paramConfig.DEBUG_FLAG) console.log("order prev:" + this.serverData[i - 1].PROCESSING_ORDER)
    //   prevOrder = this.serverData[i - 1].PROCESSING_ORDER;
    // }
    // if (this.paramConfig.DEBUG_FLAG) console.log("order plen:" + this.serverData.length + " i :" + i)
    // if (this.serverData.length > i + 1) {
    //   nextOrder = this.serverData[i + 1].PROCESSING_ORDER;
    // }


    // this.form_ADM_RULE_DEF = new app();


    // var NewVal: any = {};
    // this.cdrType1 = this.serverData[i].ITEM_MODULE;
    // if (this.paramConfig.DEBUG_FLAG) console.log("this.cdrType1:" + this.cdrType1)

    this.showHideComponents(this.serverData[i].ITEM_TYPE, i);

    // var masterParams = {
    //   MODULE: this.MODULE,
    //   USERNAME: this.starServices.MASTER_DB
    // }

    // if (this.serverData[i].ITEM_TYPE == "LGC") {
    //   var masterKeyArr = [this.serverData[i].MODULE, this.serverData[i].ITEM_PARAM, this.serverData[i].ITEM_PARAM2];
    //   var masterKeyNameArr = ["LGC_MODULE", "LGC_TYPE", "LGC_CALL_TYPE"];
    //   this.grid_LGC_HEAD = new head();
    //   for (var j = 0; j < masterKeyNameArr.length; j++) {
    //     if (this.paramConfig.DEBUG_FLAG) console.log(masterKeyNameArr[j] + ":" + masterKeyArr[j])
    //     this.grid_LGC_HEAD[masterKeyNameArr[j]] = masterKeyArr[j];
    //   }
    //   this.LGC_HEADGridConfig = new componentConfigDef();
    //   this.LGC_HEADGridConfig.masterKeyArr = [this.serverData[i].MODULE, this.serverData[i].ITEM_PARAM, this.serverData[i].ITEM_PARAM2];
    //   this.LGC_HEADGridConfig.masterKeyNameArr = ["LGC_MODULE", "LGC_TYPE", "LGC_CALL_TYPE"];
    //   this.LGC_HEADGridConfig.masterParams = masterParams;
    // }
    // else if (this.paramConfig.LKP_LIKE.includes(this.serverData[this.selectedKeys[0]].ITEM_TYPE)) {
    //   var masterKeyArr = [this.serverData[i].MODULE, this.serverData[i].ITEM_MODULE, this.cdrType2, this.serverData[i].ITEM_PARAM3];
    //   var masterKeyNameArr = ["MODULE", "CDR_TYPE_1", "CDR_TYPE_2", "JOIN_DEF"];

    // this.form_ADM_RULE_DEF = new app();


    // for (var j = 0; j < masterKeyNameArr.length; j++) {
    //   if (this.paramConfig.DEBUG_FLAG) console.log(masterKeyNameArr[j] + ":" + masterKeyArr[j])
    //   this.form_ADM_RULE_DEF[masterKeyNameArr[j]] = masterKeyArr[j];
    // }

    // this.APG_APPFormConfig = new componentConfigDef();
    // this.APG_APPFormConfig.masterKeyArr = [this.serverData[i].MODULE, this.serverData[i].ITEM_MODULE, this.cdrType2, this.serverData[i].ITEM_PARAM3];
    // this.APG_APPFormConfig.masterKeyNameArr = ["MODULE", "CDR_TYPE_1", "CDR_TYPE_2", "JOIN_DEF"];
    // this.APG_APPFormConfig.masterParams = masterParams;

    // }

  }

  public handleSelection({ index }: any): void {
    //this.selectedKeys = [index];
    if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys[0]:", this.selectedKeys)
    if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys[0]:" + JSON.stringify(this.selectedKeys));
    if (this.paramConfig.DEBUG_FLAG) console.log("this.selectedKeys:" + this.selectedKeys + " " + this.serverData[this.selectedKeys[0]].ITEM_MODULE);
    this.actonSelection(this.selectedKeys[0]);

  }

  // public isItemSelected = (_: any, index: string) =>
  // this.selectedKeys.indexOf(index) > -1;
  public fetchLookupsCallBack() {
    this.default_MASTER_DB = this.starServices.MASTER_DB;
  }

  public userLang = "EN";

  public lookupArrDef =[];
  public setlookupArrDef(){
  this.lookupArrDef =[
    {"statment":"select CHOICE CODE, TEXT CODETEXT_LANG from MENUS m where MENU  in ('APPS','MAIN') and LANGUAGE_NAME = '" + this.userLang + "' order by CODETEXT_LANG ",
    
  "lkpArrName":"lkpArrMODULE"}
  ];

  this.starServices.fetchLookups(this, this.lookupArrDef);
}


  
  public lkpArrMODULE = [];
  public lkpArrAPG_DBS = [];

  public lkpArrGetMODULE(CODE: any): any {
    // Change x.CODE below if not from SOM_TABS_CODE
    var rec = this.lkpArrMODULE.find(x => x.CODE === CODE);
    return rec;
  }
  public populateTree(object, result) {
    if (object.paramConfig.DEBUG_FLAG)  console.log("got data:", result);
    if (object.paramConfig.DEBUG_FLAG)  console.log("result:", result.data[0].data);
    if (typeof result.data[0].data[0].MODULE != "undefined") {
      object.MODULE = result.data[0].data[0].MODULE;
      object.executeQuery(object.MODULE);
    }


  }

  public valueChangeMODULE(value: any): void {
    //This is for combobox value change
    if (this.paramConfig.DEBUG_FLAG) console.log("pass:valueChangeMODULE:value:", value)
    this.MODULE = value;
    this.Body = [];
    var formVal = this.form.value;
    if (typeof formVal.MODULE != "undefined") {
      //this.readCompletedOutput.emit(formVal);
      var NewVal = {
        "MODULE": value,
        "RULE_ID": "%"
      };
      NewVal["_QUERY"] = "GET_ADM_RULE_DEF";


      this.addToBody(NewVal);


      this.starServices.performPost(this, this.populateTree);
    }
  }
  public valueChangeMASTER_DB(value: any): void {
    //This is for combobox value change
    if (this.paramConfig.DEBUG_FLAG) console.log("valueChangeMASTER_DB:value:", value)
    this.Body = [];
    var formVal = this.form.value;
    console.log("formVal:", formVal);
    this.starServices.MASTER_DB = value;
    this.setlookupArrDef();
    this.form.patchValue({ 'MODULE': '' });
    
    this.data=[];
    this.hideAll();
  }

  
  private addToBody(NewVal) {
    this.Body.push(NewVal);
  }
  onChanges(): void {

  }



  public saveCompletedHandler(form_ADM_RULE_DEF_TREE) {
    if (this.paramConfig.DEBUG_FLAG) console.log("saveCompletedHandler:form_ADM_RULE_DEF_TREE:", form_ADM_RULE_DEF_TREE)
    this.currentOrder = form_ADM_RULE_DEF_TREE.PROCESSING_ORDER;
    this.APG_APPFormConfig = new componentConfigDef();
    this.APG_APPFormConfig.masterSaved = form_ADM_RULE_DEF_TREE;



    this.executeQuery(this.MODULE);

  }

  public clearCompletedHandler(form_ADM_RULE_DEF_TREE) {
    if (this.paramConfig.DEBUG_FLAG) console.log("clearCompletedHandler:")
    //this.grid_LGC_HEAD = new head();
    //this.form_ADM_RULE_DEF= new joinsDef ();
 
  }
  public setComponentConfigHandler(ComponentConfig: componentConfigDef) {
    if (this.paramConfig.DEBUG_FLAG) console.log("steps ComponentConfig:", ComponentConfig);

    // if (typeof ComponentConfig !== "undefined") {
    //   this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
    //   if (ComponentConfig.setScreen != null)
    //     this.showHideComponents(ComponentConfig.setScreen.ITEM_TYPE,-1)
    // }

  }

  public handleComponentConfig(ComponentConfig) {
    if (typeof ComponentConfig !== "undefined") {
      if (this.paramConfig.DEBUG_FLAG) console.log("appTree ComponentConfig:", ComponentConfig);

      this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig);
      if (ComponentConfig.masterParams != null) {
        this.masterParams = ComponentConfig.masterParams;
        
        if (this.masterParams.screen == "MASTER_DB") {
            this.data=[];
             this.form.patchValue({ 'MODULE': '' });
             this.MODULE = "";
             

             let lookupArrDef = [{
              "statment": "SELECT    MODULE CODE, APP_NAME CODETEXT_LANG  FROM APG_APP WHERE USERNAME ='" 
              + this.starServices.MASTER_DB  + "'",
              "lkpArrName": "lkpArrMODULE"
            }];
            this.starServices.fetchLookups(this, lookupArrDef);
        }
        else
        if (this.masterParams.screen == "CR_WS") {
          this.data=[];
          this.form.patchValue({ 'MASTER_DB': '' });
          this.form.patchValue({ 'MODULE': '' });
          let lookupArrDef = [{
            "statment": "SELECT    MODULE CODE, APP_NAME CODETEXT_LANG  FROM APG_APP WHERE USERNAME ='" 
            + this.starServices.MASTER_DB  + "'",
            "lkpArrName": "lkpArrMODULE"
          }];
          this.starServices.fetchLookups(this, lookupArrDef);
        }
        else if (this.masterParams.screen == "REMOVE_WS") {

        }

        else if (this.masterParams.screen == "APPREMOVE") {
          console.log("here1:", this.starServices.MASTER_DB)
          this.lkpArrMODULE = [];
          this.data=[];
          this.hideAll();
          this.showApp = true;
          this.form.patchValue({ 'MODULE': '' });
          let lookupArrDef = [{
            "statment": "SELECT    MODULE CODE, APP_NAME CODETEXT_LANG  FROM APG_APP WHERE USERNAME ='" 
            + this.starServices.MASTER_DB  + "'",
            "lkpArrName": "lkpArrMODULE"
          }];
          this.starServices.fetchLookups(this, lookupArrDef);

        }
        else if (this.masterParams.screen == "APP") {
          this.MODULE = this.masterParams.data.MODULE;
          this.lkpArrMODULE = [];
          this.executeQuery(this.MODULE);
          let lookupArrDef = [{
            "statment": "SELECT MODULE CODE, APP_NAME CODETEXT_LANG  FROM APG_APP WHERE USERNAME ='" 
            + this.starServices.MASTER_DB  + "'",
            "lkpArrName": "lkpArrMODULE"
          }];
          this.starServices.fetchLookups(this, lookupArrDef);
          this.form.patchValue({ 'MODULE': this.MODULE });
        }
        else {
          this.ITEM_TYPE = this.masterParams.ITEM_TYPE;
          this.ITEM_ID = this.masterParams.ITEM_ID;
          this.executeQuery(this.MODULE);

        }

      }

    }
  }
  WHEN_NEW_FORM_INSTANCE() {
    this.home();
    // this.showApp = true;
    // let whereClause = "  USERNAME= '" + this.starServices.MASTER_DB + "' ";
    // var Page = "&_WHERE=" + whereClause;
    // this.APG_APPFormConfig = new componentConfigDef();
    // this.APG_APPFormConfig.formattedWhere = Page;
    // this.APG_APPFormConfig.masterReadCompleted =true;
  }
}

