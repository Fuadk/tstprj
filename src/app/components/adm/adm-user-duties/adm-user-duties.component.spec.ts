import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserDutiesComponent } from './adm-user-duties.component';

describe('AdmUserDutiesComponent', () => {
  let component: AdmUserDutiesComponent;
  let fixture: ComponentFixture<AdmUserDutiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserDutiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserDutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
