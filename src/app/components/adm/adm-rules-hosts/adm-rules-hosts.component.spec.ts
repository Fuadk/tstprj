import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmRulesHostsComponent } from './adm-rules-hosts.component';

describe('AdmRulesHostsComponent', () => {
  let component: AdmRulesHostsComponent;
  let fixture: ComponentFixture<AdmRulesHostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmRulesHostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmRulesHostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
