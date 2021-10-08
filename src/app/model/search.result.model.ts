export interface SearchResult {
  id: number;
  providerName: string;
  positionLat: number;
  positionLong: number;
  address: string;
  description?: string;
  fromTime: Date;
  toTime: Date;
  ratePerMinute: number;
  currency: string;
  capacity: number;
}
