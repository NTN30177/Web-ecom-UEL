import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordMismatchError: string = '';

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.setDefaultValues();
  }

  initForm() {
    this.registerForm = this.fb.group({
      'cus_firstname': ['', Validators.required],
      'cus_lastname': ['', Validators.required],
      'cus_email': ['', [Validators.required, this.emailValidator()]],
      'cus_phonenumber': ['', [Validators.required, this.phonenumberValidator()]],
      'cus_dob': ['', Validators.required],
      'cus_gender': ['', Validators.required],
      'cus_region_id': ['', Validators.required],
      'cus_district_id': ['', Validators.required],
      'cus_ward_id': ['', Validators.required],
      'cus_address_id': ['', Validators.required],
      'cus_password': ['', Validators.required],
      'cus_reenterpassword': ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  // Getter for easy access to form controls
  get formControls() {
    return this.registerForm.controls;
  }

  setDefaultValues() {
    this.registerForm.get('cus_gender')?.setValue(0);
    this.registerForm.get('cus_region_id')?.setValue(0);
    this.registerForm.get('cus_district_id')?.setValue(0);
  }



  emailValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null; // Value is empty, don't perform further validation
      }

      // Check if it's a valid email
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValidEmail = emailPattern.test(value);

      if (!isValidEmail) {
        return { invalidEmailFormat: true };
      }

      return null; // Validation passed
    };
  }

  phonenumberValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null; // Value is empty, don't perform further validation
      }

      // Check if it's a valid phone number starting with 0
      const phonePattern = /^0\d{9}$/; // Adjust the pattern according to your needs
      const isValidPhone = phonePattern.test(value);

      if (!isValidPhone) {
        return { invalidPhoneFormat: true };
      }

      return null; // Validation passed
    };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('cus_password') as FormControl;
    const confirmPasswordControl = formGroup.get('cus_reenterpassword') as FormControl;

    if (passwordControl.value !== confirmPasswordControl.value) {
      // If passwords do not match, set a warning for FormControl
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // If passwords match, make sure to clear the warning
      confirmPasswordControl.setErrors(null);
    }
  }

  register() {
    // Mark all controls as touched to trigger validation messages
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      // Clear error messages and remove error class for all controls
      Object.keys(this.registerForm.controls).forEach(field => {
        const errorElement = document.getElementById(`${field}_error`);
        const inputElement = document.getElementById(field);

        if (errorElement) {
          errorElement.innerHTML = '';
        }

        if (inputElement) {
          inputElement.classList.remove('error-input');
        }
      });

      // Redirect to "dangky" page upon successful registration
      this.router.navigate(['/login']);
    } else {
      // Show error messages and apply red border for each invalid field
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
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
              errorElement.innerHTML = '* Vui lòng nhập/chọn giá trị.';
            }

            if (inputElement) {
              inputElement.classList.add('error-input');
            }
          } else if (control.errors['invalidEmailFormat']) {
            if (errorElement) {
              errorElement.innerHTML = '* Vui lòng nhập đúng định dạng Email.';
            }

            if (inputElement) {
              inputElement.classList.add('error-input');
            }
          } else if (control.errors['invalidPhoneFormat']) {
            if (errorElement) {
              errorElement.innerHTML = '* Vui lòng nhập đúng định dạng SĐT.';
            }

            if (inputElement) {
              inputElement.classList.add('error-input');
            }
          } else if (control.errors['passwordMismatch']) {
            if (errorElement) {
              errorElement.innerHTML = '* Mật khẩu nhập lại không khớp.';
            }

            if (inputElement) {
              inputElement.classList.add('error-input');
            }
          }
        }
      });
    }
  }
}
