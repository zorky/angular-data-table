import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from "rxjs/Observable";

import {Pagination} from "../pagination";
import {catchError, map} from "rxjs/operators";
import 'rxjs/add/observable/throw';

import {TemplateObject} from './';
import {ListParameters} from "./list-parameters";

import {ErrorObservable} from "rxjs/observable/ErrorObservable";

/**
 * DaoGeneric : fourniture d'un CRUD sur un type T
 *
 * Utile pour le MatDataSource sur le list()
 */
export abstract class DaoGeneric<T> {
  constructor(private http: HttpClient) {

  }

  /**
   * Pour obtenir l'url "root" de l'API souhaitée
   *
   * Exemple : `${environment.baseUrl}/projets/categories/`;
   * @return {string}
   */
  abstract getRootUrl(): string;

  /**
   * Obtient la liste d'objects T sous forme de Pagination
   *
   * @param {string} sort : champ de tri [optionnel]
   * @param {string} order : si 'sort', ordre du tri : asc | desc [optionnel]
   * @param {number} limit : nb. max d'éléments à ramener
   * @param {number} offset : démarre la pagination à partir de 'offset'
   * @param {Map<string, string>} extraParams : extra paramètres à passer à la requête API [optionnel]
   * @param {string} keyword : [optionnel] mot de recherche le cas échéant (!= '')
   * @return {Observable<Pagination>} : un objet Pagination des éléments trouvés
   */
  list(sort: string, order: string, limit: number, offset: number, extraParams: Map<string, string> = null, keyword = '') : Observable<Pagination> {
    let params = this._getParams(limit, offset, keyword, extraParams);
    const url = this.getRootUrl();

    if(sort && sort !== '') {
      params = this._getSorting(sort, order, params);
    }

    return this.http
      .get<T[]>(url, {params: params})
      .pipe(map(response => this._getPagination(response, limit)));
  }

  /**
   * Obtient la liste d'objects T sous forme de Pagination
   *
   * @param {ListParameters} parameters : paramètre pour l'obtention de la liste (sorting, pagination, mot de recherche, extra paramètres)
   * @return {Observable<Pagination>}
   */
  listItems(parameters: ListParameters): Observable<Pagination> {
    return this.list(parameters.sort, parameters.order, parameters.limit, parameters.offset, parameters.extraParams, parameters.keyword);
  }

  /**
   * Liste de tous les éléments
   * @return {Observable<Pagination>}
   */
  listAllItems() : Observable<Pagination> {
    return this.list('', '', 0, 0, null);
  }

  /**
   * Obtient un objet (GET)
   * @param id l'id de l'objet à obtenir
   * @return {Observable<any>}
   */
  public get(id): Observable<any> {
    const url = this._getUrl(id);

    return this.http.get(url).pipe(catchError((error: any) =>  this._throwObservable(error)));
  }

  /**
   * Création d'un objet (POST)
   * @param object
   * @return {Observable<any>}
   */
  public create(object): Observable<any> {
    const url = this._getUrl();

    return this.http.post(url, JSON.stringify(object)).pipe(catchError((error: any) => this._throwObservable(error)));
  }

  /**
   * Màj d'un objet (PUT)
   *
   * @param object : doit contenir la propriété 'id'
   * @return {Observable<any>}
   */
  public update(object): Observable<any> {
    const url = this._getUrl(object.id);

    return this.http.put(url, object).pipe(catchError((error: any) =>  this._throwObservable(error)));
  }

  /**
   * Suppression d'un objet
   * @param object : doit contenir la propriété 'id'
   * @returns {Observable<any>}
   */
  public delete(object): Observable<any> {
    const url = this._getUrl(object.id);

    return this.http.delete(url).pipe(catchError((error: any) =>  this._throwObservable(error)));
  }

  /******************************
   * PRIVATE METHODS
   *
   *******************************/

  /**
   * Obtient l'URL
   * @param {any} id [optionnel] id nécessaire pour le get/update/remove
   * @return {string}
   */
  private _getUrl(id = null) {
    let url = this.getRootUrl();

    if(id !== null) {
      url = `${url}${id}/`;
    }

    return url;
  }

  /**
   * Création de l'object Pagination
   * @param response : retour JSON  de type TemplateObject { count: n, results: [{}] }
   * @param limit : limite de la liste d'objets ramenés, si limit null | 0 : la pagination n'est pas activée
   * @return {Pagination}
   * @private
   */
  protected _getPagination(response, limit) {
    const pagination: Pagination = new Pagination();

    if('results' in response && limit > 0) {
      const list = response as TemplateObject;
      pagination.total = list.count;
      pagination.list = list.results;
      pagination.totalView = pagination.list.length;
    } else {
      const list = response as T[];
      pagination.total = list.length;
      pagination.list = list;
      pagination.totalView = list.length;
    }

    return pagination;
  }

  protected _getParams(limit: number, offset: number, keyword: string, extraQS: Map<string,any> = null) {
    let params: HttpParams = this._getUrlHttpParams(extraQS);
    if (limit > 0) {
      params = params.set('limit', limit.toString()).set('offset', offset.toString());
    }

    if (keyword && keyword !== '') {
      params = params.set('search', keyword);
    }

    return params;
  }

  protected _getSorting(sort: string, order: string, params: HttpParams) {
    let orderDirection = '';
    let orderField = '';
    if(order) {
      switch(order) {
        case 'asc':
          orderDirection = '';
          break;
        case 'desc':
          orderDirection = '-';
          break;
      }
    }

    if(sort) {
      orderField = `${orderDirection}${sort}`;
      params = params.set('ordering', orderField);
    }

    return params;
  }

  private _getUrlHttpParams(extraQS: Map<string, string>): HttpParams {
    let urlQS = new HttpParams();

    if(extraQS !== null) {
      extraQS.forEach((v,k) => {
        urlQS = urlQS.set(k, v);
      })
    }

    return urlQS;
  }

  private _throwObservable(error: any) {
    console.log("error : ", error);
    // return ErrorObservable.throw(error.error || `Server error : ${error} ${JSON.stringify(error)}`);
    return Observable.throw(error.error || `Server error : ${error} ${JSON.stringify(error)}`)
  }
}
