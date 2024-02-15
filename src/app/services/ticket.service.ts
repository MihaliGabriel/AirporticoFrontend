import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';
import { User } from './user.service';

export interface Passenger {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    seat?: string;
    nrSmallLuggage: number;
    nrMediumLuggage: number;
    nrBigLuggage: number;
  }
  
export interface BuyTicket {
    flightName: string;
    nrOfPassengers: number;
    userId: BigInt;
    passengers: Passenger[];
    ticketType: String;
    voucherCode: String;
    buyerSmallLuggage: number;
    buyerMediumLuggage: number;
    buyerLargeLuggage: number;
    buyerSeat: string;
  }

export interface Ticket {
  id: BigInt;
  userId: BigInt;
  ticketName: string;
  flightName: string;
  passengers: Passenger[];
  price: number;
  ticketType: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private postService: PostService) { }

  getTicketsForUser(id: BigInt) : Observable<Ticket[]> {
    const postBody = {id: id}
    const postUrl = 'api/ticketsbyuser';
    return this.postService.post(postBody, postUrl);
  }

  buyTicket(buyTicket : BuyTicket): Observable<Ticket> {
  
    const postUrl = 'api/buyticket';
    console.log(postUrl);
    return this.postService.post(buyTicket, postUrl);
  }

  reserveTicket(buyTicket: BuyTicket): Observable<Ticket> {
    const postUrl = 'api/reserveticket';
    return this.postService.post(buyTicket, postUrl);
  }
  
  getAllTickets() : Observable<Ticket[]> {
    const postBody = {};
    const postUrl = 'api/tickets';
    return this.postService.post(postBody,postUrl);
  }

  updateReservedTicket(id: BigInt): Observable<Ticket> {
    const postBody = {id: id};
    console.log(postBody)
    const postUrl = 'api/updatereservedticket';
    return this.postService.post(postBody, postUrl);
  }
}
