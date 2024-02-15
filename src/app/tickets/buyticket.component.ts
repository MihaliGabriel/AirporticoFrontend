import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuyTicket, TicketService } from '../services/ticket.service';
import { Person, PersonService } from '../services/person.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './buyticket.component.html',
  styleUrls: ['./buyticket.component.css']

})
@Injectable()
export class BuyTicketComponent implements OnInit {
  formSubmitted = false;
  buyTicketForm: FormGroup;
  passengers: FormArray;
  maxPassengersReached: boolean = false;
  emptyPerson: Person = {
    id: BigInt(0),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userId: BigInt(0),
    birthDate: new Date(0)
  };

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';



  constructor(
    private dialogRef: MatDialogRef<BuyTicketComponent>,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private personService: PersonService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    if (data.nrOfPassengers > 0) {
      this.passengers = this.fb.array([this.createPassengerGroup()]);
    } else {
      this.passengers = this.fb.array([]);
    }
    this.buyTicketForm = this.fb.group({
      flightName: this.data.flight.name,
      nrOfPassengers: this.data.nrOfPassengers,
      userId: data.id.toString(),
      passengers: this.passengers,
      ticketType: this.data.ticketType
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.buyTicketForm.value);
  }

  addPassenger() {
    if (this.passengers.length < this.data.nrOfPassengers) {
      this.passengers.push(this.createPassengerGroup());
      if (this.passengers.length === this.data.nrOfPassengers) {
        this.maxPassengersReached = true;
      }
    }
  }

  removePassenger(index: number) {
    this.passengers.removeAt(index);
    this.maxPassengersReached = false;
  }

  createPassengerGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("[0-9]{10}")]]
    });
  }

 /* buyTicket(): void {
    this.formSubmitted = true;
    if (this.buyTicketForm.valid) {
      console.log(this.buyTicketForm.value);
      this.ticketService.buyTicket(this.buyTicketForm.value).subscribe(
        response => {
          console.log('Ticket purchased successfully:', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error purchasing ticket:', error);
        }
      );
    }
    else {
      console.log("form is not valid");
    }
  }*/
  buyTicket(): void {
    this.formSubmitted = true;
    let price = 0;
    if (this.buyTicketForm.valid) {
        if(this.buyTicketForm.get('ticketType')?.value === 'Economy') {
          price = this.data.flight.discountedEconomyPrice;
          console.log(price)
        }
        else {
          if(this.buyTicketForm.get('ticketType')?.value === 'Business') {
            price = this.data.flight.discountedBusinessPrice;
            console.log(price)
          }
          else {
            if(this.buyTicketForm.get('ticketType')?.value === 'First class') {
              price = this.data.flight.discountedFirstClassPrice;
              console.log(price)
            }
          }
        }
        this.dialogRef.close();
      this.router.navigate(['checkout'], { state: { data: this.buyTicketForm.value, flightPrice: price, ticketType: this.buyTicketForm.get('ticketType')?.value, 
                                                    occupiedSeats: this.data.flight.occupiedSeats, departureCity: this.data.flight.departureCity , arrivalCity: this.data.flight.arrivalCity, duration: this.data.flight.duration  } });
    } else {
      console.log("form is not valid");
    }
  }
  getPassengerControl(passengerIndex: number, controlName: string): AbstractControl {
    return this.passengers.controls[passengerIndex].get(controlName) as AbstractControl;
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
