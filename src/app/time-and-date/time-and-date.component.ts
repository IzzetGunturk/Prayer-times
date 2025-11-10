import { Component } from '@angular/core';

@Component({
  selector: 'app-time-and-date',
  standalone: true,
  imports: [],
  templateUrl: './time-and-date.component.html',
  styleUrl: './time-and-date.component.scss'
})
export class TimeAndDateComponent {
  dateNow = new Date();
  timeNow: string = '';
  
  dateToday = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(this.dateNow);

  ngOnInit() {
    setInterval(() => {
      this.timeNow = new Date().toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }, 1000);
  }
}
