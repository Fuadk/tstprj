import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormFieldsGridComponent } from './dsp-form-fields-grid.component';

describe('DspFormFieldsGridComponent', () => {
  let component: DspFormFieldsGridComponent;
  let fixture: ComponentFixture<DspFormFieldsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormFieldsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormFieldsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
