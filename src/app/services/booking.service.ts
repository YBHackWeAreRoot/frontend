import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../model/booking';
import {BookRequest} from './book-request';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly basePath: string = 'https://mr-parker-backend.azurewebsites.net';
  private readonly listPath: string = '/api/bookings/list';
  private readonly postPath: string = '';
  private readonly cancelBooktingPath: string = '';
  private readonly checkInPath: string = '';
  private readonly checkOutPath: string = '';

  public constructor(private readonly httpClient: HttpClient) {
  }

  public createBooking(parkingSpaceId: string, from: Date, to: Date): Observable<void> {
    const bookRequest: BookRequest = {parkingSpaceId, from, to};
    return this.httpClient.post<void>(`${this.basePath}${this.postPath}`, bookRequest);
  }

  public getBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.basePath}${this.listPath}`);
  }

  public cancelBooking(bookingId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.basePath}${this.cancelBooktingPath}`, {bookingId});
  }

  public checkIn(bookingId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.basePath}${this.checkInPath}`, {bookingId});
  }

  public checkOut(bookingId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.basePath}${this.checkOutPath}`, {bookingId});
  }
}
