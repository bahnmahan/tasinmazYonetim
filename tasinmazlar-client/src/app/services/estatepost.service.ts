import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstatepostService {

  constructor(
    private http: HttpClient
  ) { }

  addEstate(estate: any) {
    const url = 'http://localhost:42390/api/estates';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(url, estate, {headers});
  }





}
