import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.getUserValue();
    const isLoggedIn = this.authService.isLoggedIn();
    let isApiUrl = false;

    if (this.isAbsoluteUrl(request.url)) {
      const url = new URL(request.url);
      isApiUrl = url.pathname.startsWith('/api');
    } else {
      // For relative URLs, directly check if it starts with '/api'
      isApiUrl = request.url.startsWith('/api');
    }
    console.log(isApiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${user.token}`}
      });
      console.log(user.token)
    }

    return next.handle(request);
  }
  private isAbsoluteUrl(url: string): boolean {
    // A simple regex to check for absolute URLs
    const absoluteUrlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
    return absoluteUrlPattern.test(url);
  }
}
