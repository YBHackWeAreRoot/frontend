import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Booking} from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly basePath: string = 'https://mr-parker-backend.azurewebsites.net/api/booking/';

  public constructor(private readonly httpClient: HttpClient) {
  }

  public createBooking(parkingSpaceId: string, from: Date, to: Date): Observable<void> {
    // const queryString = `position=${latLon.lat},${latLon.lon}&from=${from.toISOString()}&to=${to.toISOString()}`;
    // return this.httpClient.post<void>(this.basePath + queryString);
    return of();
  }

  public getBookings(): Observable<Booking[]> {
    return of([]);
  }

  public cancelBooking(bookingId: string): Observable<void> {
    return of();
  }

  public checkIn(bookingId: string): Observable<void> {
    return of();
  }

  public checkOut(bookingId: string): Observable<void> {
    return of();
  }
}
