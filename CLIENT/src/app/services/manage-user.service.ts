import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user';
import { local } from '../ENV/envi';
@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http: HttpClient) {}

  getAllUserData(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${local}/admin/user`);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${local}/admin/user${user._id}`, user);
  }
}

