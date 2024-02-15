import { Component, Inject, OnInit } from '@angular/core';
import { Flight, FlightService } from '../services/flight.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Route, RouteService } from '../services/route.service';
import { Company, CompanyService } from '../services/company.service';
import { BuyTicketComponent } from './buyticket.component';
import { AuthService } from '../services/auth.service';
import { UserValue } from '../services/auth.service';
import { Location, LocationService } from '../services/location.service';
import { DatePipe } from '@angular/common';
import { Person, PersonService } from '../services/person.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-searchflightsuser',
  templateUrl: './searchflightsuser.component.html',
  styleUrls: ['./searchflightsuser.component.css'],
  animations: [
    trigger('expandDetail', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class SearchFlightsUserComponent implements OnInit {
  searchFlightForm: FormGroup; // Define the FormGroup
  buyButtonClicked = false;
  flights: Flight[] = [];
  companies: Company[] = [];
  locations: Location[] = [];
  businessPrice: any = 0;
  economyPrice: any = 0;
  firstClassPrice: any = 0;
  sortByDuration: any = [];
  searchedFlight?: Flight; 
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;
  minPriceSlider = 0;
  maxPriceFirstClassSlider = 2000;
  maxPriceBusinessSlider = 2000;
  maxPriceEconomySlider = 2000;
  maxPriceFirstClassSliderValue: number = 0;
  minPriceFirstClassSliderValue: number = 0;
  maxPriceBusinessSliderValue: number = 0;
  minPriceBusinessSliderValue: number = 0;
  maxPriceEconomySliderValue: number = 0;
  minPriceEconomySliderValue: number = 0;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private locationService: LocationService,
    private personService: PersonService,
    private flightService: FlightService,
    private dialog: MatDialog,
    private routeService: RouteService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.searchFlightForm = this.fb.group({
      departureCity: null,
      arrivalCity: null,
      departureDate: null,
      arrivalDate: null,
      companyId: null,
      nrOfPassengers: ['', Validators.required],
      sortByDuration: null,
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadCompanies();
    this.loadLocations();
    this.loadFlights();
  }
  loadFlights() {
    this.flightService.getFlightsUser(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.flights =  response.content.map((flight: any) => ({...flight, isExpanded: false }));
      this.totalPages = response.totalPages;
    },
    error => {
      console.log(error);
    });
  }
  loadLocations(): void {
    this.locationService.getAllLocations().subscribe(
      (data: Location[]) => {
        this.locations = data;
      }
    )
  }
  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(
      (companies: Company[]) => {
        this.companies = companies;
      },
      (error: any) => {
        console.error('Error in fetching companies: ', error);
      }
    )
  }
  buyTicket(flight: Flight) {
    this.buyButtonClicked = true;
    if (this.getFlightControl("nrOfPassengers").valid) {
      let nrOfPassengers = this.searchFlightForm.value.nrOfPassengers;
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
      this.personService.getPersonByUser(id).subscribe((emptyPerson) => {
        console.log("empty person", emptyPerson);
        if (emptyPerson.id != BigInt(0)) {
          nrOfPassengers = nrOfPassengers - 1;
          console.log("nr of passengers", nrOfPassengers);
          const dialogRef = this.dialog.open(BuyTicketComponent, {
            data: { flight, id, nrOfPassengers }
          });
        }
        else {
          console.log("nr of passengers", nrOfPassengers);
          const dialogRef = this.dialog.open(BuyTicketComponent, {
            data: { flight, id, nrOfPassengers }
          });
        }
        this.flightService.getAllFlights();
      })  
    }
  }
  loadSearchedFlights(flight: Flight) {
    const formattedArrivalDate = flight.arrivalDate ? this.datePipe.transform(flight.arrivalDate, 'yyyy-MM-dd HH:mm:ss') : null;
    const formattedDepartureDate = flight.departureDate ? this.datePipe.transform(flight.departureDate, 'yyyy-MM-dd HH:mm:ss') : null;

    if (formattedArrivalDate && formattedDepartureDate) {
      console.log(formattedArrivalDate + formattedDepartureDate);
    }

    flight.arrivalDate = formattedArrivalDate;
    flight.departureDate = formattedDepartureDate;
    flight.businessPriceMax = this.businessPrice[1];
    flight.businessPriceMin = this.businessPrice[0];
    flight.firstClassPriceMax = this.firstClassPrice[1];
    flight.firstClassPriceMin = this.firstClassPrice[0];
    flight.economyPriceMax = this.economyPrice[1];
    flight.economyPriceMin = this.economyPrice[0];

    this.flightService.searchFlights(this.currentPage, this.itemsPerPage, flight).subscribe(
      (response => {
        this.flights =  response.content.map((flight: any) => ({...flight, isExpanded: false }));
        this.totalPages = response.totalPages;
      }));
  }
  searchFlight(flight: Flight) {
    this.searchedFlight = flight;
    this.loadSearchedFlights(flight);
    this.searchFlightForm.reset();
  }
  getFlightControl(controlName: string): FormControl {
    return this.searchFlightForm.get(controlName) as FormControl;
  }
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      if(this.searchedFlight) 
        this.loadSearchedFlights(this.searchedFlight);
    }
  }

  toggleDetails(flight: Flight): void {
    flight.isExpanded = !flight.isExpanded; // Toggle the isExpanded property
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      if(this.searchedFlight) 
        this.loadSearchedFlights(this.searchedFlight);
    }
  }

  onPriceSliderValueChange(): void {

    const formattedArrivalDate = this.searchFlightForm.get('arrivalDate')?.value ? this.datePipe.transform( this.searchFlightForm.get('arrivalDate')?.value, 'yyyy-MM-dd HH:mm:ss') : null;
    const formattedDepartureDate =  this.searchFlightForm.get('departureDate')?.value ? this.datePipe.transform(this.searchFlightForm.get('departureDate')?.value, 'yyyy-MM-dd HH:mm:ss') : null;

    if (formattedArrivalDate && formattedDepartureDate) {
      console.log(formattedArrivalDate + formattedDepartureDate);
    }
    if (this.minPriceFirstClassSliderValue === -1 || this.maxPriceFirstClassSliderValue === -1 || 
      this.minPriceBusinessSliderValue === -1 || this.maxPriceBusinessSliderValue === -1 ||
      this.minPriceEconomySliderValue === -1 || this.maxPriceEconomySliderValue === -1) {
      return;
    }
    const flight: Flight = {
      companyId: this.searchFlightForm.get('companyId')?.value,
      sortByDuration: this.searchFlightForm.get('sortByDuration')?.value,
      nrOfPassengers: this.searchFlightForm.get('nrOfPassengers')?.value,
      firstClassPriceMin: this.minPriceFirstClassSliderValue,
      firstClassPriceMax: this.maxPriceFirstClassSliderValue,
      businessPriceMin: this.minPriceBusinessSliderValue,
      businessPriceMax: this.maxPriceBusinessSliderValue,
      economyPriceMin: this.minPriceEconomySliderValue,
      economyPriceMax: this.maxPriceEconomySliderValue,
      departureCity: this.searchFlightForm.get('departureCity')?.value,
      departureDate: formattedDepartureDate,
      arrivalCity: this.searchFlightForm.get('arrivalCity')?.value,
      arrivalDate: formattedArrivalDate,
      id: null,
      name: '',
      routeId: null,
      businessSeats: 0,
      economySeats: 0,
      firstClassSeats: 0,
      companyName: '',
      routeName: null,
      remainingBusinessSeats: 0,
      remainingEconomySeats: null,
      remainingFirstClassSeats: null,
      businessPrice: 0,
      economyPrice: 0,
      firstClassPrice: 0,
      discountedBusinessPrice: 0,
      discountedEconomyPrice: 0,
      discountedFirstClassPrice: 0,
      discountPercentage: 0,
      duration: '',
      isExpanded: false,
      occupiedSeats: [],
      airplaneName: ''
    }

    this.flightService.searchFlights(this.currentPage, this.itemsPerPage, flight).subscribe(
      (response => {
        this.flights = response.content;
        this.totalPages = response.totalPages;
      }));
  }
  onLanguageChange() {
    this.loadCompanies();
    this.loadLocations();
    this.loadFlights();
  }
  
  }
