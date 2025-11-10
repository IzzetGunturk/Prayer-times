import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponse ,Timings } from '../../interfaces/prayertimes.interfaces';       
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [NgIf],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent {

  prayerTimes?: Timings;

  private apiService = inject(ApiService);

  getApiInformation() {
    this.apiService.getPrayerTimes('Roermond', 'Netherlands').subscribe({
      next: (response: ApiResponse) => {
        this.prayerTimes = response.data.timings;
        console.log('Gebedstijden:', response.data.timings);
        console.log(response.data)
      },
      error: (err) => {
        console.error('Fout bij het ophalen:', err);
      }
    });
  }
}
