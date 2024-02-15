import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Airplane } from '../services/airplane.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-update-airplane-dialog',
  templateUrl: './updateairplane.component.html'
})
@Injectable()
export class UpdateAirplaneDialogComponent implements OnInit {
  updateForm: FormGroup;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';

  constructor(
    private dialogRef: MatDialogRef<UpdateAirplaneDialogComponent>,
    private fb: FormBuilder,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      name: [this.data.name],
      columns: [this.data.columns],
      rows: [this.data.rows]
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
    const airplane: Airplane = this.updateForm.value;
    // Save the updated airplane details and close the dialog
    this.dialogRef.close(airplane);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
