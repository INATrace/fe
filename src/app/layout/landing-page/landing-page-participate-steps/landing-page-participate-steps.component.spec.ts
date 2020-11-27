import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageParticipateStepsComponent } from './landing-page-participate-steps.component';

describe('LandingPageParticipateStepsComponent', () => {
  let component: LandingPageParticipateStepsComponent;
  let fixture: ComponentFixture<LandingPageParticipateStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageParticipateStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageParticipateStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
