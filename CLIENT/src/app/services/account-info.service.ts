import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { local } from '../ENV/envi';
import { IUser } from '../interfaces/user';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {
  constructor(private http: HttpClient) { }

  // getUserAccountInfo(userID: string) {
  //   return this.http.get(`${local}/user/account/info?userID=${userID}`).pipe(
  //     map((response: IUser) => response as IUser)
  //   )
  // }
  getUserAccountInfo(userID: string): Observable<IUser> {
    return this.http.get<IUser>(`${local}/user/account/info?userID=${userID}`);
  }

  updateUserAccountInfo(userID: string, updatedInfo: any): Observable<any> {
    // Gửi HTTP PUT request đến server với dữ liệu cập nhật
    return this.http.put(`${local}/user/account/info/update/${userID}`, updatedInfo);
  }
}
