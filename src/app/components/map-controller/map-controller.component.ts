import {Component, OnInit} from '@angular/core';
import {CustomCircleMarker, MapComponent} from "../map/map.component";
import {LocationResolverService} from '../../services/location-resolver.service';
import {SearchService} from '../../services/search.service';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ParkingSpaceDetailSheet} from "../parking-space-detail-dialog/parking-space-detail-sheet.component";
import {ParkingSpaceService} from '../../services/parking-space.service';
import {FilterService} from "../../services/filter.service";
import {distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {BookingHistorySheetComponent} from "../booking-history-sheet/booking-history-sheet.component";
import {BookingService} from "../../services/booking.service";
import {Booking, BookingStatus} from "../../model/booking";
import {BookingSheetComponent} from "../booking-dialog/booking-sheet.component";
import {SelectParkingSpaceService} from '../../services/select-parking-space.service';
import {LatLonCoordinates} from "../../model/latlon-coordinates.model";
import {ParkingSpace} from "../../model/parking-space";

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {
  public currentBooking?: Booking;
  public upcomingBooking?: Booking;
  private mapComponent?: MapComponent;
  private markers: CustomCircleMarker[] = [];

  public constructor(private readonly filterService: FilterService,
                     private readonly locationResolverService: LocationResolverService,
                     private readonly searchService: SearchService,
                     private readonly parkingSpaceService: ParkingSpaceService,
                     private readonly bookingService: BookingService,
                     private readonly bookingHistorySheet: MatBottomSheet,
                     private selectParkingSpaceService: SelectParkingSpaceService,
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

    this.selectParkingSpaceService.goToParkingSpace.subscribe(parkingSpace => {
      if (this.mapComponent && parkingSpace.positionLat && parkingSpace.positionLong) {
        this.mapComponent.moveToLatLon({lat: parkingSpace.positionLat, lon: parkingSpace.positionLong});
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
      this.filterService.setLatLon({lat, lon});
      this.mapComponent?.moveToLatLon({lat, lon});

      this.mapComponent?.addSelfMarker([lat, lon]);
    });
  }

  public onMapReady(mapComponent: MapComponent) {
    this.mapComponent = mapComponent;
    this.filterService.filterChangeObservable()
      .pipe(
        filter(filter => !!filter.latLon && !!filter.from && !!filter.to),
        switchMap((filter) => this.searchService.searchParkingSpaces(filter.latLon as LatLonCoordinates, filter.from as Date, filter.to as Date)),
      )
      .subscribe((results) => {
        this.clearMarkers();
        results.forEach((result) => {
          this.markers.push(mapComponent.addMarker([result.positionLat as number, result.positionLong as number], result));
        });
      });
    this.filterService.setLatLon(this.mapComponent.getPosition())
  }

  public onZoomChanged(zoomLevel: number) {
    console.log(zoomLevel);
  }

  public onMarkerClicked(parkingSpace: ParkingSpace) {
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

  public showBookingHistory() {
    this.bookingHistorySheet.open(BookingHistorySheetComponent);
  }

  private showParkingSpaceInfo(parkingSpace: ParkingSpace) {
    const parkingSpaceDetailSheetRef = this.parkingSpaceDetailSheet
      .open(ParkingSpaceDetailSheet, {data: parkingSpace});
    parkingSpaceDetailSheetRef.backdropClick().subscribe(() => {
      parkingSpaceDetailSheetRef.dismiss();
    });
  }

  private isReservedWithinNextHour(booking: Booking) {
    const now = new Date();
    // @ts-ignore
    var diff = Math.abs(new Date(booking.reservedFromTime) - now);
    var minutes = Math.floor((diff / 1000) / 60);
    return minutes <= 60;
  }

  private showCurrentOrUpcomingBookingSheet() {
    if (this.currentBooking) {
      this.bookingSheet.open(BookingSheetComponent, {data: this.currentBooking});
    } else {
      this.bookingSheet.open(BookingSheetComponent, {data: this.upcomingBooking});
    }
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.remove());
  }

  public showLastRecentBooking() {
    this.showCurrentOrUpcomingBookingSheet();
  }
}
