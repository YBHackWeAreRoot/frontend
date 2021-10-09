import {ParkingSpace} from './parking-space';

export interface Booking {
  id: string;
  parkingSpace: ParkingSpace;
  reservedFromTime: Date;
  reservedToTime: Date;
  status: BookingStatus;
  checkedInTime?: Date;
  checkedOutTime?: Date;
  createdDate: Date;
  price: number;
  currency: string;
}

export enum BookingStatus {
  RESERVED = 'Reserved',
  CHECKED_IN = 'CheckedIn',
  CHECKED_OUT = 'CheckedOut',
  CANCELED = 'Canceled',
  CANCELED_BY_SYSTEM = 'CanceledBySystem'
}
