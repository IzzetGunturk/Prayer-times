import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent {

  private apiService = inject(ApiService);

  getApiInformation() {
    this.apiService.getPrayerTimes('Roermond', 'Netherlands').subscribe({
      next: (response) => {
        console.log('Gebedstijden:', response.data.timings);
        console.log(response.data)
      },
      error: (err) => {
        console.error('Fout bij het ophalen:', err);
      }
    });
  }

  ngOnInit() {
    this.getApiInformation();
  }
}
