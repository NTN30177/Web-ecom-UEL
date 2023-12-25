import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {ICartItem, IColor, IProduct, ISubType, IType } from '../interfaces/product';

import { BehaviorSubject, Observable, catchError, map, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';
import { IUserAddress } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private _http: HttpClient) {}


  saveOrder(data: any): Observable<any> {
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
        `${local}/cart/saveOrder`,
        JSON.stringify(data),
        requestOptions
      )
      .pipe(
        map((res) => (res)),
        retry(3),
       
        catchError(this.handleError)
      );
  }
  getAddress2(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json', // Change this to 'json'
    };
    
    return this._http
      .get<any>(
        `${local}/user/account/address/${data}`
      )
      .pipe(
        map((res) => (res)),
        retry(3),
       
        catchError(this.handleError)
      );
  }

  getAddress(userId: string): Observable<IUserAddress[]> {
    return this._http.get<IUserAddress[]>(`${local}/user/account/address?userId=${userId}`);
  }
  

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
  
}
