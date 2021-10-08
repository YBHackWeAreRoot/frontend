import {Component, Inject} from '@angular/core';
import {ParkingSpace} from "../../model/parking-space";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-parking-space-detail-dialog',
  templateUrl: './parking-space-detail-sheet.component.html',
  styleUrls: ['./parking-space-detail-sheet.component.scss']
})
export class ParkingSpaceDetailSheetComponent {

  public constructor(
    private parkingSpaceDetailSheetMatBottomSheetRef: MatBottomSheetRef<ParkingSpaceDetailSheetComponent>,
    private readonly bookingService: BookingService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ParkingSpace
  ) {
  }

  public reserve() {
    if (this.data.id && this.data.fromTime && this.data.toTime) {
      this.bookingService.createBooking(this.data.id, this.data.fromTime, this.data.toTime).subscribe(() => {
        this.bookingService.triggerBookingsReload();
        this.parkingSpaceDetailSheetMatBottomSheetRef.dismiss();
      });
    }
  }
}
