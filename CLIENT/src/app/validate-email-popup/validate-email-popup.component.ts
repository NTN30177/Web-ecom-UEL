import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validate-email-popup',
  templateUrl: './validate-email-popup.component.html',
  styleUrls: ['./validate-email-popup.component.css']
})
export class ValidateEmailPopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

}
