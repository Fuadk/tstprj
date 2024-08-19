import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDashboardComponent } from './dsp-dashboard.component';

describe('DspDashboardComponent', () => {
  let component: DspDashboardComponent;
  let fixture: ComponentFixture<DspDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
