import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  userIdFromHeader: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private _authService: AuthService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar

  ) {
    this._authService.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
     
    });
    this.loginForm = this.fb.group({
      cus_account: [
        '',
        [Validators.required, this.emailOrPhoneNumberValidator()],
      ],
      cus_password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.userIdFromHeader){
      // this.router.navigate(['/']);
    }
  }


  emailOrPhoneNumberValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null; // Value is empty, don't perform further validation
      }

      // Check if it's a valid email or phone number
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const phonePattern = /^0\d{9}$/;

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
              this.renderer.setProperty(
                errorElement,
                'innerHTML',
                '* Vui lòng nhập giá trị.'
              );
            }

            if (inputElement) {
              this.renderer.addClass(inputElement, 'error-input');
            }
          } else if (control.errors['invalidFormat']) {
            if (errorElement) {
              this.renderer.setProperty(
                errorElement,
                'innerHTML',
                '* Vui lòng nhập đúng định dạng Email/SĐT.'
              );
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
  openSnackbar(duration: number): void {
    // Check if this.infoResult is not undefined or null
    if (this.infoResult !== undefined && this.infoResult !== null) {
      // Open a snackbar with the infoResult message
      this.snackBar.open(this.infoResult, 'Đóng', {
        duration: duration, // Use the provided duration value
        verticalPosition: 'top', // Display at the top
        panelClass: ['custom-snackbar'], // Add custom styling if needed
      });
    }
  }

  verifiedLogin() {
    if (this.loginForm.invalid) {
    } else {
      console.log('1235');
      this._authService.verifiedInForUserService(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.infoResult = data.message;
          const duration = data.login ? 700 : 5000;
          this.openSnackbar(duration);

          if (data.login) {
            localStorage.setItem('userData', JSON.stringify(data.userData));
            this._authService.isLoginSubject.next(data.login);
            this._authService.emailUserSubject.next(data.userData.email);
            timer(1000).subscribe(() => {
              this.router.navigate(['/']);
            });
          }
        },
        error: (err) => {
          this.errMessage = err;
          console.log(this.errMessage);
          this.openSnackbar(5000);
        },
      });
      console.log('save');
    }
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

