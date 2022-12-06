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
isEmptyForm : boolean = false;
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
  if(Object.values(this.createPackageForm.value).includes('' || null)){
    this.isEmptyForm = true
    return;
  }else{
    this.isEmptyForm = false;
    // here comes the logic to push the actual data tot de DB
    this.data.createPackage(this.createPackageForm.value);
    }
  }
}

interface IPackage {
  id : number;
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}