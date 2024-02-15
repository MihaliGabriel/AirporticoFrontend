import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company } from '../services/company.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-update-company-dialog',
  templateUrl: './updatecompany.component.html'
})
@Injectable()
export class UpdateCompanyDialogComponent implements OnInit{
  updateForm: FormGroup;
  companyCodes = ['W4', 'AA', 'AC', 'AF', 'EK', 'EY', 'RO', 'W6'];

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private dialogRef: MatDialogRef<UpdateCompanyDialogComponent>,
    private fb: FormBuilder,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      email: [this.data.email],
      companyName: [this.data.companyName],
      companyCode: [this.data.companyCode],
      phone: [this.data.phone]
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
    const company: Company = this.updateForm.value;
    // Save the updated user details and close the dialog
    this.dialogRef.close(company);
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
