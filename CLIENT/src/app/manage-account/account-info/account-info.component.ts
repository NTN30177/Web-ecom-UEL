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
  userID = '65830fbb6e84f0388d3e7b6b';
  userInfoForm!: FormGroup;
  userInfo: IUser | undefined;// Use the IUser interface
  constructor(private accountInfoService: AccountInfoService, private datePipe: DatePipe, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserAccountInfo();
  }


  initForm() {
    this.userInfoForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [{ value: ''}, [Validators.required, Validators.email]],
      gender: [0, Validators.required],
      date_of_birth: ['']
    });
  }

  // loadUserAccountInfo() {
  //   this.accountInfoService.getUserAccountInfo(this.userID)
  //     .subscribe((data: any) => {
  //       this.userInfo = data;
  //       this.formatDateOfBirth(); // Format date of birth after retrieving data
  //     });
  // }


  // loadUserAccountInfo() {
  //   this.accountInfoService.getUserAccountInfo(this.userID)
  //     .subscribe((data: any) => {
  //       this.userInfo = data;
  //       // Update form values when user data is loaded
  //       this.userInfoForm.patchValue({
  //         first_name: this.userInfo.first_name,
  //         last_name: this.userInfo.last_name,
  //         phone: this.userInfo.phone,
  //         email: this.userInfo.email,
  //         gender: this.userInfo.gender,
  //         date_of_birth: this.formatDateOfBirthForInput(this.userInfo.date_of_birth)
  //       });
  //     });
  // }

  loadUserAccountInfo() {
    this.accountInfoService.getUserAccountInfo(this.userID).subscribe((response: IUser) => {
      this.userInfo = response;
      console.log(this.userInfo);
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




  // formatDateOfBirthForInput(isoDateString: string | null): string {
  //   if (isoDateString) {
  //     const date = new Date(isoDateString);
  //     // Format the date for the input type="date"
  //     return date.toISOString().split('T')[0];
  //   }
  //   return '';
  // }

  formatDateOfBirthForInput(date: Date | null): string {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') || '' : '';
  }



  // updateUserInfo() {
  //   if (this.userInfoForm.valid) {
  //     // Implement your update logic here
  //     console.log('Update user info:', this.userInfoForm.value);
  //   } else {
  //     this.userInfoForm.markAllAsTouched();
  //   }
  // }

  // submitForm() {
  //   if (this.userInfoForm.valid) {
  //     // Implement form submission logic here
  //     console.log('Form submitted successfully!');
  //     // Access form values using this.userInfoForm.value
  //   } else {
  //     // Mark form controls as touched to display validation messages
  //     this.userInfoForm.markAllAsTouched();
  //   }
  // }
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
            // Cập nhật lại dữ liệu hiển thị nếu cần
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

