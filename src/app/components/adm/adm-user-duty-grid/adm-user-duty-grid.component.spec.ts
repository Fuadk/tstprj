import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUserDutyGridComponent } from './adm-user-duty-grid.component';

describe('AdmUserDutyGridComponent', () => {
  let component: AdmUserDutyGridComponent;
  let fixture: ComponentFixture<AdmUserDutyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmUserDutyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUserDutyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
