import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Route {
  id: BigInt;
  arrivalAirport: string;
  departureAirport: string;
  routeName: string;
}
@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private postService: PostService) { }

  getAllRoutes(): Observable<Route[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/routes'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getRoutes(page: number, size: number): Observable<any> {
    const url =`api/admin/routes?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createRoute(route: Route): Observable<Route> {
    const postUrl = 'api/admin/createroute';
    return this.postService.post(route, postUrl);
  }

  updateRoute(route: Route): Observable<Route> {
    const postUrl = 'api/admin/updateroute';
    const postBody = {id: route.id, arrivalAirport: route.arrivalAirport, departureAirport: route.departureAirport};
    console.log(postBody + "updated role in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteRoute(id: BigInt): Observable<Route[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleteroute';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }
}
