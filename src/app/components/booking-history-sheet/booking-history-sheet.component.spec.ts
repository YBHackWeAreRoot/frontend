import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingHistorySheetComponent } from './booking-history-sheet.component';

describe('BookingHistorySheetComponent', () => {
  let component: BookingHistorySheetComponent;
  let fixture: ComponentFixture<BookingHistorySheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingHistorySheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingHistorySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
