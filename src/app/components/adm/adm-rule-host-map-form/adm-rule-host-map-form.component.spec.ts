import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleHostMapFormComponent } from './adm-rule-host-map-form.component';

describe('AdmRuleHostMapFormComponent', () => {
  let component: AdmRuleHostMapFormComponent;
  let fixture: ComponentFixture<AdmRuleHostMapFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleHostMapFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleHostMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
