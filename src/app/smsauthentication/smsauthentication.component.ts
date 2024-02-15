import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { ResetPassword, ResetPasswordService, SaveResetPassword } from '../services/resetpassword.service';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-smsauthentication',
  templateUrl: './smsauthentication.component.html'
})
export class SmsAuthenticationComponent implements OnInit {

  smsTokenForm: FormGroup; // Define the FormGroup
  username: string = '';
  smsTokenFromDb: any;
  errorMessage = '';
  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';



  constructor(private router : Router, private resetPasswordService: ResetPasswordService, private route : ActivatedRoute, private dialog: MatDialog, private fb: FormBuilder, private authService: AuthService,
            private translate: TranslateService,
            private languageService: LanguageService) {
    this.smsTokenForm = this.fb.group({
      smsToken: ''  // Add Validators.required
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? '';
  }

  enterSmsToken() {
    const data = this.smsTokenForm.value;
    this.authService.verifySmsToken(this.username, data.smsToken).subscribe(response => {
        if (response.verified) {
          console.log(data.smsToken);
          this.router.navigate(['authenticated']);
        } else {
          console.log(data.smsToken);
          this.errorMessage = 'Invalid SMS Code';
        }
      }, error => {
        this.errorMessage = 'Verification failed. Please try again.';
      });

  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}
