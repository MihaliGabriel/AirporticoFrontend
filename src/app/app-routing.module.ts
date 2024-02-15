import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { UpdateUserDialogComponent } from './users/update.component';
import { AirportsComponent } from './airports/airports.component';
import { UpdateAirportDialogComponent } from './airports/updateairport.component';
import { UpdateRoleDialogComponent } from './roles/updaterole.component';
import { RolesComponent } from './roles/roles.component';
import { CompanyComponent } from './companies/companies.component';
import { UpdateCompanyDialogComponent } from './companies/updatecompany.component';
import { UpdateRouteDialogComponent } from './routes/updateroute.component';
import { RoutesComponent } from './routes/routes.component';
import { FlightsComponent } from './flights/flight.component';
import { UpdateFlightDialogComponent } from './flights/updateflight.component';
import { BuyTicketComponent } from './tickets/buyticket.component';
import { SearchFlightsUserComponent } from './tickets/searchflightsuser.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ChangePasswordComponent } from './password/changepassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { LocationsComponent } from './locations/locations.component';
import { UpdateLocationDialogComponent } from './locations/updatelocation.component';
import { ProfileComponent } from './airports/profile/profile.component';
import { SmsAuthenticationComponent } from './smsauthentication/smsauthentication.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LuggageComponent } from './luggage/luggage.component';
import { AirplaneComponent } from './airplanes/airplanes.component';
import { UpdateAirplaneDialogComponent } from './airplanes/updateairplane.component';
import { ReserveTicketComponent } from './reserveticket/reserveticket.component';
const routes: Routes = [
  {path: 'auth/login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'authenticated', component: AuthenticatedComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN', 'ROLE_USER']}},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'updateuser', component: UpdateUserDialogComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'airports', component: AirportsComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updateairport', component: UpdateAirportDialogComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updaterole', component: UpdateRoleDialogComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'roles', component: RolesComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'companies', component: CompanyComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updatecompany', component: UpdateCompanyDialogComponent, canActivate: [AuthGuard]},
  {path: 'updateroute', component: UpdateRouteDialogComponent, canActivate: [AuthGuard]},
  {path: 'routes', component: RoutesComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'flights', component: FlightsComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updateflight', component: UpdateFlightDialogComponent, canActivate: [AuthGuard]},
  {path: 'buytickets', component: BuyTicketComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']}},
  {path: 'searchflightsuser', component: SearchFlightsUserComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']}},
  {path: 'ticketsforuser', component: TicketsComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']}},
  {path: 'auth/changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'resetpassword', component: ResetPasswordComponent, data: {roles: ['ROLE_USER']}},
  {path: 'locations', component: LocationsComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updatelocation', component: UpdateLocationDialogComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']}},
  {path: 'smsauthentication', component: SmsAuthenticationComponent, data: {roles: ['ROLE_USER']}},
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']} },
  { path: 'selectluggage', component: LuggageComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_USER']}},
  {path: 'airplanes', component: AirplaneComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'updateairplane', component: UpdateAirplaneDialogComponent, canActivate: [AuthGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: 'reserveticket', component: ReserveTicketComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {
}
