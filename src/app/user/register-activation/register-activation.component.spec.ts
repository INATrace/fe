import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterActivationComponent } from './register-activation.component';

describe('RegisterActivationComponent', () => {
  let component: RegisterActivationComponent;
  let fixture: ComponentFixture<RegisterActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
