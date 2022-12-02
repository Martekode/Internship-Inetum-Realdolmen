import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static baseUrl = "http://localhost:8081/api/packages/";
  public status = "";
  public errorMessage = "";
  constructor(private http: HttpClient) { }

  giveMeAllPackages(){
    return this.http.get('http://localhost:8081/api/packages/');
  }

  deletePackage(id:any){
    console.log(`${DataService.baseUrl}${id}`);
    this.http.delete(`${DataService.baseUrl}${id}`)
    .subscribe();
    window.location.reload();
  }
}
