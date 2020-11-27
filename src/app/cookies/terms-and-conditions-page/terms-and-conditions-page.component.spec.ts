import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsPageComponent } from './terms-and-conditions-page.component';

describe('TermsAndConditionsPageComponent', () => {
  let component: TermsAndConditionsPageComponent;
  let fixture: ComponentFixture<TermsAndConditionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
