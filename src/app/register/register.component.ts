import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerButtonClicked = false;
  username: string = '';
  password: string = '';
  formData: FormGroup;
  errorMessage: string = '';

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private authService: AuthService, private router: Router, private translate: TranslateService, private languageService: LanguageService) {
    this.formData = new FormGroup({
      username : new FormControl,
      password : new FormControl
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
  }

  onClickSubmit(data: {username: string; password: string;}) {
    this.username = data.username;
    this.password = data.password;
    this.registerButtonClicked = true;

    console.log('Register page: ' + this.username + ', ' + this.password);
    if(this.formData.valid)
      this.authService.register(this.username, this.password)
        .subscribe({
          next: (value: any): any => {
            console.log('Raspuns de la server: ', value);
            if (value) return this.router.navigate(['auth/login']);
          },
          error: (err: any) => {
            console.error('Eroare de server: ', err);
            this.errorMessage = err;
          },
          complete: () => {
            console.log('Aici se ajunge cand raspunsul s-a terminat de tot....');
          }
        });
  }
  getRegisterControl(controlName: string): AbstractControl {
    return this.formData.get(controlName) as AbstractControl;
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
