import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfifyDocumentComponent } from './verfify-document.component';

describe('VerfifyDocumentComponent', () => {
  let component: VerfifyDocumentComponent;
  let fixture: ComponentFixture<VerfifyDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerfifyDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerfifyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
