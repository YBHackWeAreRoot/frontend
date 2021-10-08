import {Component, Inject, OnInit} from '@angular/core';
import {ParkingSpace} from "../../model/parking-space";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-parking-space-detail-dialog',
  templateUrl: './parking-space-detail-sheet.component.html',
  styleUrls: ['./parking-space-detail-sheet.component.scss']
})
export class ParkingSpaceDetailSheet implements OnInit {

  public constructor(
    private parkingSpaceDetailSheetMatBottomSheetRef: MatBottomSheetRef<ParkingSpaceDetailSheet>,
    private readonly bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ParkingSpace
  ) { }

  public ngOnInit(): void {
  }

  public reserve() {
    if (this.data.id && this.data.fromTime && this.data.toTime) {
      this.bookingService.createBooking(this.data.id, this.data.fromTime, this.data.toTime).subscribe(() => {
        this.parkingSpaceDetailSheetMatBottomSheetRef.dismiss();
      });
    }
  }
}
