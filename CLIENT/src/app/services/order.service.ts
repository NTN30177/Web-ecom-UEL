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
  getOrders(): Observable<IOrders[]> {
    const headers = new HttpHeaders().set("Content-Type", "application/json"); // Use application/json instead of text/plain
    const requestOptions: Object = {
      headers: headers,
      responseType: "json" // Set responseType to json
    };
  
    return this.http.get<IOrders[]>(`${local}/order/manage-orders`, requestOptions).pipe(
      retry(3),
      catchError((error) => {
        console.error('Error in getOrders:', error);
        return this.handleError(error);
      })
    );
  }
  



  getOrderDetails(orderId: string): Observable<any> {
    console.log(orderId,'oiddd')
    return this.http.get<any>(`${local}/order/order-details/${orderId}`);
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }
}
