import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as Leaflet from 'leaflet';
import {LatLngExpression, LeafletEvent, Map, Marker} from 'leaflet';
import {LatLonCoordinates} from '../../model/latlon-coordinates.model';
import {ParkingSpace} from "../../model/parking-space";

export class CustomCircleMarker extends Marker {
  public readonly data?: ParkingSpace;

  public constructor(latlng: LatLngExpression, markerData: ParkingSpace) {
    super(latlng, {icon: markerIcon});
    this.data = markerData;
  }
}

const markerIcon = Leaflet.divIcon({
  className: 'parking-marker',
  html: '<div><span class="mat-elevation-z2 count">3</span><img src="assets/images/park2.png" alt="parking-symbol" /></div>'
});

const activeIcon = Leaflet.divIcon({
  className: 'active-marker',
  html: '<div><img src="assets/images/car_red_small.png" alt="active-symbol" /></div>'
});

const selfIcon = Leaflet.divIcon({
  className: 'self-marker',
  html: '<div><img src="assets/images/car_small.png" alt="self-symbol" /></div>'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public zoom = 17;
  public latitude = 46.963734;
  public longitude = 7.464972;
  public map?: Map;

  @Output()
  public readonly markerClicked: EventEmitter<ParkingSpace> = new EventEmitter();

  @Output()
  public readonly zoomChanged: EventEmitter<number> = new EventEmitter();

  @Output()
  public readonly mapReady: EventEmitter<MapComponent> = new EventEmitter();

  public readonly options: Leaflet.MapOptions = {
    layers: MapComponent.getLayers(),
    zoom: this.zoom,
    center: new Leaflet.LatLng(this.latitude, this.longitude)
  };

  public constructor() {
  }

  private static getLayers(): Leaflet.Layer[] {
    return [
      new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as Leaflet.TileLayerOptions),
    ] as Leaflet.Layer[];
  };

  public ngOnInit(): void {

  }

  public ngOnDestroy() {
    this.map?.clearAllEventListeners();
    this.map?.remove();
  };

  public onMapReady(map: Map) {
    this.map = map;
    this.zoom = map.getZoom();
    this.mapReady.emit(this);
  }

  public addMarker(latLng: LatLngExpression, parkingSpace: ParkingSpace): CustomCircleMarker {
    return new CustomCircleMarker(latLng, parkingSpace)
      .unbindPopup()
      .unbindTooltip()
      .on({
        add: (event) => {
          const element = (event.target._icon as HTMLElement);
          const countElement = element.querySelector('.count');
          if(countElement) {
            countElement.textContent = '' + parkingSpace.capacity;
          }


          element.onclick = () => {
            this.markerClicked.emit(event.target.data as ParkingSpace);
          };
        }
      })
      .addTo(this.map as Map);
  }

  private selfMarker?: Marker;
  public addSelfMarker(latLng: LatLngExpression): void {
    this.selfMarker?.remove();
    this.selfMarker = new Marker(latLng, {icon: selfIcon}).unbindPopup().unbindTooltip().addTo(this.map as Map);
  }

  private activeMarker?: Marker;
  public addActiveParking(latLng: LatLngExpression): void {
    this.activeMarker?.remove();
    this.activeMarker = new Marker(latLng, {icon: activeIcon, zIndexOffset: 100}).unbindPopup().unbindTooltip().addTo(this.map as Map);
  }

  public onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
    this.zoomChanged.emit(this.zoom);
  }

  public moveToLatLon(latLon: LatLonCoordinates) {
    if (this.map) {
      this.map.setView([latLon.lat, latLon.lon]);
    }
  }

  public getPosition(): LatLonCoordinates | undefined {
    if(!this.map) {
      return undefined;
    }
    return {lat: this.map.getCenter().lat, lon: this.map.getCenter().lng};
  }

  public removeActiveMarker() {
    this.activeMarker?.remove();
  }
}
