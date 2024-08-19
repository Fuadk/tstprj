import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspWorkOrderArGridComponent } from './dsp-work-order-ar-grid.component';

describe('DspWorkOrderArGridComponent', () => {
  let component: DspWorkOrderArGridComponent;
  let fixture: ComponentFixture<DspWorkOrderArGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspWorkOrderArGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspWorkOrderArGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
