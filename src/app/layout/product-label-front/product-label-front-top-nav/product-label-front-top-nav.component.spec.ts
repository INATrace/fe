import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelFrontTopNavComponent } from './product-label-front-top-nav.component';

describe('ProductLabelFrontTopNavComponent', () => {
  let component: ProductLabelFrontTopNavComponent;
  let fixture: ComponentFixture<ProductLabelFrontTopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelFrontTopNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelFrontTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
