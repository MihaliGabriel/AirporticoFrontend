import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Role {
  id: BigInt;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private postService: PostService) { }

  getAllRoles(): Observable<Role[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/roles'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getRoles(page: number, size: number): Observable<any> {
    const url =`api/admin/rolespag?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createRole(role: Role): Observable<Role> {
    const postUrl = 'api/admin/createrole';
    return this.postService.post(role, postUrl);
  }

  updateRole(role: Role): Observable<Role> {
    const postUrl = 'api/admin/updaterole';
    const postBody = {id: role.id, name: role.name};
    console.log(postBody + "updated role in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteRole(id: BigInt): Observable<Role[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleterole';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }

  searchRoles(role: Role): Observable<Role[]> {
    console.log(role);
    const postUrl = 'api/admin/searchroles';
    return this.postService.post(role, postUrl);
  }
}
