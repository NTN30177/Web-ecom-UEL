import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordModalSuccessComponent } from '../forgot-password-modal-success/forgot-password-modal-success.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css'],
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  canOpenModal: boolean = false;
  infoResult: any;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _authService: AuthService
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
    // Kiểm tra xem form có hợp lệ không
    if (this.forgotPasswordForm.valid) {
      // Close the current modal
      this.dialogRef.close();

      // Open another modal (replace ForgotPasswordModalSuccessComponent with the actual component)
      const successModalRef = this.dialog.open(
        ForgotPasswordModalSuccessComponent,
        {
          width: '70%',
          data: {}, // Pass any data needed to the new modal
        }
      );

      successModalRef.afterClosed().subscribe((result: any) => {
        console.log('The success modal was closed', result);
      });
    } else {
      // Đánh dấu các control đã touched để hiển thị thông báo lỗi nếu cần
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
