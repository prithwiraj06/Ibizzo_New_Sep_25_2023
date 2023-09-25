import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentValidationComponent } from './content-validation.component';

describe('ContentValidationComponent', () => {
  let component: ContentValidationComponent;
  let fixture: ComponentFixture<ContentValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
