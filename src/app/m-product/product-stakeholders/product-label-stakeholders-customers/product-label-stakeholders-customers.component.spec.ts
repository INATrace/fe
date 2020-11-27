import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelStakeholdersCustomersComponent } from './product-label-stakeholders-customers.component';

describe('ProductLabelStakeholdersCustomersComponent', () => {
  let component: ProductLabelStakeholdersCustomersComponent;
  let fixture: ComponentFixture<ProductLabelStakeholdersCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelStakeholdersCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelStakeholdersCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
