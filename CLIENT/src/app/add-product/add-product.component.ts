import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  variantForm: FormGroup;

  colors: string[] = ['Đỏ', 'Xanh', 'Vàng', 'Phụ kiện'];

  newType: any;
  types: string[] = ['Type 1', 'Type 2', 'Type 3', 'Phụ kiện'];

  selectedType: string = '';

  newSubType: any;
  subTypes: string[] = ['Type 1', 'Type 2'];
  selectedSubType: boolean = false;
  showDivSubtype: boolean = true;

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';
  showDivCollection: boolean = true;

  showVariantForm: boolean = true;
  variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;

  product = {
    name: '',
    sku: '',
    description: '',
    price: '',
    type: '',
    subType: '',
    color: '',
    quantityS: '',
    quantityM: '',
    quantityL: '',
    quantityXL: '',
    quantityXXL: '',
    quantityFreeSize: '',
  };

  addProductForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    sku: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    cost: new FormControl(''),
    type: new FormControl(''),
    subType: new FormControl(''),
    collection: new FormControl(''),
    color: new FormControl(''),
    colorFreeSize: new FormControl(''),
    sizeS: new FormControl(''),
    sizeL: new FormControl(''),
    sizeM: new FormControl(''),
    sizeXL: new FormControl(''),
    sizeXXL: new FormControl(''),
    freeSize: new FormControl(''),
    newTypeInput: new FormControl(''),
    newSubTypeInput: new FormControl(''),
    images: new FormControl(''),
    imagesFreeSize: new FormControl(''),
    newCollectionInput: new FormControl(''),
  });

  submitted = false;
  typeFormControl: any;

  constructor(private fb: FormBuilder) {
    this.variantForm = this.fb.group({
      color: ['', Validators.required],
      sizes: this.fb.group({
        sizeS: ['', Validators.required],
        sizeM: ['', Validators.required],
        sizeL: ['', Validators.required],
        sizeXL: ['', Validators.required],
        sizeXXL: ['', Validators.required],
      }),
      image: ['', Validators.required],
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z].*'),
      ]),
      sku: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      subType: new FormControl('', Validators.required),
      sizeS: new FormControl('', Validators.required),
      sizeL: new FormControl('', Validators.required),
      sizeM: new FormControl('', Validators.required),
      sizeXL: new FormControl('', Validators.required),
      sizeXXL: new FormControl('', Validators.required),
      freeSize: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {}
  markAllAsTouched() {
    if (this.variants.length === 0) {
      this.addVariant();
    }
    const controls = this.addProductForm.controls;
    Object.keys(controls).forEach((controlName) => {
      controls[controlName].markAsTouched();
    });
    const formData = this.addProductForm.value;
    console.log(formData);
  }

  onSubmit() {
    (this.addProductForm.get('sizeS') as FormArray).push(new FormControl(''));
    (this.addProductForm.get('sizeL') as FormArray).push(new FormControl(''));
    const formData = this.addProductForm.value;
    console.log(formData);
    this.addProductForm.reset();

    if (this.addProductForm.valid) {
      alert('Success');
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      // Access the 'images' control using the 'get' method
      const imagesControl = this.addProductForm.get('images');

      if (imagesControl) {
        imagesControl.setValue(files[0]);
        imagesControl.markAsTouched();
      }

      if (allowedTypes.includes(file.type)) {
        console.log('Tệp hợp lệ:', file);
      } else {
        console.error('Loại tệp không hợp lệ');
      }
    } else {
      // Clear the 'images' control value if no file is selected
      const imagesControl = this.addProductForm.get('images');
      if (imagesControl) {
        imagesControl.setValue(null);
      }
    }
  }

  get productName() {
    return this.addProductForm.get('name') as FormControl;
  }
  get productSku() {
    return this.addProductForm.get('sku') as FormControl;
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
    return this.addProductForm.get('type') as FormControl;
  }
  get productSubType() {
    return this.addProductForm.get('subType') as FormControl;
  }
  get productColor() {
    return this.addProductForm.get('color') as FormControl;
  }
  get productColorFreeSize() {
    return this.addProductForm.get('colorFreeSize') as FormControl;
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
  get productImagesFreeSize() {
    return this.addProductForm.get('imagesFreeSize') as FormControl;
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
      this.selectedType = '';
      console.log('1');
      this.clearAllVariants();
      this.addVariant();
    } else if (type === 'type' && selectedValue == 'Phụ kiện') {
      this.selectedType = 'Phụ kiện';
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
        this.clearAllVariants();
        this.addVariant();
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
