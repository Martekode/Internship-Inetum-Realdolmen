import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DataService } from '../data.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent {
@Input() Package = {} as IPackage;

static baseUrl = "http://localhost:8081/api/packages/";
constructor(private http : HttpClient, private data : DataService){
}

public DeletePackage(id:any){
  this.data.deletePackage(id);
}

}

interface IPackage {
  id : number;
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}