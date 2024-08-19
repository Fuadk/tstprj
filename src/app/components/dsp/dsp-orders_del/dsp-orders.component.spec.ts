import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrdersComponent } from './dsp-orders.component';

describe('DspOrdersComponent', () => {
  let component: DspOrdersComponent;
  let fixture: ComponentFixture<DspOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
