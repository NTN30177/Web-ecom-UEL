import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-address-list-popup',
  templateUrl: './address-list-popup.component.html',
  styleUrl: './address-list-popup.component.css'
})
export class AddressListPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddressListPopupComponent>
  ) { }

  addresses = [
    {
      name: 'Phương Nguyên',
      phone: '0986428483',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: false,
    },
    {
      name: 'Phương Nhi',
      phone: '0986838999',
      address: 'Tô Vĩnh Diện, Đông Hoà, Dĩ An, Bình Dương',
      isDefault: false,
    },
  ];


  @Output() addressSelected = new EventEmitter<any>();

  chooseAddress(selectedAddress: any) {
    // Emit the selected address to the parent component
    this.addressSelected.emit(selectedAddress);
    // Close the dialog
    this.dialogRef.close();
  }

  closePopup() {
    this.dialogRef.close()
  }


}
