import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ManageProductService } from '../../services/manage-product.service';
import { IColor, ISubType, IType } from '../../interfaces/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product-2',
  templateUrl: './add-product-2.component.html',
  styleUrl: './add-product-2.component.css',
})
export class AddProduct2Component implements OnInit {
  multipleImages: File[] = [];
  variantFormGroup: FormGroup | undefined;
  accessory: boolean = false;
  colors: IColor[] | undefined 
  types: IType[] | undefined;
  subTypes: ISubType[] | undefined;
  collections: ISubType[] | undefined;
  newType: any;
  newSubType: any;
  showDivSubtype: boolean = true;
  i = 1;
  newCollection: any;
  selectedCollection: string = '';
  showDivCollection: boolean = true;
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;
  books: any;
  errMessage: any;
  rfDataModal: FormGroup;
  errFlag: boolean | undefined;
  colorList: any;
  constructor(
    private _productService: ManageProductService,
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.rfDataModal = this.fb.group({
      productName: ['', [Validators.required]],
      productSku: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      typeName: ['',[Validators.required]],
      subTypeName: ['', [Validators.required]],
      collectionName: [''],
      newTypeInput: [''],
      newSubTypeInput: [''],
      newCollectionInput: [''],
      variant: this.fb.array([]),
      
    });
  }

  ngOnInit(): void {
    this.addVariant();
    this.apiColor()
    this.apiType()
    this.apiCollection('Bộ sưu tập')
  }

  getVariantControl(index: number, controlName: string) {
    const variantFormGroup = this.variantsControls[index];
    return variantFormGroup.get(controlName) as FormControl;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    const data = this.onMultipleSubmit();
    this.checkTypeToValidate();
    if (this.rfDataModal.invalid || this.variant.invalid) {
      this.markFormGroupTouched(this.rfDataModal);
      alert('Vui lòng kiểm tra lại thông tin form');
    } else {
      this._productService.postProduct(data).subscribe({
        next: (data) => {
          this.books = data;
          this.router.navigate(['/admin/manage-order']);
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
      alert('Lưu dữ liệu thành công');
    }
  }
  apiColor() {
    this._productService.getColor().subscribe({
      next: (data) => {
        this.colors = data;
        console.log(this.colors)
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }
  apiType() {
    this._productService.getType().subscribe({
      next: (data) => {
        this.types = data;
        console.log(this.types)
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  apiSubType(type:any) {
    this._productService.getSubType(type).subscribe({
      next: (data) => {
        this.subTypes = data;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }
  apiCollection(type:any) {
    this._productService.getSubType(type).subscribe({
      next: (data) => {
        this.collections = data;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  validateSelect(value: any): void {
    console.log(value);
    if (!value) {
      this.errFlag = true;
    } else {
      this.errFlag = false;
    }
  }

  checkTypeToValidate() {
    if (!this.accessory) {
      const variantArray = this.rfDataModal.get('variant') as FormArray;
      variantArray.controls.forEach(
        (
          value: AbstractControl<any>,
          index: number,
          array: AbstractControl<any>[]
        ) => {
          const variantFormGroup = value as FormGroup;
          variantFormGroup.get('colorFreeSize')?.clearValidators();
          variantFormGroup.get('colorFreeSize')?.updateValueAndValidity();
          variantFormGroup.get('colorFreeSize')?.disable();
          variantFormGroup.get('freeSize')?.clearValidators();
          variantFormGroup.get('freeSize')?.updateValueAndValidity();
          variantFormGroup.get('freeSize')?.disable();
        }
      );
    } else {
      const variantArray = this.rfDataModal.get('variant') as FormArray;
      variantArray.controls.forEach(
        (
          value: AbstractControl<any>,
          index: number,
          array: AbstractControl<any>[]
        ) => {
          const variantFormGroup = value as FormGroup;

          variantFormGroup.get('color')?.clearValidators();
          variantFormGroup.get('sizeS')?.clearValidators();
          variantFormGroup.get('sizeL')?.clearValidators();
          variantFormGroup.get('sizeM')?.clearValidators();
          variantFormGroup.get('sizeXL')?.clearValidators();
          variantFormGroup.get('sizeXXL')?.clearValidators();

          variantFormGroup.get('color')?.updateValueAndValidity();
          variantFormGroup.get('sizeS')?.updateValueAndValidity();
          variantFormGroup.get('sizeL')?.updateValueAndValidity();
          variantFormGroup.get('sizeM')?.updateValueAndValidity();
          variantFormGroup.get('sizeXL')?.updateValueAndValidity();
          variantFormGroup.get('sizeXXL')?.updateValueAndValidity();
        }
      );
    }
  }



  addDiv(type: string): void {
    this.showInputType = type === 'typeName';
    this.showInputSubtype = type === 'subTypeName';
    this.showInputCollection = type === 'collectionName';
  }

  accessoryId='Phụ kiện'
  selectChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue == this.accessoryId) {
      this.accessory = true;
      this.clearAllVariants();
      this.addVariant();
    } else {
      this.accessory = false;
    }
    this.apiSubType(selectedValue)
  }

  clickSaveAdd(type: string, event: Event): void {
    event.stopPropagation();
    if (type === 'typeName') {
      this.handleTypeName();
    } else if (type === 'subTypeName') {
      this.handleSubTypeName();
    } else if (type === 'collectionName') {
      this.handleCollection();
    }
  }

  handleTypeName(): void {
    const newTypeValue = this.rfDataModal.get('newTypeInput')?.value;
    if (newTypeValue !== '' && !this.isTypeValueExists(newTypeValue)) {
      const newTypeObject: IType = {
        typeName: newTypeValue,
        slug: '',
        subtypes: [],
        _id: newTypeValue,
      };
      this.types?.push(newTypeObject);
      this.addDiv('subTypeName');
    }
    this.rfDataModal.get('typeName')?.setValue(newTypeValue);
    this.rfDataModal.get('newTypeInput')?.setValue('');
    this.showInputType = false;
  }
  handleSubTypeName(): void {
    const newSubTypeValue = this.rfDataModal.get('newSubTypeInput')?.value;
    console.log(newSubTypeValue)
    if (newSubTypeValue !== '' && !this.isSubTypeValueExists(newSubTypeValue)) {
      const newTypeObject: ISubType = {
        subTypeName: newSubTypeValue,
        slug: '',
        products: [],
        _id: newSubTypeValue,
      };
      if (this.subTypes === undefined ) {
        const newTypeObject: ISubType = {
          subTypeName: newSubTypeValue,
          slug: '',
          products: [],
          _id: newSubTypeValue,
        };
      }
      this.subTypes?.push(newTypeObject);
      this.showInputSubtype = false;
    }

    this.rfDataModal.get('subTypeName')?.setValue(newSubTypeValue);
    this.rfDataModal.get('newSubTypeInput')?.setValue('');
    this.showInputType = false;
  }
  
  private isTypeValueExists(newTypeValue: string): boolean {
    return this.types !== undefined && this.types.some(type => type.typeName === newTypeValue);
  }
  private isSubTypeValueExists(newSubTypeValue: string): boolean {
    return (
      this.types !== undefined &&
      (this.subTypes ?? []).some(type => type.subTypeName === newSubTypeValue)
    );
  }
  private isCollectionValueExists(newCollectionValue: string): boolean {
    return (
      this.types !== undefined &&
      (this.collections ?? []).some(type => type.subTypeName === newCollectionValue)
    );
  }
  

  handleCollection(): void {
    const newCollectionValue = this.rfDataModal.get('newCollectionInput')?.value;
    console.log(newCollectionValue)
    if (newCollectionValue !== '' && !this.isCollectionValueExists(newCollectionValue)) {
      const newTypeObject: ISubType = {
        subTypeName: newCollectionValue,
        slug: '',
        products: [],
        _id: newCollectionValue,
      };
      this.subTypes?.push(newTypeObject);
      this.showInputSubtype = false;
    }
    this.rfDataModal.get('collectionName')?.setValue(newCollectionValue);
    this.rfDataModal.get('newCollectionInput')?.setValue('');
    this.showInputCollection = false;
  }



  addVariant() {
    const variantFormGroup = this.fb.group({
      color: ['', [Validators.required]],
      sizeS: ['', [Validators.required]],
      sizeL: ['', [Validators.required]],
      sizeM: ['', [Validators.required]],
      sizeXL: ['', [Validators.required]],
      sizeXXL: ['', [Validators.required]],
      colorFreeSize: ['', [Validators.required]],
      freeSize: ['', [Validators.required]],
    });
    (this.rfDataModal.get('variant') as FormArray).push(variantFormGroup);
  }

  deleteVariant(index: number) {
    this.variant.removeAt(index);
  }
  clearAllVariants() {
    const variantsArray = this.rfDataModal.get('variant') as FormArray;
    while (variantsArray.length !== 0) {
      variantsArray.removeAt(0);
    }
  }
  

  imageCollections: { [fieldId: string]: File[] } = {};
  selectMultipleImage(event: Event, fieldId: number) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const images = Array.from(target.files) as File[];
      if (!this.imageCollections[fieldId]) {
        this.imageCollections[fieldId] = [];
      }
      this.imageCollections[fieldId] =
        this.imageCollections[fieldId].concat(images);
    }
    console.log(this.imageCollections);
  }

  onMultipleSubmit() {
    const formData = new FormData();
    for (let key in this.rfDataModal.value) {
      if (key != 'variant') {
        formData.append(key, this.rfDataModal.value[key]);
      }
    }
    const variants = this.rfDataModal.get('variant') as FormArray;
    for (let i = 0; i < variants.length; i++) {
      const variant = variants.at(i) as FormGroup;
      if (!this.accessory) {
        formData.append(`variant[${i}][color]`, variant.get('color')!.value);
        formData.append(`variant[${i}][sizeS]`, variant.get('sizeS')!.value);
        formData.append(`variant[${i}][sizeL]`, variant.get('sizeL')!.value);
        formData.append(`variant[${i}][sizeM]`, variant.get('sizeM')!.value);
        formData.append(`variant[${i}][sizeXL]`, variant.get('sizeXL')!.value);
        formData.append(
          `variant[${i}][sizeXXL]`,
          variant.get('sizeXXL')!.value
        );
      } else {
        formData.append(
          `variant[${i}][colorFreeSize]`,
          variant.get('colorFreeSize')!.value
        );
        formData.append(
          `variant[${i}][freeSize]`,
          variant.get('freeSize')!.value
        );
      }
    }

    for (let key in this.imageCollections) {
      if (this.imageCollections.hasOwnProperty(key)) {
        const files = this.imageCollections[key];

        for (let i = 0; i < files.length; i++) {
          formData.append(`${key}[${i}]`, files[i]);
        }
      }
    }
    return formData;
  }
  
  get variant(): FormArray {
    return this.rfDataModal.get('variant') as FormArray;
  }
  get variantsControls(): FormGroup[] {
    return this.variant.controls as FormGroup[];
  }
  get productName() {
    return this.rfDataModal.get('productName') as FormControl;
  }
  get productSku() {
    return this.rfDataModal.get('productSku') as FormControl;
  }
  get productDescription() {
    return this.rfDataModal.get('description') as FormControl;
  }
  get productPrice() {
    return this.rfDataModal.get('price') as FormControl;
  }
  get productCost() {
    return this.rfDataModal.get('cost') as FormControl;
  }
  get productType() {
    return this.rfDataModal.get('typeName') as FormControl;
  }
  get productSubType() {
    return this.rfDataModal.get('subTypeName') as FormControl;
  }
  get productCollection() {
    return this.rfDataModal.get('collectionName') as FormControl;
  }
  get productColor() {
    return this.rfDataModal.get('color') as FormControl;
  }
  get productSizeS() {
    return this.rfDataModal.get('sizeS') as FormControl;
  }
  get productSizeL() {
    return this.rfDataModal.get('sizeL') as FormControl;
  }
  get productSizeM() {
    return this.rfDataModal.get('sizeM') as FormControl;
  }
  get productSizeXL() {
    return this.rfDataModal.get('sizeXL') as FormControl;
  }
  get productSizeXXL() {
    return this.rfDataModal.get('sizeXXL') as FormControl;
  }
  get productFreeSize() {
    return this.rfDataModal.get('freeSize') as FormControl;
  }
  get productImages() {
    return this.rfDataModal.get('images') as FormControl;
  }
}
