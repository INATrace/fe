import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeRedirectComponent } from './qr-code-redirect.component';

describe('QrCodeRedirectComponent', () => {
  let component: QrCodeRedirectComponent;
  let fixture: ComponentFixture<QrCodeRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
