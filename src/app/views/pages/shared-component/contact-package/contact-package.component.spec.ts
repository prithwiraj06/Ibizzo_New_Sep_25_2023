import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPackageComponent } from './contact-package.component';

describe('ContactPackageComponent', () => {
  let component: ContactPackageComponent;
  let fixture: ComponentFixture<ContactPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
