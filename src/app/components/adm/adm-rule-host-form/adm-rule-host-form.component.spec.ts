import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleHostFormComponent } from './adm-rule-host-form.component';

describe('AdmRuleHostFormComponent', () => {
  let component: AdmRuleHostFormComponent;
  let fixture: ComponentFixture<AdmRuleHostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleHostFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleHostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
