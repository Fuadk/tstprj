import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspTemplateComponent } from './dsp-template-form.component';

describe('DspTemplateComponent', () => {
  let component: DspTemplateComponent;
  let fixture: ComponentFixture<DspTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
