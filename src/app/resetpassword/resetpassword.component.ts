import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { ResetPassword, ResetPasswordService, SaveResetPassword } from '../services/resetpassword.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup; // Define the FormGroup
  username: string | null = '';
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';

  constructor(private router : Router, private resetPasswordService: ResetPasswordService, private route : ActivatedRoute, private dialog: MatDialog, private fb: FormBuilder,
            private translate: TranslateService, private languageService: LanguageService) {
    this.resetPasswordForm = this.fb.group({
      password: ''  // Add Validators.required
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get("username");
  }

  resetPassword() {
    const passwordControl = this.resetPasswordForm.get('password');
    const password = passwordControl ? passwordControl.value : '';
    if(this.username == null) {
        this.username = '';
    }
    const saveResetPassword : SaveResetPassword = {username: this.username, password: password};
    console.log(this.username, password);
    
    this.resetPasswordService.resetPassword(saveResetPassword).subscribe(
        data => {
            console.log(data);
        },
        error => {
            console.log("Error resetting password", error);
        }
    )
    return this.router.navigate(['auth/login']);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}
