import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelRedirectToProductPageComponent } from './label-redirect-to-product-page.component';

describe('LabelRedirectToProductPageComponent', () => {
  let component: LabelRedirectToProductPageComponent;
  let fixture: ComponentFixture<LabelRedirectToProductPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelRedirectToProductPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelRedirectToProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
