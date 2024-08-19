import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusFormComponent } from './menus-form.component';

describe('MenusFormComponent', () => {
  let component: MenusFormComponent;
  let fixture: ComponentFixture<MenusFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
