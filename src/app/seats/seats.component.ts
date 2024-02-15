import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../services/language.service";
import { BuyTicket, Passenger } from "../services/ticket.service";
import { AirplaneService } from "../services/airplane.service";
import { FlightService } from "../services/flight.service";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-seats',
    templateUrl: './seats.component.html',
    styleUrls: ['./seats.component.css']
})
export class SeatsComponent implements OnInit {


    supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        // Add more languages as needed
    ];

    selectedLanguage = 'en';
    rows : number[] = [];
    columns : number[] = [];
    seatMap: boolean[][] = [];
    buyerSeat: string = '';
    selectedSeats: { [key: string]: string } = {};


    constructor(private snackBar: MatSnackBar, private dialogRef: MatDialogRef<SeatsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private translate: TranslateService, private languageService: LanguageService, private airplaneService: AirplaneService, private flightService: FlightService) {
        this.translate.setDefaultLang(this.selectedLanguage);
        if (languageService.getCurrentLanguage())
            this.selectedLanguage = languageService.getCurrentLanguage();

    }

    ngOnInit(): void {
        console.log(this.data.buyer);
        this.initRowsColumns();
        this.generateSeatMap();
    }
    generateSeatMap() { 
        if (this.data.occupiedSeats) {
         //   this.seatMap = JSON.parse(JSON.stringify(this.data.occupiedSeats));
         this.flightService.getSeatMap(this.data.flightName).subscribe( data => {
            this.seatMap = JSON.parse(JSON.stringify(data));
         })
        } else {
            this.seatMap = Array.from({ length: this.rows.length }, 
                () => Array.from({ length: this.columns.length }, () => false));
        }
    }

    save(): void {
        const dataToReturn = {
            passengers: this.data.passengers,
            buyerSeat: this.buyerSeat
          };
          let buyTicketObj : BuyTicket  = {
            flightName: this.data.flightName,
            nrOfPassengers: this.data.nrOfPassengers,
            userId: this.data.userId,
            passengers: this.data.passengers,
            ticketType: 'Business',
            voucherCode: '',
            buyerSmallLuggage: 0,
            buyerMediumLuggage: 0,
            buyerLargeLuggage: 0,
            buyerSeat: this.buyerSeat
          }

          let allSeatsSelected = true;
          if (this.buyerSeat.trim() == '') {
            allSeatsSelected = false;
          }
        
          this.data.passengers.forEach((passenger : Passenger) => {
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
          console.log('Object to be sent to reserveSeats:', buyTicketObj)
          this.airplaneService.reserveSeats(buyTicketObj).subscribe(data => {
            localStorage.setItem('reservedTicketId', data.id);
            console.log(data.id);
          })
          this.dialogRef.close(dataToReturn);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onLanguageChange() {
        this.languageService.setLanguage(this.selectedLanguage);
    }
    initRowsColumns() {
        let rowsNr = this.data.rows;
        let columnsNr = this.data.columns;
        console.log("rows" + this.data.rows);
        console.log("columns" + this.data.columns);
        this.rows = Array.from({ length: rowsNr }, (_, i) => i);
        this.columns = Array.from({ length: columnsNr}, (_, i) => i);
        console.log("rows array" + this.rows);
        console.log("columns array" + this.columns);
    }

    toggleSeatBuyer(row: number, col: number) {
        console.log(this.seatMap);
        console.log(row, col, this.seatMap[col][row]);
        if(this.buyerSeat) {
            if(this.passengerSeatToRowsColumns(this.buyerSeat)) {
                const rowsCols = this.passengerSeatToRowsColumns(this.buyerSeat);
                if(rowsCols)
                    if(this.seatMap[rowsCols[0]][rowsCols[1]] && this.seatMap[row][col]) {
                        this.seatMap[rowsCols[0]][rowsCols[1]] = false;
                        this.buyerSeat = '';
                    }  
                    else {
                        if(!this.seatMap[row][col] && this.seatMap[rowsCols[0]][rowsCols[1]]) {
                            this.seatMap[rowsCols[0]][rowsCols[1]] = false;
                            this.seatMap[row][col] = true;
                            this.buyerSeat = `${row}${this.columnToLetter(col)}`;
                        }
                    }
            }
        }
        else {
            if(this.seatMap[row][col]) {
                this.seatMap[row][col] = false;
            }
            else {
                this.seatMap[row][col] = true;
                this.buyerSeat = `${row}${this.columnToLetter(col)}`;  
            }
        }  
    }
    passengerSeatToRowsColumns(seat: string) : number[] | null {
        console.log('passenger seat to rows columns', seat);
        if (!seat) {
            console.error('Seat string is null or undefined');
            return null;
        }
        
        const rowMatch = seat.match(/^\d+/);
        console.log(seat);
        if (!rowMatch) {
            console.error('Invalid seat string format');
            return null;
        }
        
        const row = parseInt(rowMatch[0], 10);
    
        const colLetter = seat[seat.length - 1];
        if (!colLetter || colLetter.length !== 1 || !/[A-Z]/.test(colLetter)) {
            console.error('Invalid column in seat string');
            return null;
        }
    
        const col = colLetter.charCodeAt(0) - 65;  // 'A' has the char code 65
    
        return [row, col];
    }

    toggleSeat(passenger: Passenger, row: number, col: number) {
        if (this.seatMap[row] && this.seatMap[row][col] !== undefined) {
            if(passenger.seat) {    
                if(this.passengerSeatToRowsColumns(passenger.seat)) {
                    const rowsCols = this.passengerSeatToRowsColumns(passenger.seat);
                    if(rowsCols)
                        if(this.seatMap[rowsCols[0]][rowsCols[1]] && this.seatMap[row][col]) {
                            this.seatMap[rowsCols[0]][rowsCols[1]] = false;
                            passenger.seat = undefined;
                        }  
                        else {
                            if(!this.seatMap[row][col] && this.seatMap[rowsCols[1]][rowsCols[0]]) {
                                this.seatMap[rowsCols[1]][rowsCols[0]] = false;
                                this.seatMap[row][col] = true;
                                passenger.seat = `${row}${this.columnToLetter(col)}`;
                            }
                        }
                }
            }
            else {
                if(this.seatMap[row][col]) {
                    this.seatMap[row][col] = false;
                }
                else {
                    this.seatMap[row][col] = true;
                    passenger.seat = `${row}${this.columnToLetter(col)}`;  
                }
            }   
        } else {
            console.error(`Invalid seat coordinates: ${row}, ${col}`);
        }
    }
    isSelected(passenger: Passenger, row: number, col: number) : boolean {
        if(this.seatMap[row] && this.seatMap[row][col]) {
            return true;
        }
        return false;
    }
    isSelectedBuyer(row: number, col: number): boolean {
        if(this.seatMap[row] && this.seatMap[row][col]) {
            return true;
        }
        return false;
    }
    
    isSeatSelected(row: number, col: number): boolean {
        return this.seatMap[row][col];
    }

    columnToLetter(col: number) : string {
        return String.fromCharCode(65 + col);
    }

}

