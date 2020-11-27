import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBlogSelectSectionModalComponent } from './knowledge-blog-select-section-modal.component';

describe('KnowledgeBlogSelectSectionModalComponent', () => {
  let component: KnowledgeBlogSelectSectionModalComponent;
  let fixture: ComponentFixture<KnowledgeBlogSelectSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeBlogSelectSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBlogSelectSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
