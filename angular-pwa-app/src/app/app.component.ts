import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
  table;
  sessionPackages : Array<IPackage> = [];
  sessionDeletes : Array<string> = [];


  constructor(private updates: SwUpdate,private data: DataService,@Inject(DOCUMENT) private document : Document){
    this.table = this.document.getElementById('packageTableBody')
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> window.location.reload());
    })
  }
  
  public DeletePackage(id:string){
    switch (navigator.onLine){
      case true:
        this.data.deletePackage(id);
        break;
      case false:
        this.handleOfflineDeletes(id);
        // this.handleDeleteVisual(id); broken!!! can't find the document.getelementbug
        break;
    }
    
  }

  handleDeleteVisual(id :string){
    console.log("handle offline visual fired");
    const deleteElement : any = this.document.getElementById(id);
    this.table?.removeChild(deleteElement);
  }

  ngOnInit(){
    // just a console log to see what's inside the cache. 
    console.log(CacheStorage);
    switch (navigator.onLine){
      case true:
        this.createPackagesFromSession();
        this.deletePackagesFromSession();
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
    if(sessionStorage['posts']){
      const newEntries = JSON.parse(sessionStorage['posts']);
      newEntries.forEach((obj : IPackage) => {
        this.sessionPackages.push(obj);
      });
      window.location.reload();
    }
  }

  handleOfflineDeletes(id:string){
        this.sessionDeletes.push(id);
        const newDeletes = JSON.stringify(this.sessionDeletes);
        sessionStorage.setItem('deletes',newDeletes);
  }
  
  deletePackagesFromSession(){
    if(sessionStorage['deletes']){
      const newDeletes = JSON.parse(sessionStorage['deletes']);
      newDeletes.forEach((item:string) => {
        this.data.deletePackage(item);
      });
      sessionStorage.removeItem('deletes');
      this.sessionDeletes = [];
    }
  }
}
