import { Component } from '@angular/core';
import { AuthService, ChangePassword } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['changepassword.component.css']
})
export class ChangePasswordComponent {
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  successMessage!: string;
  errorMessage!: string;
  changeP!: ChangePassword;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private authService: AuthService, private translate: TranslateService, private languageService: LanguageService) { 
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }
  
    const username = localStorage.getItem('username');
  
    if (username) {
      this.changeP = { 
        username: username,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };
  
      this.authService.changePassword(this.changeP).subscribe(
        response => {
          if (response && response.message) {
            this.successMessage = response.message;
          } else {
            this.successMessage = 'Password changed successfully.';
          }
          this.errorMessage = '';
        },
        error => {
          this.errorMessage = 'An error occurred while changing the password.';
          this.successMessage = '';
        }
      );
    }
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
  
}