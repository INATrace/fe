import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLabelStakeholdersCollectorsComponent } from './product-label-stakeholders-collectors.component';

describe('ProductLabelStakeholdersCollectorsComponent', () => {
  let component: ProductLabelStakeholdersCollectorsComponent;
  let fixture: ComponentFixture<ProductLabelStakeholdersCollectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelStakeholdersCollectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelStakeholdersCollectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
