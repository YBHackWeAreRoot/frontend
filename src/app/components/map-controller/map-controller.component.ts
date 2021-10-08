import {Component, OnInit} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {LocationResolverService} from '../../services/location-resolver.service';
import {SearchService} from '../../services/search.service';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ParkingSpace} from "../../model/parking-space";
import {ParkingSpaceDetailSheet} from "../parking-space-detail-dialog/parking-space-detail-sheet.component";
import {ParkingSpaceService} from '../../services/parking-space.service';
import {FilterService} from "../../services/filter.service";
import {distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {BookingHistorySheetComponent} from "../booking-history-sheet/booking-history-sheet.component";
import {BookingService} from "../../services/booking.service";
import {Booking, BookingStatus} from "../../model/booking";
import {BookingSheetComponent} from "../booking-dialog/booking-sheet.component";

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {
  private mapComponent?: MapComponent;
  public currentBooking?: Booking;
  public upcomingBooking?: Booking;

  public constructor(private readonly filterService: FilterService,
                     private readonly locationResolverService: LocationResolverService,
                     private readonly searchService: SearchService,
                     private readonly parkingSpaceService: ParkingSpaceService,
                     private readonly bookingService: BookingService,
                     private readonly bookingHistorySheet: MatBottomSheet,
                     private parkingSpaceDetailSheet: MatBottomSheet,
                     private bookingSheet: MatBottomSheet
  ) {
  }

  public ngOnInit(): void {
    this.filterService.filterChangeObservable().pipe(
      map(value => value.place),
      filter(value => !!value),
      distinctUntilChanged(),
      switchMap((place) => this.locationResolverService.searchForLocation(place as string)),
    ).subscribe((result) => {
      this.filterService.setLatLon(result);
      this.mapComponent?.moveToLatLon(result);
    });

    this.bookingService.getBookings().subscribe(bookings => {
      let currentBookings = bookings.filter(booking => booking.status === BookingStatus.CHECKED_IN);
      if (currentBookings.length === 1) {
        this.currentBooking = currentBookings[0];
        this.upcomingBooking = undefined;
      } else {
        let upcomingBookings = bookings.filter(booking => booking.status === BookingStatus.RESERVED
        && this.isReservedWithinNextHour(booking));
        this.upcomingBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : undefined;
        this.currentBooking = undefined;
      }
      if (this.currentBooking || this.upcomingBooking) {
        this.showCurrentOrUpcomingBookingSheet();
      }
    });
  }

  public onLocateMe() {
    if (!navigator.geolocation?.getCurrentPosition) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      this.mapComponent?.moveToLatLon({lat, lon});
      this.mapComponent?.addSelfMarker([lat, lon]);
    });
  }

  public onMapReady(mapComponent: MapComponent) {
    this.mapComponent = mapComponent;
    mapComponent.addMarker([mapComponent.latitude, mapComponent.longitude], {id: 'my-id-yes'});
  }

  public onZoomChanged(zoomLevel: number) {
    console.log(zoomLevel);
  }

  public onMarkerClicked(parkingSpace: ParkingSpace) {
    console.log(parkingSpace);
    this.showParkingSpaceInfo(parkingSpace);
  }

  public test() {
    this.locationResolverService.searchForLocation('Ausserholligen, Bern').subscribe(location => {
      if (this.mapComponent) {
        this.mapComponent.moveToLatLon(location);
      }
      console.log(location);

      this.searchService.searchParkingSpaces(
        location,
        new Date('2021-10-08T13:00:16Z'),
        new Date('2021-10-08T13:00:16Z'))
        .subscribe(searchResult => console.log(searchResult));
    });

  }

  private showParkingSpaceInfo(parkingSpace: ParkingSpace) {
    this.parkingSpaceService.getParkingSpace(
      '1',
      new Date('2021-10-08T13:00:16Z'),
      new Date('2021-10-08T13:00:16Z')).subscribe(parkingSpace => {
      console.log(parkingSpace);
      this.parkingSpaceDetailSheet.open(ParkingSpaceDetailSheet, {data: parkingSpace});
    });
  }

  public showBookingHistory() {
    this.bookingHistorySheet.open(BookingHistorySheetComponent);
  }

  private isReservedWithinNextHour(booking: Booking) {
    const now = new Date();
    // @ts-ignore
    var diff = Math.abs(new Date(booking.reservedFromTime) - now);
    var minutes = Math.floor((diff/1000)/60);
    return minutes <= 60;
  }

  private showCurrentOrUpcomingBookingSheet() {
    if (this.currentBooking) {
      this.bookingSheet.open(BookingSheetComponent, {data: this.currentBooking});
    } else {
      this.bookingSheet.open(BookingSheetComponent, {data: this.upcomingBooking});
    }
  }
}
