import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleActionGridComponent } from './adm-rule-action-grid.component';

describe('AdmRuleActionGridComponent', () => {
  let component: AdmRuleActionGridComponent;
  let fixture: ComponentFixture<AdmRuleActionGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleActionGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleActionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
