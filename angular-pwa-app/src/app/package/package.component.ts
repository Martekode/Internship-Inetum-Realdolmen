import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DataService } from '../data.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent {

@Input() Package = {} as IPackage;
createPackageForm : FormGroup;
static baseUrl = "http://localhost:8081/api/packages/";

constructor(private http : HttpClient, private data : DataService){
  this.createPackageForm = new FormGroup({
    street_name: new FormControl(),
    house_number: new FormControl(),
    postal_code: new FormControl(),
    adressed_name: new FormControl()
  });
}

public DeletePackage(id:any){
  this.data.deletePackage(id);
}
onSubmit(){
  console.log(this.createPackageForm.value);
}
}

interface IPackage {
  id : number;
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}