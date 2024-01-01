import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateEmailPopupComponent } from '../validate-email-popup/validate-email-popup.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.css']
})
export class ValidateEmailComponent implements OnInit {
  userId: any;

  constructor(private dialog: MatDialog, private router: Router, 
    private _authService:AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.openSuccessDialog();
    this.route.queryParams.subscribe(params => {
      this.userId = params['id']; 
      console.log( this.userId,' this.userId')
      this._authService.validateEmail(this.userId).subscribe((data)=>{
        
      })
  });
  }

  openSuccessDialog() {
    const dialogRef = this.dialog.open(ValidateEmailPopupComponent, {
      width: '250px',
      data: { message: 'Email đã được xác nhận thành công!' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // Chờ 5 giây trước khi chuyển hướng về trang chủ
      setTimeout(() => {
        this.router.navigate(['/']); // Thay '/home' bằng đường dẫn trang chủ thực tế của bạn
      }, 2000);
    });
  }
}
