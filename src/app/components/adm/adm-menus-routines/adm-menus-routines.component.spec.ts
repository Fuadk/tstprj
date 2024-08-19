import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmMenusRoutinesComponent } from './adm-menus-routines.component';

describe('AdmMenusRoutinesComponent', () => {
  let component: AdmMenusRoutinesComponent;
  let fixture: ComponentFixture<AdmMenusRoutinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmMenusRoutinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmMenusRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
