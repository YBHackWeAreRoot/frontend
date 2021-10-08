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

export class CustomCircleMarker extends CircleMarker {
  public readonly data?: MarkerData;
  public constructor(latlng: LatLngExpression, markerData: MarkerData) {
    super(latlng, {});
    this.data = markerData;
  }
}

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
  public readonly markerClickedEventEmitter: EventEmitter<MarkerData> = new EventEmitter();

  @Output()
  public readonly zoomChangedEventEmitter: EventEmitter<number> = new EventEmitter();

  @Output()
  public readonly mapReadyEventEmitter: EventEmitter<number> = new EventEmitter();

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
    console.log(this.map);
    this.mapReadyEventEmitter.emit();
  }

  public addMarker(markerData: MarkerData): CustomCircleMarker {
    return new CustomCircleMarker([this.latitude, this.longitude], markerData)
      .on({
        click: event => {
          console.log(event.target.data);
          this.markerClickedEventEmitter.emit(event.target.data as MarkerData)
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
