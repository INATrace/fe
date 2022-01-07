import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBlogDocumentsItemComponent } from './knowledge-blog-documents-item.component';

describe('KnowledgeBlogDocumentsItemComponent', () => {
  let component: KnowledgeBlogDocumentsItemComponent;
  let fixture: ComponentFixture<KnowledgeBlogDocumentsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeBlogDocumentsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBlogDocumentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
