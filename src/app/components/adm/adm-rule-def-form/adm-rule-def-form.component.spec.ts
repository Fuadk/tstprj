import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleDefFormComponent } from './adm-rule-def-form.component';

describe('AdmRuleDefFormComponent', () => {
  let component: AdmRuleDefFormComponent;
  let fixture: ComponentFixture<AdmRuleDefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleDefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleDefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
