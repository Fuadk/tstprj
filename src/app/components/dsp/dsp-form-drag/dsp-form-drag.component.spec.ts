import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormDragComponent } from './dsp-form-drag.component';

describe('DspFormDragComponent', () => {
  let component: DspFormDragComponent;
  let fixture: ComponentFixture<DspFormDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
