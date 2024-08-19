import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDynamicChartComponent } from './dsp-dynamic-chart.component';

describe('DspDynamicChartComponent', () => {
  let component: DspDynamicChartComponent;
  let fixture: ComponentFixture<DspDynamicChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspDynamicChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspDynamicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
