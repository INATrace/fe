import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelStockSkuListComponent } from './product-label-stock-sku-list.component';

describe('ProductLabelStockSkuListComponent', () => {
  let component: ProductLabelStockSkuListComponent;
  let fixture: ComponentFixture<ProductLabelStockSkuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelStockSkuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelStockSkuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
