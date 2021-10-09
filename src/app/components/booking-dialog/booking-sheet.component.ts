import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus} from "../../model/booking";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';
import {BookingService} from '../../services/booking.service';
import {addMinutes, isAfter} from "date-fns";
import {interval} from "rxjs";

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
  public showGraceTime: boolean = false;
  public timerShown: boolean = false;
  public timerValue?: string;

  public constructor(
    private bookingSheetMatBottomSheetRef: MatBottomSheetRef<BookingSheetComponent>,
    private selectParkingSpaceService: SelectParkingSpaceService,
    private bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Booking,
  ) {
  }

  ngAfterViewInit(): void {
    const now = new Date();
    this.showGraceTime = false;
    if(isAfter(now, this.data.reservedToTime)) {
      return;
    }
    if (this.data.status === BookingStatus.CHECKED_IN) {
      this.startTimer(this.data.reservedToTime);
    }
    if (this.data.status ===  BookingStatus.RESERVED) {
      if(isAfter(now, this.data.reservedFromTime)) {
        this.showGraceTime = true;
        this.startTimer(addMinutes(this.data.reservedFromTime, 15));
      }
      this.startTimer(this.data.reservedFromTime);
    }
  }

  startTimer(date: Date){
    const countDownDate = new Date(date).getTime();
    // Update the count down every 1 second
   const x = setInterval(() => {
      this.timerShown = true;
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timer!.nativeElement.innerHTML = this.pad(minutes, 2) + ":" + this.pad(seconds, 2);

      // If the count down is finished, write some text
      if (distance < 0) {
        this.timerShown = false;

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
      this.selectParkingSpaceService.removeCurrentActiveMarker.next();
      this.bookingService.triggerBookingsReload();
      this.bookingSheetMatBottomSheetRef.dismiss();
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
