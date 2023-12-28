import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {IColor, IProduct, ISubType, IType } from '../interfaces/product';

import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { local } from '../ENV/envi';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _http: HttpClient) {}
getProductHomePage(): Observable<any> {
  return this._http.get<any>(`${local}/user/product/`).pipe(
    map((res) => res as IProduct),
    catchError(this.handleError)
  );
}

  

  
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
