import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTransGridComponent } from './log-trans-grid.component';

describe('LogTransGridComponent', () => {
  let component: LogTransGridComponent;
  let fixture: ComponentFixture<LogTransGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogTransGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogTransGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
