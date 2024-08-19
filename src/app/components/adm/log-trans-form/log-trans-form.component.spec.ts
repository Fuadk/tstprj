import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTransFormComponent } from './log-trans-form.component';

describe('LogTransFormComponent', () => {
  let component: LogTransFormComponent;
  let fixture: ComponentFixture<LogTransFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTransFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTransFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
