import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'range-slider',
  template: `
    <mat-slider
      [min]="0"
      [max]="maxValue"
      [step]="1"
      [tickInterval]="100"
      (change)="onChange($event)"
      [value]="value">
    </mat-slider>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ]
})
export class RangeSliderComponent implements ControlValueAccessor {
  value = [0, 100];  // default range
  maxValue = 100; // You can adjust this
  
  sliderChange(event: any) {
    this.value = [event.value.lower, event.value.upper];
    this.onChange(this.value);
  }
  // function to call when the value changes.
  onChange = (value: any) => {};

  // function to call when the input is touched
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // if you want to implement disabled state
  }
  
}
