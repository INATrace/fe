import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBatchNumberModalComponent } from './check-batch-number-modal.component';

describe('CheckBatchNumberModalComponent', () => {
  let component: CheckBatchNumberModalComponent;
  let fixture: ComponentFixture<CheckBatchNumberModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckBatchNumberModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBatchNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
