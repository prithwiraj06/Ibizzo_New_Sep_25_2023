import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterTemplateComponent } from './newsletter-template.component';

describe('NewsletterTemplateComponent', () => {
  let component: NewsletterTemplateComponent;
  let fixture: ComponentFixture<NewsletterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsletterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
