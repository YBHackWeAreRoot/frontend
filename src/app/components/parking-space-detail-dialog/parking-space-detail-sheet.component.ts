import {Component, Inject, OnInit} from '@angular/core';
import {ParkingSpace} from "../../model/parking-space";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-parking-space-detail-dialog',
  templateUrl: './parking-space-detail-sheet.component.html',
  styleUrls: ['./parking-space-detail-sheet.component.scss']
})
export class ParkingSpaceDetailSheet implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ParkingSpaceDetailSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ParkingSpace,
    public date: DatePipe
  ) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  public closeSheet(parkingSpace: ParkingSpace | null = null): void {
    this._bottomSheetRef.dismiss();
  }
}