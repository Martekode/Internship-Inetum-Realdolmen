import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { FormGroup, FormControl,Validators } from '@angular/forms';

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
isInvalidForm : boolean = false;
createPackageArray : Array<Object> = [];
static baseUrl = "http://localhost:8081/api/packages/";

constructor(private data : DataService){
  // creating a formgroup to bind the values of the form to an object.
  // to the createPackageform.value.
  this.createPackageForm = new FormGroup({
    street_name: new FormControl(null,[
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[A-Za-z ]+$/)
    ]),
    house_number: new FormControl(null , [
      Validators.required,
      Validators.pattern(/^[0-9]+$/)
    ]),
    postal_code: new FormControl('',[
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/^[0-9]+$/)
    ]),
    adressed_name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ])
  });
}

// getters to access the properties in the frontend, so we can check the validation in the client
get streetName() {return this.createPackageForm.get('street_name')}
get houseNumber() {return this.createPackageForm.get('house_number')}
get postalCode() {return this.createPackageForm.get('postal_code')}
get adressedName() {return this.createPackageForm.get('adressed_name')}

public DeletePackage(id:any){
  // fires the delete package function to remove set package from 
  // the databese. 
  // TODO : implement connection check and storing in session if no
  //        connection.
  this.data.deletePackage(id);
}
onSubmit(){
  console.log('submit hit')
  switch(navigator.onLine){
    case true:
      // fires the validation and if validated fires the post of the 
      // package to the database. 
      this.onValidationCreation();
      break;
    case false:
      // pushing the package to an array if there is no connection and 
      // storing it in the session as a string.
      this.handleOfflinePackageCreation();
      break;
    }
  }
onValidationCreation(){
  if(!this.createPackageForm.valid){
    // sets it to true so that the client displays a message that the forms 
    // need to be filled in.
    this.isInvalidForm = true;
    return;
  }else{
    this.isInvalidForm = false;
    // posting the package to the database
    this.data.createPackage(this.createPackageForm.value);
    return;
    }
  }

  handleOfflinePackageCreation(){
    console.log('handle offline packages submit hit')
    this.createPackageArray.push(this.createPackageForm.value);
    const stringCreatePackageArray = JSON.stringify(this.createPackageArray);
    sessionStorage.setItem("posts", stringCreatePackageArray);
    window.location.reload();
  }
}

// created a DTO so the front end knows whats inside the Package object.
export interface IPackage {
  id : number;
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}