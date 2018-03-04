import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

import {Injectable} from "@angular/core";

import {DaoGeneric} from "./generic.dao";
import {Pagination} from "../pagination";
import {ListParameters} from "./list-parameters";

import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {merge} from "rxjs/observable/merge";
import {startWith} from "rxjs/operators/startWith";
import {catchError} from "rxjs/operators/catchError";
import {switchMap} from "rxjs/operators/switchMap";
import {of} from "rxjs/observable/of";
import {map} from "rxjs/operators/map";
import {finalize} from "rxjs/operators/finalize";
// import {Subscription} from "rxjs/Subscription";

@Injectable()
export class MatDataSourceGeneric<T> {
  private _datasource: MatTableDataSource<T> = new MatTableDataSource<T>();
  private _filterChange: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _sort: MatSort = null;
  private _paginator: MatPaginator = null;
  private _daoService: DaoGeneric<T>;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  set filterValue(value: string) {
    this._filterChange.next(value);
  }

  get filterValue(): string {
    return this._filterChange.value;
  }

  set filterChange(value: BehaviorSubject<string>) {
    this._filterChange = value;
  }

  get filterChange() : BehaviorSubject<string> {
    return this._filterChange;
  }

  set sort(value: MatSort) {
    this._sort = value;
  };

  get sort() : MatSort {
    return this._sort;
  }

  set paginator(value: MatPaginator) {
    this._paginator = value;
  }

  get paginator() : MatPaginator {
    return this._paginator;
  }

  set datasource(value: MatTableDataSource<T>) {
    this._datasource = value;
  }

  get datasource() : MatTableDataSource<T> {
    return this._datasource;
  }

  set daoService(value: DaoGeneric<T>) {
    this._daoService = value;
  }

  /**
   * Appel de DaoGeneric<T>.list(...), en interne : merge() sur sortChange / page / filterChange
   *
   * @param {Map<string, string>} extraParams : complément de paramètre pour la querystring
   * @return {Observable<Pagination>} : renvoie un Observable<Pagination> du merge()
   */
  list(extraParams: Map<string, string> = null) {
    this.loadingSubject.next(true);
    this.loadingSubject.complete();

    return merge(this.sort.sortChange, this.paginator.page, this.filterChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          const search = this.filterValue || '';

          const parameters: ListParameters = {
            limit: this.paginator.pageSize,
            offset: (this.paginator.pageIndex) * (this.paginator.pageSize),

            sort: this.sort.active,
            order: this.sort.direction,

            keyword: search,
            extraParams: extraParams
          };

          return this._daoService!.listItems(parameters);
        }),
        map((data: Pagination) => {
          return data;
        }),
        finalize(() => this.loadingSubject.next(false)),
        catchError(() => {
          return of([]);
        }));
  }
}
