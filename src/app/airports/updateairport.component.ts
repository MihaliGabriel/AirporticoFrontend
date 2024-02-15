import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Airport } from '../services/airport.service';
import { Location, LocationService } from '../services/location.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-update-airport-dialog',
  templateUrl: './updateairport.component.html'
})
export class UpdateAirportDialogComponent implements OnInit{
  
  updateForm: FormGroup;
  locations: Location[] = [];
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private locationService : LocationService,
    private dialogRef: MatDialogRef<UpdateAirportDialogComponent>,
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      name: [this.data.name],
      city: [this.data.city]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit(): void { 
    this.loadLocations();
  }

  loadLocations() : any {
    this.locationService.getAllLocations().subscribe(
      data => {
        this.locations = data;
      },
      error => {
        console.log("Error loading locations", error);
      }
    )
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    const airport: Airport = this.updateForm.value;
    // Save the updated user details and close the dialog
    this.dialogRef.close(airport);
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
