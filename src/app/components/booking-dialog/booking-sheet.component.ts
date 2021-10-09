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
  public showCancelBooking = true;
  public isCheckinPossible = true;
  @ViewChild('timer') timer?: ElementRef;
  public upcomingEndGraceTimerShown: boolean = false;
  public timerShown: boolean = false;
  public timerValue?: string;
  private showCheckOutButton = true;
  public upcompingStartReservationTimerExpired = false;
  private upcomingEndReservationTimerShown = false;

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

  startTimer(date: Date): Observable<boolean> {
    const subject = new Subject<boolean>();

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
        this.timerShown = false;

        clearInterval(x);
        this.timer!.nativeElement.innerHTML = "";
        subject.next(true);
        subject.complete();
      }
    }, 1000);
    return subject.asObservable();
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

  private checkAndStartTimer(): void {
    const now = new Date();
    this.upcomingEndGraceTimerShown = false;
    if (isAfter(now, this.data.reservedToTime)) {
      return;
    }


    if (this.data.status === BookingStatus.CHECKED_IN) {
      this.upcomingEndReservationTimerShown = false;
      this.startTimer(this.data.reservedToTime).subscribe(() => {
        this.upcomingEndReservationTimerShown = true;
      });
    }
    if (this.data.status === BookingStatus.RESERVED) {
      if (isAfter(now, this.data.reservedFromTime)) {
        this.upcomingEndGraceTimerShown = true;
        this.startTimer(addMinutes(this.data.reservedFromTime, 15)).subscribe(() => {
          this.upcomingEndGraceTimerShown = false;
          this.checkAndStartTimer();
        });
      } else {
        this.upcompingStartReservationTimerExpired = false;
        this.startTimer(this.data.reservedFromTime).subscribe(() => {
          this.upcompingStartReservationTimerExpired = true;
        });
      }
    }
  }

  private pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
