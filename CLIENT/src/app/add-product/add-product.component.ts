import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})

export class AddProductComponent implements OnInit {
  variantForm: FormGroup;

  newType: any;
  types: string[] = ['Type 1', 'Type 2', 'Type 3', 'Phụ kiện'];
  selectedType: string = '';

  newSubType: any;
  subTypes: string[] = ['Type 1', 'Type 2'];
  selectedSubType: string = '';

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';

  showVariantForm: boolean = false; 
  variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;

  constructor(private fb: FormBuilder) {
    this.variantForm = this.fb.group({
      color: ['', Validators.required],
      sizes: this.fb.group({
        S: [null, Validators.required],
        M: [null, Validators.required],
        L: [null, Validators.required],
        XL: [null, Validators.required],
        XXL: [null, Validators.required],
      }),
      image: ['', Validators.required],
    });}
    
  ngOnInit(): void {}
  addDiv(type: string): void {
    if (type === 'type') {
      this.showInputType = !this.showInputType;
    } else if (type === 'subtype') {
      this.showInputSubtype = !this.showInputSubtype;
    } else if (type === 'collection') {
      this.showInputCollection = !this.showInputCollection;
    }
  }

  clickSelectAdd(type: string): void {
    this.showInputType = false;
    this.showInputCollection = false;
    this.showInputSubtype = false;
    if(this.selectedSubType!=''){
      this.clearAllVariants();
      this.addVariant()
    } 
  }
  clickSaveAdd(type: string, event: Event): void {
    event.stopPropagation();
    if (type === 'type' && this.newType.trim() !== '') {
      this.selectedType = this.newType;
      this.types.push(this.newType);
      this.newType = '';
      this.showInputType = false;
    }
    if (type === 'subtype' && this.newSubType.trim() !== '') {
      this.selectedSubType = this.newSubType;
      this.subTypes.push(this.newSubType);
      this.newSubType = '';
      this.showInputSubtype = false;
    }
  }
  addVariant() {
    this.variants.push(this.variantForm.value);
    this.variantForm.reset();
  }
  deleteVariant(index: number) {
    this.variants.splice(index, 1);
  }
  clearAllVariants() {
    this.variants = [];
    this.variantForm.reset();
  }
  
}
