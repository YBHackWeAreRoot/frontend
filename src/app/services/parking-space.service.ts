import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ParkingSpace} from '../model/parking-space';

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  private readonly basePath: string = 'https://mr-parker-backend.azurewebsites.net/api/parkingspaces/detail?';

  public constructor(private readonly httpClient: HttpClient) {
  }

  public getParkingSpace(id: string, from: Date, to: Date): Observable<ParkingSpace> {
    const queryString = `id=${id}&from=${from.toISOString()}&to=${to.toISOString()}`;
    return this.httpClient.get<ParkingSpace>(this.basePath + queryString);
  }
}
