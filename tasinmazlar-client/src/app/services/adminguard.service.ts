import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {

  constructor(
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const token = this.authService.getToken(); // AuthService'ten tokeni al
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userRole = decodedToken.userrole;
      if (userRole === 'Yönetici') { // Kullanıcının rolü 'Yönetici' mi kontrol et
        return true; // Erişime izin ver
      } else {
        alertify.error('Bu Sayfayı Görüntüleme Yetkiniz Yok')
        this.router.navigate(['/tasinmazlar']); // Kullanıcı yönetici değilse başka bir sayfaya yönlendir
        return false; // Erişime izin verme
      }
    }
  }
  



}
