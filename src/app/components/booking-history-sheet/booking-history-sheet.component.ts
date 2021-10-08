import {Component, OnInit} from '@angular/core';
import {Booking, BookingStatus} from "../../model/booking";
import {BookingService} from "../../services/booking.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-booking-history-sheet',
  templateUrl: './booking-history-sheet.component.html',
  styleUrls: ['./booking-history-sheet.component.scss']
})
export class BookingHistorySheetComponent implements OnInit {
  public bookings: Booking[] = [];

  constructor(private bookingService: BookingService,
              private bookingHistorySheetComponentMatBottomSheetRef: MatBottomSheetRef<BookingHistorySheetComponent>,
              public date: DatePipe,
              public number: DecimalPipe
  ) { }

  public ngOnInit(): void {
    this.bookingService.getBookings().subscribe((bookings) => {
      this.bookings = bookings.filter(booking => booking.status === BookingStatus.CANCELED ||
        booking.status === BookingStatus.CANCELED_BY_SYSTEM || BookingStatus.CHECKED_OUT);
    });
  }

  public getCurrency() {
    if (this.bookings.length > 0) {
      return this.bookings[0].currency;
    }
    return 'CHF';
  }

  public getTotalPrice() {
    return this.bookings
      .map(booking => booking.price)
      .reduce((memo, price) => memo + price, 0);
  }
}
