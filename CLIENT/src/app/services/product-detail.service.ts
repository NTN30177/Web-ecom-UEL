import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product';
import { local } from '../ENV/envi';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private _http: HttpClient) { }
  getProductDetail(slug: string): Observable<IProduct[]> {
    return this._http.get<IProduct[]>(`${local}/product/product-detail/${slug}`);
  }
}
