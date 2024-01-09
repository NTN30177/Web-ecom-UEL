import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-method-list',
  templateUrl: './method-list.component.html',
  styleUrl: './method-list.component.css'
})
export class MethodListComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MethodListComponent>
  ) { }

  closePopup() {
    this.dialogRef.close()
  }
}
