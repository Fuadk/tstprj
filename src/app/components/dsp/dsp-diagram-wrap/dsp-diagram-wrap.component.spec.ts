import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DspDiagramWrapComponent } from './dsp-diagram-wrap.component';

describe('DspDiagramWrapComponent', () => {
  let component: DspDiagramWrapComponent;
  let fixture: ComponentFixture<DspDiagramWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DspDiagramWrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DspDiagramWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
