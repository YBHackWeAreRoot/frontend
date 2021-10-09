import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus} from "../../model/booking";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';
import {BookingService} from '../../services/booking.service';
import {addMinutes, isAfter} from "date-fns";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-booking-sheet',
  templateUrl: './booking-sheet.component.html',
  styleUrls: ['./booking-sheet.component.scss']
})
export class BookingSheetComponent implements AfterViewInit {
  public bookingStatusEnum = BookingStatus;
  public isCheckinPossible = true;
  public upcomingEndGraceTimerShown: boolean = false;
  public timerValue?: string;
  public upcomingStartReservationTimerExpired = false;
  public upcomingEndReservationTimerShown = false;

  public constructor(
    private bookingSheetMatBottomSheetRef: MatBottomSheetRef<BookingSheetComponent>,
    private selectParkingSpaceService: SelectParkingSpaceService,
    private bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Booking,
  ) {
  }

  ngAfterViewInit(): void {
    this.checkAndStartTimer();
  }

  public startTimer(date: Date): Observable<boolean> {
    const subject = new Subject<boolean>();

    const countDownDate = new Date(date).getTime();
    // Update the count down every 1 second
    const x = setInterval(() => {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.timerValue = this.pad(minutes, 2) + ":" + this.pad(seconds, 2);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.timerValue = "";
        subject.next(true);
        subject.complete();
      }
    }, 1000);
    return subject.asObservable();
  }

  public cancelBooking() {
    this.bookingService.cancelBooking(this.data.id).subscribe(() => {
      this.upcomingEndGraceTimerShown = false;
      this.bookingService.triggerBookingsReload();
      this.bookingSheetMatBottomSheetRef.dismiss();
    });
  }

  public checkOut() {
    this.bookingService.checkOut(this.data.id).subscribe(() => {
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

  private checkAndStartTimer(): void {
    const now = new Date();
    this.upcomingEndGraceTimerShown = false;
    if (isAfter(now, this.data.reservedToTime)) {
      return;
    }


    if (this.data.status === BookingStatus.CHECKED_IN) {
      this.startCheckInCountdown();
    }

    if (this.data.status === BookingStatus.RESERVED) {
      if (isAfter(now, this.data.reservedFromTime)) {
        this.startGraceCountdown();
      } else {
        this.startReservationCountdown();
      }
    }
  }

  private startReservationCountdown() {
    this.upcomingStartReservationTimerExpired = false;
    this.startTimer(this.data.reservedFromTime).subscribe(() => {
      this.upcomingStartReservationTimerExpired = true;
    });
  }

  private startGraceCountdown() {
    this.upcomingEndGraceTimerShown = true;
    this.startTimer(addMinutes(this.data.reservedFromTime, 15)).subscribe(() => {
      this.upcomingEndGraceTimerShown = false;
      this.checkAndStartTimer();
    });
  }

  private startCheckInCountdown() {
    this.upcomingEndReservationTimerShown = false;
    this.startTimer(this.data.reservedToTime).subscribe(() => {
      this.upcomingEndReservationTimerShown = true;
    });
  }

  private pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
