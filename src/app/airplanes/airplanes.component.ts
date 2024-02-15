import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Airplane, AirplaneService } from '../services/airplane.service'; // Ensure to import your Airplane service.
import { TranslateService } from '@ngx-translate/core';
import { UpdateAirplaneDialogComponent } from './updateairplane.component';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-airplanes',
  templateUrl: './airplanes.component.html',
  styleUrls: ['./airplanes.component.css']
})
@Injectable()
export class AirplaneComponent implements OnInit {
  airplaneForm: FormGroup;
  airplanes: Airplane[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';

  constructor(private languageService: LanguageService, private dialog: MatDialog, private airplaneService: AirplaneService, private fb: FormBuilder,
              private translate: TranslateService) {
    this.airplaneForm = fb.group({
      name: [null, Validators.required],
      columns: [null, Validators.required],
      rows: [null, Validators.required]
    });

    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
      
  }

  ngOnInit() {
    this.loadAirplanes();
  }

  loadAirplanes() {
    this.airplaneService.getAirplanes(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.airplanes = response.content;
      this.totalPages = response.totalPages;
    });
  }

  addAirplane(airplane: Airplane): void {
    this.airplaneService.createAirplane(airplane).subscribe(airplane => {
      this.airplanes.push(airplane);
    });
  }

  updateAirplane(airplane: Airplane) {
    const dialogRef = this.dialog.open(UpdateAirplaneDialogComponent, {
      data: airplane
    });
    dialogRef.afterClosed().subscribe(updatedAirplane => {
      if(updatedAirplane) {
        console.log(updatedAirplane);
        this.airplaneService.updateAirplane(updatedAirplane).subscribe((updatedAirplane) => {
          console.log(updatedAirplane);
          const index = this.airplanes.findIndex(u => u.id === updatedAirplane.id);
          if(index !== -1) {
            this.airplanes[index] = updatedAirplane;
          }
        },
          (error: any) => {
          console.error('Error updating user: ', error);
        });
      }
    });
  }

  deleteAirplane(id: BigInt) {
    this.airplaneService.deleteAirplane(id).subscribe(
      data => {
        this.airplanes = data;
      }
    )
  }
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAirplanes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAirplanes();
    }
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
