import { Component, OnInit } from '@angular/core';
import {MapComponent, MarkerData} from "../map/map.component";

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {

  public constructor() { }

  public ngOnInit(): void {
  }

  public onLocateMe() {

  }

  public onMapReady(mapComponent: MapComponent) {
    mapComponent.addMarker([mapComponent.latitude, mapComponent.longitude],{id: 'my-id-yes'})
  }

  public onZoomChanged(zoomLevel: number) {
    console.log(zoomLevel);
  }

  public onMarkerClicked(markerData: MarkerData) {
    console.log(markerData);
  }
}
