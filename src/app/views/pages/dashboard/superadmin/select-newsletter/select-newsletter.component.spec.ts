import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNewsletterComponent } from './select-newsletter.component';

describe('SelectNewsletterComponent', () => {
  let component: SelectNewsletterComponent;
  let fixture: ComponentFixture<SelectNewsletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNewsletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
