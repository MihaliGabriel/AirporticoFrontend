import { Component, Injectable, OnInit } from '@angular/core';
import { User, UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCompanyDialogComponent } from './updatecompany.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompanyService } from '../services/company.service';
import { AirportErrorComponent } from '../airports/airporterror.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
@Injectable()
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  addCompanyButton = false;
  nameNotUniqueMessage = '';
  companies: Company[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private dialog: MatDialog, private companyService: CompanyService, private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService) {
    this.companyForm = fb.group(
      {
        companyName: [null, Validators.required],
        companyCode: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        phone: [null, [Validators.required, Validators.pattern("[0-9]{10}")]]
      }
    );
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
   }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.companies = response.content;
      this.totalPages = response.totalPages;
    });
  }

  addCompany(company: Company): any {
    this.addCompanyButton = true;
    console.log('Add company', company);
    if(this.companyForm.valid)
      this.companyService.createCompany(company).subscribe(company => {
        this.companies.push(company);
      },
      (error : any) => {
        console.log(error);
        this.nameNotUniqueMessage = error;
      });
  }
  updateCompany(company : Company) {
    const dialogRef = this.dialog.open(UpdateCompanyDialogComponent, {
      data: company
    });
    dialogRef.afterClosed().subscribe(updatedCompany => {
      if(updatedCompany) {
        console.log(updatedCompany);
        this.companyService.updateCompany(updatedCompany).subscribe((updatedCompany) => {
          console.log(updatedCompany);
          const index = this.companies.findIndex(u => u.id === updatedCompany.id);
          if(index !== -1) {
            this.companies[index] = updatedCompany;
          }
        },
          (error: any) => {
          this.showError(error);
          console.error('Error updating user: ', error);
        });
      }
    });
  } 
  
  deleteCompany(id : BigInt) {
    this.companyService.deleteCompany(id).subscribe(
      data => {
        this.companies = data;
      },
      error => {
        console.error('Error in fetching users after delete: ', error);
      }
    )
  }

  showError(errorMessage: string): void {
    const dialogRef = this.dialog.open(AirportErrorComponent, {
      width: '300px', // Set the width of the dialog
      data: { errorMessage },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
    });
  }
  
  searchCompanies(company: Company) {
    this.companyService.searchCompany(company).subscribe(
      data => {
        this.companies = data;  
      },
      error => {
        console.error('Error in searching company:', error);
      }
    )
  }
  getCompanyControl(controlName: string): AbstractControl {
    return this.companyForm.get(controlName) as AbstractControl;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCompanies();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCompanies();
    }
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}