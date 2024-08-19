import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmGroupAuthorityComponent } from './adm-group-authority.component';

describe('AdmGroupAuthorityComponent', () => {
  let component: AdmGroupAuthorityComponent;
  let fixture: ComponentFixture<AdmGroupAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmGroupAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmGroupAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
