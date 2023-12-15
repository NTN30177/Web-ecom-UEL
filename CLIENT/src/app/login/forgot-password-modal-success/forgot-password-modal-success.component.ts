import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password-modal-success',
  templateUrl: './forgot-password-modal-success.component.html',
  styleUrls: ['./forgot-password-modal-success.component.css']
})
export class ForgotPasswordModalSuccessComponent {
  forgotPasswordSuccessForm: FormGroup;
  passwordMismatchError: string = '';
  formSubmitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<ForgotPasswordModalSuccessComponent>, private fb: FormBuilder) { 
    this.forgotPasswordSuccessForm = this.fb.group({
      cus_new_pass: ['', [Validators.required]],
      re_cus_new_pass: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
      this.dialogRef.close();
  }

  resetPassword(): void {
    // Đánh dấu rằng form đã được submit
    this.formSubmitted = true;
  
    // Kiểm tra xem có lỗi không trước khi đặt lại mật khẩu
    const cusNewPassControl = this.forgotPasswordSuccessForm.get('cus_new_pass');
    if (this.forgotPasswordSuccessForm.valid) {
      // Xử lý logic đặt lại mật khẩu ở đây
  
      // Đóng modal khi mọi thứ đều hợp lệ
      this.dialogRef.close();
    } else {
      // Nếu có lỗi, hiển thị thông báo lỗi
      if (cusNewPassControl?.hasError('required')) {
        this.passwordMismatchError = '* Vui lòng nhập mật khẩu';
      } else {
        this.passwordMismatchError = '* Mật khẩu nhập lại không khớp';
      }
    }
  }
  

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('cus_new_pass') as FormControl;
    const confirmPasswordControl = formGroup.get('re_cus_new_pass') as FormControl;

    if (passwordControl.value !== confirmPasswordControl.value) {
      // Nếu mật khẩu không khớp, set cảnh báo cho FormControl
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // Nếu mật khẩu khớp, đảm bảo clear cảnh báo
      confirmPasswordControl.setErrors(null);
    }
  }
}
