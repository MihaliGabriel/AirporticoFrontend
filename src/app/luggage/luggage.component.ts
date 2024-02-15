import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../services/language.service";

@Component({
  selector: 'app-luggage',
  templateUrl: './luggage.component.html',
  styleUrls: ['./luggage.component.css']
})
export class LuggageComponent implements OnInit{
  luggages = [
    { name: 'Small checked-in luggage', quantity: 0 },
    { name: 'Medium checked-in luggage', quantity: 0 },
    { name: 'Large checked-in luggage', quantity: 0 },
  ];

  buyerLuggages = [
    { name: 'Small checked-in luggage', quantity: 0 },
    { name: 'Medium checked-in luggage', quantity: 0 },
    { name: 'Large checked-in luggage', quantity: 0 },
  ];

  passengerLuggage = new Map();

  buyerSmallLuggage? = 0;
  buyerMediumLuggage? = 0;
  buyerLargeLuggage? = 0;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private dialogRef: MatDialogRef<LuggageComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
          private translate: TranslateService, private languageService: LanguageService) {

    data.passengers.forEach((passenger: any) => {
      this.passengerLuggage.set(passenger, [...this.luggages]);
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
    
  }

  ngOnInit(): void {
    console.log(this.data.buyer);
   }

  incrementQuantityBuyer(luggage: {name: any; }) {
    const luggageItem = this.buyerLuggages.find((item: { name: any; }) => item.name === luggage.name)
    if(luggageItem)
      luggageItem.quantity += 1;
    if(luggage.name === 'Small checked-in luggage')
      this.buyerSmallLuggage = luggageItem?.quantity;
    if(luggage.name === 'Medium checked-in luggage')
      this.buyerMediumLuggage = luggageItem?.quantity;
    if(luggage.name === 'Large checked-in luggage')
      this.buyerLargeLuggage = luggageItem?.quantity;
  }
  decrementQuantityBuyer(luggage: {name: any; }) {
    const luggageItem = this.buyerLuggages.find((item: { name: any; }) => item.name === luggage.name)
    if(luggageItem)
      luggageItem.quantity -= 1;

    if(luggage.name === 'Small checked-in luggage')
      this.buyerSmallLuggage = luggageItem?.quantity;
    if(luggage.name === 'Medium checked-in luggage')
      this.buyerMediumLuggage = luggageItem?.quantity;
    if(luggage.name === 'Large checked-in luggage')
      this.buyerLargeLuggage = luggageItem?.quantity;
  }
  incrementQuantity(passenger: any, luggage: { name: any; }) {
    const luggageList = this.passengerLuggage.get(passenger);
    const luggageItem = luggageList.find((item: { name: any; }) => item.name === luggage.name);
    luggageItem.quantity += 1;
    if(luggage.name === 'Small checked-in luggage')
      passenger.nrSmallLuggage = luggageItem.quantity;
    if(luggage.name === 'Medium checked-in luggage')
      passenger.nrMediumLuggage = luggageItem.quantity;
    if(luggage.name === 'Large checked-in luggage')
      passenger.nrBigLuggage = luggageItem.quantity;

  }

  decrementQuantity(passenger: any, luggage: { name: any; }) {
    const luggageList = this.passengerLuggage.get(passenger);
    const luggageItem = luggageList.find((item: { name: any; }) => item.name === luggage.name);
    if (luggageItem.quantity > 0) {
      luggageItem.quantity -= 1;
    }
    if(luggage.name === 'Small checked-in luggage')
      passenger.nrSmallLuggage = luggageItem.quantity;
    if(luggage.name === 'Medium checked-in luggage')
      passenger.nrMediumLuggage = luggageItem.quantity;
    if(luggage.name === 'Large checked-in luggage')
      passenger.nrBigLuggage = luggageItem.quantity;
  }

  getQuantity(passenger: any, luggage: { name: any; }) {
    const luggageList = this.passengerLuggage.get(passenger);
    const luggageItem = luggageList.find((item: { name: any; }) => item.name === luggage.name);
    return luggageItem.quantity;
  }

  save(): void { 
    const dataToReturn = {
      passengers: this.data.passengers,
      buyerSmallLuggage: this.buyerSmallLuggage,
      buyerMediumLuggage: this.buyerMediumLuggage,
      buyerLargeLuggage: this.buyerLargeLuggage
    };
  
    this.dialogRef.close(dataToReturn);
  }

  onCancel() : void {
    this.dialogRef.close();
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
