import { Component, OnInit } from '@angular/core';
import { Route, RouteService } from '../services/route.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRouteDialogComponent } from './updateroute.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Airport, AirportService } from '../services/airport.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html'
})
export class RoutesComponent implements OnInit {
  routeForm: FormGroup; // Define the FormGroup

  routes: Route[] = [];
  airports: Airport[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';



  constructor(private airportService: AirportService, private routeService: RouteService, private dialog: MatDialog, private fb: FormBuilder,
        private translate: TranslateService, private languageService: LanguageService) {
    this.routeForm = this.fb.group({
      id: [null, Validators.required],
      departureAirport: [null, Validators.required],
      arrivalAirport: [null, Validators.required],
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadAirports();
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.routes = response.content;
      this.totalPages = response.totalPages;
    });
  }

  addRoute(route: Route): any {
    this.routeService.createRoute(route).subscribe(route => {
      this.routes.push(route);
      this.routeForm.reset(); // Reset the form after successful submission
    });
  }
  updateRoute(route : Route) {
    const dialogRef = this.dialog.open(UpdateRouteDialogComponent, {
      data: route
    });
    dialogRef.afterClosed().subscribe(updatedRoute => {
      if(updatedRoute) {
        console.log(updatedRoute);
        this.routeService.updateRoute(updatedRoute).subscribe(() => {
          console.log(updatedRoute);
          const index = this.routes.findIndex(u => u.id === updatedRoute.id);
          if(index !== -1) {
            this.routes[index] = updatedRoute;
          }
        },
          (error: any) => {
          console.error('Error updating route: ', error);
        });
      }
    });
  } 
  
  deleteRoute(id : BigInt) {
    this.routeService.deleteRoute(id).subscribe(
      data => {
        this.routes = data;
      },
      error => {
        console.error('Error in fetching routes after delete: ', error);
      }
    )
  }
  loadAirports() {
    this.airportService.getAllAirports().subscribe(
      airports => {
        this.airports = airports;
      },
      error => {
        console.error('Error in fetching roles: ', error);
      }
    );
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRoutes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRoutes();
    }
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}


