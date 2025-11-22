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

  private apiService = inject(ApiService);

  getApiInformation() {
    this.apiService.getPrayerTimes('Roermond', 'Netherlands').subscribe({
      next: (response: ApiResponse) => {
        this.prayerTimes = response.data.timings;
        this.timeLeftPrayer();
      },
      error: (err) => {
        console.error('Fout bij het ophalen:', err);
      }
    });
  }

  getNextPrayer(): { name: string; date: Date } | null {
    if (!this.prayerTimes) return null;

    const dateNow = new Date();

    for (const prayer of this.prayerOrder) {
      const [h, m] = this.prayerTimes[prayer as keyof Timings].split(':').map(Number);
      const prayerDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), h, m);

      if (prayerDate > dateNow) {
        return { name: prayer, date: prayerDate };
      }
    }

    const [fh, fm] = this.prayerTimes.Fajr.split(':').map(Number);
    const fajrTomorrow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 1, fh, fm);


    return { name: 'Fajr', date: fajrTomorrow };
  }

  timeLeftPrayer() {
    const dateNow = new Date();
    const nextPrayer = this.getNextPrayer();

    if (!nextPrayer) return;

    const differenceTime = nextPrayer.date.getTime() - dateNow.getTime();

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