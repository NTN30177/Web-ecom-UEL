import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

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
  showDivSubtype:boolean = false;

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';
  showDivCollection:boolean = false;

  showVariantForm: boolean = false;
  variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;

  product = { name: '', sku: '', description: '',price:'', type:'', subType:'', color:'', quantityS:'',quantityM:'', quantityL:'',quantityXL:'',quantityXXL:'',quantityFreeSize:''};
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
    });
  }

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

  clickSelectChoose(type: string, event: Event): void {
    this.showInputType = false;
    this.showInputCollection = false;
    this.showInputSubtype = false;
    
    if (type === 'type' && this.selectedType) {
      this.showDivSubtype = true;
      this.selectedSubType = '';
      this.selectedCollection = '';
      this.clearAllVariants();
      this.showDivCollection = true;
    } else if (type === 'subType' && this.selectedSubType) {
      // this.showVariantForm = true;
      console.log('1')
      this.addVariant();
    }
  }
  
  clickSaveAdd(type: string, event: Event): void {
    event.stopPropagation();
    if (type === 'type' && this.newType) {
      this.selectedType = this.newType;
      this.types.push(this.newType);
      this.newType = '';
      this.showInputType = false;
      this.showDivSubtype = true;
      this.showDivCollection = true;

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
    if (this.variants.length === 0) {
      setTimeout(() => {
        this.addVariant();
      }, 500); 
    }
  }
  clearAllVariants() {
    this.variants = [];
    this.variantForm.reset();
  }
}
