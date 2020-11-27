import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchDetailPageComponent } from './batch-detail-page.component';

describe('BatchDetailPageComponent', () => {
  let component: BatchDetailPageComponent;
  let fixture: ComponentFixture<BatchDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
