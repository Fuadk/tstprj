import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTeamDutiesComponent } from './adm-team-duties.component';

describe('AdmTeamDutiesComponent', () => {
  let component: AdmTeamDutiesComponent;
  let fixture: ComponentFixture<AdmTeamDutiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmTeamDutiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTeamDutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
