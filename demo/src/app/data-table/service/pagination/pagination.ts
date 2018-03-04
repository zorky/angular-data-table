import { Injectable } from '@angular/core';

@Injectable()
export class Pagination {
    total = 0;
    totalView = 0;
    list: any[] = [];
}
