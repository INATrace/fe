import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBatchNumberResponseModalComponent } from './check-batch-number-response-modal.component';

describe('CheckBatchNumberResponseModalComponent', () => {
  let component: CheckBatchNumberResponseModalComponent;
  let fixture: ComponentFixture<CheckBatchNumberResponseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckBatchNumberResponseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBatchNumberResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
