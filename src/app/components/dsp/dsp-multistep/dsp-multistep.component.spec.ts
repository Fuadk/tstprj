import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspMultistepComponent } from './dsp-multistep.component';

describe('DspMultistepComponent', () => {
  let component: DspMultistepComponent;
  let fixture: ComponentFixture<DspMultistepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspMultistepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspMultistepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
