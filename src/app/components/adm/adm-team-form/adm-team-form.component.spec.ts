import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTeamFormComponent } from './adm-team-form.component';

describe('AdmTeamFormComponent', () => {
  let component: AdmTeamFormComponent;
  let fixture: ComponentFixture<AdmTeamFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmTeamFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
