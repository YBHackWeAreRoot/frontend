import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LocationResolverService} from "../../services/location-resolver.service";
import {Filter, FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss']
})
export class MapSearchComponent implements OnInit {

  @ViewChild("location")
  public location?: ElementRef;
  public defaultStartValue = this.getTimeString(new Date());
  public defaultEndValue = this.getTimeString(new Date(new Date().setDate(new Date().getDate() + 1)));
  public minStart = this.getTimeString(new Date());
  private readonly filter: Filter = {};

  public constructor(
    private locationResolverService: LocationResolverService,
    private filterService: FilterService
  ) {
  }

  public ngOnInit(): void {
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

    this.filterService.updateFilter(this.filter);
  }
}
