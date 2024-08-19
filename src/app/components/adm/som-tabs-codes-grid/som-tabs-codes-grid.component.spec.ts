import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomTabsCodesGridComponent } from './som-tabs-codes-grid.component';

describe('SomTabsCodesGridComponent', () => {
  let component: SomTabsCodesGridComponent;
  let fixture: ComponentFixture<SomTabsCodesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomTabsCodesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomTabsCodesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
