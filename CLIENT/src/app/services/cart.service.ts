import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {ICartItem, IColor, IProduct, ISubType, IType } from '../interfaces/product';

import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private _http: HttpClient) {}


  getProductCart(userIdFromHeader:any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${local}/cart/product/${userIdFromHeader}`,requestOptions).pipe(
      map((res) => JSON.parse(res) as IProduct),
      retry(3),
      catchError(this.handleError)
    );
  }
  putProductItemCart(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json', // Change this to 'json'
    };
    
    console.log(data,'444')
    return this._http
      .put<any>(
        `${local}/cart/product/${data.userId}`,
        JSON.stringify(data),
        requestOptions
      )
      .pipe(
        map((res) => (res)),
        retry(3),
        // map((res) => JSON.parse(res)),
       
        catchError(this.handleError)
      );
  }

  
  

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
  
}
