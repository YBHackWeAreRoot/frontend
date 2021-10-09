import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LocationResolverService} from "../../services/location-resolver.service";
import {Filter, FilterService} from "../../services/filter.service";
import {addHours, addMinutes} from "date-fns";

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit {

  @ViewChild("location")
  public location?: ElementRef;
  private static now = new Date(); //addMinutes(new Date(), 15)
  private static later = addHours(new Date(), 2);
  public defaultStartValue = this.getTimeString(MapSearchComponent.now);
  public defaultEndValue = this.getTimeString(MapSearchComponent.later);
  public minStart = this.getTimeString(new Date());
  private readonly filter: Filter = {
    from: MapSearchComponent.now,
    to: MapSearchComponent.later
  };

  public constructor(
    private locationResolverService: LocationResolverService,
    private filterService: FilterService
  ) {
  }

  public ngOnInit(): void {
    this.filterService.updateFilter(this.filter.place, this.filter.from, this.filter.to);
  }

  public onClickSearch() {
    this.emitFilterChanged();
  }

  public onSubmit($event: Event) {
    $event.preventDefault();
    this.emitFilterChanged();
  }

  public onStartDataChange(event: Event) {
    this.filter.from = new Date((event.target as HTMLInputElement).value as string);
    this.emitFilterChanged();
  }

  public onEndDateChange(event: Event) {
    this.filter.to = new Date((event.target as HTMLInputElement).value as string);
    this.emitFilterChanged();
  }

  public getTimeString(dt: Date) {
    return `${
      dt.getFullYear().toString().padStart(4, '0')}-${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')}T${
      dt.getHours().toString().padStart(2, '0')}:${
      dt.getMinutes().toString().padStart(2, '0')}`;
  }

  private emitFilterChanged() {
    this.filter.place = this.location?.nativeElement.value;
    this.filter.to = new Date();

    this.filterService.updateFilter(this.filter.place, this.filter.from, this.filter.to);
  }
}
