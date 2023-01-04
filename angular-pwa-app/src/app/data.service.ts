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
    return this.http.get(DataService.baseUrl);
  }

  deletePackage(id:any){
    this.http.delete(`${DataService.baseUrl}${id}`)
    .subscribe();
  }

  createPackage(obj:object){
    this.http.post(DataService.baseUrl,obj).subscribe();
    }
}
