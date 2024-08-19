import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormDefFormComponent } from './dsp-form-def-form.component';

describe('DspFormDefFormComponent', () => {
  let component: DspFormDefFormComponent;
  let fixture: ComponentFixture<DspFormDefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormDefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormDefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
