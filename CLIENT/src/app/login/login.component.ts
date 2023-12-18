import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';
import { ReactiveFormsModule } from '@angular/forms';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,    public dialog: MatDialog // Inject MatDialog
  ) {
    this.loginForm = this.fb.group({
      'cus_account': ['', [Validators.required, this.emailOrPhoneNumberValidator()]],
      'cus_password': ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  
  emailOrPhoneNumberValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null; // Value is empty, don't perform further validation
      }

      // Check if it's a valid email or phone number
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const phonePattern = /^\d{10}$/; // Adjust the pattern according to your needs

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
    Object.keys(this.loginForm.controls).forEach(field => {
      const errorElement = document.getElementById(`${field}_error`);
      const inputElement = document.getElementById(field);

      if (errorElement) {
        errorElement.innerHTML = '';
      }

      if (inputElement) {
        inputElement.classList.remove('error-input');
      }
    });

    // Redirect to "dangky" page upon successful login
    this.router.navigate(['/register']);
  } else {
    // Show error messages and apply red border for each invalid field
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      const errorElement = document.getElementById(`${field}_error`);
      const inputElement = document.getElementById(field);

      // Clear error messages and remove error class for all controls
      if (errorElement) {
        errorElement.innerHTML = '';
      }

      if (inputElement) {
        inputElement.classList.remove('error-input');
      }

      if (control && control.errors) {
        if (control.errors['required']) {
          if (errorElement) {
            errorElement.innerHTML = '* Vui lòng nhập giá trị.';
          }

          if (inputElement) {
            inputElement.classList.add('error-input');
          }
        } else if (control.errors['invalidFormat']) {
          if (errorElement) {
            errorElement.innerHTML = '* Vui lòng nhập đúng định dạng Email/SĐT.';
          }

          if (inputElement) {
            inputElement.classList.add('error-input');
          }
        }
      }
    });
  }
}


  openForgotPasswordDialog(): void{
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
