import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormPageFormOrgComponent } from './dsp-form-page-form-org.component';

describe('DspFormPageFormComponent', () => {
  let component: DspFormPageFormOrgComponent;
  let fixture: ComponentFixture<DspFormPageFormOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormPageFormOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormPageFormOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
