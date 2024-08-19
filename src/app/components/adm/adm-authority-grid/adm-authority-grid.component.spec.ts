import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmAuthorityGridComponent } from './adm-authority-grid.component';

describe('AdmAuthorityGridComponent', () => {
  let component: AdmAuthorityGridComponent;
  let fixture: ComponentFixture<AdmAuthorityGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmAuthorityGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmAuthorityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
