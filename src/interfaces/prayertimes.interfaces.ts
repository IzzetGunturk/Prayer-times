export interface Timings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface PrayerData {
    timings: Timings
}

export interface ApiResponse {
    data: PrayerData
}