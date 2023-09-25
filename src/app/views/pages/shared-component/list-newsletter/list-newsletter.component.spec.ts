import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewsletterComponent } from './list-newsletter.component';

describe('ListNewsletterComponent', () => {
  let component: ListNewsletterComponent;
  let fixture: ComponentFixture<ListNewsletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNewsletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
