import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BgmService {
  private bgmUrl = 'https://api.bgm.tv/v0';

  constructor(private http: HttpClient) { }

  getCalendar() {
    return this.http.get(`https://api.bgm.tv/calendar`);
  }

  getSubject(subjectId: string) {
    return this.http.get(`${this.bgmUrl}/subject/${subjectId}`);
  }
}
