import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IColor, IProduct, ISubType, IType } from '../interfaces/product';

import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private _http: HttpClient) {}

  getChartData1(): Observable<any> {

    const apiUrl =`${local}/admin/chart1`;
    return this._http.get<any>(apiUrl).pipe(
      map((res) => res ),
      catchError(this.handleError)
    );
  }
  getCharYear(day:any): Observable<any> {
    console.log(day, 'day')
    const apiUrl =
      day == 12
        ? `${local}/admin/chartYear?year=${day}`
        : `${local}/admin/chart2?maxDay=${day}`;
    return this._http.get<any>(apiUrl).pipe(
      map((res) => res ),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
