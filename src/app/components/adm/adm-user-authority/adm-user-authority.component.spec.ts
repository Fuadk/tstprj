import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserAuthorityComponent } from './adm-user-authority.component';

describe('AdmUserAuthorityComponent', () => {
  let component: AdmUserAuthorityComponent;
  let fixture: ComponentFixture<AdmUserAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
