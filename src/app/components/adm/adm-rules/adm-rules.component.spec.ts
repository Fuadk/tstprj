import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRulesComponent } from './adm-rules.component';

describe('AdmRulesComponent', () => {
  let component: AdmRulesComponent;
  let fixture: ComponentFixture<AdmRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
