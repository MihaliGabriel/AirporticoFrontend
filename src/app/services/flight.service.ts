import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Flight {
  id: BigInt | null;
  name: string;
  departureDate: string | null;
  arrivalDate: string | null;
  routeId: BigInt | null;
  companyId: BigInt | null;
  businessSeats: Number;
  economySeats: Number;
  firstClassSeats: Number;
  companyName: string;
  routeName: string | null;
  arrivalCity: string | null;
  departureCity: string | null;
  remainingBusinessSeats: Number | null;
  remainingEconomySeats: Number | null;
  remainingFirstClassSeats: Number | null;
  businessPrice: Number | null;
  economyPrice: Number | null;
  firstClassPrice: Number | null;
  discountedBusinessPrice: Number | null;
  discountedEconomyPrice: Number | null;
  discountedFirstClassPrice: Number | null;
  discountPercentage: number;
  duration: string;
  icon? : string;
  nrOfPassengers: string;
  businessPriceMin: Number | null;
  businessPriceMax: Number | null;
  firstClassPriceMin: Number | null;
  firstClassPriceMax: Number | null;
  economyPriceMin: Number | null;
  economyPriceMax: Number | null;
  sortByDuration: string;
  isExpanded: boolean;
  occupiedSeats: boolean[][];
  airplaneName: string;
}
@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private postService: PostService) { }

  getFlights(page: number, size: number): Observable<any> {
    const url =`api/admin/flights?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  getFlightsUser(page: number, size: number): Observable<any> {
    const url =`api/flights?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  getSeatMap(flightName: String) : Observable<boolean[][]> {
    const postBody = {name: flightName};
    const postUrl = 'api/getseatmap';
    return this.postService.post(postBody, postUrl);
  }

  getAllFlights(): Observable<Flight[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/flights'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getAllFlightsUser(): Observable<Flight[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/flights'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getCheapestFlights(): Observable<Flight[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/cheapestflights'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  createFlight(flight: Flight): Observable<Flight> {
    const postUrl = 'api/admin/createflight';
    const postBody = {id: flight.id, name: flight.name, departureDate: flight.departureDate, businessSeats: flight.businessSeats, economySeats: flight.economySeats, firstClassSeats: flight.firstClassSeats, arrivalDate: flight.arrivalDate, routeId: flight.routeId, companyId: flight.companyId, businessPrice: flight.businessPrice, economyPrice: flight.economyPrice, firstClassPrice: flight.firstClassPrice};
    return this.postService.post(flight, postUrl);
  }

  updateFlight(flight: Flight): Observable<Flight> {
    const postUrl = 'api/admin/updateflight';
    const postBody = {id: flight.id, name: flight.name, departureDate: flight.departureDate, arrivalDate: flight.arrivalDate, routeId: flight.routeId, companyId: flight.companyId,businessPrice: flight.businessPrice, economyPrice: flight.economyPrice, firstClassPrice: flight.firstClassPrice, businessSeats: flight.businessSeats, economySeats: flight.economySeats, firstClassSeats: flight.firstClassSeats, remainingEconomySeats: flight.remainingEconomySeats, remainingBusinessSeats: flight.remainingBusinessSeats, remainingFirstClassSeats: flight.remainingFirstClassSeats};
    console.log(postBody + "updated role in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteFlight(id: BigInt): Observable<Flight[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleteflight';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }
  
  searchFlights(page: number, size: number, flight: Flight): Observable<any> {
    console.log(flight);
    const url =`api/admin/searchflights?page=${page}&size=${size}`;
    return this.postService.post(flight, url);
  }

  exportToPdf() : Observable<any> {
    const postBody = {};
    const postUrl = 'api/admin/exportflightspdf';
    console.log(postBody, postUrl);
    return this.postService.post(postBody, postUrl);
  }

  exportToExcel() : Observable<any> {
    const postBody = {};
    const postUrl = 'api/admin/exportflightsexcel';
    console.log(postBody, postUrl);
    return this.postService.post(postBody, postUrl);
  }
  importFromExcel() : Observable<any> {
    const postBody = {};
    const postUrl = 'api/admin/importflightsexcel';
    console.log(postBody, postUrl);
    return this.postService.post(postBody, postUrl);
  }
}
