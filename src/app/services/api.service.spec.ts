import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ApiResponse } from '../../interfaces/prayertimes.interfaces';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the correct URL and return prayer times', () => {
    // given
    const today = '23-11-2025';
    const city = 'Amsterdam';
    const country = 'Netherlands';

    const mockResponse: ApiResponse = {
      data: {
        timings: {
          Fajr: '05:00',
          Sunrise: '08:17',
          Dhuhr: '12:00',
          Asr: '15:00',
          Maghrib: '18:00',
          Isha: '19:30'
        }
      }
    };

    const expectedUrl = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=${country}&method=3`;

    let actualResponse: ApiResponse | undefined;

    // when
    service.getPrayerTimes(today, city, country).subscribe(response => {
      actualResponse = response;
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockResponse);

    // then
    expect(actualResponse).toEqual(mockResponse);
  });
});
