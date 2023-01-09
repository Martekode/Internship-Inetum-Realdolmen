import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
import { IPackage } from './package/package.component';
import { OnInit } from '@angular/core';
import { NgxIndexedDBService} from 'ngx-indexed-db';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa-app';
  packagesFromDBOrCache: any;
  packages : any;
  table;
  sessionPackages : Array<IPackage> = [];
  sessionDeletes : Array<IToDelete> = [];
  indexedDB = window.indexedDB;
  request :any;
  navigator = window.navigator;
  isOnline : boolean = navigator.onLine;
  db:any;
  packageStore:any;

  constructor(private updates: SwUpdate,private data: DataService,@Inject(DOCUMENT) private document : Document, private dbService : NgxIndexedDBService){
    this.table = this.document.getElementById('packageTableBody')
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> window.location.reload());
    })
  }

  public DeletePackage(id:string){
    // when this func fires from button press
    // check for con
    switch (this.navigator.onLine){
      case true:
        // if con then delete packages
        this.data.deletePackage(id);
        // delete from idb too 
        this.deletePackageFromIDB('PackagesIDB','packages',id);
        // we load the packages back in from the idb to update the view 
        this.loadPackagesFromIDB();
        break;
      case false:
        // if NO con put the id in the sessionStorage to delete later
        this.handleOfflineDeletes(id);
        // if NO conn, delete the package from IDB to handle visually
        this.deletePackageFromIDB('PackagesIDB','packages',id);
        // reload the page to make the change visible
        window.location.reload();
        break;
    } 
  }

  deletePackageFromIDB(dbName:string,storeName:string,value :string){
    // make it hidden sinds I don't know how to access cacheStorage
    // const element = this.document.getElementById(id);
    // element?.classList.add('hidden');
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = function() {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const requestCursor = objectStore.openCursor();
        requestCursor.onsuccess = function(event:any) {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.id  === value) {
              console.log('Found object with key:', cursor.key);
              const requestDelete = objectStore.delete(cursor.key);
              requestDelete.onsuccess = function() {
                console.log('Successfully deleted object with key:', cursor.key);
                resolve();
              };
              requestDelete.onerror = function() {
                console.error('Failed to delete object with key:', cursor.key);
                reject();
              };
            } else {
              cursor.continue();
            }
          } else {
            console.error('Object not found');
            reject();
          }
        };
        requestCursor.onerror = function() {
          console.error('Failed to open cursor');
          reject();
        };
      };
      request.onerror = function() {
        console.error('Failed to open database');
        reject();
      };
    });
  }


  syncApp(){
    console.log('syncApp was hit');
    this.loadPackagesFromDBOrCache();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }


  loadPackagesFromDBOrCache(){
    console.log('load db or cache hit')
    this.data.giveMeAllPackages().subscribe(res => {
      this.packagesFromDBOrCache = res;
      this.dbService.clear('packages').subscribe(
        () => {console.log('clear success')},
        (error) => {console.log('clear error', error)}
      );
      this.packagesFromDBOrCache.forEach((singlePackage : IPackage)=>{
        this.dbService.add('packages',singlePackage).subscribe(
          () => {console.log('adding packagesnto idb succes')},
          (error) => {console.log('adding packages to idb error', error)}
        )
      })
    })
  }


  loadPackagesFromIDB(){
    // now pull in data from database and show them
    // SW is goin to show cached if no con.
    console.log('loadIDB hit')
    this.dbService.getAll('packages').subscribe((res)=>{
      this.packages = res;
    });
  }
  ngOnInit(){
    // oninit is going to check for connection
    if(this.navigator.onLine){
      console.log('navigator' , this.navigator.onLine);
        // if there is con then create the packages from session
        this.createPackagesFromSession();
        // if there is con then delete packages from session 
        this.deletePackagesFromSession();
        //default loading packages from DB and putting it in the IDB
        // this.loadPackagesFromDBOrCache();
        // now load packages from the IDB to the view
        this.loadPackagesFromIDB();
    }else{
      console.log('navigator' , this.navigator.onLine);
      // if there is NO con then handle the packages visibly
      this.handleOfflineSessionPackages();
      // now load packages from the IDB to the view
      this.loadPackagesFromIDB();
    }
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
    // this could be done with IDB but this workes for now and eliminates
    // refactoring 
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