import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleLogFormComponent } from './adm-rule-log-form.component';

describe('AdmRuleLogFormComponent', () => {
  let component: AdmRuleLogFormComponent;
  let fixture: ComponentFixture<AdmRuleLogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleLogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
