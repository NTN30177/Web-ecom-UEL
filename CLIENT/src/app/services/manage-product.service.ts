import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

import { Observable, catchError, map, retry, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ManageProductService {
  cartData = new EventEmitter<Product[]|[]>()
  constructor(private _http: HttpClient) {}
  
  postBook(aBook: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .post<any>(
        'http://localhost:3000/product/add-product',
        JSON.stringify(aBook),
        requestOptions
      )
      .pipe(
        map((res) => JSON.parse(res) ),
        retry(3),
        catchError(this.handleError)
      );
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
 
}
  