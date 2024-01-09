import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-order-success',
  templateUrl: './feedback-order-success.component.html',
  styleUrls: ['./feedback-order-success.component.css']
})
export class FeedbackOrderSuccessComponent {

  constructor(
    public dialogRef: MatDialogRef<FeedbackOrderSuccessComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    // Đóng cả hai dialog cùng một lúc
    this.dialog.closeAll();
  }
}
