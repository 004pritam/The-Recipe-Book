import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthServiceService,
                private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            return this.authService.userSub.pipe(
                take(1), // just take latest user value and unsubscribe auto, it will not keep listening authguard uncessarily
                map(user => {
                const isAuth = !!user; // converts true if user present and false if not present
                if (isAuth) {
                    return true; // if authenticated return true
                } else { // if not authenticated navigate to below url tree
                    return this.router.createUrlTree(['/auth']);
                }
            }));
    }
}
