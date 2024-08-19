import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserInformationFormComponent } from './adm-user-information-form.component';

describe('AdmUserInformationFormComponent', () => {
  let component: AdmUserInformationFormComponent;
  let fixture: ComponentFixture<AdmUserInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
