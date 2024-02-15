import { Component, Inject, OnInit } from '@angular/core';
import { User, UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateLocationDialogComponent } from './updatelocation.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Role, RoleService } from '../services/roles.service';
import { Location, LocationService } from '../services/location.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locationForm: FormGroup; // Define the FormGroup

  locations: Location[] = [];
  locationCodes = ['CJ', 'B', 'SY', 'LN', 'BL', 'BR'];

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
    private locationService: LocationService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.locationForm = this.fb.group({
      city: [null, Validators.required], 
      locationCode: [null, Validators.required],// Add Validators.required
      country: [null, Validators.required], // Add Validators.required
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
   this.loadLocations();
  }

  loadLocations() {
    this.locationService.getLocations(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.locations = response.content;
      this.totalPages = response.totalPages;
    });
  }


  addLocation(location: Location) {
    this.locationService.createLocation(location).subscribe(location => {
      console.log(location);
      this.locations.push(location);
      this.locationForm.reset();
      this.loadLocations(); // Reset the form after successful submission
    },
    error => {
        console.error('Error in adding location:', error);
      });
  }

  updateLocation(location: Location) {
    const dialogRef = this.dialog.open(UpdateLocationDialogComponent, {
      data: location
    });
    dialogRef.afterClosed().subscribe(updatedLocation => {
      if (updatedLocation) {
        console.log(updatedLocation);
        this.locationService.updateLocation(updatedLocation).subscribe((updatedLocation) => {
          console.log(updatedLocation);
          const index = this.locations.findIndex(u => u.id === updatedLocation.id);
          if (index !== -1) {
            this.locations[index] = updatedLocation;
          }
        },
          (error: any) => {
            console.error('Error updating location: ', error);
          });
      }
    });
  }

  searchLocations(location: Location) {
    this.locationService.searchLocations(location).subscribe(
      data => {
        this.locations = data;  
        this.locationForm.reset();
      },
      error => {
        console.error('Error in searching locations:', error);
      }
    )
  }

  deleteLocation(id: BigInt) {
    this.locationService.deleteLocation(id).subscribe(
      data => {
        this.locations = data;
      },
      error => {
        console.error('Error in fetching locations after delete: ', error);
      }
    )
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadLocations();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadLocations();
    }
}

onLanguageChange() {
  console.log("Language changed");
  this.loadLocations();
}
}