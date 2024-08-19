import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrderOrdersComponent } from './dsp-order-orders.component';

describe('DspOrderOrdersComponent', () => {
  let component: DspOrderOrdersComponent;
  let fixture: ComponentFixture<DspOrderOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrderOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrderOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
