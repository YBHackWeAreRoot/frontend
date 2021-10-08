import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';

export const getLayers = (): Leaflet.Layer[] => {
  return [
    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    } as Leaflet.TileLayerOptions),
  ] as Leaflet.Layer[];
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public latitude = 46.963734;
  public longitude = 7.464972;

  title = 'AngularOSM';

  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 12,
    center: new Leaflet.LatLng(this.latitude, this.longitude)
  };

  public constructor() { }

  public ngOnInit(): void {

  }

}
