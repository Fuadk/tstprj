import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, toODataString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

export abstract class NorthwindService {
    private BASE_URL = 'https://demos.telerik.com/kendo-ui/service-v4/odata/';

    constructor(
        private http: HttpClient,
        protected tableName: string
    ) {
    }

    public fetch(state: State): Observable<GridDataResult> {
        const queryStr = `${toODataString(state)}&$count=true`;

        return this.http
            .get(`${this.BASE_URL}${this.tableName}?${queryStr}`)
            .pipe(
                map(response => (<GridDataResult>{
                    data: response['value'],
                    total: parseInt(response['@odata.count'], 10)
                }))
            );
    }
}

@Injectable()
export class OrdersService extends NorthwindService {
    constructor(http: HttpClient) { super(http, 'Orders'); }
}
