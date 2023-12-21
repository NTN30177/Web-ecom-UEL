import { Component, OnInit } from '@angular/core';
import { AccountInfoService } from '../services/account-info.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit{

  userID = '65830fbb6e84f0388d3e7b6b';
  userName: any

  constructor(private accountInfoService: AccountInfoService) { }
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
    this.accountInfoService.getUserAccountInfo(this.userID)
      .subscribe(
        (data: any) => {
          this.userName = `${data.first_name} ${data.last_name}`;
        },
        (error) => {
          console.error('Error loading user name:', error);
        }
      );
  }
}
