import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { last } from 'rxjs';
import { LanguageService } from '../services/language.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isUserLoggedIn = false;
  isAdmin = false;
  isUser = false;
  title = 'Authentication'

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  @Output() navbarEvent = new EventEmitter<any>();
  
  selectedLanguage = 'en';

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService,
              private languageService: LanguageService,
      ) {
        translate.setDefaultLang(this.selectedLanguage);
        if(languageService.getCurrentLanguage())
          this.selectedLanguage = languageService.getCurrentLanguage(); 
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // Fetch the user's role and set isAdmin/isUser flags
    if (this.isUserLoggedIn) {
      const role = this.authService.getRole(); // Assuming a method that returns the user role
      this.isAdmin = role === 'ROLE_ADMIN';
      this.isUser = role === 'ROLE_USER';
    }
  }

  logout() {
    return this.router.navigate(['logout']);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
    this.navbarEvent.emit();
  }
}
