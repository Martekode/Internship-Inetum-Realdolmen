import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-pwa-app';
  packages: any;
  constructor(private updates: SwUpdate,private data: DataService){
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> document.location.reload());
    })
  }
  
  public DeletePackage(id:any){
    this.data.deletePackage(id);
  }

  ngOnInit(){
    this.data.giveMeAllPackages().subscribe(res => {
      this.packages = res;
    })
  }
}
