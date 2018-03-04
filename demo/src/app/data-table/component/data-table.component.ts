import {AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatPaginator, MatSort, MatTable} from "@angular/material";

import {ColumnDataTable} from "./data-table-column";
import {ActionDataTable} from "./data-table-action";
import {Pagination} from "../service/pagination";

import {MatDataSourceGeneric} from "../service/generic-dao";

import {Subscription} from "rxjs/Subscription";
import {distinctUntilChanged} from "rxjs/operators/distinctUntilChanged";
import {filter} from "rxjs/operators/filter";
import {fromEvent} from "rxjs/observable/fromEvent";
import {debounceTime} from "rxjs/operators/debounceTime";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {finalize} from "rxjs/operators/finalize";
// import {tap} from "rxjs/operators/tap";
import {catchError} from "rxjs/operators/catchError";
import {of} from "rxjs/observable/of";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Source de données
   * Contient la fonction list(), et les éléments pour le sort et pagination
   * @type {MatDataSourceGeneric<T>} générique MatDataSourceGeneric<T>
   */
  @Input()
  dataSource: MatDataSourceGeneric<any> = null;

  /**
   * Les colonnes à afficher
   * @type {null}
   */
  @Input()
  columns: ColumnDataTable[] = null;

  /**
   * Complète la querystring, <clé, valeur>
   * @type {null}
   */
  @Input()
  extraParams: Map<string, string> = null;

  /**
   * Les actions possibles pour une ligne
   * @type {null}
   */
  @Input()
  actions: ActionDataTable[] = null;

  /**
   * Taille max de la page, nb. d'éléments / page
   * @type {number} par défaut 10
   */
  @Input()
  pageSize: number = 10;

  /**
   * Choix du nombre max d'éléments / page
   * @type {number[]} par défaut [5, 10, 25]
   */
  @Input()
  pageSizesList: number[] = [5, 10, 25];

  @Input()
  flexColumn: number = 90;

  @Input()
  flexAction: number = 5;

  /**
   * Affichage de la recherche ?
   * Par défaut oui
   * @type {boolean}
   */
  @Input()
  filterDisplay: boolean = true;

  /**
   * à partir de combien de car. la recherche se déclenche-t-elle ?
   * Par défaut >= 3
   * @type {number}
   */
  @Input()
  minFilter: number = 3;

  @Input()
  placeHolderFilter: string = "Recherche";

  @Input()
  toolTipFilter: string = "au moins 3 caractères";

  @Input()
  showLoader: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('filter') filter: ElementRef;

  private filterChange = new BehaviorSubject('');

  /**
   * Rechargement des données (appel dataSource.list())
   */
  reload() {
    if (this.dataSource.paginator !== null) {
      this.dataSource.paginator.pageIndex = 0;
    }

    this.getList();
  }

  total = 0;

  subSort: Subscription;
  subPage: Subscription;
  subFilter: Subscription;
  subList: Subscription;

  loading: boolean = false;

  /**
   * Obtention des colonnes (colonne et actions) à afficher
   * => columnDef ou sortField si défini
   * @return {any[]}
   */
  get displayedColumns() {
    let columns = [];
    if (this.columns) {
      columns = this.columns.map(c => {
        if (c.sortField) {
          return c.sortField;
        }

        return c.columnDef;
      });
    }

    let actions = [];
    if (this.actions) {
      actions = this.actions.map(a => a.label);
    }

    return [...columns, ...actions];
  }

  /**
   * Calcul de la largeur flex pour une colonne champ ou action
   * @param type
   * @param colaction
   * @param row
   * @return {string}
   */
  flexWidth(type, colaction, row) {
    let pourcent = '10%';

    switch (type) {
      case 'column' :
        pourcent = `${this.flexColumn}%`;
        break;
      case 'action' :
        pourcent = `${this.flexAction}%`;
        break;
    }

    if (colaction && colaction.flex) {
      pourcent = `${colaction.flex}%`;
    }

    return pourcent;
  }

  /**
   * Obtention de la couleur, appel de la fonction "color(element)" si définie
   * @param {ColumnDataTable} column : pour obtenir la fonction color
   * @param row : l'objet à afficher
   * @return {any} la couleur, par défaut noire (#000000) si indéfinie
   */
  getColor(column: ColumnDataTable, row) {
    if(column) {
      if(column.color && typeof column.color === 'function') {
        return column.color.call(null, row);
      }
    }

    return '#000000';
  }

  /**
   * Obtention de la tooltip le cas échéant
   * @param {ColumnDataTable} column
   * @param row
   */
  getTooltip(column: ColumnDataTable, row) {
    if(column) {
      if(column.tooltip && typeof column.tooltip === 'function') {
        return column.tooltip.call(null, row);
      }
    }

    return '';
  }

  ngAfterViewInit(): void {
    if(this.filterDisplay) {
      fromEvent(this.filter.nativeElement, 'keyup')
        .pipe(debounceTime(400),
          distinctUntilChanged(),
          filter(() => {
            return this.filter.nativeElement.value.length >= this.minFilter || this.filter.nativeElement.value.length === 0;
          }))
        .subscribe(() => {
          let filterValue = this.filter.nativeElement.value;
          filterValue = filterValue.trim().toLowerCase();

          this.paginator.pageIndex = 0;

          this.dataSource.filterChange.next(filterValue);
        });
    }

    this.getList();
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterChange = this.filterChange;

    this.dataSource.loading$.subscribe((val) => console.log('loading ', val));
  }

  unsubscribeSubscription() {
    if (this.subList) {
      this.subList.unsubscribe();
    }

    if (this.subSort) {
      this.subSort.unsubscribe();
    }

    if (this.subPage) {
      this.subPage.unsubscribe();
    }

    if (this.subFilter) {
      this.subFilter.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeSubscription();
  }

  onSortPageFilterChange() {
    if (this.dataSource.sort !== null) {
      this.subSort = this.dataSource.sort.sortChange.subscribe(() => {
        this.toggleLoading(true);
        if (this.dataSource.paginator !== null) {
          this.dataSource.paginator.pageIndex = 0;
        }
      });
    }

    if (this.dataSource.paginator !== null) {
      this.dataSource.paginator.page.subscribe(() => this.toggleLoading(true));
    }

    if (this.dataSource.filterChange !== null) {
      this.dataSource.filterChange.subscribe(() => this.toggleLoading(true));
    }
  }

  getList() {
    this.unsubscribeSubscription();

    this.onSortPageFilterChange();

    this.subList = this.dataSource
      .list(this.extraParams)
      .pipe(
        // tap(() => this.toggleLoading(true)),
        finalize( () => this.toggleLoading(false)),
        catchError(() => {
          this.toggleLoading(false);
          return of([]);
        }))
      .subscribe((data: Pagination) => {
        this.toggleLoading(false);

        this.total = data.total;
        this.dataSource.datasource.data = data.list;
    });
  }

  /**
   * Activation spinner si option activée
   * @param value
   */
  toggleLoading(value) {
    if (this.showLoader) {
      setTimeout(() => this.loading = value);
    }
  }
}

