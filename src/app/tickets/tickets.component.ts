import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Passenger, Ticket, TicketService } from '../services/ticket.service';
import { User } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
    tickets : Ticket[] = [];
    passengers : Passenger[] = [];
    selectedTicket : any = null;

    supportedLanguages = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      // Add more languages as needed
    ];
  
    selectedLanguage = 'en';

    
  constructor(private authService: AuthService, private ticketService: TicketService, private dialog: MatDialog, private fb: FormBuilder,
            private translate: TranslateService, private languageService: LanguageService) {
              this.translate.setDefaultLang(this.selectedLanguage);
              if(languageService.getCurrentLanguage()) 
                this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    let userValue = this.authService.getUserValue();
    console.log('Retrieved id from localStorage:', userValue.id); // Log the retrieved id
    let id = userValue.id;
    this.ticketService.getTicketsForUser(id).subscribe(
      data => {
        this.tickets = data;
      },
      error => {
        console.error('Error in fetching tickets: ', error);
      }
    );
  }

  seePassengers(ticket: Ticket): void {
    this.selectedTicket = ticket;
    console.log(this.selectedTicket);
    this.passengers = ticket.passengers;
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
