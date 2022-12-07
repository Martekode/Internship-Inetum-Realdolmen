import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
import { IPackage } from './package/package.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-pwa-app';
  packages: any;
  sessionPackages : Array<IPackage> = [];
  constructor(private updates: SwUpdate,private data: DataService){
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> window.location.reload());
    })
  }
  
  public DeletePackage(id:any){
    this.data.deletePackage(id);
  }

  ngOnInit(){
    switch (navigator.onLine){
      case true:
        this.createPackagesFromSession();
        break;
      case false:
        this.handleOfflineSessionPackages();
        break;

    }
    this.data.giveMeAllPackages().subscribe(res => {
      this.packages = res;
    })
  }

  createPackagesFromSession(){
    if(sessionStorage['posts']){
      const newEntries = JSON.parse(sessionStorage['posts']);
      newEntries.forEach((obj : Object) => {
        this.data.createPackage(obj);
      });
      sessionStorage.removeItem('posts');
      this.sessionPackages = [];
    }
  }
  handleOfflineSessionPackages(){
    const newEntries = JSON.parse(sessionStorage['posts']);
    newEntries.forEach((obj : IPackage) => {
      this.sessionPackages.push(obj);
    });
    window.location.reload();
  }
}
