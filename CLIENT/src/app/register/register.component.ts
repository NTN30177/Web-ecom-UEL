import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('cusFirstname') cusFirstname!: ElementRef;
  @ViewChild('cusLastname') cusLastname!: ElementRef;

  registerForm!: FormGroup;
  showOptionZeroError: boolean = false;
  infoResult: any;
  errMessage: any;
  districts: any;
  provinces: any;
  wards: any;
  // Thêm vào trong class RegisterComponent
  hidePassword = true;
  userIdFromHeader: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private snackBar: MatSnackBar  // Add this line
,

  ) {
    this._authService.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
     
    });
  }

  ngOnInit() {
    if(this.userIdFromHeader){
      this.router.navigate(['/']);
    }
    this.initForm();
    this.setDefaultValues();
    this.apiProvince();
  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        cus_firstname: ['', [Validators.required, this.nameValidator]],
        cus_lastname: ['', [Validators.required, this.nameValidator]],
        cus_email: ['', [Validators.required, this.emailValidator()]],
        cus_phonenumber: [
          '',
          [Validators.required, this.phonenumberValidator()],
        ],
        cus_dob: ['', Validators.required],
        cus_gender: [0, [Validators.required, this.optionValidator(0)]],
        cus_region_id: [0, [Validators.required, this.optionValidator(0)]],
        cus_district_id: [0, [Validators.required, this.optionValidator(0)]],
        cus_ward_id: [0, [Validators.required, this.optionValidator(0)]],
        cus_address_id: ['', Validators.required],
        cus_password: ['', [Validators.required, Validators.minLength(6)]],
        cus_reenterpassword: ['', Validators.required],
        cus_agree: [true],
        cus_register_news: [false],
      },
      {
        validators: this.passwordMatchValidator.bind(this),
      }
    );
  }
  genders = [
    { value: 1, viewValue: 'Nữ' },
    { value: 2, viewValue: 'Nam' },
  ];

  nameValidator(control: FormControl) {
    const value = control.value;
    if (!value) {
      return null; // Value is empty, don't perform further validation
    }

    // Check if the name starts with a number
    const startsWithNumber = /^\d/.test(value);

    if (startsWithNumber) {
      return { startsWithNumber: true };
    }

    return null; // Validation passed
  }

  selectChangeP(event: MatSelectChange) {
    const selectedValue = event.value;
    console.log(selectedValue, 'district');
    this.apiDistrict(selectedValue);
    console.log();
  }

  selectChangeD(event: MatSelectChange) {
    const selectedValue = event.value;
    this.apiWard(selectedValue);
  }
  onRegionChange(event: MatSelectChange) {
    const selectedValue = event.value;
    console.log('Selected Region ID:', selectedValue);
    this.apiDistrict(selectedValue);

    // Bạn có thể thực hiện các thao tác khác với giá trị đã chọn tại đây
  }

  apiProvince() {
    console.log('1235');
    this._authService.getProvince().subscribe({
      next: (data: any) => {
        this.provinces = data;
        console.log(this.provinces, '123');
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

  apiDistrict(id: any) {
    console.log('1235');
    this._authService.getDistrict(id).subscribe({
      next: (data: any) => {
        this.districts = data;
        console.log(this.districts);
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

  apiWard(id: any) {
    console.log('ward');
    this._authService.getWard(id).subscribe({
      next: (data: any) => {
        this.wards = data;
        console.log(this.wards);
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

  }


  register() {
    // Mark all controls as touched to trigger validation messages
    this.registerForm.markAllAsTouched();

    // Check if any option with value 0 is selected
    const hasOptionZeroSelected =
      this.isOptionZeroSelected('cus_gender') ||
      this.isOptionZeroSelected('cus_region_id') ||
      this.isOptionZeroSelected('cus_district_id') ||
      this.isOptionZeroSelected('cus_ward_id');

    // Show error only if an option with value 0 is selected
    this.showOptionZeroError = hasOptionZeroSelected;

this.postRegister()
  }

  postRegister() {
    if (this.registerForm.invalid) {
      alert('Vui lòng kiểm tra lại thông tin form');
    } else {
      this._authService.postInfoUser(this.registerForm.value).subscribe({
        next: (data: any) => {
          console.log(data, 'dât')
          if (data) {
            this.infoResult = data.message;
            this.snackBar.open(this.infoResult, 'Close', {
              duration: 5000,  
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            if (data.success) {
              const snackBarRef = this.snackBar.open('Vui lòng xác thực gmail', 'Close', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            
              snackBarRef.afterDismissed().subscribe(() => {
                this.router.navigate(['/login']);
              });
            }
          } else {
            this.infoResult = 'Hệ thống lỗi, vui lòng đăng ký lại';
          }
        },
        error: (err: any) => {
          this.errMessage = err;
        },
      });
      console.log('save');

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
    const confirmPasswordControl = formGroup.get(
      'cus_reenterpassword'
    ) as FormControl;

    if (passwordControl.value !== confirmPasswordControl.value) {
      // If passwords do not match, set a warning for FormControl
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // If passwords match, make sure to clear the warning
      confirmPasswordControl.setErrors(null);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}