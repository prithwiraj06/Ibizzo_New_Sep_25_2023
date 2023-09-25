import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradePostsComponent } from './trade-posts.component';

describe('TradePostsComponent', () => {
  let component: TradePostsComponent;
  let fixture: ComponentFixture<TradePostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradePostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
