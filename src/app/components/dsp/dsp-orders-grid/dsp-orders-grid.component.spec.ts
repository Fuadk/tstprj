import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrdersGridComponent } from './dsp-orders-grid.component';

describe('DspOrdersGridComponent', () => {
  let component: DspOrdersGridComponent;
  let fixture: ComponentFixture<DspOrdersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrdersGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrdersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
