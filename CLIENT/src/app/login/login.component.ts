import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('cusAccount') cusAccountInput: ElementRef | undefined;
  @ViewChild('cusPassword') cusPasswordInput: ElementRef | undefined;
  
  loginForm: FormGroup;
  infoResult: string | undefined;
  errMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private _authService: AuthService,
    private renderer: Renderer2

  ) {
    this.loginForm = this.fb.group({
      cus_account: [
        '',
        [Validators.required, this.emailOrPhoneNumberValidator()],
      ],
      cus_password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  emailOrPhoneNumberValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null; // Value is empty, don't perform further validation
      }

      // Check if it's a valid email or phone number
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const phonePattern = /^0\d{9}$/

      const isValidEmail = emailPattern.test(value);
      const isValidPhone = phonePattern.test(value);

      if (!isValidEmail && !isValidPhone) {
        return { invalidFormat: true };
      }

      return null; // Validation passed
    };
  }

  login() {
    // Mark all controls as touched to trigger validation messages
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      // Clear error messages and remove error class for all controls
      Object.keys(this.loginForm.controls).forEach((field) => {
        const errorElement = this.renderer.selectRootElement(`#${field}_error`);
        const inputElement = this.renderer.selectRootElement(`#${field}`);

        if (errorElement) {
          this.renderer.setProperty(errorElement, 'innerHTML', '');
        }

        if (inputElement) {
          this.renderer.removeClass(inputElement, 'error-input');
        }
      });

      // Redirect to "dangky" page upon successful login
      // this.router.navigate(['/register']);
    } else {
      // Show error messages and apply red border for each invalid field
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        const errorElement = this.renderer.selectRootElement(`#${field}_error`);
        const inputElement = this.renderer.selectRootElement(`#${field}`);

        // Clear error messages and remove error class for all controls
        if (errorElement) {
          this.renderer.setProperty(errorElement, 'innerHTML', '');
        }

        if (inputElement) {
          this.renderer.removeClass(inputElement, 'error-input');
        }

        if (control && control.errors) {
          if (control.errors['required']) {
            if (errorElement) {
              this.renderer.setProperty(errorElement, 'innerHTML', '* Vui lòng nhập giá trị.');
            }

            if (inputElement) {
              this.renderer.addClass(inputElement, 'error-input');
            }
          } else if (control.errors['invalidFormat']) {
            if (errorElement) {
              this.renderer.setProperty(errorElement, 'innerHTML', '* Vui lòng nhập đúng định dạng Email/SĐT.');
            }

            if (inputElement) {
              this.renderer.addClass(inputElement, 'error-input');
            }
          }
        }
      });
    }
    this.verifiedLogin();
  }
  verifiedLogin() {
    if (this.loginForm.invalid) {
      alert('Vui lòng kiểm tra lại thông tin form');
    } else {
      this._authService.verifiedInForUser(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.infoResult = data.message;
          this.openInfoResultModal(); // Mở modal với thông tin kết quả
          setTimeout(() => {
            this.infoResult = undefined;
          }, 5000);
        },
        error: (err) => {
          this.errMessage = err;
          console.log(this.errMessage);
        },
      });
    }
  }

  openInfoResultModal(): void {
    const dialogRef = this.dialog.open(InfoResultModalComponent, {
      width: '500px',
      data: { infoResult: this.infoResult },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  
  openForgotPasswordDialog(): void {
    // Open the modal when the "Quên mật khẩu?" link is clicked
    const dialogRef = this.dialog.open(ForgotPasswordModalComponent, {
      width: '70%',
    });

    // Handle the modal close event if needed
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  // Khai báo biến showPassword và khởi tạo nó là false
  showPassword: boolean = false;

  // Hàm để chuyển đổi giữa hiển thị và ẩn mật khẩu
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

//Popup hiển thị kết quả đăng nhập
@Component({
  selector: 'app-info-result-modal',
  template: `
    <div style="padding: 20px; text-align: center; font-size:20px; font-family: 'Montserrat', sans-serif; padding-top: 80px; padding-bottom: 80px; color: black">
      {{ data.infoResult }}
    </div>
  `,
})
export class InfoResultModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { infoResult: string },
    public dialogRef: MatDialogRef<InfoResultModalComponent>
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close(); // Tắt modal sau 5 giây
    }, 5000);
  }
}