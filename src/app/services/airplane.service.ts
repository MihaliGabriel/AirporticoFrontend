import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';
import { Flight } from './flight.service';
import { BuyTicket, Ticket } from './ticket.service';

export interface Airplane {
  id: BigInt;
  name: string;
  columns: Number;
  rows: Number;
}
@Injectable({
  providedIn: 'root'
})
export class AirplaneService {

  constructor(private postService: PostService) { }

  getAllAirplanes(): Observable<Airplane[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/admin/airplanes'; // Replace with your actual endpoint

    return this.postService.post(postBody, postUrl);
  }

  getAirplanes(page: number, size: number): Observable<any> {
    const url =`api/admin/airplanes?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createAirplane(airplane: Airplane): Observable<Airplane> {
    const postUrl = 'api/admi/createairplane';
    return this.postService.post(airplane, postUrl);
  }

  updateAirplane(airplane: Airplane): Observable<Airplane> {
    const postUrl = 'api/admin/updateairplane';
    const postBody = {id: airplane.id, name: airplane.name, columns: airplane.columns, rows: airplane.rows};
    console.log(postBody + "updated airplane in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteAirplane(id: BigInt): Observable<Airplane[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deleteairplane';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }
  searchAirplanes(airplane: Airplane): Observable<Airplane[]> {
    console.log(airplane);
    const postUrl = 'api/admin/searchairplanes';
    return this.postService.post(airplane, postUrl);
  }
  getAirplaneByFlightName(flight: Flight) : Observable<Airplane> {
    const postUrl = 'api/airplanebyflightname';
    return this.postService.post(flight, postUrl);
  }
  reserveSeats(buyTicket: BuyTicket) : Observable<any> {
    const postUrl = 'api/reserveairplaneseats';
    return this.postService.post(buyTicket, postUrl);
  }
  freeSeats(id: BigInt) : Observable<any> {
    const postUrl = 'api/freeairplaneseats';
    const postBody = {id: id};
    return this.postService.post(postBody, postUrl);
  }
}
