import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus} from "../../model/booking";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';
import {BookingService} from '../../services/booking.service';
import {isAfter} from "date-fns";

@Component({
  selector: 'app-booking-sheet',
  templateUrl: './booking-sheet.component.html',
  styleUrls: ['./booking-sheet.component.scss']
})
export class BookingSheetComponent implements AfterViewInit {
  public bookingStatusEnum = BookingStatus;
  public showCancelBooking = true;
  private showCheckOutButton = true;
  public isCheckinPossible = true;
  public timerExpired = false;

  @ViewChild('timer') timer?: ElementRef;

  public constructor(
    private bookingSheetMatBottomSheetRef: MatBottomSheetRef<BookingSheetComponent>,
    private selectParkingSpaceService: SelectParkingSpaceService,
    private bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Booking,
  ) {
  }

  ngAfterViewInit(): void {
    //this.showBookingFinished = false;
    const now = new Date();
    /*if(isAfter(now, this.data.reservedToTime)) {
      this.showBookingFinished = true;
    }*/
    //debugger;
    if (this.data.status === BookingStatus.CHECKED_IN) {
      this.startTimer(this.data.reservedToTime);
    }
    if (this.data.status === BookingStatus.RESERVED) {
      this.startTimer(this.data.reservedFromTime);
    }
  }

  startTimer(date: Date){
    const countDownDate = new Date(date).getTime();
    // Update the count down every 1 second
   const x = setInterval(() => {

      var now = new Date().getTime();

      var distance = countDownDate - now;

      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timer!.nativeElement.innerHTML = this.pad(minutes, 2) + ":" + this.pad(seconds, 2);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.timer!.nativeElement.innerHTML = "";
        this.timerExpired = true;
      }
    }, 1000);
  }

  public cancelBooking() {
    this.bookingService.cancelBooking(this.data.id).subscribe(() => {
      this.showCancelBooking = false;
      this.bookingService.triggerBookingsReload();
      this.bookingSheetMatBottomSheetRef.dismiss();
    });
  }

  public checkOut() {
    this.bookingService.checkOut(this.data.id).subscribe(() => {
      this.showCheckOutButton = false;
      this.bookingService.triggerBookingsReload();
    });
  }

  public showParkingLocationOnMap() {
    this.selectParkingSpaceService.goToParkingSpace.next(this.data.parkingSpace);
  }

  public checkIn() {
    this.bookingService.checkIn(this.data.id).subscribe(() => {
      this.isCheckinPossible = false;
      this.bookingService.triggerBookingsReload();
      this.bookingSheetMatBottomSheetRef.dismiss();
    });
  }

  private pad(num: number, size: number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
