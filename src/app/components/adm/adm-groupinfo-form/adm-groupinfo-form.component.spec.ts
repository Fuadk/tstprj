import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmGroupinfoFormComponent } from './adm-groupinfo-form.component';

describe('AdmGroupinfoFormComponent', () => {
  let component: AdmGroupinfoFormComponent;
  let fixture: ComponentFixture<AdmGroupinfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmGroupinfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmGroupinfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
