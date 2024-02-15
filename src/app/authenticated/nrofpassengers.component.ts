import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role } from '../services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-nr-passengers-dialog',
  templateUrl: './nrofpassengers.component.html'
})
export class NrOfPassengersDialogComponent implements OnInit{
  nrOfPassengersForm: FormGroup;
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private dialogRef: MatDialogRef<NrOfPassengersDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.nrOfPassengersForm = this.fb.group({
      nrOfPassengers: null
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }
  ngOnInit(): void {
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    const nrOfPassengers = this.nrOfPassengersForm.get('nrOfPassengers')?.value;
    // Save the updated user details and close the dialog
    this.dialogRef.close(nrOfPassengers);
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
