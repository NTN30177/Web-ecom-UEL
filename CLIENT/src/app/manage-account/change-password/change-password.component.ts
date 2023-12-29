import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {


    ngOnInit(): void {
      throw new Error('Method not implemented.');
    }



    showPassword: boolean = false;
    togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
    }
}
