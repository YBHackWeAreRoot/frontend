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
    private parkingSpaceDetailSheetMatBottomSheetRef: MatBottomSheetRef<ParkingSpaceDetailSheet>,
    public date: DatePipe,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ParkingSpace
  ) { }

  ngOnInit(): void {
  }
/*
  openLink(event: MouseEvent): void {
    this.parkingSpaceDetailSheetMatBottomSheetRef.dismiss();
    event.preventDefault();
  }

  public closeSheet(parkingSpace: ParkingSpace | null = null): void {
    this.parkingSpaceDetailSheetMatBottomSheetRef.dismiss();
  }*/
}
