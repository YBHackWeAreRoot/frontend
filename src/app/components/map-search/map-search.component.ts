import { Component, OnInit } from '@angular/core';

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

  public constructor() { }

  public ngOnInit(): void {
  }

}
