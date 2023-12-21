import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { local } from '../ENV/envi';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {
  constructor(private http: HttpClient) { }

  getUserAccountInfo(userID: string) {
    return this.http.get(`${local}/user/account/info?userID=${userID}`);
  }
}
