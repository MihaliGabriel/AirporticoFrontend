import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route } from '../services/route.service';
import { AirportService, Airport } from '../services/airport.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-update-route-dialog',
  templateUrl: './updateroute.component.html'
})
export class UpdateRouteDialogComponent implements OnInit{
  updateForm: FormGroup;
  airports: Airport[] = [];

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private dialogRef: MatDialogRef<UpdateRouteDialogComponent>,
    private fb: FormBuilder,
    private airportService : AirportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      arrivalAirport: [this.data.arrivalAirport],
      departureAirport: [this.data.departureAirport],
      routeName: [this.data.routeName]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }
    ngOnInit(): void {  
        this.loadAirports();
    }
    loadAirports(): void {
        this.airportService.getAllAirports().subscribe(
            airports => {
            this.airports = airports;
          },
          error => {
            console.error('Error in fetching airports: ', error);
          }
        );
      }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    const route: Route = this.updateForm.value;
    // Save the updated user details and close the dialog
    this.dialogRef.close(route);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
