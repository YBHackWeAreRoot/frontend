import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus} from "../../model/booking";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';

@Component({
  selector: 'app-booking-sheet',
  templateUrl: './booking-sheet.component.html',
  styleUrls: ['./booking-sheet.component.scss']
})
export class BookingSheetComponent implements OnInit {
  public bookingStatusEnum = BookingStatus;
  constructor(
    private bookingSheetMatBottomSheetRef: MatBottomSheetRef<BookingSheetComponent>,
    private selectParkingSpaceService: SelectParkingSpaceService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Booking,
  ) { }

  ngOnInit(): void {
  }

  public showParkingLocationOnMap() {
    this.selectParkingSpaceService.goToParkingSpace.next(this.data.parkingSpace);
  }
}
