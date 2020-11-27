import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSideNavComponent } from './guest-side-nav.component';

describe('GuestSideNavComponent', () => {
  let component: GuestSideNavComponent;
  let fixture: ComponentFixture<GuestSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
