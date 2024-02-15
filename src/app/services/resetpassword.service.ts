import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface ResetPassword {
  username: string;
  
}
export interface SaveResetPassword {
    username: string;
    password: string;
}
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private postService: PostService) { }

  sendResetPasswordEmail(resetPassword: ResetPassword) : Observable<any> {
    const postBody = resetPassword;
    const postUrl = 'api/resetpassword/sendresetemail';

    return this.postService.post(postBody, postUrl);
  }

  resetPassword(saveResetPassword : SaveResetPassword) : Observable<any>{
    const postBody = saveResetPassword;
    console.log(postBody);
    const postUrl = 'api/resetpassword/saveresetpassword';

    return this.postService.post(postBody, postUrl);
  }
}
