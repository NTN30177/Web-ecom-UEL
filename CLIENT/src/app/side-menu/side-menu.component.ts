import { Component, OnInit } from '@angular/core';
import { AccountInfoService } from '../services/account-info.service';
import { IUser } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit{

  userID :any;
  userName: any

  constructor(private accountInfoService: AccountInfoService,
    private _authServer: AuthService) {
    this._authServer.idUserSubject.subscribe((data) => {
      this.userID = data;
      console.log(data, '1111');
    });
   }
  ngOnInit(): void {
  
    this.loadUserName();
  }

  toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.toggle('show');
    }
  }

  loadUserName() {
    this.accountInfoService.getUserAccountInfo(this.userID).subscribe((data: IUser) => {
          console.log(data,'fsy')
          this.userName = `${data.first_name} ${data.last_name}`;
        },
        (error) => {
          console.error('Error loading user name:', error);
        }
      );
  }
}
