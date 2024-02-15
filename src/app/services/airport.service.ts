import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Airport {
  id: BigInt;
  name: string;
  city: string;
}
@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor(private postService: PostService) { }

  getAllAirports(): Observable<Airport[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/airports'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getAirports(page: number, size: number): Observable<any> {
    const url =`api/admin/airports?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createAirport(airport: Airport): Observable<Airport> {
    const postUrl = 'api/admin/createairport';
    return this.postService.post(airport, postUrl);
  }

  updateAirport(airport: Airport): Observable<Airport> {
    const postUrl = 'api/admin/updateairport';
    const postBody = {id: airport.id, name: airport.name, city: airport.city};
    console.log(postBody + "updated airport in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteAirport(id: BigInt): Observable<Airport[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleteairport';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }
  searchAirports(airport: Airport): Observable<Airport[]> {
    console.log(airport);
    const postUrl = 'api/admin/searchairports';
    return this.postService.post(airport, postUrl);
  }
  
  exportToPdf() : Observable<any> {
    const postBody = {};
    const postUrl = 'api/admin/exportairportspdf';
    console.log(postBody, postUrl);
    return this.postService.post(postBody, postUrl);
  }

  exportToExcel() : Observable<any> {
    const postBody = {};
    const postUrl = 'api/admin/exportairportsexcel';
    console.log(postBody, postUrl);
    return this.postService.post(postBody, postUrl);
  }
}
