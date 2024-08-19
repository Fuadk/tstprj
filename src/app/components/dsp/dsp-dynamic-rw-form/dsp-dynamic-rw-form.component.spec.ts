import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDynamicRwFormComponent } from './dsp-dynamic-rw-form.component';

describe('DspDynamicRwFormComponent', () => {
  let component: DspDynamicRwFormComponent;
  let fixture: ComponentFixture<DspDynamicRwFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspDynamicRwFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspDynamicRwFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
