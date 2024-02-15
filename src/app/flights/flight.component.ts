import { Component, Inject, OnInit } from '@angular/core';
import { Flight, FlightService } from '../services/flight.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateFlightDialogComponent } from './updateflight.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Route, RouteService } from '../services/route.service';
import { Company, CompanyService } from '../services/company.service';
import { AirportErrorComponent } from '../airports/airporterror.component';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Airplane, AirplaneService } from '../services/airplane.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['flight.component.css'],
  animations: [
    trigger('expandDetail', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FlightsComponent implements OnInit {
  flightForm: FormGroup; // Define the FormGroup
  nameNotUniqueMessage = '';
  flights: Flight[] = [];
  routes: Route[] = [];
  companies: Company[] = [];
  airplanes: Airplane[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private flightService: FlightService,
    private dialog: MatDialog,
    private routeService: RouteService,
    private companyService: CompanyService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService,
    private airplaneService: AirplaneService
  ) {
    this.flightForm = this.fb.group({
      businessSeats: [null, Validators.required],
      economySeats: [null, Validators.required],
      firstClassSeats: [null, Validators.required],
      departureDate: [null, Validators.required],
      arrivalDate: [null, Validators.required],
      routeId: [null, Validators.required],
      companyId: [null, Validators.required],
      businessPrice: [null, Validators.required],
      economyPrice: [null, Validators.required],
      firstClassPrice:[null, Validators.required],
      airplaneName:[null, Validators.required]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadRoutes();
    this.loadCompanies();
    this.loadAirplanes();
    this.loadFlights();
  }
  
  loadFlights() {
    this.flightService.getFlights(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.flights = response.content.map((flight: any) => ({...flight, isExpanded: false }));
      this.totalPages = response.totalPages;
    });
  }

  toggleDetails(flight: Flight): void {
    flight.isExpanded = !flight.isExpanded; // Toggle the isExpanded property
  }

  loadAirplanes() {
    this.airplaneService.getAllAirplanes().subscribe(
      airplanes => {
        this.airplanes = airplanes;
      },
      error => {
        console.error('Error in fetching airplanes', error);
      }      
    )
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(
      companies => {
        this.companies = companies;
      },
      error => {
        console.error('Error in fetching companies: ', error);
      }
    )
  }
  loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe(
      routes => {
        this.routes = routes;
      },
      error => {
        console.error('Error in fetching routes: ', error);
      }
    );
  }

  showError(errorMessage: string): void {
    const dialogRef = this.dialog.open(AirportErrorComponent, {
      width: '300px', // Set the width of the dialog
      data: { errorMessage },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
    });
  }

  addFlight(flight: Flight): any {
    const formattedArrivalDate = flight.arrivalDate ? this.datePipe.transform(flight.arrivalDate, 'yyyy-MM-dd HH:mm:ss') : null;
    const formattedDepartureDate = flight.departureDate ? this.datePipe.transform(flight.departureDate, 'yyyy-MM-dd HH:mm:ss') : null;

    if (formattedArrivalDate && formattedDepartureDate) {
      console.log(formattedArrivalDate + formattedDepartureDate);
    }
    flight.arrivalDate = formattedArrivalDate;
    flight.departureDate = formattedDepartureDate;
    console.log(flight);
    this.flightService.createFlight(flight).subscribe(flight => {
      this.flights.push(flight);
      this.loadFlights();
      this.flightForm.reset(); // Reset the form after successful submission
    },
    error => {
      this.nameNotUniqueMessage = error;
      console.log(error);
    })
  }

  updateFlight(flight: Flight) {
    console.log(flight.arrivalDate + " date in flights update" + flight.departureDate);
    const dialogRef = this.dialog.open(UpdateFlightDialogComponent, {
      data: flight
    });
    console.log("data flight" + flight);
    dialogRef.afterClosed().subscribe(updatedFlight => {  
      if (updatedFlight) {
        const formattedArrivalDate = updatedFlight.arrivalDate ? this.datePipe.transform(updatedFlight.arrivalDate, 'yyyy-MM-dd HH:mm:ss') : null;
        const formattedDepartureDate = updatedFlight.departureDate ? this.datePipe.transform(updatedFlight.departureDate, 'yyyy-MM-dd HH:mm:ss') : null;

        if (formattedArrivalDate && formattedDepartureDate) {
          console.log(formattedArrivalDate + formattedDepartureDate);
        }
        updatedFlight.arrivalDate = formattedArrivalDate;
        updatedFlight.departureDate = formattedDepartureDate;
        console.log(updatedFlight);
        this.flightService.updateFlight(updatedFlight).subscribe((updatedFlight) => {
          console.log(updatedFlight);
          const index = this.flights.findIndex(u => u.id === updatedFlight.id);
          if (index !== -1) {
            const indexRoute = this.routes.findIndex(r => r.id === updatedFlight.routeId);
            this.flights[index] = updatedFlight;
          }
        },
          (error: any) => {
            this.showError(error);
            console.error('Error updating flight: ', error);
          });
      }
    });
  }

  deleteFlight(id: BigInt) {
    this.flightService.deleteFlight(id).subscribe(
      data => {
        this.flights = data;
      },
      error => {
        console.error('Error in fetching flights after delete: ', error);
      }
    )
  }

  exportFlightsToPdf() {
    this.flightService.exportToPdf().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error in exporting flights to PDF', error);
      }
    )
  }

  exportFlightsToExcel() {
    this.flightService.exportToExcel().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error in exporting flights to excel', error);
      }
    )
  }
  importFlightsFromExcel() {
    this.flightService.importFromExcel().subscribe(
      data => {
        console.log(data);
      },
      error => {
        this.nameNotUniqueMessage = error;
        console.error('Error in importing from excel', error);
      }
    )
  }
  
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFlights();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadFlights();
    }
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}