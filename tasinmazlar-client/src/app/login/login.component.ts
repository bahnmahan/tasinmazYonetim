import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
declare let alertify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }




  loginUser: any = {}

  ngOnInit() {
    this.authService.checkTokenValidity();
  }

  login() {
    this.authService.login(this.loginUser);
  }






}
