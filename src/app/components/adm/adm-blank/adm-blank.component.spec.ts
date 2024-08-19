import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmBlankComponent } from './adm-blank.component';

describe('AdmBlankComponent', () => {
  let component: AdmBlankComponent;
  let fixture: ComponentFixture<AdmBlankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmBlankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
