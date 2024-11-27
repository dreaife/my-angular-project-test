import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerMock: any;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when not logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it('should return true when logged in', () => {
    sessionStorage.setItem('userToken', 'test-token');
    expect(service.isLoggedIn()).toBeTruthy();
    sessionStorage.removeItem('userToken');
  });

  it('should clear token and navigate to login on logout', () => {
    sessionStorage.setItem('userToken', 'test-token');
    service.logout();
    expect(sessionStorage.getItem('userToken')).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
