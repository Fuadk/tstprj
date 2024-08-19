import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspEditorFormComponent } from './dsp-editor-form.component';

describe('DspEditorFormComponent', () => {
  let component: DspEditorFormComponent;
  let fixture: ComponentFixture<DspEditorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspEditorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspEditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
