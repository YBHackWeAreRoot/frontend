import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ParkingSpace} from '../model/parking-space';

@Injectable({
  providedIn: 'root'
})
export class SelectParkingSpaceService {

  public readonly goToParkingSpace = new Subject<ParkingSpace>();

}
