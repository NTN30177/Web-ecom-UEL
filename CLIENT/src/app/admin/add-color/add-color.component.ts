import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-add-color',
  templateUrl: './add-color.component.html',
  styleUrl: './add-color.component.css',
})
export class AddColorComponent implements OnInit {
  color = {
    name: '',
  };

  addColorForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    images: new FormControl(''),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addColorForm = this.fb.group({
      color_name: ['', Validators.required], // Add validation if needed
      color_img: ['', Validators.required],
    });
  }

  onSubmit() {
    const formData = this.addColorForm.value;
    console.log(formData);
    this.addColorForm.reset();

    if (this.addColorForm.valid) {
      alert('Success');
    }
  }

  markAllAsTouched() {
    const controls = this.addColorForm.controls;
    Object.keys(controls).forEach((controlName) => {
      controls[controlName].markAsTouched();
    });
    const formData = this.addColorForm.value;
    console.log(formData);
  }

  featureUnderDevelopment() {
    alert('Chức năng đang được phát triển');
  }

  get colorName() {
    return this.addColorForm.get('name') as FormControl;
  }
}
