import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspWorkOrdersMyComponent } from './dsp-work-orders-my.component';

describe('DspWorkOrdersMyComponent', () => {
  let component: DspWorkOrdersMyComponent;
  let fixture: ComponentFixture<DspWorkOrdersMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspWorkOrdersMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspWorkOrdersMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
