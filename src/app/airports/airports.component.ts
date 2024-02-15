import { Component, OnInit } from '@angular/core';
import { Airport, AirportService } from '../services/airport.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAirportDialogComponent } from './updateairport.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Location, LocationService } from '../services/location.service';
import { AirportErrorComponent } from './airporterror.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.css']
})
export class AirportsComponent implements OnInit {
  airportForm: FormGroup; // Define the FormGroup

  nameNotUniqueMessage = '';
  airports: Airport[] = [];
  locations: Location[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';



  constructor(private locationService: LocationService, private airportService: AirportService, private dialog: MatDialog, private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService) {
    this.airportForm = this.fb.group({
      name: [null, Validators.required], // Add Validators.required
      city: [null, Validators.required]  // Add Validators.required
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadAirports();
    this.loadLocations();
  }

  loadAirports() {
    this.airportService.getAirports(this.currentPage, this.itemsPerPage)
      .subscribe(response => {
        this.airports = response.content;
        this.totalPages = response.totalPages;
      });
  }

  loadLocations(): any {
    this.locationService.getAllLocations().subscribe(
      data => {
        this.locations = data;
      },
      error => {
        console.error('Error in loading locations', error);
      }
    );

  }
  addAirport(airport: Airport): any {
    this.airportService.createAirport(airport).subscribe(airport => {
      this.airports.push(airport);
      this.airportForm.reset(); // Reset the form after successful submission
    },
      (error: any) => {
        console.error(error);
        this.nameNotUniqueMessage = error;
      });
  }
  updateAirport(airport: Airport) {
    const dialogRef = this.dialog.open(UpdateAirportDialogComponent, {
      data: airport
    });
    dialogRef.afterClosed().subscribe(updatedAirport => {
      if (updatedAirport) {
        console.log(updatedAirport);
        this.airportService.updateAirport(updatedAirport).subscribe((updatedAirport) => {
          console.log(updatedAirport);
          const index = this.airports.findIndex(u => u.id === updatedAirport.id);
          if (index !== -1) {
            this.airports[index] = updatedAirport;
          }
        },
          (error: any) => {
            this.showError(error);
            console.error('Error updating user: ', error);
          });
      }
    });
  }



  deleteAirport(id: BigInt) {
    this.airportService.deleteAirport(id).subscribe(
      data => {
        this.airports = data;
      },
      error => {
        console.error('Error in fetching users after delete: ', error);
      }
    )
  }

  searchUsers(airport: Airport) {
    this.airportService.searchAirports(airport).subscribe(
      data => {
        this.airports = data;
        this.airportForm.reset();
      },
      error => {
        console.error('Error in searching users:', error);
      }
    )
  }


  exportAirportsToPdf() {
    this.airportService.exportToPdf().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error in exporting airports', error);
      }
    )
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

  exportAirportsToExcel() {
    this.airportService.exportToExcel().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.error('Error in exporting airports', error);
      }
    )
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAirports();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAirports();
    }
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}
