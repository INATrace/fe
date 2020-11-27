import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeScreenUnconfirmedComponent } from './welcome-screen-unconfirmed.component';

describe('WelcomeScreenUnconfirmedComponent', () => {
  let component: WelcomeScreenUnconfirmedComponent;
  let fixture: ComponentFixture<WelcomeScreenUnconfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeScreenUnconfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeScreenUnconfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
