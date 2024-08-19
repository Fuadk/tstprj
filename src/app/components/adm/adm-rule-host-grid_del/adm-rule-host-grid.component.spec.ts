import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRuleHostGridComponent } from './adm-rule-host-grid.component';

describe('AdmRuleHostGridComponent', () => {
  let component: AdmRuleHostGridComponent;
  let fixture: ComponentFixture<AdmRuleHostGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRuleHostGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRuleHostGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
