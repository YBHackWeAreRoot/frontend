import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as Leaflet from 'leaflet';
import {
  Map,
  Control,
  DomUtil,
  ZoomAnimEvent,
  Layer,
  MapOptions,
  tileLayer,
  latLng,
  LeafletEvent,
  Marker, CircleMarker, LatLngExpression, CircleMarkerOptions
} from 'leaflet';
import {mark} from "@angular/compiler-cli/src/ngtsc/perf/src/clock";

export interface MarkerData {
  id: string | null;
}

export class CustomCircleMarker extends Marker {
  public readonly data?: MarkerData;
  public constructor(latlng: LatLngExpression, markerData: MarkerData) {
    super(latlng, {icon: markerIcon});
    this.data = markerData;
  }
}

const markerIcon = Leaflet.divIcon({
  className: 'my-div-icon',
  html: '<span>3</span><img src="assets/images/parking_icon.svg" alt="parking-symbol" />'
});;

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
  public readonly markerClicked: EventEmitter<MarkerData> = new EventEmitter();

  @Output()
  public readonly zoomChanged: EventEmitter<number> = new EventEmitter();

  @Output()
  public readonly mapReady: EventEmitter<MapComponent> = new EventEmitter();

  public options: Leaflet.MapOptions = {
    layers: MapComponent.getLayers(),
    zoom: this.zoom,
    center: new Leaflet.LatLng(this.latitude, this.longitude)
  };

  public constructor() { }

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

  public addMarker(latLng: LatLngExpression, markerData: MarkerData): CustomCircleMarker {
    return new CustomCircleMarker([this.latitude, this.longitude], markerData)
      .on({
        click: event => {
          this.markerClicked.emit(event.target.data as MarkerData)
        }
      })
      .addTo(this.map as Map);
  }

  public onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
  }

  private static getLayers(): Leaflet.Layer[] {
    return [
      new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as Leaflet.TileLayerOptions),
    ] as Leaflet.Layer[];
  };

}
