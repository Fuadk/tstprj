import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDashboardDefComponent } from './adm-dashboard-def.component';

describe('AdmDashboardDefComponent', () => {
  let component: AdmDashboardDefComponent;
  let fixture: ComponentFixture<AdmDashboardDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmDashboardDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDashboardDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
