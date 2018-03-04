/**
 * Pour les components.ts qui en auraient besoin, classe utilitaire
 * par héritage / pattern hollywood
 * getList() est à implémenter
 */

import {Pagination} from "./pagination";

export abstract class PaginationBase {
  public MAX_ITEMS = 5;
  public pager: any = {};
  public pagination: Pagination = new Pagination();
  public page = 1;
  public total = 0;
  public totalView = 0;

  /**
   * A implémenter : obtient la liste sur la page 'page'
   * @param page la page souhaitée
   */
  abstract getList(page: number);

  public changePage(page) {
    this.getList(page);
  }
}
