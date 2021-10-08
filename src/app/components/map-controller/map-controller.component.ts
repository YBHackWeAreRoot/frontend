import {Component, OnInit} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {LocationResolverService} from '../../services/location-resolver.service';
import {SearchService} from '../../services/search.service';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ParkingSpace} from "../../model/parking-space";
import {ParkingSpaceDetailSheet} from "../parking-space-detail-dialog/parking-space-detail-sheet.component";

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {
  private mapComponent?: MapComponent;

  public constructor(private readonly locationResolverService: LocationResolverService,
                     private readonly searchService: SearchService,
                     private parkingSpaceDetailSheet: MatBottomSheet) {
  }

  public ngOnInit(): void {
  }

  public onLocateMe() {
    if(!navigator.geolocation?.getCurrentPosition) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      this.mapComponent?.moveToLatLon({lat, lon});
    });
  }

  public onMapReady(mapComponent: MapComponent) {
    this.mapComponent = mapComponent;
    mapComponent.addMarker([mapComponent.latitude, mapComponent.longitude], {id: 'my-id-yes'})
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

      this.searchService.searchParkingSpaces(location, new Date('2021-10-08T13:00:16Z'),
        new Date('2021-10-08T13:00:16Z'))
        .subscribe(searchResult => console.log(searchResult));
    });
  }

  private showParkingSpaceInfo(parkingSpace1: ParkingSpace) {
    const markerId: string = '1';
    // TODO add service call
    const parkingSpace: ParkingSpace = {
      id: '1',
      name: 'ewb',
      address: 'Monbijoustrasse 11, 3011 Bern',
      info: 'Schlüssel liegt beim Pförtner',
      contact: '+41313213111',
      price_min: 0.31,
      fromDate: new Date(),
      toDate: new Date(),
      capacity: 1
    };
    const parkingSpaceDetailSheetRef = this.parkingSpaceDetailSheet.open(ParkingSpaceDetailSheet, {data: parkingSpace});
    parkingSpaceDetailSheetRef.backdropClick().subscribe(() => {
      console.log('close');
      parkingSpaceDetailSheetRef.dismiss();
    });
  }


  public onShowSheet() {

  }
}
