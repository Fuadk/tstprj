import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomTabsCodesSpecFormComponent } from './som-tabs-codes-spec-form.component';

describe('SomTabsCodesSpecFormComponent', () => {
  let component: SomTabsCodesSpecFormComponent;
  let fixture: ComponentFixture<SomTabsCodesSpecFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomTabsCodesSpecFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomTabsCodesSpecFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
