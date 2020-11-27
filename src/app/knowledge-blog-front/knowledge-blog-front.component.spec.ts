import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeBlogFrontComponent } from './knowledge-blog-front.component';

describe('KnowledgeBlogFrontComponent', () => {
  let component: KnowledgeBlogFrontComponent;
  let fixture: ComponentFixture<KnowledgeBlogFrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeBlogFrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeBlogFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
