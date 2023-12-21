import { Component, OnInit } from '@angular/core';
import { AccountInfoService } from '../../services/account-info.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit{
  userID = '65830fbb6e84f0388d3e7b6b';
  userInfo: any = {};

  constructor(private accountInfoService: AccountInfoService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadUserAccountInfo();
  }

  loadUserAccountInfo() {
    this.accountInfoService.getUserAccountInfo(this.userID)
      .subscribe((data: any) => {
        this.userInfo = data;
        this.formatDateOfBirth(); // Format date of birth after retrieving data
      });
  }

  formatDateOfBirth() {
    if (this.userInfo.date_of_birth) {
      // Format the date using Angular's DatePipe
      this.userInfo.date_of_birth = this.datePipe.transform(this.userInfo.date_of_birth, 'dd/MM/yyyy');
    }
  }
}
