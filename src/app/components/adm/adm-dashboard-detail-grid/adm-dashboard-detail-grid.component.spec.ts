import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDashboardDetailGridComponent } from './adm-dashboard-detail-grid.component';

describe('AdmDashboardDetailGridComponent', () => {
  let component: AdmDashboardDetailGridComponent;
  let fixture: ComponentFixture<AdmDashboardDetailGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmDashboardDetailGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDashboardDetailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
