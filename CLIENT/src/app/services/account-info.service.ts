import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { local } from '../ENV/envi';
import { IUser } from '../interfaces/user';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {
  constructor(private http: HttpClient) { }
  
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  setUserId(userId: string): void {
    this.userIdSubject.next(userId);
  }

  getUserAccountInfo(userID: string): Observable<IUser> {
    return this.http.get<IUser>(`${local}/user/account/info?userID=${userID}`);
  }

  updateUserAccountInfo(userID: string, updatedInfo: any): Observable<any> {
    // Gửi HTTP PUT request đến server với dữ liệu cập nhật
    return this.http.put(`${local}/user/account/info/update/${userID}`, updatedInfo);
  }
}
