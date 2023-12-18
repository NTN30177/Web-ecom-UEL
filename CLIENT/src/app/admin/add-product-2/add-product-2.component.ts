import { NzFormModule } from 'ng-zorro-antd/form';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ManageProductService } from '../../services/manage-product.service';
import { HttpClient } from '@angular/common/http';
import { IColor, ISubType, IType } from '../../interfaces/product';

@Component({
  selector: 'app-add-product-2',
  templateUrl: './add-product-2.component.html',
  styleUrl: './add-product-2.component.css',
})
export class AddProduct2Component implements OnInit {
  // variantForm: FormGroup;
  multipleImages: File[] = [];

  variantFormGroup: FormGroup | undefined;
  accessory: boolean = false;

  colors: IColor[] | undefined 
  types: IType[] | undefined;
  subTypes: ISubType[] | undefined;
  collections: ISubType[] | undefined;


  newType: any;

  newSubType: any;
  selectedSubType: boolean = false;
  showDivSubtype: boolean = true;

  i = 1;

  newCollection: any;
  selectedCollection: string = '';
  showDivCollection: boolean = true;

  // showVariantForm: boolean = true;
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
    private fb: FormBuilder
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
    this.apiCollection('64c4c7f4e2a184d32cff6540')
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
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
      alert('Lưu dữ liệu thành công');
    }
  }
  apiColor() {
    console.log('1235')
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
    console.log('type')
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
        console.log(this.subTypes ,'s')
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

  validateCourse(value: any): void {
    console.log(value);
    if (!value) {
      this.errFlag = true;
    } else {
      this.errFlag = false;
    }
  }

  checkTypeToValidate() {
    this.rfDataModal.get('newTypeInput')?.disable();
    this.rfDataModal.get('newSubTypeInput')?.disable();
    this.rfDataModal.get('newCollectionInput')?.disable();
    this.rfDataModal.get('cost')?.disable();
    console.log(this.accessory);
    if (!this.accessory) {
      console.log(this.accessory);

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

          variantFormGroup.get('color')?.disable();
          variantFormGroup.get('sizeS')?.disable();
          variantFormGroup.get('sizeL')?.disable();
          variantFormGroup.get('sizeM')?.disable();
          variantFormGroup.get('sizeXL')?.disable();
          variantFormGroup.get('sizeXXL')?.disable();
        }
      );
    }
  }



  addDiv(type: string): void {
    this.showInputType = type === 'typeName';
    this.showInputSubtype = type === 'subTypeName';
    this.showInputCollection = type === 'collectionName';
  }

  selectChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue == 'Phụ kiện') {
      this.accessory = true;
      this.clearAllVariants();
      this.addVariant();
    } else {
      this.accessory = false;
    }
    this.apiSubType(selectedValue)
    console.log(selectedValue)
  }

  clickSaveAdd(type: string, event: Event): void {
    event.stopPropagation();

    if (type === 'typeName') {
      this.handleTypeName();
    } else if (type === 'subTypeName') {
      this.handleSubTypeName();
    } else if (type === 'collection') {
      this.handleCollection();
    }
  }

  handleTypeName(): void {
    const newTypeValue = this.rfDataModal.get('newTypeInput')?.value;
    if (newTypeValue !== null) {
      this.rfDataModal.get('typeName')?.setValue(newTypeValue);
      this.rfDataModal.get('newTypeInput')?.setValue('');
      if (newTypeValue !== '') {
        // this.types.push(newTypeValue);
        this.addDiv('subTypeName');
      }
      this.showInputType = false;
    }
  }

  handleSubTypeName(): void {
    const newSubTypeValue = this.rfDataModal.get('newSubTypeInput')?.value;
    if (newSubTypeValue !== null) {
      this.rfDataModal.get('subTypeName')?.setValue(newSubTypeValue);
      this.rfDataModal.get('newSubTypeInput')?.setValue('');
      if (newSubTypeValue !== '') {
        // this.subTypes.push(newSubTypeValue);
      }
      this.selectedSubType = true;
      this.showInputSubtype = false;
    }
  }

  handleCollection(): void {
    const newCollectionValue =
      this.rfDataModal.get('newCollectionInput')?.value;
    if (newCollectionValue !== null) {
      this.rfDataModal.get('collectionName')?.setValue(newCollectionValue);
      this.rfDataModal.get('newCollectionInput')?.setValue('');
      if (newCollectionValue !== '') {
        // this.collections.push(newCollectionValue);
      }
      this.showInputCollection = false;
    }
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
    // Append form values to formData
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

    // Append files
    for (let key in this.imageCollections) {
      if (this.imageCollections.hasOwnProperty(key)) {
        const files = this.imageCollections[key];

        for (let i = 0; i < files.length; i++) {
          formData.append(`${key}[${i}]`, files[i]);
        }
      }
    }
    console.log('Form Data:', this.rfDataModal.value);
    console.log('Files:', this.imageCollections);
    console.log('Files:', formData);
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
