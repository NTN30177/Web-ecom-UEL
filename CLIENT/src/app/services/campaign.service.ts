import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../interfaces/campaign';




@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignsUrl = 'assets/data/campaigns.json'

  constructor(private http: HttpClient) { }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.campaignsUrl);
  }


}
