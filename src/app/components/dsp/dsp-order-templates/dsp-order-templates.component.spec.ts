import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspOrderTemplatesComponent } from './dsp-order-templates.component';

describe('DspOrderTemplatesComponent', () => {
  let component: DspOrderTemplatesComponent;
  let fixture: ComponentFixture<DspOrderTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspOrderTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspOrderTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
