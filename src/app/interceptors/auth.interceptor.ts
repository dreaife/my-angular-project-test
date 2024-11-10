import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = environment.bgm.authToken;
  const userAgent = environment.bgm.userAgent;

  if (req.url.startsWith('https://api.bgm.tv')) {
    const authReq = req.clone({
      setHeaders: {
        // Authorization: `Bearer ${authToken}`,
        // 'mode': 'cors',
        // 'User-Agent': userAgent,mode: 'cors'
      }
    });
    return next(authReq);
  }

  return next(req);
};
