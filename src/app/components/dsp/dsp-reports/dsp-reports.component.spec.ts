import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspReportsComponent } from './dsp-reports.component';

describe('DspReportsComponent', () => {
  let component: DspReportsComponent;
  let fixture: ComponentFixture<DspReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
