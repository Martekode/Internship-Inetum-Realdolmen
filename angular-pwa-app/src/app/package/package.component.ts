import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent {
@Input() Package = {} as IPackage;
}

interface IPackage {
  street_name : string;
  house_number : number;
  postal_code : number;
  adressed_name : string;
}