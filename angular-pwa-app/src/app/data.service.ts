import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  giveMeAllPackages(){
    return this.http.get('http://localhost:8081/api/packages/');
  }
}
