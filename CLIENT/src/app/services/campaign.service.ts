import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Campaign } from '../interfaces/campaign';
import { local } from '../ENV/envi';





@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignsUrl = 'assets/data/campaigns.json'


  constructor(private _http: HttpClient) { }

  getCampaigns(): Observable<Campaign[]> {
    return this._http.get<Campaign[]>(this.campaignsUrl);
  }

  postCampaigns(campaign: any): Observable<any> {
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
        `${local}/campaign/create-campaign`,
        campaign,
        requestOptions
      )
      .pipe(
        map((res) => JSON.parse(res)),

        catchError(this.handleError)
      );
  }

  getProducts(): Observable<any> {
    return this._http.get<any>(`${local}/campaign/products`)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }


}
