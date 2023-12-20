import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedbackOrderSuccessComponent } from '../feedback-order-success/feedback-order-success.component';


@Component({
  selector: 'app-feedback-order',
  templateUrl: './feedback-order.component.html',
  styleUrl: './feedback-order.component.css'
})
export class FeedbackOrderComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<FeedbackOrderComponent>, private fb: FormBuilder, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openFeedbackOrderSuccessDialog(): void{
    const dialogRef = this.dialog.open(FeedbackOrderSuccessComponent, {
      width: '50%',
    });

    // Handle the modal close event if needed
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
