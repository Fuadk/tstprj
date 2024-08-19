import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmQueryDefFormComponent } from './adm-query-def-form.component';

describe('AdmQueryDefFormComponent', () => {
  let component: AdmQueryDefFormComponent;
  let fixture: ComponentFixture<AdmQueryDefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmQueryDefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmQueryDefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
