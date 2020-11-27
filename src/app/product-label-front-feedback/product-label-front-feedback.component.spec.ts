import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelFrontFeedbackComponent } from './product-label-front-feedback.component';

describe('ProductLabelFrontFeedbackComponent', () => {
  let component: ProductLabelFrontFeedbackComponent;
  let fixture: ComponentFixture<ProductLabelFrontFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelFrontFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelFrontFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
