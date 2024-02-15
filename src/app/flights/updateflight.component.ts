import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Flight, FlightService } from '../services/flight.service';
import { Route, RouteService } from '../services/route.service';
import { Company, CompanyService } from '../services/company.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './updateflight.component.html'
})
export class UpdateFlightDialogComponent implements OnInit{
  updateForm: FormGroup;
  routes: Route[] = [];
  companies: Company[] = [];

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(
    private dialogRef: MatDialogRef<UpdateFlightDialogComponent>,
    private fb: FormBuilder,
    private routeService: RouteService,
    private companyService: CompanyService,
    private translate: TranslateService,
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      id: [data.id],
      businessSeats: [data.businessSeats],
      economySeats: [data.economySeats],
      firstClassSeats: [data.firstClassSeats],
      departureDate: [data.departureDate],
      arrivalDate: [data.arrivalDate],
      routeId: [data.routeId],
      companyId: [data.companyId],
      businessPrice: [data.businessPrice],
      economyPrice: [data.economyPrice],
      firstClassPrice: [data.firstClassPrice],
      remainingBusinessSeats: [data.remainingBusinessSeats],
      remainingEconomySeats: [data.remainingEconomySeats],
      remainingFirstClassSeats: [data.remainingFirstClassSeats]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }
    ngOnInit(): void {
        this.loadRoutes();
        this.loadCompanies();
    }
    loadRoutes(): void {
        this.routeService.getAllRoutes().subscribe(
            routes => {
            this.routes = routes;
          },
          error => {
            console.error('Error in fetching routes: ', error);
          }
        );
    }
    loadCompanies(): void {
      this.companyService.getAllCompanies().subscribe(
        companies => {
          this.companies = companies;
        },
        error => {
          console.error('Error in fetching companies: ', error);
        }
      )
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    const flight: Flight = this.updateForm.value;
    this.dialogRef.close(flight);
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
