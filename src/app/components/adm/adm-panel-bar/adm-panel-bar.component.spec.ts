import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPanelBarComponent } from './adm-panel-bar.component';

describe('AdmPanelBarComponent', () => {
  let component: AdmPanelBarComponent;
  let fixture: ComponentFixture<AdmPanelBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmPanelBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPanelBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
