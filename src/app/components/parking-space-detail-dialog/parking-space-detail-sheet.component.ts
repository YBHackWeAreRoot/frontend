import {Component, Inject} from '@angular/core';
import {ParkingSpace} from "../../model/parking-space";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {BookingService} from '../../services/booking.service';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-parking-space-detail-dialog',
  templateUrl: './parking-space-detail-sheet.component.html',
  styleUrls: ['./parking-space-detail-sheet.component.scss']
})
export class ParkingSpaceDetailSheetComponent {
  private fromDate?: Date;
  private toDate?: Date;

  public constructor(
    private parkingSpaceDetailSheetMatBottomSheetRef: MatBottomSheetRef<ParkingSpaceDetailSheetComponent>,
    private readonly bookingService: BookingService,
    private readonly filterService: FilterService,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ParkingSpace
  ) {
    filterService.filterChangeObservable().subscribe(filter => {
      this.fromDate = filter.from;
      this.toDate = filter.to;
    });
  }

  public reserve() {
    if (this.data.id && this.fromDate && this.toDate) {
      this.bookingService.createBooking(this.data.id, this.fromDate, this.toDate).subscribe(() => {
        this.bookingService.triggerBookingsReload();
        this.parkingSpaceDetailSheetMatBottomSheetRef.dismiss();
      });
    }
  }
}
