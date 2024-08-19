import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSortabeComponent } from './test-sortabe.component';

describe('TestSortabeComponent', () => {
  let component: TestSortabeComponent;
  let fixture: ComponentFixture<TestSortabeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSortabeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSortabeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
