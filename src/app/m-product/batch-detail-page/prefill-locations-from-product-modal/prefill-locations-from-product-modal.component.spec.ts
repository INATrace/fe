import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefillLocationsFromProductModalComponent } from './prefill-locations-from-product-modal.component';

describe('PrefillLocationsFromProductModalComponent', () => {
  let component: PrefillLocationsFromProductModalComponent;
  let fixture: ComponentFixture<PrefillLocationsFromProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefillLocationsFromProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefillLocationsFromProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
