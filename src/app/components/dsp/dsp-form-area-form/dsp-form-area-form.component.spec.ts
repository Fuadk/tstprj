import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormAreaFormComponent } from './dsp-form-area-form.component';

describe('DspFormAreaFormComponent', () => {
  let component: DspFormAreaFormComponent;
  let fixture: ComponentFixture<DspFormAreaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormAreaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormAreaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
