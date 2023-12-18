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
  showOptionZeroError: boolean = false;

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
      'cus_gender': [0, [Validators.required, this.optionValidator(0)]],  // Set default value for cus_gender with 0
      'cus_region_id': [0, [Validators.required, this.optionValidator(0)]],
      'cus_district_id': [0, [Validators.required, this.optionValidator(0)]],
      'cus_ward_id': [0, [Validators.required, this.optionValidator(0)]],
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
    this.registerForm.get('cus_ward_id')?.setValue(0);
  }

  isOptionZeroSelected(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.value === 0;
  }

  optionValidator(optionValue: number) {
    return (control: FormControl) => {
      if (control.value === optionValue) {
        return { invalidOption: true };
      }
      return null;
    };
  }

  clearSpecificErrorMessage(controlName: string) {
    const errorElement = document.getElementById(`${controlName}_error`);
    const inputElement = document.getElementById(controlName);

    if (errorElement) {
      errorElement.innerHTML = '';
    }

    if (inputElement) {
      inputElement.classList.remove('error-input');
    }
  }

  displayErrorMessage(controlName: string, errorMessage: string) {
    const errorElement = document.getElementById(`${controlName}_error`);
    const inputElement = document.getElementById(controlName);

    if (errorElement) {
      errorElement.innerHTML = errorMessage;
    }

    if (inputElement) {
      inputElement.classList.add('error-input');
    }
  }

  validateAndClearError(controlName: string) {
    const control = this.registerForm.get(controlName);
    const errorElement = document.getElementById(`${controlName}_error`);
    const inputElement = document.getElementById(controlName);

    if (control && errorElement && inputElement) {
      if (control.valid) {
        // Clear error messages and remove error class for valid controls
        this.clearSpecificErrorMessage(controlName);
      } else {
        // Show error messages and apply red border for invalid controls
        this.displayErrorMessage(controlName, '* Vui lòng nhập/chọn giá trị.');
        if (controlName === 'cus_reenterpassword' && control.errors?.['passwordMismatch']) {
        this.displayErrorMessage(controlName, 'Mật khẩu nhập lại không khớp.');
      }
        inputElement.classList.add('error-input');
      }
    }
  }

  register() {
    // Mark all controls as touched to trigger validation messages
    this.registerForm.markAllAsTouched();

    // Check if any option with value 0 is selected
    const hasOptionZeroSelected = this.isOptionZeroSelected('cus_gender') ||
      this.isOptionZeroSelected('cus_region_id') ||
      this.isOptionZeroSelected('cus_district_id') ||
      this.isOptionZeroSelected('cus_ward_id');

    // Show error only if an option with value 0 is selected
    this.showOptionZeroError = hasOptionZeroSelected;

    if (this.registerForm.valid && !hasOptionZeroSelected) {
      // Clear error messages and remove error class for all controls
      Object.keys(this.registerForm.controls).forEach(field => {
        this.clearSpecificErrorMessage(field);
      });

      this.router.navigate(['/login']);
    } else {
      // Show error messages and apply red border for each invalid field
      Object.keys(this.registerForm.controls).forEach(field => {
        this.validateAndClearError(field);
      });
    }
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
}
