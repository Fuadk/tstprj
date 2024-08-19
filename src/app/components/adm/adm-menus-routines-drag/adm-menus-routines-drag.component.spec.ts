import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmMenusRoutinesDragComponent } from './adm-menus-routines-drag.component';

describe('AdmMenusRoutinesDragComponent', () => {
  let component: AdmMenusRoutinesDragComponent;
  let fixture: ComponentFixture<AdmMenusRoutinesDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmMenusRoutinesDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmMenusRoutinesDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
