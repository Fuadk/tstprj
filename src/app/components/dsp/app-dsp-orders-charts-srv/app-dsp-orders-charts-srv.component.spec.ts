import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDspOrdersChartsSrvComponent } from './app-dsp-orders-charts-srv.component';

describe('AppDspOrdersChartsSrvComponent', () => {
  let component: AppDspOrdersChartsSrvComponent;
  let fixture: ComponentFixture<AppDspOrdersChartsSrvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDspOrdersChartsSrvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDspOrdersChartsSrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
