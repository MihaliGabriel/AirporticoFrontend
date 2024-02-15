import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface User {
  id: BigInt;
  username: string;
  password: string;
  roleName: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private postService: PostService) { }

  getAllUsers(): Observable<User[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/users'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getUsers(page: number, size: number): Observable<any> {
    const url =`api/admin/users?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createUser(user: User): Observable<User> {
    const postUrl = 'api/admin/createuser';

    return this.postService.post(user, postUrl);
  }

  updateUser(user: User): Observable<User> {
    const postUrl = 'api/admin/updateuser';
    const postBody = {id: user.id, username: user.username, password: user.password, roleName: user.roleName};
    console.log(postBody + "updated user in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteUser(id: BigInt): Observable<User[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleteuser';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }

  searchUsers(user: User): Observable<User[]> {
    console.log(user);
    const postUrl = 'api/admin/searchusers';
    return this.postService.post(user, postUrl);
  }
}
