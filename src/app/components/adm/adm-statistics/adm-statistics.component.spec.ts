import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmStatisticsComponent } from './adm-statistics.component';

describe('AdmStatisticsComponent', () => {
  let component: AdmStatisticsComponent;
  let fixture: ComponentFixture<AdmStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
