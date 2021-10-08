import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {LatLonCoordinates} from '../model/latlon-coordinates.model';

@Injectable({
  providedIn: 'root'
})
export class LocationResolverService {

  private readonly basePath: string = 'https://nominatim.openstreetmap.org/search?q=';
  private readonly postParams: string = '&format=json';

  public constructor(public readonly httpClient: HttpClient) {
  }

  public searchForLocation(location: string): Observable<LatLonCoordinates> {
    const searchTerm = encodeURIComponent(location);
    return this.createSearchRequest(searchTerm);
  }

  private createSearchRequest(searchTerm: string): Observable<LatLonCoordinates> {
    return this.httpClient.get<LatLonCoordinates[]>(`${this.basePath}${searchTerm}${this.postParams}`)
      .pipe(
        filter(value => value.length > 0),
        map(value => ({lat: value[0].lat, lon: value[0].lon}))
      );
  }
}
