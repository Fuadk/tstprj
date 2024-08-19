import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormFieldsFormComponent } from './dsp-form-fields-form.component';

describe('DspFormFieldsFormComponent', () => {
  let component: DspFormFieldsFormComponent;
  let fixture: ComponentFixture<DspFormFieldsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormFieldsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormFieldsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
