import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextinputModalComponent } from './textinput-modal.component';

describe('TextinputModalComponent', () => {
  let component: TextinputModalComponent;
  let fixture: ComponentFixture<TextinputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextinputModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextinputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
