import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedDocumentsComponent } from './uploaded-documents.component';

describe('UploadedDocumentsComponent', () => {
  let component: UploadedDocumentsComponent;
  let fixture: ComponentFixture<UploadedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
