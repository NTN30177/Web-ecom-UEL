import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-pw',
  templateUrl: './forget-pw.component.html',
  styleUrls: ['./forget-pw.component.css']
})
export class ForgetPwComponent implements OnInit {
  forgotPasswordSuccessForm!: FormGroup; // Corrected variable name
  formSubmitted: boolean = false;
  passwordMismatchError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotPasswordSuccessForm = this.fb.group({
      cus_new_pass: ['', Validators.required],
      re_cus_new_pass: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  resetPassword(): void {
    this.formSubmitted = true;

    if (this.forgotPasswordSuccessForm.valid) {
      // Handle password reset logic here
    } else {
      // Display password mismatch error
      this.passwordMismatchError = 'Mật khẩu nhập lại không khớp';
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('cus_new_pass');
    const confirmPasswordControl = formGroup.get('re_cus_new_pass');

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      // Set error if passwords do not match
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // Clear error if passwords match
      confirmPasswordControl?.setErrors(null);
    }
  }
}
