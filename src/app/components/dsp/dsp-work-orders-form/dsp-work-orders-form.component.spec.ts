import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspWorkOrdersFormComponent } from './dsp-work-orders-form.component';

describe('DspWorkOrdersFormComponent', () => {
  let component: DspWorkOrdersFormComponent;
  let fixture: ComponentFixture<DspWorkOrdersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspWorkOrdersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspWorkOrdersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
