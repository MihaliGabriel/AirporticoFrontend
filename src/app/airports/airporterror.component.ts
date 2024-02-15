import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-airport-error',
  templateUrl: './airporterror.component.html'
})
export class AirportErrorComponent {

  constructor(
    public dialogRef: MatDialogRef<AirportErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { errorMessage: string }
  ) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}