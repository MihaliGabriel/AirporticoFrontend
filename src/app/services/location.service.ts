import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Location {
  id: BigInt;
  city: string;
  locationCode: string;
  country: string;
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private postService: PostService) { }

  getAllLocations(): Observable<Location[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/locations'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getLocations(page: number, size: number): Observable<any> {
    const url =`api/locations?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createLocation(location: Location): Observable<Location> {
    const postUrl = 'api/admin/createlocation';
    return this.postService.post(location, postUrl);
  }

  updateLocation(location: Location): Observable<Location> {
    const postUrl = 'api/admin/updatelocation';
    const postBody = {id: location.id, city: location.city, country: location.country, locationCode: location.locationCode};
    console.log(postBody + "updated location in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteLocation(id: BigInt): Observable<Location[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deletelocation';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }
  searchLocations(location: Location): Observable<Location[]> {
    console.log(location);
    const postUrl = 'api/admin/searchlocations';
    return this.postService.post(location, postUrl);
  }
}
