import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapControllerComponent} from "./components/map-controller/map-controller.component";

const routes: Routes = [
  {
    path: '', component: MapControllerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
