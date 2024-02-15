import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BuyTicket, Passenger, TicketService } from '../services/ticket.service';
import { Person, PersonService } from '../services/person.service';
import { Voucher, VoucherService } from '../services/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LuggageComponent } from '../luggage/luggage.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { SeatsComponent } from '../seats/seats.component';
import { Flight } from '../services/flight.service';
import { Airplane, AirplaneService } from '../services/airplane.service';
import { ModalComponent } from '../modal/modal.component';
import { InactivityTimerService } from '../services/inactivity.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  @Input() formData: any;

  private timeoutId: number | null = null;
  private readonly INACTIVITY_TIME = 1 * 60 * 1000;

  showModal = false;

  voucher: string = '';
  flightPrice: number = 0;
  duration: string = '';
  arrivalCity: string = '';
  departureCity: string = '';
  ticketType: string = '';
  arrivalAirport: string = '';
  departureAirport: string = '';
  nrSmallLuggage = 0;
  nrMediumLuggage = 0;
  nrLargeLuggage = 0;
  buyerSeat = '';
  correspondingAirplane: Airplane = {
    id: BigInt(0),
    name: '',
    columns: 0,
    rows: 0
  };
  occupiedSeats: boolean[][] = [];

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  emptyPerson: Person = {
    id: BigInt(0),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userId: BigInt(0),
    birthDate: new Date(0)
  };
  constructor(private dialog: MatDialog, private ticketService: TicketService, private personService: PersonService, private voucherService: VoucherService,  private snackBar: MatSnackBar, private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private airplaneService: AirplaneService,
    private inactivityService: InactivityTimerService) { 
      this.translate.setDefaultLang(this.selectedLanguage);
      if(languageService.getCurrentLanguage()) 
        this.selectedLanguage = languageService.getCurrentLanguage();
    }

  ngOnDestroy(): void {
    this.inactivityService.stopTimer();
  }

  ngOnInit(): void {
    this.inactivityService.startTimer(() => this.openSessionExpiredPopUp());
    const idString: string = localStorage.getItem('id') ?? '';
    const id = BigInt(idString);
    this.emptyPerson.userId = id;
    this.personService.getPersonByUser(id).subscribe(emptyPerson => {
      this.emptyPerson = emptyPerson;
      console.log(emptyPerson);
    });
    
    this.formData = history.state.data;
    this.flightPrice = history.state.flightPrice;
    this.arrivalCity = history.state.arrivalCity;
    this.departureCity = history.state.departureCity;
    this.duration = history.state.duration;
    this.ticketType = history.state.ticketType;
    this.arrivalAirport = history.state.arrivalAirport;
    this.departureAirport = history.state.departureAirport;
    this.occupiedSeats = history.state.occupiedSeats;
    console.log(this.formData.passengers)
  }
  resetTimer() {
    this.inactivityService.resetTimer();
  }

  public openSessionExpiredPopUp() : void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: {message: 'This is a message from the parent component'}
    });
    let reservedTicketId = localStorage.getItem('reservedTicketId');
    console.log(reservedTicketId);
    if(reservedTicketId) {
      console.log("intrat if");
      let bigIntId = BigInt(reservedTicketId);
      this.airplaneService.freeSeats(bigIntId).subscribe(data => {});
    }
        
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.redirectUserToHome();
    });
  }

  redirectUserToHome() {
    this.router.navigate(['/authenticated']);
  }

  applyVoucher(): void {
    let voucherObj : Voucher;
    let price = this.flightPrice;
    let discountedPrice = 0;
    if(this.voucher) {
      this.voucherService.getVoucherByCode(this.voucher).subscribe( data => {
        voucherObj = data;
        discountedPrice = this.flightPrice - (data.discountPercentage / 100) * this.flightPrice;
        this.flightPrice = discountedPrice;
        this.snackBar.open('Voucher applied succesfully', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn']
      });
        console.log(voucherObj);
      },
      error => {
        console.error('Error applying voucher:', error);
        this.snackBar.open('Error applying voucher. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn']
      });
      }
      );
    }
  }

  buyTicket(): void {
    let buyTicketObj : BuyTicket  = {
      flightName: this.formData.flightName,
      nrOfPassengers: this.formData.nrOfPassengers,
      userId: this.formData.userId,
      passengers: this.formData.passengers,
      ticketType: this.ticketType,
      voucherCode: this.voucher,
      buyerSmallLuggage: this.nrSmallLuggage,
      buyerMediumLuggage: this.nrMediumLuggage,
      buyerLargeLuggage: this.nrLargeLuggage,
      buyerSeat: this.buyerSeat
    }

    let allSeatsSelected = true;

    if (this.buyerSeat.trim() == '') {
      allSeatsSelected = false;
    }
  
    this.formData.passengers.forEach((passenger : Passenger) => {
      if (passenger.seat == null) {
        console.log("passenger seat null")
        allSeatsSelected = false;
      }
    });

    if (!allSeatsSelected) {
      console.log("snackbar")
      this.snackBar.open('Please select all seats for passengers', 'Close', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      return;
    }
    console.log("buying")
    const reservedTicketId = localStorage.getItem('reservedTicketId');
    if(reservedTicketId) {
      let bigIntId = BigInt(reservedTicketId);
      this.airplaneService.freeSeats(bigIntId).subscribe( 
        data => {
          console.log("seats freed succesfully")
        });
    }  
    this.ticketService.buyTicket(buyTicketObj).subscribe(
      response => {
        console.log('Ticket purchased successfully:', response);
        this.snackBar.open('Ticket purchased succesfully', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn']
          
        });
        window.open('https://www.booking.com', '_blank');
      },
      error => {
        console.error('Error purchasing ticket:', error);
      }
    );
  }

  reserveTicket(): void {
    let buyTicketObj : BuyTicket  = {
      flightName: this.formData.flightName,
      nrOfPassengers: this.formData.nrOfPassengers,
      userId: this.formData.userId,
      passengers: this.formData.passengers,
      ticketType: this.ticketType,
      voucherCode: this.voucher,
      buyerSmallLuggage: this.nrSmallLuggage,
      buyerMediumLuggage: this.nrMediumLuggage,
      buyerLargeLuggage: this.nrLargeLuggage,
      buyerSeat: this.buyerSeat
    }
    const reservedTicketId = localStorage.getItem('reservedTicketId');
    if(reservedTicketId) {
      let bigIntId = BigInt(reservedTicketId);
      this.airplaneService.freeSeats(bigIntId).subscribe( 
        data => {
          console.log("seats freed succesfully")
        });
    }  
    this.ticketService.reserveTicket(buyTicketObj).subscribe(
      
      response => {
        console.log('Ticket purchased successfully:', response);
        this.snackBar.open('Ticket purchased succesfully', 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn']
          
        });
        window.open('https://www.booking.com', '_blank');
      },
      error => {
        console.error('Error purchasing ticket:', error);
      }
    );
  }

  selectLuggage() : void {
    const dialogRef = this.dialog.open(LuggageComponent, {
      data: { passengers: this.formData.passengers, buyer: this.emptyPerson }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.formData.passengers = result.passengers;
      this.nrSmallLuggage = result.buyerSmallLuggage;
      this.nrMediumLuggage = result.buyerMediumLuggage;
      this.nrLargeLuggage = result.buyerLargeLuggage;
      console.log(this.formData.passengers);
  });
}
  selectSeats() : void {
    let selectedFlight: Flight = {
      id: null,
      name: this.formData.flightName,
      departureDate: null,
      arrivalDate: null,
      routeId: null,
      companyId: null,
      businessSeats: 0,
      economySeats: 0,
      firstClassSeats: 0,
      companyName: '',
      routeName: null,
      arrivalCity: null,
      departureCity: null,
      remainingBusinessSeats: null,
      remainingEconomySeats: null,
      remainingFirstClassSeats: null,
      businessPrice: null,
      economyPrice: null,
      firstClassPrice: null,
      discountedBusinessPrice: null,
      discountedEconomyPrice: null,
      discountedFirstClassPrice: null,
      discountPercentage: 0,
      duration: '',
      nrOfPassengers: '',
      businessPriceMin: null,
      businessPriceMax: null,
      firstClassPriceMin: null,
      firstClassPriceMax: null,
      economyPriceMin: null,
      economyPriceMax: null,
      sortByDuration: '',
      isExpanded: false,
      occupiedSeats: [],
      airplaneName: ''
    }
    
    this.airplaneService.getAirplaneByFlightName(selectedFlight).subscribe(
      data => {
        this.correspondingAirplane = data;
        console.log('correspondingAirplane' + this.correspondingAirplane.rows + ' ' + this.correspondingAirplane.columns)
        const dialogRef2 = this.dialog.open(SeatsComponent, {
          data: { occupiedSeats: this.occupiedSeats, rows: this.correspondingAirplane.rows, columns: this.correspondingAirplane.columns, passengers: this.formData.passengers, buyer: this.emptyPerson, flightName: this.formData.flightName, userId: this.formData.userId, nrOfPassengers: this.formData.nrOfPassengers }
        });
        dialogRef2.afterClosed().subscribe(result => {
          this.formData.passengers = result.passengers;
          this.buyerSeat = result.buyerSeat;
          console.log(this.formData.passengers);
          console.log(this.buyerSeat);
      });
      }
    )
    
    
  }
  
onLanguageChange() {
}
}