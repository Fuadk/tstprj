import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDashboardDefFormComponent } from './adm-dashboard-def-form.component';

describe('AdmDashboardDefFormComponent', () => {
  let component: AdmDashboardDefFormComponent;
  let fixture: ComponentFixture<AdmDashboardDefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmDashboardDefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDashboardDefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
