import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ManageProductService } from '../../services/manage-product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  // variantForm: FormGroup;

  colors: string[] = ['Đỏ', 'Xanh', 'Vàng', 'Phụ kiện'];

  newType: any;
  types: string[] = ['Type 1', 'Type 2', 'Type 3', 'Phụ kiện'];

  selectedType: string = '';

  newSubType: any;
  subTypes: string[] = ['Type 1', 'Type 2'];
  selectedSubType: boolean = false;
  showDivSubtype: boolean = true;

i=1

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';
  showDivCollection: boolean = true;

  showVariantForm: boolean = true;
  variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;
  // addProductForm!: FormGroup;

  submitted = false;
  typeFormControl: any;
  variantCounter: number = 0;
  addProductMessage: string | undefined;
  books: any;
  errMessage: any;


  addProductForm: FormGroup = new FormGroup({
    productName: new FormControl(''),
    productSku: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    cost: new FormControl(''),
    typeName: new FormControl(''),
    subTypeName: new FormControl(''),
    collectionName: new FormControl(''),
    color: new FormArray([]),
    sizeS: new FormArray([]),
    sizeL: new FormArray([]),
    sizeM: new FormArray([]),
    sizeXL: new FormArray([]),
    sizeXXL: new FormArray([]),
    freeSize: new FormArray([]),
    images: new FormArray([]),
    newTypeInput: new FormControl(''),
    newSubTypeInput: new FormControl(''),
    newCollectionInput: new FormControl(''),
  });
  addProductForm1: FormGroup<{ productName: FormControl<string | null>; productSku: FormControl<string | null>; description: FormControl<string | null>; price: FormControl<string | null>; cost: FormControl<string | null>; typeName: FormControl<string | null>; color: FormArray<never>; sizeS: FormArray<never>; sizeL: FormArray<never>; sizeM: FormArray<never>; sizeXL: FormArray<never>; sizeXXL: FormArray<never>; freeSize: FormArray<never>; images: FormArray<never>; subTypeName: FormControl<string | null>; collectionName: FormControl<string | null>; newTypeInput: FormControl<string | null>; newSubTypeInput: FormControl<string | null>; newCollectionInput: FormControl<string | null>; }>;

  constructor(
    private _productService: ManageProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.addProductForm1 = this.fb.group({
      productName: [''],
      productSku: [''],
      description: [''],
      price: [''],
      cost: [''],
      typeName: [''],
      color: new FormArray([]),
      sizeS: new FormArray([]),
      sizeL: new FormArray([]),
      sizeM: new FormArray([]),
      sizeXL: new FormArray([]),
      sizeXXL: new FormArray([]),
      freeSize: new FormArray([]),
      images: new FormArray([]),
      subTypeName: [''],
      collectionName: [''],
      newTypeInput: [''],
      newSubTypeInput: [''],
      newCollectionInput: [''],
    });
   
  }
  ngOnInit(): void {
    this.addVariant();
    
  }
  count(end: number): number[] {
    return new Array(end).fill(0).map((_, index) => index + 1);
  }
  markAllAsTouched() {
    if (this.variantCounter === 0) {
      this.addVariant();
    }
    const controls = this.addProductForm.controls;
    Object.keys(controls).forEach((controlName) => {
      controls[controlName].markAsTouched();
    });
  }

  onSubmit() {
    const formData = this.addProductForm.value;
    
    this._productService.postProduct(formData).subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });

    console.log(formData);
  }
  onSubmit3() {
    this.submitted = true;
    const formData = this.addProductForm.value;
    console.log(formData);
    this.addProductForm.reset();
    alert('Success');
    if (this.addProductForm.valid) {
      return;
    }
  }

  get productName() {
    return this.addProductForm.get('productName') as FormControl;
  }
  get productSku() {
    return this.addProductForm.get('productSku') as FormControl;
  }
  get productDescription() {
    return this.addProductForm.get('description') as FormControl;
  }
  get productPrice() {
    return this.addProductForm.get('price') as FormControl;
  }
  get productCost() {
    return this.addProductForm.get('cost') as FormControl;
  }
  get productType() {
    return this.addProductForm.get('typeName') as FormControl;
  }
  get productSubType() {
    return this.addProductForm.get('subTypeName') as FormControl;
  }
  get productCollection() {
    return this.addProductForm.get('collectionName') as FormControl;
  }
  get productColor() {
    return this.addProductForm.get('color') as FormControl;
  }
  get productSizeS() {
    return this.addProductForm.get('sizeS') as FormControl;
  }
  get productSizeL() {
    return this.addProductForm.get('sizeL') as FormControl;
  }
  get productSizeM() {
    return this.addProductForm.get('sizeM') as FormControl;
  }
  get productSizeXL() {
    return this.addProductForm.get('sizeXL') as FormControl;
  }
  get productSizeXXL() {
    return this.addProductForm.get('sizeXXL') as FormControl;
  }
  get productFreeSize() {
    return this.addProductForm.get('freeSize') as FormControl;
  }
  get productImages() {
    return this.addProductForm.get('images') as FormControl;
  }

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
    const selectedValue = this.addProductForm.get(type)?.value;
    console.log(selectedValue);
    if (type === 'type' && selectedValue != 'Phụ kiện') {
      this.clearAllVariants();
      this.addVariant();
    } else if (type === 'type' && selectedValue == 'Phụ kiện') {
      this.selectedType = 'Phụ kiện';
      this.clearAllVariants();
      this.addVariant();
    }
  }

  clickSaveAdd(type: string, event: Event): void {
    event.stopPropagation();

    if (
      type === 'type' &&
      this.addProductForm.get('newTypeInput')?.value !== null
    ) {
      const newTypeValue = this.addProductForm.get('newTypeInput')?.value;
      this.addProductForm.get('type')?.setValue(newTypeValue);
      this.addProductForm.get('newTypeInput')?.setValue('');
      if (newTypeValue != '') {
        this.types.push(newTypeValue);
        // this.clearAllVariants();
        // this.addVariant();
        this.addDiv('subtype');
      }
      this.showInputType = false;
    } else if (
      type === 'subType' &&
      this.addProductForm.get('newSubTypeInput')
    ) {
      const newSubTypeValue = this.addProductForm.get('newSubTypeInput')?.value;
      this.addProductForm.get('subType')?.setValue(newSubTypeValue);
      this.addProductForm.get('newSubTypeInput')?.setValue('');
      if (newSubTypeValue != '') {
        this.subTypes.push(newSubTypeValue);
      }
      this.selectedSubType = true;
      this.showInputSubtype = false;
    } else if (
      type === 'collection' &&
      this.addProductForm.get('newCollectionInput')
    ) {
      const newCollectionValue =
        this.addProductForm.get('newCollectionInput')?.value;
      this.addProductForm.get('collection')?.setValue(newCollectionValue);
      this.addProductForm.get('newCollectionInput')?.setValue('');
      if (newCollectionValue != '') {
        this.collections.push(newCollectionValue);
      }
      this.showInputCollection = false;
    }
  }

  addVariant() {
    this.variantCounter++;
  }
  deleteVariant(index: number) {
    if (this.variantCounter === 0) {
      setTimeout(() => {
        this.addVariant();
      }, 500);
    }
  }
  clearAllVariants() {
    this.variantCounter === 0;
    // this.addVariant();
    // this.addProductForm.reset();
  }
}
