import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponse, Timings } from '../../interfaces/prayertimes.interfaces';       
import { NgIf } from '@angular/common';
import { TimeAndDateComponent } from '../time-and-date/time-and-date.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [NgIf, TimeAndDateComponent],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent {

  prayerTimes?: Timings;
  prayerOrder = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
  timeLeft?: string;
  nextPrayerName?: string;

  private apiService = inject(ApiService);

  getApiInformation() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2,'0');
    const month = (today.getMonth() + 1).toString().padStart(2,'0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    this.apiService.getPrayerTimes(formattedDate, 'Roermond', 'Netherlands').subscribe({
      next: (response: ApiResponse) => {
        this.prayerTimes = response.data.timings;
        this.timeLeftPrayer();
      },
      error: (err) => {
        console.error('Fout bij het ophalen:', err);
      }
    });
  }

  private updateTomorrowPrayerTime() {
    const today = new Date();
    const day = (today.getDate() + 1).toString().padStart(2,'0');
    const month = (today.getMonth() + 1).toString().padStart(2,'0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    this.apiService.getPrayerTimes(formattedDate, 'Roermond', 'Netherlands').subscribe({
      next: (response: ApiResponse) => {
        this.prayerTimes = response.data.timings;
        this.timeLeftPrayer();
      },
      error: (err) => {
        console.error('Fout bij het ophalen:', err);
      }
    });
  }

  getNextPrayer(now?: Date): { name: string; date: Date } | null {
    if (!this.prayerTimes) return null;

    const currentDate = now ?? new Date();

    for (const prayer of this.prayerOrder) {
      const [h, m] = this.prayerTimes[prayer as keyof Timings].split(':').map(Number);
      const prayerTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), h, m);

      if (prayerTime > currentDate) {
        return { name: prayer, date: prayerTime };
      }
    }

    const [fh, fm] = this.prayerTimes.Fajr.split(':').map(Number);
    const fajrTomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, fh, fm);

    this.updateTomorrowPrayerTime();

    return { name: 'Fajr', date: fajrTomorrow };
  }

  timeLeftPrayer() {
    const now = new Date();
    const nextPrayer = this.getNextPrayer();

    if (!nextPrayer) return;

    this.nextPrayerName = nextPrayer.name;

    const differenceTime = nextPrayer.date.getTime() - now.getTime();

    const hours = Math.floor(differenceTime / (1000 * 60 * 60));
    const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

    const [hStr, mStr, sStr] = [hours, minutes, seconds].map(
      timeDigits => timeDigits.toString().padStart(2, '0')
    );

    this.timeLeft = `Prayer: ${nextPrayer.name} - ${hStr}:${mStr}:${sStr}`;
  }

  ngOnInit() {
    this.getApiInformation();

    setInterval(() => {
      this.timeLeftPrayer();
    }, 1000);
  }
}