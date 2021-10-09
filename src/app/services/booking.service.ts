import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Booking} from '../model/booking';
import {BookingRequest} from './booking-request';
import {map} from 'rxjs/operators';
import {addHours, isAfter, isBefore} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public readonly bookingsRefreshed = new BehaviorSubject<Booking[]>([]);
  private readonly basePath: string = 'https://mr-parker-backend.azurewebsites.net';
  private readonly listPath: string = '/api/bookings/list';
  private readonly postPath: string = '/api/bookings/new';
  private readonly cancelBooktingPath: string = '/api/bookings/cancel';
  private readonly checkInPath: string = '/api/bookings/checkin';
  private readonly checkOutPath: string = '/api/bookings/checkout';

  public constructor(private readonly httpClient: HttpClient) {
  }

  public triggerBookingsReload(): void {
    this.getBookings().subscribe(bookings => {
      this.bookingsRefreshed.next(bookings);
    });
  }

  public createBooking(parkingSpaceId: string, from: Date, to: Date): Observable<void> {
    const bookRequest: BookingRequest = {parkingSpaceId, from, to};
    return this.httpClient.post<void>(`${this.basePath}${this.postPath}`, bookRequest);
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

  private getBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.basePath}${this.listPath}`).pipe(
      map(bookings => bookings.map(booking => this.addTimeShift(booking))
        .sort((a, b) => {
          if (isAfter(a.createdDate, b.createdDate)) {
            return -1;
          }
          if (isBefore(a.createdDate, b.createdDate)) {
            return 1;
          }

          return 0;
        })
      ));
  }

  private addTimeShift(booking: Booking): Booking {
    booking.reservedFromTime =  addHours(new Date(booking.reservedFromTime), 2);
    booking.reservedToTime = addHours(new Date(booking.reservedToTime), 2);
    booking.checkedInTime = !booking.checkedInTime ? undefined : addHours(new Date(booking.checkedInTime), 2);
    booking.checkedOutTime = !booking.checkedOutTime ? undefined : addHours(new Date(booking.checkedOutTime), 2);
    booking.createdDate = addHours(new Date(booking.createdDate), 2);
    return booking;
  }
}
