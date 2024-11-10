import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BgmService {
  private bgmUrl = 'https://api.bgm.tv/v0';

  constructor(private http: HttpClient) { }

  getCalendar() : Observable<any> {
    return this.http.get(`https://api.bgm.tv/calendar`);
  }

  getSubject(subjectId: string) : Observable<any> {
    return this.http.get(`${this.bgmUrl}/subjects/${subjectId}`);
  }
}
