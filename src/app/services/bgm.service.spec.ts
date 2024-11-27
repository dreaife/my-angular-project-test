import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BgmService } from './bgm.service';

describe('BgmService', () => {
  let service: BgmService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BgmService]
    });

    service = TestBed.inject(BgmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get calendar data', () => {
    service.getCalendar().subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne('https://api.bgm.tv/calendar');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get subject by id', () => {
    const testId = '123';
    service.getSubject(testId).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`https://api.bgm.tv/v0/subjects/${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should search subjects', () => {
    const keyword = 'test';
    const options = {
      limit: 10,
      page: 1
    };

    service.searchSubject(keyword, options).subscribe(data => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(
      req => req.url.includes('https://api.bgm.tv/v0/search/subjects')
    );
    expect(req.request.method).toBe('POST');
    req.flush({ results: [] });
  });
});
