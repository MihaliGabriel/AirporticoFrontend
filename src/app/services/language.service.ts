import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translate: TranslateService) {}

  setLanguage(language: string) {
    localStorage.setItem('currentLanguage', language);
    this.translate.use(language);
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }
}
