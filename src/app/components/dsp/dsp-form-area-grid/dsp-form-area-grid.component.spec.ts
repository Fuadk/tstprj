import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspFormAreaGridComponent } from './dsp-form-area-grid.component';

describe('DspFormAreaGridComponent', () => {
  let component: DspFormAreaGridComponent;
  let fixture: ComponentFixture<DspFormAreaGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspFormAreaGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspFormAreaGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
