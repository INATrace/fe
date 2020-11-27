import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedPageComponent } from './get-started-page.component';

describe('GetStartedPageComponent', () => {
  let component: GetStartedPageComponent;
  let fixture: ComponentFixture<GetStartedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
