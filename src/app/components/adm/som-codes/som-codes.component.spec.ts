import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomCodesComponent } from './som-codes.component';

describe('SomCodesComponent', () => {
  let component: SomCodesComponent;
  let fixture: ComponentFixture<SomCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
