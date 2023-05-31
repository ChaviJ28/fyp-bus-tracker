import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/components/home/home.component';
import { MapViewComponent } from './modules/components/map-view/map-view.component';
import { BusRoutesComponent } from './modules/components/bus-routes/bus-routes.component';
import { ProfileComponent } from './modules/components/profile/profile.component';
import { LoginComponent } from './modules/components/login/login.component';
import { RegisterComponent } from './modules/components/register/register.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapViewComponent },
  { path: 'bus-routes', component: BusRoutesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
