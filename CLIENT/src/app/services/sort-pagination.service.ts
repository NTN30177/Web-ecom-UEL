import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { local } from '../ENV/envi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IColor } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class SortPaginationService {

  constructor(private _http: HttpClient) { }
  
  sort(colors:any,sizes:any, minPrice:any, maxPrice:any, sortType:any, slug:any, productsPerPage:any, currentPage:any ): Observable<any> {
    const inputValue='' 
    const userId=''
    const apiUrl = `${local}/api/searchSortPagination/${slug}?productsPerPage=${productsPerPage}&page=${currentPage}&minPrice=${minPrice}&maxPrice=${maxPrice}&color=${colors}&size=${sizes}&keySearch=${inputValue}&sort=${sortType}&userId=${userId}`;
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
      
    );
  }
  getColor(): Observable<IColor[]> {
    return this._http.get<IColor[]>(`${local}/api/color2`);
  }
}
