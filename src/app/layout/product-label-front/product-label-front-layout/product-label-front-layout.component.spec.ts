import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelFrontLayoutComponent } from './product-label-front-layout.component';

describe('ProductLabelFrontLayoutComponent', () => {
  let component: ProductLabelFrontLayoutComponent;
  let fixture: ComponentFixture<ProductLabelFrontLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelFrontLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelFrontLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
