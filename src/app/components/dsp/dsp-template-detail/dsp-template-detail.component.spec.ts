import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspTemplateDetailComponent } from './dsp-template-detail.component';

describe('DspTemplateDetailComponent', () => {
  let component: DspTemplateDetailComponent;
  let fixture: ComponentFixture<DspTemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspTemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
