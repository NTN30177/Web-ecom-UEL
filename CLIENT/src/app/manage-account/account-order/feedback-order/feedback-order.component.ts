import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedbackOrderSuccessComponent } from '../feedback-order-success/feedback-order-success.component';
import { HttpClient } from '@angular/common/http';
import { ManageProductService } from '../../../services/manage-product.service';

@Component({
  selector: 'app-feedback-order',
  templateUrl: './feedback-order.component.html',
  styleUrls: ['./feedback-order.component.css']
})
export class FeedbackOrderComponent implements OnInit {
  feedbackForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FeedbackOrderComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private _service: ManageProductService
  ) {
    this.feedbackForm = this.fb.group({
      content_fb: [''],
      images: ['']
    });
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  openFeedbackOrderSuccessDialog(): void {

    const content = this.feedbackForm.get('content_fb')?.value;
    const formData = new FormData();

    // No need to append productId and orderId manually

    formData.append('content', content);

    const imagesControl = this.feedbackForm.get('images');
    if (imagesControl?.value) {
      const images: FileList = imagesControl.value;
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    this._service.submitFeedback(formData).subscribe(
      (response) => {
        console.log('Phản hồi được gửi thành công', response);
        const dialogRef = this.dialog.open(FeedbackOrderSuccessComponent, {
          width: '50%',
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed', result);
        });
      },
      (error) => {
        console.error('Lỗi khi gửi phản hồi', error);
        alert('Lỗi khi gửi phản hồi: ' + error.message);

      }
    );
  }

  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.feedbackForm.get('images')?.setValue(fileList);
    }
  }
}
