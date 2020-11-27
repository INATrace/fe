import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefillProductSelectionModalComponent } from './prefill-product-selection-modal.component';

describe('PrefillProductSelectionModalComponent', () => {
  let component: PrefillProductSelectionModalComponent;
  let fixture: ComponentFixture<PrefillProductSelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefillProductSelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefillProductSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
