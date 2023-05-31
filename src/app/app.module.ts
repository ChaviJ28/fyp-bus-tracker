import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './modules/components/map-view/map-view.component';
import { ProfileComponent } from './modules/components/profile/profile.component';
import { BusRoutesComponent } from './modules/components/bus-routes/bus-routes.component';
import { HomeComponent } from './modules/components/home/home.component';
import { NavbarComponent } from './modules/components/navbar/navbar.component';
import { SpinnerComponent } from './modules/components/spinner/spinner.component';

import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './modules/components/register/register.component';
import { LoginComponent } from './modules/components/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    ProfileComponent,
    BusRoutesComponent,
    HomeComponent,
    NavbarComponent,
    SpinnerComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
