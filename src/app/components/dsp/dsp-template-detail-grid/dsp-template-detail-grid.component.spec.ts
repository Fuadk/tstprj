import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspTemplateDetailGridComponent } from './dsp-template-detail-grid.component';

describe('DspTemplateDetailGridComponent', () => {
  let component: DspTemplateDetailGridComponent;
  let fixture: ComponentFixture<DspTemplateDetailGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspTemplateDetailGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspTemplateDetailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
