/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import './app/polyfills';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
