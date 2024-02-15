import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role } from '../services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-update-location-dialog',
  templateUrl: './updatelocation.component.html'
})
export class UpdateLocationDialogComponent implements OnInit{
  updateForm: FormGroup;
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private dialogRef: MatDialogRef<UpdateLocationDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      city: [this.data.city],
      country: [this.data.country],
      locationCode: [this.data.locationCode]
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
    const location: Location = this.updateForm.value;
    // Save the updated user details and close the dialog
    this.dialogRef.close(location);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
