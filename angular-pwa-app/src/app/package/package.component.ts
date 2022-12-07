import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent {

// receiving variable from the parent component.
@Input() Package = {} as IPackage;

// some properties needed for the application to work.
createPackageForm : FormGroup;
isEmptyForm : boolean = false;
createPackageArray : Array<Object> = [];
static baseUrl = "http://localhost:8081/api/packages/";

constructor(private data : DataService){
  // creating a formgroup to bind the values of the form to an object.
  // to the createPackageform.value.
  this.createPackageForm = new FormGroup({
    street_name: new FormControl(),
    house_number: new FormControl(),
    postal_code: new FormControl(),
    adressed_name: new FormControl()
  });
}

public DeletePackage(id:any){
  // fires the delete package function to remove set package from 
  // the databese. 
  // TODO : implement connection check and storing in session if no
  //        connection.
  this.data.deletePackage(id);
}
onSubmit(){
  switch(navigator.onLine){
    case true:
      // fires the validation and if validated fires the post of the 
      // package to the database. 
      this.onValidationCreation();
      break;
    case false:
      // pushing the package to an array if there is no connection and 
      // storing it in the session as a string.
      this.createPackageArray.push(this.createPackageForm.value);
      const stringCreatePackageArray = JSON.stringify(this.createPackageArray);
      sessionStorage.setItem("posts", stringCreatePackageArray);
      break;
    }
  }
onValidationCreation(){
  if(Object.values(this.createPackageForm.value).includes('' || null)){
    // sets it to true so that the client displays a message that the forms 
    // need to be filled in.
    this.isEmptyForm = true
    return;
  }else{
    this.isEmptyForm = false;
    // posting the package to the database
    this.data.createPackage(this.createPackageForm.value);
    return;
    }
  }
}

// created a DTO so the front end knows whats inside the Package object.
interface IPackage {
  id : number;
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}