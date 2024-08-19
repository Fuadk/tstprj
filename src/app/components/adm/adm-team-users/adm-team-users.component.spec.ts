import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTeamUsersComponent } from './adm-team-users.component';

describe('AdmTeamUsersComponent', () => {
  let component: AdmTeamUsersComponent;
  let fixture: ComponentFixture<AdmTeamUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmTeamUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTeamUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
