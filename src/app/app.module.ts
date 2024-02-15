import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { UsersComponent } from './users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpdateUserDialogComponent } from './users/update.component';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { AirportsComponent } from './airports/airports.component';
import { UpdateAirportDialogComponent } from './airports/updateairport.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UpdateRoleDialogComponent } from './roles/updaterole.component';
import { RolesComponent } from './roles/roles.component';
import { CompanyComponent } from './companies/companies.component';
import { UpdateCompanyDialogComponent } from './companies/updatecompany.component';
import { UpdateRouteDialogComponent } from './routes/updateroute.component';
import { RoutesComponent } from './routes/routes.component';
import { UpdateFlightDialogComponent } from './flights/updateflight.component'; 
import { FlightsComponent } from './flights/flight.component';
import {SearchFlightsUserComponent } from './tickets/searchflightsuser.component';
import { BuyTicketComponent } from './tickets/buyticket.component';
import { TicketsComponent } from './tickets/tickets.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangePasswordComponent } from './password/changepassword.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { UpdateLocationDialogComponent } from './locations/updatelocation.component';
import { LocationsComponent } from './locations/locations.component';
import { AirportErrorComponent } from './airports/airporterror.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ProfileComponent } from './airports/profile/profile.component';
import { SmsAuthenticationComponent } from './smsauthentication/smsauthentication.component';
import { MatSliderModule } from '@angular/material/slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NrOfPassengersDialogComponent } from './authenticated/nrofpassengers.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LuggageComponent } from './luggage/luggage.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SeatsComponent } from './seats/seats.component';
import { UpdateAirplaneDialogComponent } from './airplanes/updateairplane.component';
import {AirplaneComponent} from './airplanes/airplanes.component'
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { ModalComponent } from './modal/modal.component';
import { ReserveTicketComponent } from './reserveticket/reserveticket.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    AuthenticatedComponent,
    UsersComponent,
    RegisterComponent,
    UpdateUserDialogComponent,
    AirportsComponent,
    UpdateAirportDialogComponent,
    UpdateRoleDialogComponent,
    RolesComponent,
    CompanyComponent,
    UpdateCompanyDialogComponent,
    UpdateRouteDialogComponent,
    RoutesComponent,
    FlightsComponent,
    UpdateFlightDialogComponent,
    BuyTicketComponent,
    SearchFlightsUserComponent,
    ChangePasswordComponent,
    TicketsComponent,
    NavbarComponent,
    ResetPasswordComponent,
    UpdateLocationDialogComponent,
    LocationsComponent,
    AirportErrorComponent,
    ProfileComponent,
    SmsAuthenticationComponent,
    NrOfPassengersDialogComponent,
    CheckoutComponent,
    LuggageComponent,
    SeatsComponent,
    AirplaneComponent,
    UpdateAirplaneDialogComponent,
    ModalComponent,
    ReserveTicketComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatSliderModule,
    NgbModule,
    MatSnackBarModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true}
  ]
})
export class AppModule { }
