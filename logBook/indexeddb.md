To add IndexedDB to your Angular project, you can follow these steps:

Install the Angular IndexedDB library by running the following command in your terminal:
```bash
npm install angular-indexed-db --save
```
Import the Angular IndexedDB module in your Angular module file (e.g. app.module.ts) by adding the following line at the top of the file:
Copy code
import { AngularIndexedDB } from 'angular-indexed-db';
Add the Angular IndexedDB module to the imports array of your Angular module:
Copy code
```ts
@NgModule({
  imports: [
    AngularIndexedDB
  ],
  // ...
})
Inject the AngularIndexedDB service into your component or service where you want to use it:
Copy code
import { AngularIndexedDB } from 'angular-indexed-db';

@Component({
  // ...
})
export class MyComponent {
  constructor(private db: AngularIndexedDB) {
    // ...
  }
}
```
Use the AngularIndexedDB service to open a connection to your IndexedDB database and perform operations such as creating an object store, inserting data, and retrieving data. Here is an example of how you might use the AngularIndexedDB service to create an object store and add an item to it:
Copy code
```ts
this.db.createStore(1, (evt) => {
  let objectStore = evt.currentTarget.result.createObjectStore(
    'items', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('name_idx', 'name', { unique: false });
});

this.db.add('items', { name: 'Item 1' }).then(
  () => { console.log('item added'); },
  (error) => { console.log('error', error); }
);
```
You can find more information about using the Angular IndexedDB library in the documentation.