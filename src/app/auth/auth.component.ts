import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from './auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  constructor(private authService: AuthServiceService,
              private router: Router) { }

  ngOnInit(): void {
  }
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (!form.value) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    if (this.isLoginMode) {
      // login
      this.authService.login(email, password)
      .subscribe(respData => {
        this.isLoading = false;
        console.log(respData); // it will log whole response obj from firebase
        this.router.navigate(['./recipes']);
      }, errorMessage => { // it will get value from pipe from authserive, see it
        this.isLoading = false;
        console.log(errorMessage);
        this.error = errorMessage;
      });
    } else {
      // sign up
      this.authService.signUp(email, password)
      .subscribe(respData => {
        this.isLoading = false;
        console.log(respData); // it will log whole response obj from firebase
        this.router.navigate(['./recipes']);
      }, errorMessage => { // it will get value from pipe from authserive, see it
        this.isLoading = false;
        console.log(errorMessage);
        this.error = errorMessage;
      });
    }
    form.reset();
  }
  onclosingBox() {
    this.error = null;
  }

}
