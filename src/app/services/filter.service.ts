import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {LatLonCoordinates} from "../model/latlon-coordinates.model";

export interface Filter {
  place?: string;
  from?: Date;
  to?: Date;
  latLon?: LatLonCoordinates;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private readonly filterBehaviourSubject = new BehaviorSubject<Filter>({});

  public constructor() { }

  public updateFilter(place?: string, from?: Date, to?: Date) {
    const filter = this.filterBehaviourSubject.getValue();
    filter.from = from;
    filter.to = to;
    filter.place = place;
    this.filterBehaviourSubject.next(filter);
  }

  public filterChangeObservable(): Observable<Filter> {
    return this.filterBehaviourSubject.asObservable();
  }

  public setLatLon(result?: LatLonCoordinates) {
    const filter = this.filterBehaviourSubject.getValue();
    filter.latLon = result;
    this.filterBehaviourSubject.next(filter);
  }
}
