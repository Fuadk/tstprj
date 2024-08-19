import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspWorkOrderArComponent } from './dsp-work-order-ar.component';

describe('DspWorkOrderArComponent', () => {
  let component: DspWorkOrderArComponent;
  let fixture: ComponentFixture<DspWorkOrderArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspWorkOrderArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspWorkOrderArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
