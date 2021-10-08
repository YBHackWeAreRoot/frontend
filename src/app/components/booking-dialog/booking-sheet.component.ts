import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus} from "../../model/booking";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';
import {BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-booking-sheet',
  templateUrl: './booking-sheet.component.html',
  styleUrls: ['./booking-sheet.component.scss']
})
export class BookingSheetComponent {
  public bookingStatusEnum = BookingStatus;
  public showCancelBooking = true;
  private showCheckOutButton = true;
  public isCheckinPossible = true;

  public constructor(
    private bookingSheetMatBottomSheetRef: MatBottomSheetRef<BookingSheetComponent>,
    private selectParkingSpaceService: SelectParkingSpaceService,
    private bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Booking,
  ) {
  }

  public cancelBooking() {
    this.bookingService.cancelBooking(this.data.id).subscribe(() => this.showCancelBooking = false);
  }

  public checkOut() {
    this.bookingService.checkOut(this.data.id).subscribe(() => this.showCheckOutButton = false);
  }

  public showParkingLocationOnMap() {
    this.selectParkingSpaceService.goToParkingSpace.next(this.data.parkingSpace);
  }

  public checkIn() {
    this.bookingService.checkIn(this.data.id).subscribe(() => this.isCheckinPossible = false);
  }
}
