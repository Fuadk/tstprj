import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleLogGridComponent } from './adm-rule-log-grid.component';

describe('AdmRuleLogGridComponent', () => {
  let component: AdmRuleLogGridComponent;
  let fixture: ComponentFixture<AdmRuleLogGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleLogGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleLogGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
