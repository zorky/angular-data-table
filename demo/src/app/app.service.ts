import {Injectable} from "@angular/core";

import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

import {AppModel} from "./app.model";
import {DaoGeneric} from "./data-table/service/generic-dao";

@Injectable()
export class AppService extends DaoGeneric<AppModel> {
  private url = `${environment.baseUrl}/api/`;

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getRootUrl(): string {
    return this.url;
  }
}
