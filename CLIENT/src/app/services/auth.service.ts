import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';
import { IDistrictDocument, IProvinceDocument, IWardDocument } from '../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) {}

  getProvince(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${local}/api/province/`,requestOptions).pipe(
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
    console.log(provinceId)
    return this._http.get<any>(`${local}/api/district/${provinceId}`,requestOptions).pipe(
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
    return this._http.get<any>(`${local}/api/ward/${districtId}`,requestOptions).pipe(
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
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .post<any>(
        `${local}/register`,
        data
        // requestOptions
      )
      .pipe(
        map((res) => JSON.parse(res)),
        catchError(this.handleError)
      );
  }
  verifiedInForUser(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    console.log('122')
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

  getUserID(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>(`${local}/user/id`,requestOptions).pipe(
      map((res) => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }
  


  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
