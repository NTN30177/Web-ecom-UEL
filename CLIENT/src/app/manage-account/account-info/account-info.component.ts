import { Component, OnInit } from '@angular/core';
import { AccountInfoService } from '../../services/account-info.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl,FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit {

  userID: any
  userInfoForm!: FormGroup;
  userInfo: IUser | undefined;
  errMessage: string = '';
  successMessage: string = '';

  constructor(
    private accountInfoService: AccountInfoService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private dialogRef: MatDialog,) { }

  ngOnInit(): void {

    this._authService.idUserSubject.subscribe((data) => {
      this.userID = data;
      // console.log(this.userID, 'user id:::')
    });

    this.initForm();
    this.loadUserAccountInfo();
  }

  initForm() {
    this.userInfoForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [{ value: '' }, [Validators.required, Validators.email]],
      gender: [1, Validators.required],
      date_of_birth: ['']
    });
  }

  loadUserAccountInfo() {
    this.accountInfoService.getUserAccountInfo(this.userID).subscribe((response: IUser) => {
      this.userInfo = response;
      // console.log(this.userInfo, "Info:");
      this.userInfoForm.patchValue({
        first_name: this.userInfo.first_name,
        last_name: this.userInfo.last_name,
        phone: this.userInfo.phone,
        email: this.userInfo.email,
        gender: this.userInfo.gender,
        date_of_birth: this.formatDateOfBirthForInput(this.userInfo.date_of_birth)
      });
    });
  }

  formatDateOfBirthForInput(date: Date | null | undefined): string {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') || '' : '';
  }

  updateUserInfo() {
    if (this.userInfoForm.valid) {
      const updatedInfo = this.userInfoForm.value;
      updatedInfo.date_of_birth = new Date(updatedInfo.date_of_birth);

      console.log(updatedInfo)

      // Gọi service để cập nhật thông tin tài khoản
      this.accountInfoService.updateUserAccountInfo(this.userID, updatedInfo)
        .subscribe(
          (response) => {
            this.successMessage = 'Cập nhật thông tin thành công!';
            this.errMessage = '';
            setTimeout(() => {
              this.successMessage = '';
            }, 2000);

          },
          (error) => {
            console.error('Error updating user information:', error);
            this.errMessage = 'Cập nhật thông tin không thành công. Vui lòng thử lại!';
          }
        );
    } else {
      this.userInfoForm.markAllAsTouched();
    }
  }


  openDialog() {
    // Check if there are open dialogs before opening a new one
    if (this.dialogRef.openDialogs.length === 0) {
      const dialogRef = this.dialogRef.open(ChangePasswordComponent, {
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('Dialog result:', result);
      });
    }
  }
}

