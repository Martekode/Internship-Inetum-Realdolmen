import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { PackageComponent } from './package/package.component';
import { ReactiveFormsModule } from '@angular/forms';

import {NgxIndexedDBModule} from 'ngx-indexed-db';

const dbConfig = {
  name: 'PackagesIDB',
  version: 1,
  objectStoresMeta: [{
    store: 'packages',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'id', keypath: 'id', options: { unique: true } },
      { name: 'street_name', keypath: 'street_name', options: { unique: false } },
      { name: 'house_number', keypath : 'house_number', options : { unique : false}},
      { name: 'postal_code', keypath : 'postal_code', options: {unique: false}},
      { name: 'adressed_name', keypath : 'adressed_name', options: {unique : false}}
    ]
  }]
};


@NgModule({
  declarations: [
    AppComponent,
    PackageComponent
  ],
  imports: [
    HttpClientModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ReactiveFormsModule,
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
