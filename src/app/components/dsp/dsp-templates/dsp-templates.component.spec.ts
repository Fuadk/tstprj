import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspTemplatesComponent } from './dsp-templates.component';

describe('DspTemplatesComponent', () => {
  let component: DspTemplatesComponent;
  let fixture: ComponentFixture<DspTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
