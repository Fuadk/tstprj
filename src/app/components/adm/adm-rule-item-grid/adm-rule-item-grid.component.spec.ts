import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleItemGridComponent } from './adm-rule-item-grid.component';

describe('AdmRuleItemGridComponent', () => {
  let component: AdmRuleItemGridComponent;
  let fixture: ComponentFixture<AdmRuleItemGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleItemGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
