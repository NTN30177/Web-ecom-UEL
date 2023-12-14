import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Product } from '../../interfaces/product';
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

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';
  showDivCollection: boolean = true;

  showVariantForm: boolean = true;
  variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;

  
  addProductForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    sku: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    cost: new FormControl(''),
    type: new FormControl(''),
    subType: new FormControl(''),
    collection: new FormControl(''),
    newTypeInput: new FormControl(''),
    newSubTypeInput: new FormControl(''),
    images: new FormControl(''),
    imagesFreeSize: new FormControl(''),
    newCollectionInput: new FormControl(''),
  });


  submitted = false;
  typeFormControl: any;
  variantCounter: number =0;
  addProductMessage: string | undefined;

  constructor(private _productServer:ManageProductService,
     private fb: FormBuilder, 
     private http: HttpClient,
     private router:Router
  ) {
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

  onSubmit(){
    const formData = this.addProductForm.value;
    console.log(formData)
    this._productServer.addProduct(formData).subscribe((result) => {
      if(result){
        this.addProductMessage="Product is successfully added"
        console.log('95');
      }
      setTimeout(()=>(this.addProductMessage=undefined),3000,
      this.router.navigate(['']))
    })

  }
  onSubmit3() {
    this.submitted=true
    const formData = this.addProductForm.value;
    console.log(formData);
    this.addProductForm.reset();
    alert('Success'); 
    if (this.addProductForm.valid) {
      return
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
        this.addDiv('subtype')
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
    console.log(this.variantCounter ,'vc')
    const variantImages = `variantImages${this.variantCounter}`;
    const color = `color${this.variantCounter}`;
    const colorFreeSize = `colorFreeSize${this.variantCounter}`;
    const freeSize = `freeSize${this.variantCounter}`;
    const sizeS = `sizeS${this.variantCounter}`;
    const sizeL = `sizeL${this.variantCounter}`;
    const sizeM = `sizeM${this.variantCounter}`;
    const sizeXL = `sizeXL${this.variantCounter}`;
    const sizeXXL = `sizeXXL${this.variantCounter}`;
    this.addProductForm.addControl(color, this.fb.control(''));
    this.addProductForm.addControl(colorFreeSize, this.fb.control(''));
    this.addProductForm.addControl(variantImages, this.fb.control(''));
    this.addProductForm.addControl(sizeS, this.fb.control(''));
    this.addProductForm.addControl(sizeL, this.fb.control(''));
    this.addProductForm.addControl(sizeM, this.fb.control(''));
    this.addProductForm.addControl(sizeXL, this.fb.control(''));
    this.addProductForm.addControl(sizeXXL, this.fb.control(''));
    this.addProductForm.addControl(freeSize, this.fb.control(''));
   
    // this.variants.push(this.variantForm.value);
    // this.variantForm.reset();
  }
  deleteVariant(index: number) {
    this.variantCounter--
    const variantImages = `variantImages${index+1}`;
    const color = `color${index+1}`;
    const colorFreeSize = `colorFreeSize${index+1}`;
    const freeSize = `freeSize${index+1}`;
    const sizeS = `sizeS${index+1}`;
    const sizeL = `sizeL${index+1}`;
    const sizeM = `sizeM${index+1}`;
    const sizeXL = `sizeXL${index+1}`;
    const sizeXXL = `sizeXXL${index+1}`;
    this.addProductForm.removeControl(color);
    this.addProductForm.removeControl(colorFreeSize);
    this.addProductForm.removeControl(variantImages);
    this.addProductForm.removeControl(sizeS);
    this.addProductForm.removeControl(sizeL);
    this.addProductForm.removeControl(sizeM);
    this.addProductForm.removeControl(sizeXL);
    this.addProductForm.removeControl(sizeXXL);
    this.addProductForm.removeControl(freeSize);
    this.variants.splice(index, 1);
    if (this.variantCounter === 0) {
      
      setTimeout(() => {
    this.addVariant();

      }, 500);
    }
  }
  clearAllVariants() {
    this.variantCounter===0
    // this.addVariant();
    // this.addProductForm.reset();
  }
}
