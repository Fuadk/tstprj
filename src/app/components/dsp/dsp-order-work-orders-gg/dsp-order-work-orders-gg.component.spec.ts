import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrderWorkOrdersGgComponent } from './dsp-order-work-orders-gg.component';

describe('DspOrderWorkOrdersGgComponent', () => {
  let component: DspOrderWorkOrdersGgComponent;
  let fixture: ComponentFixture<DspOrderWorkOrdersGgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrderWorkOrdersGgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrderWorkOrdersGgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
