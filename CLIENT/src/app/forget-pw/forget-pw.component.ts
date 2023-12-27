import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forget-pw',
  templateUrl: './forget-pw.component.html',
  styleUrls: ['./forget-pw.component.css'],
})
export class ForgetPwComponent implements OnInit {
  forgotPasswordSuccessForm!: FormGroup; // Corrected variable name
  formSubmitted: boolean = false;
  passwordMismatchError: string | null = null;
  resultInfo: any;
  email: any;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.forgotPasswordSuccessForm = this.fb.group(
      {
        cus_new_pass: ['', Validators.required],
        re_cus_new_pass: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email:', this.email); });
  }

  resetPassword(): void {
    this.formSubmitted = true;
    if (this.forgotPasswordSuccessForm.valid) {
      this.saveNewPw();
    } else {
      this.passwordMismatchError = 'Mật khẩu nhập lại không khớp';
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('cus_new_pass');
    const confirmPasswordControl = formGroup.get('re_cus_new_pass');

    if (
      passwordControl &&
      confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      // Set error if passwords do not match
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      // Clear error if passwords match
      confirmPasswordControl?.setErrors(null);
    }
  }
  saveNewPw() {
    this._authService
      .resetPw(this.forgotPasswordSuccessForm.value, this.email)
      .subscribe((data) => {
        console.log(this.forgotPasswordSuccessForm.value, 1234);
        this.resultInfo = data.message;
        localStorage.setItem('userData', JSON.stringify(data.userData));
        this._authService.isLoginSubject.next(data.login);
        console.log(data, 'dttttt')
        this._authService.emailUserSubject.next(data.userData.email);
        timer(1000).subscribe(() => {
          this.router.navigate(['/']);
        });
      });
  }
}
