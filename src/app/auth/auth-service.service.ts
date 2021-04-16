import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './User.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
// have a look at this for api
// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

interface AuthResponseData {
  // below properties are same as firebase response properties
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  // userSub = new Subject<User>(); // to change ui on based on user authentication
  userSub = new BehaviorSubject<User>(null); // Requires an initial value and emits the current value to new subscribers
  // see usage of it in dataStorage service
  // it is needed here bcz we have to pass token to server
  expirationTimer: any;
  constructor(private http: HttpClient,
    private router: Router) { }
  signUp(userEmail: string, userPassword: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        // below properties are same as api given by firebase request property
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn); // string to no conversion
        }
        )
      );
  }
  login(userEmail: string, userPassword: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
      + environment.firebaseAPIKey,
      {
        // below properties are same as api given by firebase request property
        email: userEmail,
        password: userPassword,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn); // string to no conversion
        }
        )
      );
  }
  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string // ** string here
    } = JSON.parse(localStorage.getItem('userData')); // which we stored before
    if (!userData) {
      return; // when not login
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate) // ** string to date conversion see above
    );
    if (loadedUser.token) { // getter of user see user model it checks validity of token
      this.userSub.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
  logout() {
    this.userSub.next(null);
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
    // console.log('logouted ');
  }
  autoLogout(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration); // replace this 2000 for testing
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknow error occured';
    if (!errorRes.error || !errorRes.error.error) { // this format is by firebase
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password';
        break;

    }
    return throwError(errorMessage);
  }
  private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000);
    // expiresin is in seconds and getime is in milliseconds
    // console.log(expirationDate);
    // Thu May 21 2020 16:17:31 GMT+0530 (India Standard Time)
    // Thu May 21 2020 17:20:56 GMT+0530 (India Standard Time)
    const user = new User(
      email,
      id,
      token,
      expirationDate
    );
    this.userSub.next(user);
    this.autoLogout(expiresIn * 1000); // in milisecond
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
