import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusGridComponent } from './menus-grid.component';

describe('MenusGridComponent', () => {
  let component: MenusGridComponent;
  let fixture: ComponentFixture<MenusGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
