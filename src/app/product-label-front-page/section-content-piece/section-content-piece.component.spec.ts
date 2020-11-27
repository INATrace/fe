import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionContentPieceComponent } from './section-content-piece.component';

describe('SectionContentPieceComponent', () => {
  let component: SectionContentPieceComponent;
  let fixture: ComponentFixture<SectionContentPieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionContentPieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContentPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
