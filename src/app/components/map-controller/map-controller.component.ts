import {Component, OnInit} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {LocationResolverService} from '../../services/location-resolver.service';
import {SearchService} from '../../services/search.service';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ParkingSpaceDetailSheet} from "../parking-space-detail-dialog/parking-space-detail-sheet.component";
import {ParkingSpaceService} from '../../services/parking-space.service';
import {FilterService} from "../../services/filter.service";
import {distinctUntilChanged, filter, map, switchMap, tap} from "rxjs/operators";
import {BookingHistorySheetComponent} from "../booking-history-sheet/booking-history-sheet.component";
import {LatLonCoordinates} from "../../model/latlon-coordinates.model";
import {ParkingSpace} from "../../model/parking-space";

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {
  private mapComponent?: MapComponent;

  public constructor(private readonly filterService: FilterService,
                     private readonly locationResolverService: LocationResolverService,
                     private readonly searchService: SearchService,
                     private readonly parkingSpaceService: ParkingSpaceService,
                     private readonly bookingHistorySheet: MatBottomSheet,
                     private parkingSpaceDetailSheet: MatBottomSheet) {
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
    this.filterService.filterChangeObservable()
      .pipe(
        tap((valu) => {
          debugger;
        }),
        filter(filter => !!filter.latLon && !!filter.from && !!filter.to),
        switchMap((filter) => this.searchService.searchParkingSpaces(filter.latLon as LatLonCoordinates, filter.from as Date, filter.to as Date)),
      )
      .subscribe((results) => {
        results.forEach((result) => {
          mapComponent.addMarker([mapComponent.latitude, mapComponent.longitude], result);
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
    const bookingHistorySheet = this.bookingHistorySheet.open(BookingHistorySheetComponent);
  }

  private showParkingSpaceInfo(parkingSpace: ParkingSpace) {
    const parkingSpaceDetailSheetRef = this.parkingSpaceDetailSheet
      .open(ParkingSpaceDetailSheet, {data: parkingSpace});
    parkingSpaceDetailSheetRef.backdropClick().subscribe(() => {
      parkingSpaceDetailSheetRef.dismiss();
    });
  }
}
