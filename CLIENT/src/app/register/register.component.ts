import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('cusFirstname') cusFirstname!: ElementRef;
  @ViewChild('cusLastname') cusLastname!: ElementRef;

  registerForm!: FormGroup;
  passwordMismatchError: string = '';
  showOptionZeroError: boolean = false;
  infoResult: any;
  errMessage: any;
  districts: any;
  provinces: any;
  wards: any;

  constructor(private fb: FormBuilder,
     private router: Router,
     private _authService: AuthService,
     private renderer: Renderer2
     ) { }

  ngOnInit() {
    this.initForm();
    this.setDefaultValues();
    this.apiProvince()
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
  selectChangeP(event: any) {
    const selectedValue = event.target.value;
    console.log(selectedValue, 'district')
    this.apiDistrict(selectedValue)
    console.log(selectedValue, 'district')

  }
  selectChangeD(event: any) {
    const selectedValue = event.target.value;
    this.apiWard(selectedValue)
  }

  apiProvince() {
    console.log('1235')
    this._authService.getProvince().subscribe({
      next: (data: any) => {
        this.provinces = data;
        console.log(this.provinces, '123')
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  apiDistrict(id:any) {
    console.log('1235')
    this._authService.getDistrict(id).subscribe({
      next: (data: any) => {
        this.districts = data;
        console.log(this.districts)
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  apiWard(id:any) {
    console.log('ward')
    this._authService.getWard(id).subscribe({
      next: (data: any) => {
        this.wards = data;
        console.log(this.wards)
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

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
    const errorElement = this.renderer.selectRootElement(`#${controlName}_error`);
    const inputElement = this.renderer.selectRootElement(`#${controlName}`);

    if (errorElement) {
      this.renderer.setProperty(errorElement, 'innerHTML', '');
    }

    if (inputElement) {
      this.renderer.removeClass(inputElement, 'error-input');
    }
  }

  displayErrorMessage(controlName: string, errorMessage: string) {
    const errorElement = this.renderer.selectRootElement(`#${controlName}_error`);
    const inputElement = this.renderer.selectRootElement(`#${controlName}`);

    if (errorElement) {
      this.renderer.setProperty(errorElement, 'innerHTML', errorMessage);
    }

    if (inputElement) {
      this.renderer.addClass(inputElement, 'error-input');
    }
  }

  validateAndClearError(controlName: string) {
    const control = this.registerForm.get(controlName);
    const errorElement = this.renderer.selectRootElement(`#${controlName}_error`);
    const inputElement = this.renderer.selectRootElement(`#${controlName}`);

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
        this.renderer.addClass(inputElement, 'error-input');
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
    this.postRegister()
  }
  postRegister(){
    if (this.registerForm.invalid) {
      alert('Vui lòng kiểm tra lại thông tin form');
    } else {
      this._authService.postInfoUser(this.registerForm.value).subscribe({
        next: (data: any) => {
          if(data){
            this.infoResult ='Vui lòng xác thực địa chỉ gmail'
            setTimeout(() => {
              this.infoResult=''
            }, 5000);
          } else{
            this.infoResult ='Hệ thống lỗi, vui lòng đăng ký lại'
          }
        },
        error: (err: any) => {
          this.errMessage = err;
        },
      });
      console.log('save')

      alert('Lưu dữ liệu thành công');
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
      const phonePattern = /^0\d{9}$/;
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
