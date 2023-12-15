import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AppAng9';
  rfDataModal: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rfDataModal = this.fb.group({
      hoTen: ['', [Validators.required]],
      listDichVu: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // this.dataService.getListData().subscribe((result) => {
      // this.rfDataModal.setValue(result);
      // this.rfDataModal.patchValue(result);
      // this.initFormArray(result.listDichVu);
      // this.dicVus.setValue(result.listDichVu);
    // });
  }

  // initFormArray(data: any[]) {
  //   const controls = this.dicVus;
  //   data.forEach((item) => {
  //     controls.push(
  //       this.fb.group({
  //         tenDichVu: item.tenDichVu,
  //         donGia: item.donGia,
  //         soLuong: item.soLuong,
  //       })
  //     );
  //   });
  // }

  get dicVus(): FormArray {
    return this.rfDataModal.get('listDichVu') as FormArray;
  }

  get dichVuControls(): FormGroup[] {
    return this.dicVus.controls as FormGroup[];
  }

  addDichVu() {
    this.dicVus.push(
      this.fb.group({
        tenDichVu: ['', [Validators.required]],
        donGia: [0],
        soLuong: [undefined, [Validators.required]],
      })
    );
  }

  removeDichVu(index: number) {
    this.dicVus.removeAt(index);
  }

  save(): void {
    if (this.rfDataModal.invalid) {
      alert('Vui lòng xem lại thông tin form');
      // tslint:disable-next-line:forin
      for (const i in this.rfDataModal.controls) {
        this.rfDataModal.controls[i].markAsDirty();
        this.rfDataModal.controls[i].updateValueAndValidity();
      }
      // tslint:disable-next-line:forin
      for (const i in this.dicVus.controls) {
        const fGr: any = this.dicVus.controls[i];
        // tslint:disable-next-line:forin
        for (const j in fGr.controls) {
          fGr.controls[j].markAsDirty();
          fGr.controls[j].updateValueAndValidity();
        }
      }
    } else {
      alert('Save Data');
    }
  }
}
