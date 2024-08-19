import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormPageFormComponent } from './dsp-form-page-form.component';

describe('DspFormPageFormComponent', () => {
  let component: DspFormPageFormComponent;
  let fixture: ComponentFixture<DspFormPageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormPageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormPageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
