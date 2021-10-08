import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationResolverService} from "../../services/location-resolver.service";

export interface Filter {
  place: string;
  from: Date;
  to: Date;
}

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit {

  public constructor(
    private locationResolverService: LocationResolverService
  ) { }

  public ngOnInit(): void {
  }

  public onClickSearch(element: HTMLInputElement) {
    const location = element.value;
    this.locationResolverService.searchForLocation(location);
  }
}
