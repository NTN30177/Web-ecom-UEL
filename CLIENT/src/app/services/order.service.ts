import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';
import { IOrders } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<IOrders[]> {
    const headers = new HttpHeaders().set("Content-Type", "application/json"); // Use application/json instead of text/plain
    const requestOptions: Object = {
      headers: headers,
      responseType: "json" // Set responseType to json
    };
  
    return this.http.get<IOrders[]>(`${local}/user/account/order/${userId}`, requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  

  // getFashions(): Observable<any> {
  //   const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
  //   const requestOptions: Object = {
  //     headers: headers,
  //     responseType: "text"
  //   }
  //   return this._http.get<any>(`${this.url}/fashions`, requestOptions).pipe(
  //     map(res => JSON.parse(res) as Array<Fashion>),
  //     retry(3),
  //     catchError(this.handleError))
  // }

  getOrderDetails(orderId: string): Observable<any> {
    return this.http.get<any>(`${local}/order-details/${orderId}`);
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
