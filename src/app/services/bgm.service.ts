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

  searchSubject(keyword: string, options: any = {}) : Observable<any> {
    const body: any = {
      keyword: keyword,
      sort: options.sort || "rank",
      filter: {}
    };

    if (options.type) {
      body.filter.type = options.type;
    }
    if (options.meta_tags) {
      body.filter.meta_tags = options.meta_tags;
    }
    if (options.tag) {
      body.filter.tag = options.tag;
    }
    if (options.air_date) {
      body.filter.air_date = options.air_date;
    }
    if (options.rating) {
      body.filter.rating = options.rating;
    }
    if (options.rank) {
      body.filter.rank = options.rank;
    }
    if (options.nsfw !== undefined) {
      body.filter.nsfw = options.nsfw;
    }

    const limit = options.limit || 10;
    const page = options.page || 1;
    const offset = (page - 1) * limit;

    return this.http.post(`${this.bgmUrl}/search/subjects?limit=${limit}&offset=${offset}`, body);
  }
}
