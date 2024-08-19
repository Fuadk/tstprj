import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDynamicRwGridComponent } from './dsp-dynamic-rw-grid.component';

describe('DspDynamicRwGridComponent', () => {
  let component: DspDynamicRwGridComponent;
  let fixture: ComponentFixture<DspDynamicRwGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspDynamicRwGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspDynamicRwGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
