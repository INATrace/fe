import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelStockSkuModalComponent } from './product-label-stock-sku-modal.component';

describe('ProductLabelStockSkuModalComponent', () => {
  let component: ProductLabelStockSkuModalComponent;
  let fixture: ComponentFixture<ProductLabelStockSkuModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelStockSkuModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelStockSkuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
