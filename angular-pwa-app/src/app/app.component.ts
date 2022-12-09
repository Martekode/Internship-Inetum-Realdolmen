import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
import { IPackage } from './package/package.component';
import { OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa-app';
  packages: any;
  table;
  sessionPackages : Array<IPackage> = [];
  sessionDeletes : Array<IToDelete> = [];


  constructor(private updates: SwUpdate,private data: DataService,@Inject(DOCUMENT) private document : Document){
    this.table = this.document.getElementById('packageTableBody')
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> window.location.reload());
    })
  }
  
  public DeletePackage(id:string){
    // when this func fires from button press
    // check for con
    switch (navigator.onLine){
      case true:
        // if con then delete packages
        this.data.deletePackage(id);
        break;
      case false:
        // if NO con handle push to session
        this.handleOfflineDeletes(id);
        // if NO con then make invisible
        this.handleDeleteVisual(id);
        break;
    }
    
  }

  handleDeleteVisual(id :string){
    // make it hidden sinds I don't know how to access cacheStorage
    const element = this.document.getElementById(id);
    element?.classList.add('hidden');
  }

  handleOfflineSessionDeletesVisual(){
    // if deletes inside session storage
    if(sessionStorage['deletes']){
      // settimeout needed to access the DOM, oninit it is null otherwise
      // I tried afterviewinit too but doesn't work either
      // definitly better way of doing it out there
      setTimeout(() => {
        const sessionDeletes = JSON.parse(sessionStorage['deletes']);
        sessionDeletes.forEach((item : IToDelete) =>{
          const element = this.document.getElementById(item.ID);
          element?.classList.add('hidden');
      })
      }, 100);
    }
  }

  ngOnInit(){
    // oninit is going to check for connection
    switch (navigator.onLine){
      case true:
        // if there is con then create the packages from session
        this.createPackagesFromSession();
        // if there is con then delete packages from session 
        this.deletePackagesFromSession();
        break;
      case false:
        // if there is NO con then handle the packages visibly
        this.handleOfflineSessionPackages();
        break;

    }
    // now pull in data from database and show them
    // SW is goin to show cached if no con.
    this.data.giveMeAllPackages().subscribe(res => {
      this.packages = res;
    })
    // theis is ugly code!!! I couldn't find a way to access the cacheStorage
    // sinds service worker only resides in dist/ folder.
    // so i handled it ugly and only visibly 
    this.handleOfflineSessionDeletesVisual();
  }


  createPackagesFromSession(){
    // if posts in session storage 
    if(sessionStorage['posts']){
      // parse the objects from the session
      // for eachh obj inside that parsed value create the packages in the DB
      const newEntries = JSON.parse(sessionStorage['posts']);
      newEntries.forEach((obj : Object) => {
        this.data.createPackage(obj);
      });
      // remove the session posts
      sessionStorage.removeItem('posts');
      // make the local storage client side empty again
      this.sessionPackages = [];
    }
  }

  handleOfflineSessionPackages(){
    // if session storage posts
    console.log('handle offline packages oninit')
    if(sessionStorage['posts']){
      // translate the string to container with objects
      // for each object in the container push the posts to te local varaible
      const newEntries = JSON.parse(sessionStorage['posts']);
      newEntries.forEach((obj : IPackage) => {
        this.sessionPackages.push(obj);
      });
    }
  }

  handleOfflineDeletes(id:string){
        // create a new object (this could be left out but i did it to test out bugs)
        const newObject = {ID : id};
        // if deletes inside session storage first create const of the old data
        // then set the local variable to the old data
        // because we need to push new ones on top of it without losing the old data.
        if(sessionStorage['deletes']){
          const oldDeletes = JSON.parse(sessionStorage['deletes']);
          this.sessionDeletes = oldDeletes;
        }
        // push the new data on top of the old
        this.sessionDeletes.push(newObject);
        // translate back to string 
        const newDeletes = JSON.stringify(this.sessionDeletes);
        // put new container string in session
        sessionStorage.setItem('deletes',newDeletes);
  }
  
  deletePackagesFromSession(){
    // if there are deletes inside session storage 
    if(sessionStorage['deletes']){
      // create variable for container of deletes objects
      const newDeletes = JSON.parse(sessionStorage['deletes']);
      // for each object inside the container delete the package from DB 
      // with that item.ID
      newDeletes.forEach((item:IToDelete) => {
        this.data.deletePackage(item.ID);
      });
      // remove deleted items from the session storage
      sessionStorage.removeItem('deletes');
      // set local variable back to empty
      this.sessionDeletes = [];
    }
  }
  
}
// DTO so the code knows whats inside the to be deleted items objects.
interface IToDelete {
    ID : string;
}