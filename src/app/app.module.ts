import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import { MapControllerComponent } from './components/map-controller/map-controller.component';
import {HttpClientModule} from '@angular/common/http';
import {MatInputModule} from "@angular/material/input";
import { MapSearchComponent } from './components/map-search/map-search.component';
import {ParkingSpaceDetailSheet} from "./components/parking-space-detail-dialog/parking-space-detail-sheet.component";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DatePipe, DecimalPipe} from "@angular/common";
import { BookingHistorySheetComponent } from './components/booking-history-sheet/booking-history-sheet.component';
import {DatePipe} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControllerComponent,
    MapSearchComponent,
    MapControllerComponent,
    ParkingSpaceDetailSheet,
    BookingHistorySheetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    LeafletModule,
    MatInputModule,
    MatBottomSheetModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
