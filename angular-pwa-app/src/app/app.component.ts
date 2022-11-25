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
  pokemon: any;
  constructor(private updates: SwUpdate,private data: DataService){
    this.updates.available.subscribe(event => {
      updates.activateUpdate().then(()=> document.location.reload());
    })
  }

  ngOnInit(){
    this.data.giveMePokemon().subscribe(res => {
      this.pokemon = res;
    })
  }
}
