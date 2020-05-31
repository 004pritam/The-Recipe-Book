import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthServiceService } from './auth-service.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthServiceService) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // this will called every time req send from app
        return this.authService.userSub
            .pipe(
                take(1), // Emit provided number of values before completing.
                exhaustMap(user => { // Map to inner observable, ignore other values until that observable completes.
                    if (!user) { // when app reloads it dont have user then use original req
                        return next.handle(req);
                    }
                    const modifiedReq = req.clone({ // in this case we will send token to server to authorised user
                        params: new HttpParams().set('auth', user.token) // req is added with token
                    });
                    return next.handle(modifiedReq);
                }));
    }
}
