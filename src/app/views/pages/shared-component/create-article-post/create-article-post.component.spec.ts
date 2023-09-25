import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArticlePostComponent } from './create-article-post.component';

describe('CreateArticlePostComponent', () => {
  let component: CreateArticlePostComponent;
  let fixture: ComponentFixture<CreateArticlePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateArticlePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArticlePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
