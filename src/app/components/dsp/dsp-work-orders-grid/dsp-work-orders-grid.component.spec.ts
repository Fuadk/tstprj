import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspWorkOrdersGridComponent } from './dsp-work-orders-grid.component';

describe('DspWorkOrdersGridComponent', () => {
  let component: DspWorkOrdersGridComponent;
  let fixture: ComponentFixture<DspWorkOrdersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspWorkOrdersGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspWorkOrdersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
