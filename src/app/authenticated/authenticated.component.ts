import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Flight, FlightService } from '../services/flight.service';
import { Person, PersonService } from '../services/person.service';
import { FormControl } from '@angular/forms';
import { BuyTicketComponent } from '../tickets/buyticket.component';
import { MatDialog } from '@angular/material/dialog';
import { NrOfPassengersDialogComponent } from './nrofpassengers.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})

export class AuthenticatedComponent implements OnInit {
  isUserLoggedIn = false;
  isAdmin = false;
  isUser = false;
  title = 'Authentication';
  cheapestFlights : Flight[] = [];

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private authService: AuthService,
              private router: Router,
              private flightService: FlightService,
              private dialog: MatDialog,
              private personService: PersonService,
              private translate: TranslateService,
              private languageService: LanguageService
      ) {
        this.translate.setDefaultLang(this.selectedLanguage);
        if(languageService.getCurrentLanguage()) 
          this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn();
    // Fetch the user's role and set isAdmin/isUser flags
    if (this.isUserLoggedIn) {
    const user = this.authService.getUserValue();
    let token: any = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    let remainingTime = token.exp - currentTime;
    console.log(currentTime, token.exp);
    if(remainingTime < 0) {
      this.logout();
    }
    else {
      const role = this.authService.getRole(); // Assuming a method that returns the user role
      this.isAdmin = role === 'ROLE_ADMIN';
      this.isUser = role === 'ROLE_USER';
    }
    }
    this.flightService.getCheapestFlights().subscribe(data => {
      this.cheapestFlights = data;
    });
   
  }
  bookFlight(flight: Flight) {
    const emptyPerson: Person = {
      id: BigInt(0),
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userId: BigInt(0),
      birthDate: new Date(0)
    };
      const idString: string = localStorage.getItem('id') ?? '';
      const id = BigInt(idString);
      emptyPerson.userId = id;

      const dialogRef = this.dialog.open(NrOfPassengersDialogComponent);
      dialogRef.afterClosed().subscribe(nrOfPassengers => {
        if(nrOfPassengers) {
          this.personService.getPersonByUser(id).subscribe((emptyPerson) => {
            console.log("empty person", emptyPerson);
            if (emptyPerson.id != BigInt(0)) {
              nrOfPassengers = nrOfPassengers - 1;
              console.log("nr of passengers", nrOfPassengers);
            }
            console.log(nrOfPassengers)
            const dialogRef2 = this.dialog.open(BuyTicketComponent, {
              data: { flight, id, nrOfPassengers }
            });
          })  
          }
      });
    }
  logout() {
    return this.router.navigate(['logout']);
  }
  onLanguageChange() {
    console.log("language changed");
    this.flightService.getCheapestFlights().subscribe(data => {
      console.log("languagec change cheapest flights");
      console.log(this.cheapestFlights);
      this.cheapestFlights = data;
    });
  }
}