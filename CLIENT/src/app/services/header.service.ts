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
export class HeaderService {
  constructor(private _http: HttpClient) {}

  getTypesPopulateSubtypes(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this._http
      .get<any>(`${local}/user/types-populate-subtypes`, requestOptions)
      .pipe(
        map((res) => res),
        retry(3),
        catchError(this.handleError)
      );
  }

  liveSearch(inputValue: any, userId:any): Observable<any> {
    const productsPerPage = 10;
    const slug = 'search';
    const sortType = '';
    const colors = [''];
    const sizes = [''];
    const minPrice = '';
    const maxPrice = '';
    let currentPage = 1;
    const startIndex = (currentPage - 1) * productsPerPage;
    const apiUrl = `${local}/api/searchSortPagination/${slug}?start=${startIndex}&limit=${productsPerPage}&page=${currentPage}&minPrice=${minPrice}&maxPrice=${maxPrice}&color=${colors}&size=${sizes}&keySearch=${inputValue}&sort=${sortType}&userId=${userId}`;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this._http.get<any>(apiUrl, requestOptions).pipe(
      map((res) => res),
      // retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
