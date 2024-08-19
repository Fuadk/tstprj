import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutinesFormComponent } from './routines-form.component';

describe('RoutinesFormComponent', () => {
  let component: RoutinesFormComponent;
  let fixture: ComponentFixture<RoutinesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutinesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutinesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
