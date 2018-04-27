# Angular generic data table component

Angular generic data table with list, sort, pagination, search on backend API (with generic API DAO)

DaoGeneric<User> contient principalement la fonction list() qui construit la requête qui sera envoyée au backend API
   
__Format de l'URL construite pour la liste :__ (il est possible de modifier ces différents paramètres en surchargeant _getPagination(), _getSorting() et _getParams()

* pour la pagination : **&limit=n&offset=m**
* pour le sort : **&ordering=[-]champ** le - fait un tri desc
* pour le search : **&search=txt**

Exemple : https://mondomaine/api/projets/?limit=20&offset=5 : renvoie les 20 projets, en commençant au 5ème

__Format de retour de la liste :__

L'objet ramené est de type Pagination :

```typescript
Pagination { 
  total: number; // total des éléments en base (par exemple, 1 000 projets)
  totalView: number; // total de la pagination (par exemple, 20 projets)
  list: any[]; // liste des éléments ramenés
}
```

Lors de l'implémentation de DaoGeneric<T> (**generic.dao.ts**), il est possible de surcharger 3 méthodes supplémentaires pour modifier les paramètres querystring envoyés 

```typescript
_getSorting(): HttpParams : la construction pour le tri
_getPagination(): Pagination : la construction pour la pagination
_getParams(): HttpParams : la construction pour la recherche et la pagination
```   

Exemple d'utilisation :

**user.model.ts**

```typescript
export interface User {
   nom: string;
   prenom: string;
};
```

**user.service.ts**

```typescript
import {User} from "./user.model";

@Injectable()
export class UserService extends DaoGeneric<User> {
  private url = `${environment.baseUrl}/user/`;

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getRootUrl(): string {
    return this.url;
  }
}
```

**myapp.component.html**

```html
<app-data-table
      [dataSource]="ds" 
      [extraParams]="extraParams"
      [filterDisplay]="true"
      [placeHolderFilter]="'Rechercher par ...'"
      [toolTipFilter]="'Rechercher par ...'"
      [flexAction]="5" [flexColumn]="90"
      [pageSize]="10" [pageSizesList]="[5,10,25]"
      [columns]="columns" [actions]="actions">
</app-data-table>
```

**myapp.component.ts**

```typescript

@Component({
  selector: 'app-my-component',
  templateUrl: './myapp.component.html'
})
export class MyComponent implements OnInit {
  ds: MatDataSourceGeneric<User> = new MatDataSourceGeneric<User>();

  extraParams: Map<string, string> = new Map<string, string>();
  
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  columns: ColumnDataTable[] = [
    { columnDef: 'nom', header: 'Nom', display: (element: User) => {        
        return user.nom;
      } , sort: true, hidden: false, flex: 15 },
    { columnDef: 'prenom', header: 'Prénom', display: (element: User) => {        
        return user.prenom;
      } , sort: true, hidden: false, flex: 15 },
   ];
   
   actions: ActionDataTable[] = [
    { label: 'Supprimer', tooltip: 'Supprimer l\'utilisateur',  icon: 'delete',
      click: (row) => this.delete(row), flex: 3, }
    ];
   
   constructor(private userSvc: UserService) {
       this.ds.daoService = userSvc;
   }
   
   delete(row: User) {
      // 
   }
      
}
```
