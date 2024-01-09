import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserAddress } from '../interfaces/user';
import { local } from '../ENV/envi';

@Injectable({
  providedIn: 'root'
})
export class AccountAddressService {

  constructor(private http: HttpClient) { }

  getUserAddressList(userId: string): Observable<IUserAddress[]> {
    return this.http.get<IUserAddress[]>(`${local}/user/account/address/${userId}`);
  }


  addAddress(address: any, userID: string): Observable<any> {
    return this.http.post(`${local}/user/account/address/add-address`, { address, userID });
  }
  
  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${local}/user/account/address/${addressId}`);
  }

  setDefaultAddress(userId: string, addressId: string): Observable<any> {
    // const url = `${local}/user/account/address/set-default`;
    return this.http.put(`${local}/user/account/address/set-default`, { userId, addressId });
  }
}
