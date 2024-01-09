import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordModalSuccessComponent } from '../forgot-password-modal-success/forgot-password-modal-success.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css'],
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  canOpenModal: boolean = false;
  infoResult: { message: string, success: boolean } | null = null;
  emailFieldTouched: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      cus_email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }


  openSuccessModal(): void {
    this.emailFieldTouched = true;
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('cus_email')?.value;
      this._authService.isEmailVerified(email).subscribe({
        next: (data: any) => {
          if (data.isVerified) {
            this.infoResult = { message: 'Vui lòng truy cập email để xác thực', success: true };
            setTimeout(() => {
              this.dialogRef.close();
              this.router.navigate(['/']);
            }, 5000);
          } else {
            this.infoResult = { message: 'Email không được tìm thấy', success: false };
          }
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'Email không được tìm thấy';
          this.infoResult = { message: errorMessage, success: false };
        },
      });
    } else {
      this.canOpenModal = true;
    }
  }
  


  forGotPwProcess() {
    const email = this.forgotPasswordForm.get('cus_email')?.value
    this._authService.forGotPwProcessService(email).subscribe({
      next: (data: any) => {
        this.infoResult = data.message;
        if (data.success) {
          this.openSuccessModal();
        }
      },
      error: (err: any) => {
        this.infoResult = err;
      },
    });
  }
}
