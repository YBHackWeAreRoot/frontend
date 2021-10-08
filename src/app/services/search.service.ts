import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LatLonCoordinates} from '../model/latlon-coordinates.model';
import {Observable} from 'rxjs';
import {SearchResult} from '../model/search.result.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly basePath: string = 'https://mr-parker-backend.azurewebsites.net/api/parkingspaces/search?';

  public constructor(private readonly httpClient: HttpClient) {
  }

  public searchParkingSpaces(latLon: LatLonCoordinates, from: Date, to: Date): Observable<SearchResult[]> {
    const queryString = `position=${latLon.lat},${latLon.lon}&from=${from.toISOString()}&to=${to.toISOString()}`;
    return this.httpClient.get<SearchResult[]>(this.basePath + queryString);
  }
}
