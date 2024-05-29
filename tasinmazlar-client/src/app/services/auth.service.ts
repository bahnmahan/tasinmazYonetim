import { Injectable } from '@angular/core';
import { LoginUser } from '../models/loginUser';
import { userReg } from '../models/userReg';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as alertifyjs from 'alertifyjs';

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {

  constructor(
    private httpClient:HttpClient,
    private router:Router,

  ) { }

  ngOnInit(): void {

  }

  path = "http://localhost:42390/api/auth/"
  userToken:any;
  decodedToken:any;
  TOKEN_KEY = "token"
  jwtHelper:JwtHelperService = new JwtHelperService();
  loggedIn = false;

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY,token)
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY)
  }


  login(loginUser: LoginUser) {
    let headers = new HttpHeaders().append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", loginUser, { headers: headers }).subscribe(data => {
      const token = data['tokenString'];
      this.saveToken(token);
      this.userToken = token;
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userRole = decodedToken.userrole;
      this.router.navigateByUrl('/tasinmazlar');
      this.loggedIn = true;
    }, (error: any) => {
      alertifyjs.error('Kullanıcı Adı veya Şifre Yanlış!').delay(1.5);
    });
  }

  // login(loginUser: LoginUser) {
  //   let headers = new HttpHeaders().append("Content-Type", "application/json");
  //   this.httpClient.post(this.path + "login", loginUser, { headers: headers }).subscribe(data => {
  //     const token = data['tokenString'];
  //     this.saveToken(token);
  //     this.userToken = token;
  //     this.decodedToken = this.jwtHelper.decodeToken(token);
  //     this.router.navigateByUrl('/tasinmazlar');
  //     this.loggedIn = true;
  //   }, (error: any) => {
  //     alertifyjs.error('Kullanıcı Adı veya Şifre Yanlış!');
  //   }
  // );
  // }

  checkTokenValidity() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      localStorage.removeItem(this.TOKEN_KEY);
      this.router.navigateByUrl('/login');
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }


  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('/');
    this.loggedIn = false;
  }

  

  register(userReg:userReg) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type","application/json")
    this.httpClient.post(this.path + "register" , userReg , {headers:headers}).subscribe(data => {
      console.log(alert("Kullanıcı Başarıyla Oluşturuldu!"))
    })
  }

}
