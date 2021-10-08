import {ParkingSpaceProvider} from './parking-space-provider';

export interface ParkingSpace {
  id: string;
  provider?: ParkingSpaceProvider;
  name?: string;
  description?: string;
  address?: string;
  fromTime?: Date;
  toTime?: Date;
  capacity?: number;
  ratePerMinute?: number;
  positionLat?: number;
  positionLong?: number;
  currency?: string;
}
