import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserGroupAuthorityComponent } from './adm-user-group-authority.component';

describe('AdmUserGroupAuthorityComponent', () => {
  let component: AdmUserGroupAuthorityComponent;
  let fixture: ComponentFixture<AdmUserGroupAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserGroupAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserGroupAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
