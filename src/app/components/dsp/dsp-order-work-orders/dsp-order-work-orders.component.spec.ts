import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrderWorkOrdersComponent } from './dsp-order-work-orders.component';

describe('DspOrderWorkOrdersComponent', () => {
  let component: DspOrderWorkOrdersComponent;
  let fixture: ComponentFixture<DspOrderWorkOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrderWorkOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrderWorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
