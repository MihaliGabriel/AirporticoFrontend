import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ResetPassword } from '../services/resetpassword.service';
import { ResetPasswordService } from '../services/resetpassword.service';
import { HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  forgotPasswordClicked = false;
  loginButtonClicked = false;
  errorMessage = '';
  emailSentMessage = '';
  formData: FormGroup;
  isChecked = false;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';

  constructor(
    private resetPasswordService: ResetPasswordService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder ,
    private translate: TranslateService,
    private languageService: LanguageService// Inject FormBuilder
  ) {
    this.formData = this.fb.group({
      username: ['', Validators.required], // Use FormBuilder to create controls
      password: ['', Validators.required]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    this.languageService.setLanguage(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) {
      this.selectedLanguage = languageService.getCurrentLanguage();
    }
  }

  
  ngOnInit() {
  }

  onClickSubmit() {
    const data = this.formData.value;
    this.loginButtonClicked = true;
    console.log('Login page:', data.username, data.password, this.isChecked);

    this.authService.login(data.username, data.password, this.isChecked)
      .subscribe({
        next: (value: any): any => {
          if (this.isChecked) {
            console.log('Raspuns de la server:', value);
            if (value) return this.router.navigate(['/smsauthentication']);
          }
          else {
            console.log('Raspuns de la server:', value);
            if (value) return this.router.navigate(['/authenticated']);
          }

        },
        error: (err: any) => {
          console.error('Eroare de server:', err);
          this.errorMessage = err;
        },
        complete: () => {
          console.log('Aici se ajunge cand raspunsul s-a terminat de tot....');
        }
      });
  }

  resetPassword(username: string) {
    this.forgotPasswordClicked = true;
    console.log(username);
    const resetPassword: ResetPassword = { username: username };
    this.resetPasswordService.sendResetPasswordEmail(resetPassword).subscribe(
      data => {
        console.log(data);
        this.emailSentMessage = data.message;
      },
      error => {
        console.log("Error sending email to reset password", error);
      }
    )
  }

  getLoginControl(controlName: string): AbstractControl {
    return this.formData.get(controlName) as AbstractControl;
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}