
import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//import { Routes , RouterModule } from '@angular/router';
import { ListViewModule } from "@progress/kendo-angular-listview";
//import 'hammerjs';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { MenuModule } from '@progress/kendo-angular-menu';
import { UploadModule } from '@progress/kendo-angular-upload';
import { EditorModule } from '@progress/kendo-angular-editor';
import { MessageService } from '@progress/kendo-angular-l10n';
import { GridModule , PDFModule, ExcelModule} from '@progress/kendo-angular-grid';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule , DropDownsModule} from '@progress/kendo-angular-dropdowns';
import { ChartsModule } from '@progress/kendo-angular-charts';
import {  NotificationModule } from '@progress/kendo-angular-notification';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DialogModule , DialogsModule} from '@progress/kendo-angular-dialog';
import { SortableModule } from '@progress/kendo-angular-sortable';

import { ICON_SETTINGS, IconsModule } from "@progress/kendo-angular-icons";

import { RTL } from '@progress/kendo-angular-l10n';
//import { environment } from '../environments/environment';//   src/environments/environment';
import {FocusModule} from 'angular2-focus';
//import { panelbarRouting, appRoutingProviders } from './routing/panelbar.routes';
import { NgxToggleModule } from '@nikiphoros/ngx-toggle';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
// import { SignaturePadModule } from 'ngx-signaturepad';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DiagramComponent } from './components/diagram/diagram.component';
import { NgEventBus } from 'ng-event-bus';

import { starServices } from 'starlib';
//import { Starlib1 } from './components/Starlib1';
import { panelbarRouting, appRoutingProviders } from './routing/panelbar.routes';
import { MyMessageService } from './services/my-message.service';

import { UploadInterceptor } from './app.component';

import HomeComponent from './components/OtherComponents/home.component';
import ReportsComponent from './components/OtherComponents/reports.component';
import { AdmLoginComponent } from './components/adm/adm-login/adm-login.component';
import { AdmBlankComponent } from './components/adm/adm-blank/adm-blank.component';

import { DspDashboardComponent } from './components/dsp/dsp-dashboard/dsp-dashboard.component';
import { DspDynamicChartComponent } from './components/dsp/dsp-dynamic-chart/dsp-dynamic-chart.component';
import { SomTabsCodesGridComponent } from './components/adm/som-tabs-codes-grid/som-tabs-codes-grid.component';

import { templateDetailDirective } from './components/dsp/dsp-template-detail/dsp-template-detail-binding';
import { AdmTeamUsersComponent } from './components/adm/adm-team-users/adm-team-users.component';
import { AdmTeamDutiesComponent } from './components/adm/adm-team-duties/adm-team-duties.component';

import { DspTemplateFormComponent } from './components/dsp/dsp-template-form/dsp-template-form.component';
import { DspTemplateDetailComponent } from './components/dsp/dsp-template-detail/dsp-template-detail.component';
import { DspTemplatesComponent } from './components/dsp/dsp-templates/dsp-templates.component';
 import { DspOrdersFormComponent } from './components/dsp/dsp-orders-form/dsp-orders-form.component';
 import { AdmTeamFormComponent } from './components/adm/adm-team-form/adm-team-form.component';
import { DspOrdersGridComponent } from './components/dsp/dsp-orders-grid/dsp-orders-grid.component';
import { DspOrderTemplatesComponent } from './components/dsp/dsp-order-templates/dsp-order-templates.component';
import { DspTemplateDetailGridComponent } from './components/dsp/dsp-template-detail-grid/dsp-template-detail-grid.component';
import { DspOrderOrdersComponent } from './components/dsp/dsp-order-orders/dsp-order-orders.component';
import { DspWorkOrdersGridComponent } from './components/dsp/dsp-work-orders-grid/dsp-work-orders-grid.component';
import { DspOrderWorkOrdersComponent } from './components/dsp/dsp-order-work-orders/dsp-order-work-orders.component';
import { DspOrderWorkOrdersGgComponent } from './components/dsp/dsp-order-work-orders-gg/dsp-order-work-orders-gg.component';
import { AdmUserDutiesComponent } from './components/adm/adm-user-duties/adm-user-duties.component';
import { AdmResourceInformationFormComponent } from './components/adm/adm-resource-information-form/adm-resource-information-form.component';
import { AdmUserDutyGridComponent } from './components/adm/adm-user-duty-grid/adm-user-duty-grid.component';
import { DspWorkOrdersMyComponent } from './components/dsp/dsp-work-orders-my/dsp-work-orders-my.component';
import { DspReportsComponent } from './components/dsp/dsp-reports/dsp-reports.component';
import { DspDynamicGridComponent } from './components/dsp/dsp-dynamic-grid/dsp-dynamic-grid.component';

import { DspDynamicRwGridComponent } from './components/dsp/dsp-dynamic-rw-grid/dsp-dynamic-rw-grid.component';
import { DspDynamicRwFormComponent } from './components/dsp/dsp-dynamic-rw-form/dsp-dynamic-rw-form.component';
import { DspWorkOrdersFormComponent } from './components/dsp/dsp-work-orders-form/dsp-work-orders-form.component';
import { DspMultistepComponent } from './components/dsp/dsp-multistep/dsp-multistep.component';
import { DspFormPageFormOrgComponent } from './components/dsp/dsp-form-page-form_org/dsp-form-page-form-org.component';
import { DspFormAreaGridComponent } from './components/dsp/dsp-form-area-grid/dsp-form-area-grid.component';
import { DspFormComponent } from './components/dsp/dsp-form/dsp-form.component';
import { DspFormFieldsGridComponent } from './components/dsp/dsp-form-fields-grid/dsp-form-fields-grid.component';
import { DspEditorFormComponent } from './components/dsp/dsp-editor-form/dsp-editor-form.component';
// // import { SignaturePadModule } from 'ngx-signaturepad';

// //import { SignaturePadModule } from 'angular2-signaturepad';

import { DspFormDefFormComponent } from './components/dsp/dsp-form-def-form/dsp-form-def-form.component';
import { DspFormAreaFormComponent } from './components/dsp/dsp-form-area-form/dsp-form-area-form.component';
import { DspFormFieldsFormComponent } from './components/dsp/dsp-form-fields-form/dsp-form-fields-form.component';
import { DspFormDragComponent } from './components/dsp/dsp-form-drag/dsp-form-drag.component';
import { DspFormPageFormComponent } from './components/dsp/dsp-form-page-form/dsp-form-page-form.component';

import { AppDspOrdersChartsSrvComponent } from './components/dsp/app-dsp-orders-charts-srv/app-dsp-orders-charts-srv.component';
import { DspWorkOrderArComponent } from './components/dsp/dsp-work-order-ar/dsp-work-order-ar.component';
import { AdmMenusRoutinesDragComponent } from './components/adm/adm-menus-routines-drag/adm-menus-routines-drag.component';
import { DspWorkOrderArGridComponent } from './components/dsp/dsp-work-order-ar-grid/dsp-work-order-ar-grid.component';
import { DspDiagramWrapComponent } from './components/dsp/dsp-diagram-wrap/dsp-diagram-wrap.component';

import { AdmRuleDefFormComponent } from './components/adm/adm-rule-def-form/adm-rule-def-form.component';
import { AdmRuleItemGridComponent } from './components/adm/adm-rule-item-grid/adm-rule-item-grid.component';
import { AdmRuleActionGridComponent } from './components/adm/adm-rule-action-grid/adm-rule-action-grid.component';
import { AdmRulesComponent } from './components/adm/adm-rules/adm-rules.component';
import { AdmRuleHostFormComponent } from './components/adm/adm-rule-host-form/adm-rule-host-form.component';
import { AdmRuleHostMapFormComponent } from './components/adm/adm-rule-host-map-form/adm-rule-host-map-form.component';
import { AdmRulesHostsComponent } from './components/adm/adm-rules-hosts/adm-rules-hosts.component';
import { AdmRuleKeysGridComponent } from './components/adm/adm-rule-keys-grid/adm-rule-keys-grid.component';
import { AdmRuleLogGridComponent } from './components/adm/adm-rule-log-grid/adm-rule-log-grid.component';
import { AdmRuleLogFormComponent } from './components/adm/adm-rule-log-form/adm-rule-log-form.component';
import { AdmRulesTreeComponent } from './components/adm/adm-rules-tree/adm-rules-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    HomeComponent,
    ReportsComponent,
    AdmLoginComponent,
    AdmBlankComponent,

    DspDashboardComponent,
    DspDynamicChartComponent,
    SomTabsCodesGridComponent,

    templateDetailDirective ,
 AdmTeamUsersComponent,
 AdmTeamDutiesComponent,
 DspTemplateFormComponent ,
 DspTemplateDetailComponent ,
 DspTemplatesComponent ,
  DspOrdersFormComponent ,
 AdmTeamFormComponent,
 DspOrdersGridComponent ,
 DspOrderTemplatesComponent ,
 DspTemplateDetailGridComponent ,
 DspOrderOrdersComponent ,
 DspWorkOrdersGridComponent ,
 DspOrderWorkOrdersComponent ,
 DspOrderWorkOrdersGgComponent ,
 AdmUserDutiesComponent,
 AdmResourceInformationFormComponent,
 AdmUserDutyGridComponent,
 DspWorkOrdersMyComponent,
 DspReportsComponent,
 DspDynamicGridComponent ,
 
 AdmRuleDefFormComponent 	,
 AdmRuleItemGridComponent 	,
 AdmRuleActionGridComponent 	,
 AdmRulesComponent 	,
 AdmRuleHostFormComponent 	,
 AdmRuleHostMapFormComponent 	,
 AdmRulesHostsComponent 	,
 AdmRuleKeysGridComponent 	,
 AdmRuleLogGridComponent 	,
 AdmRuleLogFormComponent 	,
 AdmRulesTreeComponent 	,

 DspDynamicRwGridComponent ,
 DspDynamicRwFormComponent ,
 DspWorkOrdersFormComponent ,
 DspMultistepComponent ,
 DspFormPageFormOrgComponent ,
 DspFormAreaGridComponent ,
 DspFormComponent ,
 DspFormFieldsGridComponent ,
 DspEditorFormComponent ,
//  SignaturePadModule ,
 DspFormDefFormComponent ,
 DspFormAreaFormComponent ,
 DspFormFieldsFormComponent ,
 DspFormDragComponent ,
 DspFormPageFormComponent ,
 AppDspOrdersChartsSrvComponent ,
 DspWorkOrderArComponent ,
 AdmMenusRoutinesDragComponent ,
 DspWorkOrderArGridComponent,
 DspDiagramWrapComponent,
 

  
  ],
  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    AppRoutingModule,
BrowserAnimationsModule,
BrowserModule,
ButtonsModule,
ChartsModule,
DateInputsModule,
DialogModule,
DialogsModule,
DropDownListModule,
DropDownsModule,
EditorModule,
ExcelModule,
FormsModule,
GridModule,
HttpClientModule,
IndicatorsModule,
InputsModule,
LabelModule,
LayoutModule,

MenuModule,
NgxToggleModule,
NotificationModule,
panelbarRouting,
PDFExportModule,
PDFModule,
ReactiveFormsModule,

SortableModule,
ToolBarModule,
TreeViewModule,
IconsModule,
UploadModule,
WindowModule,
  ],
  providers:    [

    starServices,
    { provide: MessageService, useClass: MyMessageService } ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadInterceptor,
      multi: true
    },
    { provide: RTL, useValue: "document.documentElement.dir == 'rtl'" },
    appRoutingProviders,
    { provide: APP_BASE_HREF, useValue : window.location.pathname },
    {provide: ICON_SETTINGS, useValue: { type: 'font' }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
