import {ParkingSpaceProvider} from './parking-space-provider';

export interface ParkingSpace {
  id: string;
  provider?: ParkingSpaceProvider;
  name?: string;
  description?: string;
  address?: string;
  info?: string;
  fromTime?: Date;
  toTime?: Date;
  capacity?: number;
  contact?: string;
  ratePerMinute?: number;
  positionLat?: number;
  positionLong?: number;
  currency?: string;
}
