import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelStatisticsPageComponent } from './product-label-statistics-page.component';

describe('ProductLabelStatisticsPageComponent', () => {
  let component: ProductLabelStatisticsPageComponent;
  let fixture: ComponentFixture<ProductLabelStatisticsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelStatisticsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelStatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
