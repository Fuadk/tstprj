import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRulesTreeComponent } from './adm-rules-tree.component';

describe('AdmRulesTreeComponent', () => {
  let component: AdmRulesTreeComponent;
  let fixture: ComponentFixture<AdmRulesTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRulesTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRulesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
