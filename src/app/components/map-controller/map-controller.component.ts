import {Component, OnInit} from '@angular/core';
import {MapComponent, MarkerData} from "../map/map.component";
import {LocationResolverService} from '../../services/location-resolver.service';

@Component({
  selector: 'app-map-controller',
  templateUrl: './map-controller.component.html',
  styleUrls: ['./map-controller.component.scss']
})
export class MapControllerComponent implements OnInit {
  private mapComponent?: MapComponent;

  public constructor(private readonly locationResolverService: LocationResolverService) {
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

  public onMarkerClicked(markerData: MarkerData) {
    console.log(markerData);
  }

  public test() {
    this.locationResolverService.searchForLocation('Ausserholligen, Bern').subscribe(value => {
      if (this.mapComponent) {
        this.mapComponent.moveToLatLon(value);
      }
      console.log(value)
    });
  }
}
