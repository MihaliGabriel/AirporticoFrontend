import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResetPassword } from './resetpassword.service';

export interface UserValue {
    id: BigInt;
    username: string;
    token: string;
    roles: { authority: string }[];
  }

export interface ChangePassword {
  username: string;
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private postService: PostService, private http: HttpClient) { }

  private userValue: UserValue = {} as UserValue;
  private isUserLoggedIn: boolean = false;

  login(username: string, password: string, twoFactorAuth: any): Observable<any> {
    return this.postService.post(
      { username: username, password: password , twoFactorAuth: twoFactorAuth},
      'auth/login').pipe(tap(responseData => {
        if (responseData && responseData.hasOwnProperty('roles') && responseData.hasOwnProperty('token') && responseData.hasOwnProperty('id')) {
          this.isUserLoggedIn = true;
          this.userValue = {
            username: responseData.username,
            roles: responseData.roles,
            token: responseData.token,
            id: responseData.id
          };
          console.log(responseData);
          localStorage.setItem('username', responseData.username);
          localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? 'true' : 'false');
          localStorage.setItem('userValue', JSON.stringify(this.userValue));
          localStorage.setItem('id', responseData.id);
          localStorage.setItem('smsToken', responseData.smsToken);
          return true;
        }
        this.logout();
        return false;
      }));
  }

  logout(): void {
    this.isUserLoggedIn = false;
    localStorage.removeItem('userValue');
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('smsToken');
    localStorage.removeItem('currentLanguage');
  }

  isLoggedIn(): boolean {
    let storeData = localStorage.getItem('isUserLoggedIn');
    this.isUserLoggedIn = !!(storeData && storeData === 'true');
    return this.isUserLoggedIn;
  }

  getUserValue(): any {
    let storeData = localStorage.getItem('userValue');
    if (storeData) {
      this.userValue = JSON.parse(storeData);
    }
    return this.userValue;
  }
  

  register(username: string, password: string): Observable<any> {
    return this.postService.post({ username, password }, 'auth/register');
  }

  getRole(): string | null {
    this.getUserValue(); // Update the userValue property
    return this.userValue.roles && this.userValue.roles.length > 0 ? this.userValue.roles[0].authority : null;
  }
  
  changePassword(changePassword: ChangePassword) : Observable<any> {
    const postUrl = 'auth/changepassword';

    return this.postService.post(changePassword, postUrl);
  }

  verifySmsToken(username: string, smsToken: string): Observable<any> {
    return this.postService.post({ username: username, smsToken: smsToken }, 'auth/smsToken');
  }
  
}