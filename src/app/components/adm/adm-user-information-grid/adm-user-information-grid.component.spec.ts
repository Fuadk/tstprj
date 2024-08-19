import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserInformationGridComponent } from './adm-user-information-grid.component';

describe('AdmUserInformationGridComponent', () => {
  let component: AdmUserInformationGridComponent;
  let fixture: ComponentFixture<AdmUserInformationGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserInformationGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserInformationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
