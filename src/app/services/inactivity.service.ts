// inactivity-timer.service.ts
import { Injectable, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityTimerService {
  private timeoutId: any;
  private readonly INACTIVITY_TIME = 1 * 60 * 1000;
  private isTimerActive = false;
  private inactivityCallback: () => void = () => {};

  constructor(private router: Router) {
    this.setupEventListeners();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log("component change")
        // Check if the navigation event is an endpoint change
        if (this.isTimerActive) {
          this.stopTimer();
        }
      }
    });
  }

  private setupEventListeners(): void {
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
  }

  startTimer(callback: () => void): void {
    this.isTimerActive = true;
    this.clearTimer();
    console.log('Timer started');
    this.inactivityCallback = callback;
    this.timeoutId = setTimeout(() => {
      console.log("timeout")
      this.isTimerActive = false;
      if (this.inactivityCallback) {
        this.inactivityCallback();
      }
    }, this.INACTIVITY_TIME);
  }

  resetTimer(): void {
    if (this.isTimerActive) {
      this.clearTimer();
    }
    this.startTimer(this.inactivityCallback);
  }

  stopTimer(): void {
    this.isTimerActive = false;
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
