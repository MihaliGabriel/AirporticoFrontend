import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { ResetPassword, ResetPasswordService, SaveResetPassword } from '../services/resetpassword.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { TicketService } from '../services/ticket.service';
@Component({
  selector: 'app-reserveticket',
  templateUrl: './reserveticket.component.html'
})
export class ReserveTicketComponent implements OnInit {

  reserveTicketForm: FormGroup; // Define the FormGroup
  ticketIdString: string | null = '';
  ticketId: BigInt = BigInt(0);

  selectedLanguage = 'en';

  constructor(private router : Router, private ticketService: TicketService, private route : ActivatedRoute, private dialog: MatDialog, private fb: FormBuilder,
            private translate: TranslateService, private languageService: LanguageService) {
    this.reserveTicketForm = this.fb.group({
    });
  }

  ngOnInit() {
    if(this.route.snapshot.queryParamMap.get("id"))
        this.ticketIdString = this.route.snapshot.queryParamMap.get("id");

    if(this.ticketIdString)
        this.ticketId = BigInt(this.ticketIdString);
    console.log(this.ticketId)
  }

  reserveTicket() {
    console.log(this.ticketId)
    this.ticketService.updateReservedTicket(this.ticketId).subscribe(
        data => {
            console.log(data);
        },
        error => {
            console.log("Error updating reserved ticket", error);
        }
    )
    return this.router.navigate(['auth/login']);
  }


}
