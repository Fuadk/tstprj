import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDynamicGridComponent } from './dsp-dynamic-grid.component';

describe('DspDynamicGridComponent', () => {
  let component: DspDynamicGridComponent;
  let fixture: ComponentFixture<DspDynamicGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspDynamicGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspDynamicGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
