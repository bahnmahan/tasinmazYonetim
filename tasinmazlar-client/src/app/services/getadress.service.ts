import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetadressService {

  private apiUrl = 'http://localhost:42390/api/';

  constructor(
    private http: HttpClient
  ) { }
  


  // Veritabanından Şehirleri Getir

  getCities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cities`);
  }

  // Veritabanından İlçeleri Getir

  getDistricts(cityId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}towns?cityId=${cityId}`);
  }

  // Veritabanından Mahalleleri Getir

  getNeighborhoods(districtId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}neighborhood?districtId=${districtId}`);
  }
}
