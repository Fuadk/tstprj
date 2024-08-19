
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmBlankComponent} from '../components/adm/adm-blank/adm-blank.component';


import HomeComponent from '../components/OtherComponents/home.component';

import { DspDashboardComponent } from '../components/dsp/dsp-dashboard/dsp-dashboard.component';
import {AdmTeamUsersComponent} from   '../components/adm/adm-team-users/adm-team-users.component';
import {AdmTeamDutiesComponent} from '../components/adm/adm-team-duties/adm-team-duties.component';

import {DspTemplatesComponent} from '../components/dsp/dsp-templates/dsp-templates.component';
import {DspTemplateFormComponent} from '../components/dsp/dsp-template-form/dsp-template-form.component';
import {DspTemplateDetailComponent} from '../components/dsp/dsp-template-detail/dsp-template-detail.component';
import { DspOrdersFormComponent } from '../components/dsp/dsp-orders-form/dsp-orders-form.component';
import { DspOrdersGridComponent } from '../components/dsp/dsp-orders-grid/dsp-orders-grid.component';
import { AdmTeamFormComponent } from '../components/adm/adm-team-form/adm-team-form.component';
import { DspOrderTemplatesComponent } from '../components/dsp/dsp-order-templates/dsp-order-templates.component';
import { DspTemplateDetailGridComponent } from '../components/dsp/dsp-template-detail-grid/dsp-template-detail-grid.component';
import { DspOrderOrdersComponent } from '../components/dsp/dsp-order-orders/dsp-order-orders.component';
import { DspWorkOrdersGridComponent } from '../components/dsp/dsp-work-orders-grid/dsp-work-orders-grid.component';
import { DspOrderWorkOrdersComponent } from '../components/dsp/dsp-order-work-orders/dsp-order-work-orders.component';
import { DspOrderWorkOrdersGgComponent } from '../components/dsp/dsp-order-work-orders-gg/dsp-order-work-orders-gg.component';
import { AdmUserDutiesComponent } from '../components/adm/adm-user-duties/adm-user-duties.component';
import { DspWorkOrdersMyComponent } from '../components/dsp/dsp-work-orders-my/dsp-work-orders-my.component';
import { DspReportsComponent } from '../components/dsp/dsp-reports/dsp-reports.component';
import { DspDynamicGridComponent } from '../components/dsp/dsp-dynamic-grid/dsp-dynamic-grid.component';
import { DspDynamicRwGridComponent } from '../components/dsp/dsp-dynamic-rw-grid/dsp-dynamic-rw-grid.component';
import { DspDynamicRwFormComponent } from '../components/dsp/dsp-dynamic-rw-form/dsp-dynamic-rw-form.component';
import { DspWorkOrdersFormComponent } from '../components/dsp/dsp-work-orders-form/dsp-work-orders-form.component';
import { DspMultistepComponent } from '../components/dsp/dsp-multistep/dsp-multistep.component';
//import { DspEkycComponent } from '../../../../ekyc/src/app/components/dsp/dsp-ekyc/dsp-ekyc.component';
import { DspFormComponent } from '../components/dsp/dsp-form/dsp-form.component';
import { DspFormAreaGridComponent } from '../components/dsp/dsp-form-area-grid/dsp-form-area-grid.component';
import { DspFormPageFormOrgComponent } from '../components/dsp/dsp-form-page-form_org/dsp-form-page-form-org.component';
import { DspFormFieldsGridComponent } from '../components/dsp/dsp-form-fields-grid/dsp-form-fields-grid.component';
import { DspFormAreaFormComponent } from '../components/dsp/dsp-form-area-form/dsp-form-area-form.component';
import { DspFormDefFormComponent } from '../components/dsp/dsp-form-def-form/dsp-form-def-form.component';
import { DspFormFieldsFormComponent } from '../components/dsp/dsp-form-fields-form/dsp-form-fields-form.component';
import { DspFormDragComponent } from '../components/dsp/dsp-form-drag/dsp-form-drag.component';
import { DspFormPageFormComponent } from '../components/dsp/dsp-form-page-form/dsp-form-page-form.component';
import { DspWorkOrderArComponent } from '../components/dsp/dsp-work-order-ar/dsp-work-order-ar.component';
import { AppDspOrdersChartsSrvComponent } from '../components/dsp/app-dsp-orders-charts-srv/app-dsp-orders-charts-srv.component';


//////////
//point1

export const PanelbarRoutes: Routes = [
        { path: '', component: AdmBlankComponent },
        { path: 'home', component: HomeComponent },
        
        { path: 'PRVDASH', component: DspDashboardComponent },
        { path: 'adm_team_users', component: AdmTeamUsersComponent },
        { path: 'PRVPRES', component: AdmTeamDutiesComponent },
        { path: 'PRVTEMP', component: DspTemplatesComponent },
        { path: 'dsp_template_form', component: DspTemplateFormComponent },
        { path: 'dsp_template_detail', component: DspTemplateDetailComponent },
        { path: 'dsp_orders_form', component: DspOrdersFormComponent },
        { path: 'dsp_orders_grid', component: DspOrdersGridComponent },
        { path: 'PRVTEAM', component: AdmTeamFormComponent },
        { path: 'PRVORDERC', component: DspOrderTemplatesComponent },
        { path: 'dsp_template_detail_grid', component: DspTemplateDetailGridComponent },
        { path: 'dsp_order_orders', component: DspOrderOrdersComponent },
        { path: 'dsp_order_orders', component: DspOrderOrdersComponent },
        { path: 'dsp_work_orders_grid', component: DspWorkOrdersGridComponent },
        { path: 'PRVORDERE', component: DspOrderWorkOrdersComponent },
        { path: 'PRVORDEROV', component: DspOrderWorkOrdersGgComponent },
        { path: 'PRVRESO', component: AdmUserDutiesComponent },
        { path: 'PRVMYWO', component: DspWorkOrdersMyComponent },
        { path: 'PRVRPRT', component: DspReportsComponent },  
        { path: 'dsp_dynamic_grid', component: DspDynamicGridComponent },
        { path: 'PRVDASH', component: DspDashboardComponent },
        { path: 'dsp_dynamic_rw_grid', component: DspDynamicRwGridComponent },
        { path: 'dsp_dynamic_rw_form', component: DspDynamicRwFormComponent },
        { path: 'dsp_work_orders_form', component: DspWorkOrdersFormComponent },
        { path: 'dsp_multistep', component: DspMultistepComponent },
        { path: 'PRVFORM', component: DspFormComponent },
        { path: 'dsp_form_area_grid', component: DspFormAreaGridComponent },
        { path: 'dsp_form_page_form_org', component: DspFormPageFormOrgComponent },
        { path: 'dsp_form_fields_grid', component: DspFormFieldsGridComponent },
        { path: 'dsp_form_area_form', component: DspFormAreaFormComponent },
        { path: 'dsp_form_def_form', component: DspFormDefFormComponent },
        { path: 'dsp_form_fields_form', component: DspFormFieldsFormComponent },
        { path: 'PRVFORMD', component: DspFormDragComponent },
        { path: 'dsp_form_page_form', component: DspFormPageFormComponent },
        //point2
        { path: 'PRVWORDERAR', component: DspWorkOrderArComponent },
        { path: 'PRVORDERSV', component: AppDspOrdersChartsSrvComponent },
        
		

		
		
////////////////////////////////

];



//if (this.paramConfig.DEBUG_FLAG) console.log(PanelbarRoutes);
export const appRoutingProviders: any[] = [
];

export const panelbarRouting: ModuleWithProviders<any> = RouterModule.forRoot(PanelbarRoutes);
//export const panelbarRouting: ModuleWithProviders = RouterModule.forRoot(PanelbarRoutes, { initialNavigation : false });
