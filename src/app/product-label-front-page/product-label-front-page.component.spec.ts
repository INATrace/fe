import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelFrontPageComponent } from './product-label-front-page.component';

describe('ProductLabelFrontPageComponent', () => {
  let component: ProductLabelFrontPageComponent;
  let fixture: ComponentFixture<ProductLabelFrontPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelFrontPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelFrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
