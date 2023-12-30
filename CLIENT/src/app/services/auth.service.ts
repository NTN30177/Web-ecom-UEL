import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError, Subject, BehaviorSubject } from 'rxjs';
import { local } from '../ENV/envi';
import {
  IDistrictDocument,
  IProvinceDocument,
  IWardDocument,
} from '../interfaces/address';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoginObservable: Observable<boolean>;
  private userEmailSource = new BehaviorSubject<any[]>([]);
  userEmail$ = this.userEmailSource.asObservable();

  constructor(private _http: HttpClient) {
    this.isLoginObservable = this.isLoginSubject.asObservable();
  }
  // cartSubject = new Subject<any>();
  idUserSubject = new BehaviorSubject<any>(null);
  isLoginSubject = new BehaviorSubject<any>(null);
  emailUserSubject = new BehaviorSubject<any>(null);
  
  cartSubject = new BehaviorSubject<any>(null);
  updateCart(total_quantity: any) {
    this.cartSubject.next(total_quantity);
  }

  getIsLoginObservable(): Observable<boolean> {
    return this.isLoginObservable;
  }

  getProvince(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${local}/api/province/`, requestOptions).pipe(
      map((res) => JSON.parse(res) as IProvinceDocument),
      retry(3),
      catchError(this.handleError)
    );
  }

  


  getDistrict(provinceId: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    console.log(provinceId);
    return this._http
      .get<any>(`${local}/api/district/${provinceId}`, requestOptions)
      .pipe(
        map((res) => JSON.parse(res) as IDistrictDocument),
        retry(3),
        catchError(this.handleError)
      );
  }
  getWard(districtId: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .get<any>(`${local}/api/ward/${districtId}`, requestOptions)
      .pipe(
        map((res) => JSON.parse(res) as IWardDocument),
        retry(3),
        catchError(this.handleError)
      );
  }

  
  postInfoUser(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    return this._http
      .post<any>(`${local}/user/register`, data, { headers: headers })
      .pipe(catchError(this.handleError));
  }



  verifiedInForUserService(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    console.log('122');
    return this._http
      .post<any>(
        `${local}/user/login`,
        data
        // requestOptions
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }



  // isLoginSubject = new Subject<any>();

  forGotPwProcessService(email: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .get<any>(`${local}/user/forgot-pw/${email}`, requestOptions)
      .pipe(
        map((res) => JSON.parse(res) as IWardDocument),
        retry(3),
        catchError(this.handleError)
      );
  }

  isEmailVerified(email: string): Observable<boolean> {
    return this._http.get<boolean>(`${local}/user/is-email-verified/${email}`);
  }

  resetPw(data: any, email:any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json' // Set the content type to 'application/json'
    );
  
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };

    return this._http.post<any>(`${local}/user/resetPassW?email=${email}`, data, requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  


  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}