import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmResourceInformationFormComponent } from './adm-resource-information-form.component';

describe('AdmResourceInformationFormComponent', () => {
  let component: AdmResourceInformationFormComponent;
  let fixture: ComponentFixture<AdmResourceInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmResourceInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmResourceInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
