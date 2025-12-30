import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApplicationComponent } from './application.component';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getPrayerTimes']);
    apiSpy.getPrayerTimes.and.returnValue(of({
      data: {
        timings: {
          Fajr: '05:00',
          Sunrise: '06:20',
          Dhuhr: '12:30',
          Asr: '15:45',
          Maghrib: '18:10',
          Isha: '19:30'
        }
      }
    }));

    const activatedRouteMock = {
      params: of({
        city: 'Amsterdam'
      })
    }

    await TestBed.configureTestingModule({
      imports: [ApplicationComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
  });

  it('should call getApiInformation and set prayerTimes', () => {
    // when
    component.getApiInformation();

    // then
    expect(component.prayerTimes).toEqual({
      Fajr: '05:00',
      Sunrise: '06:20',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:10',
      Isha: '19:30'
    });

    expect(apiSpy.getPrayerTimes).toHaveBeenCalled();
  });

  it('should return the next prayer based on current time', () => {
    // given
    const fixedDate = new Date(2025, 10, 29, 10, 0, 0);

    component.prayerTimes = {
      Fajr: '05:00',
      Sunrise: '06:20',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:10',
      Isha: '19:30'
    };

    // when
    const nextPrayer = component.getNextPrayer(fixedDate);

    // then
    expect(nextPrayer?.name).toBe('Dhuhr');
    expect(nextPrayer?.date.getHours()).toBe(12);
    expect(nextPrayer?.date.getMinutes()).toBe(30);
  });

  it('should return the next prayer on the next day when all prayers are passed for today', () => {
    // given
    const fixedDate = new Date(2025, 10, 29, 20, 0, 0);

    component.prayerTimes = {
      Fajr: '05:00',
      Sunrise: '06:20',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:10',
      Isha: '19:30'
    };

    // when
    const nextPrayer = component.getNextPrayer(fixedDate);

    // then
    expect(nextPrayer?.name).toBe('Fajr');
    expect(nextPrayer?.date.getHours()).toBe(5);
  });

  it('should return difference between the time now and prayer time', () => {
    // given
    jasmine.clock().install();
    const fixedDate = new Date(2025, 10, 29, 10, 0, 0);
    jasmine.clock().mockDate(fixedDate);

    component.prayerTimes = {
      Fajr: '05:00',
      Sunrise: '06:20',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:10',
      Isha: '19:30'
    };

    // when
    component.timeLeftPrayer();

    // then
    expect(component.timeLeft).toMatch('02:30');
  });
});
