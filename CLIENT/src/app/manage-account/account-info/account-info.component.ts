import { Component, OnInit } from '@angular/core';
import { AccountInfoService } from '../../services/account-info.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit {




  userID: any
  userInfoForm!: FormGroup;
  userInfo: IUser | undefined;// Use the IUser interface
  notification: { message: string, type: 'success' | 'error' } | null = null;

  constructor(private accountInfoService: AccountInfoService, private datePipe: DatePipe, private formBuilder: FormBuilder) { }

  ngOnInit(): void {


    // Set the user ID in the service
    const userdataString = localStorage.getItem('userData');
    if (userdataString) {
      const userdata = JSON.parse(userdataString);
      this.accountInfoService.setUserId(userdata._id);

      // Subscribe to the userId$ observable to get updates
      this.accountInfoService.userId$.subscribe(userId => {
        this.userID = userId;
        console.log('User ID:', this.userID);
      });
    }

    this.initForm();
    this.loadUserAccountInfo();
  }

  initForm() {
    this.userInfoForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [{ value: '' }, [Validators.required, Validators.email]],
      gender: [0, Validators.required],
      date_of_birth: ['']
    });
  }


  loadUserAccountInfo() {
    this.accountInfoService.getUserAccountInfo(this.userID).subscribe((response: IUser) => {
      this.userInfo = response;
      console.log(this.userInfo, "Info:");
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


  // formatDateOfBirthForInput(date: Date | null): string {
  //   return date ? this.datePipe.transform(date, 'yyyy-MM-dd') || '' : '';
  // }

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
            console.log('User information updated successfully:', response);
            // Cập nhật lại dữ liệu hiển thị 
            // 1. Update local data
            this.userInfo = { ...this.userInfo, ...updatedInfo };

            // 2. Update the form with new values
            this.userInfoForm.patchValue({
              first_name: this.userInfo?.first_name,
              last_name: this.userInfo?.last_name,
              phone: this.userInfo?.phone,
              email: this.userInfo?.email,
              gender: this.userInfo?.gender,
              date_of_birth: this.formatDateOfBirthForInput(this.userInfo?.date_of_birth)
            });
            this.showNotification('Update successful', 'success');

            // Auto-dismiss the notification after 3 seconds
            setTimeout(() => {
              this.notification = null;
            }, 3000);

          },
          (error) => {
            console.error('Error updating user information:', error);
            // Xử lý lỗi nếu cần
          }
        );
    } else {
      this.userInfoForm.markAllAsTouched();
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.notification = { message, type };
  }

  submitForm() {
    if (this.userInfoForm.valid) {
      // Implement form submission logic here
      console.log('Form submitted successfully!');
      // Access form values using this.userInfoForm.value
    } else {
      this.userInfoForm.markAllAsTouched();
    }
  }
}

