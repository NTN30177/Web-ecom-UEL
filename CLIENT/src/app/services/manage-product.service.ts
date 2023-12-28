import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IColor, IProduct, ISubType, IType } from '../interfaces/product';

import { Observable, catchError, map, retry, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ManageProductService {
  local = 'http://localhost:3000';
  cartData = new EventEmitter<IProduct[] | []>();
  submitFeedback: any;

  constructor(private _http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.local}/product`);
  }

  postProduct(product: any): Observable<any> {
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
        `${this.local}/product/add-product`,
        product
        // requestOptions
      )
      .pipe(
        map((res) => JSON.parse(res)),

        catchError(this.handleError)
      );
  }
  getColor(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${this.local}/api/color/`, requestOptions).pipe(
      map((res) => JSON.parse(res) as IColor),
      retry(3),
      catchError(this.handleError)
    );
  }
  getType(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${this.local}/api/type/`, requestOptions).pipe(
      map((res) => JSON.parse(res) as IType),
      retry(3),
      catchError(this.handleError)
    );
  }
  getSubType(typeId: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .get<any>(`${this.local}/api/subType/${typeId}`, requestOptions)
      .pipe(
        map((res) => JSON.parse(res) as ISubType),
        retry(3),
        catchError(this.handleError)
      );
  }
  getCollection(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .get<any>(`${this.local}/api/collection/`, requestOptions)
      .pipe(
        map((res) => JSON.parse(res) as ISubType),
        retry(3),
        catchError(this.handleError)
      );
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  // softDeleteProduct(productId: string): Observable<any> {
  //   const url = `${this.local}/product/soft-delete/${productId}`;
  //   return this._http.patch(url, { is_deleted: true });
  // }

  toggleIsDeleted(productId: string): Observable<any> {
    const url = `${this.local}/product/toggle-soft-deleted/${productId}`;
    return this._http.patch(url, {});
  }

  addFeedback(formData: FormData,productId:any, orderId:any, userId:any): Observable<any> {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    console.log(productId, orderId, '789')
    return this._http
      .post<any>(`${this.local}/product/add-feedback?productId=${productId}&orderId=${orderId}&userId=${userId}`, formData, { headers })
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }
}
