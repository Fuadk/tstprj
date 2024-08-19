import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleKeysGridComponent } from './adm-rule-keys-grid.component';

describe('AdmRuleKeysGridComponent', () => {
  let component: AdmRuleKeysGridComponent;
  let fixture: ComponentFixture<AdmRuleKeysGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleKeysGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleKeysGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
