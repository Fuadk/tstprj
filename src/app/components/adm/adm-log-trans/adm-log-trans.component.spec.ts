import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmLogTransComponent } from './adm-log-trans.component';

describe('AdmLogTransComponent', () => {
  let component: AdmLogTransComponent;
  let fixture: ComponentFixture<AdmLogTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmLogTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmLogTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
