import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';     
import { ApiResponse } from '../../interfaces/prayertimes.interfaces';           

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://api.aladhan.com/v1/timingsByCity';

  private httpClient = inject(HttpClient)

  getPrayerTimes(city: string, country: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}?city=${city}&country=${country}&method=3`;
    return this.httpClient.get<ApiResponse>(url);
  }
}
