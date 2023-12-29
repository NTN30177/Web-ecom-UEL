import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedbackOrderSuccessComponent } from '../feedback-order-success/feedback-order-success.component';
import { ManageProductService } from '../../../services/manage-product.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-feedback-order',
  templateUrl: './feedback-order.component.html',
  styleUrl: './feedback-order.component.css'
})
export class FeedbackOrderComponent implements OnInit {
  feedbackForm!: FormGroup;
  productId: any;
  orderId: any; 
  userId: any;
  i: any;

  
  constructor(
    public dialogRef: MatDialogRef<FeedbackOrderComponent>, private fb: FormBuilder, private dialog: MatDialog,
    private _service: ManageProductService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,


  ) {
    this.orderId = data.orderId;
    this.productId = data.productId;
    this.userId = data.userId;
    console.log(this.productId, this.orderId, '357')
    this.feedbackForm = this.fb.group({
      content_fb: [''],
      images: [''],
    });
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  imageCollections: { [fieldId: string]: File[] } = {};

  selectMultipleImage(event: Event, fieldId: number) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files) as File[];
  
      // Thêm các tệp mới vào imageCollections
      if (!this.imageCollections[fieldId]) {
        this.imageCollections[fieldId] = [];
      }
      this.imageCollections[fieldId] = this.imageCollections[fieldId].concat(files);
  
      // Hiển thị danh sách tệp đang được chọn trong console
      console.log(`Field ${fieldId} - Selected files:`, this.imageCollections[fieldId]);
    }
  }

  openFeedbackOrderSuccessDialog(): void{
    const content = this.feedbackForm.get('content_fb')?.value;
    const orderId = this.feedbackForm.get('orderId')?.value;
    

    const imagesControl = this.feedbackForm.get('images');

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('productId', this.productId);
    formData.append('content', content);

  // Lưu ảnh và video vào formData
  for (const fieldId in this.imageCollections) {
    if (this.imageCollections.hasOwnProperty(fieldId)) {
      const files = this.imageCollections[fieldId];
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }
  }
    console.log(this.feedbackForm.value, 'formdata')
    this._service.addFeedback(this.feedbackForm.value, this.productId, this.orderId, this.userId).subscribe(
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
}
