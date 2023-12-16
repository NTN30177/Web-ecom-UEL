import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-product-2',
  templateUrl: './add-product-2.component.html',
  styleUrl: './add-product-2.component.css',
})
export class AddProduct2Component implements OnInit {
  // variantForm: FormGroup;
  accessory:boolean=true

  colors: string[] = ['Đỏ', 'Xanh', 'Vàng', 'Phụ kiện'];

  newType: any;
  types: string[] = ['Type 1', 'Type 2', 'Type 3', 'Phụ kiện'];

  selectedType: string = '';

  newSubType: any;
  subTypes: string[] = ['Type 1', 'Type 2'];
  selectedSubType: boolean = false;
  showDivSubtype: boolean = true;

  i = 1;

  newCollection: any;
  collections: string[] = ['Type 1', 'Type 2'];
  selectedCollection: string = '';
  showDivCollection: boolean = true;

  showVariantForm: boolean = true;
  // variants: any[] = [];
  showInputType: boolean = false;
  showInputSubtype: boolean = false;
  showInputCollection: boolean = false;
  // rfDataModal!: FormGroup;

  submitted = false;
  typeFormControl: any;
  variantounter: number = 0;
  addProductMessage: string | undefined;
  books: any;
  errMessage: any;
 

  // rfDataModal1: FormGroup<{ productName: FormControl<string | null>; productSku: FormControl<string | null>; description: FormControl<string | null>; price: FormControl<string | null>; cost: FormControl<string | null>; typeName: FormControl<string | null>; color: FormArray<never>; sizeS: FormArray<never>; sizeL: FormArray<never>; sizeM: FormArray<never>; sizeXL: FormArray<never>; sizeXXL: FormArray<never>; freeSize: FormArray<never>; images: FormArray<never>; subTypeName: FormControl<string | null>; collectionName: FormControl<string | null>; newTypeInput: FormControl<string | null>; newSubTypeInput: FormControl<string | null>; newCollectionInput: FormControl<string | null>; }>;
  rfDataModal: FormGroup;
  constructor(
    private _productService: ManageProductService,
    private fb: FormBuilder,
  ) {
    this.rfDataModal = this.fb.group({
      productName: ['', [Validators.required]],
      productSku: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      typeName: ['', [Validators.required]],
      subTypeName: ['', [Validators.required]],
      collectionName: ['', [Validators.required]],
      variant: this.fb.array([]),
      newTypeInput: [''],
      newSubTypeInput: [''],
      newCollectionInput: [''],
    });
  }
  ngOnInit(): void {
    this.addVariant();
  }
  get variant(): FormArray {
    return this.rfDataModal.get('variant') as FormArray;
  }

  get dichVuControls(): FormGroup[] {
    return this.variant.controls as FormGroup[];
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });}

  onSubmit() {
    this.checkTypeToValidate()
    if (this.rfDataModal.invalid || this.variant.invalid) {
      alert('Vui lòng kiểm tra lại thông tin form');
      this.markFormGroupTouched(this.rfDataModal);
      // this.markFormGroupTouched(this.variant);
    } else {
      alert('Save Data');
    }
  }
  checkTypeToValidate(){
    this.rfDataModal.get('newTypeInput')?.disable(); 
    this.rfDataModal.get('newSubTypeInput')?.disable(); 
    this.rfDataModal.get('newCollectionInput')?.disable(); 
    this.rfDataModal.get('cost')?.disable(); 
    console.log(this.selectedType,
      '2')
    if(this.accessory){
      const variantArray = this.rfDataModal.get('variant') as FormArray;
      variantArray.controls.forEach((value: AbstractControl<any>, index: number, array: AbstractControl<any>[]) => {
        const variantFormGroup = value as FormGroup;
        variantFormGroup.get('colorFreeSize')?.disable();
        variantFormGroup.get('freeSize')?.disable();
    });
    } else{
      this.rfDataModal.get('color')?.disable(); 
      this.rfDataModal.get('sizeS')?.disable(); 
      this.rfDataModal.get('sizeL')?.disable(); 
      this.rfDataModal.get('sizeM')?.disable(); 
      this.rfDataModal.get('sizeXL')?.disable(); 
      this.rfDataModal.get('sizeXXL')?.disable(); 
    }
    
  }
  onSubmit4() {
    const formData = this.rfDataModal.value;
    this._productService.postBook(formData).subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });

    console.log(formData);
  }

  addDiv(type: string): void {
    if (type === 'typeName') {
      this.showInputType = !this.showInputType;
      this.showInputSubtype = false;
      this.showInputCollection = false;


    } else if (type === 'subTypeName') {
      this.showInputSubtype = !this.showInputSubtype;
      this.showInputType = false;
      this.showInputCollection = false;


    } else if (type === 'collectionName') {
      this.showInputCollection = !this.showInputCollection;
      this.showInputType = false;
      this.showInputSubtype = false;
    }
  }
  selectChange(event: any) {
    const selectedValue = event.target.value;
    console.log('Selected value:', selectedValue);
    if (selectedValue == 'Phụ kiện') {
      this.selectedType = selectedValue
      console.log(this.selectedType, '1')
      this.clearAllVariants();
      this.addVariant()
    } else {
      this.selectedType = ''
    }

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
        this.types.push(newTypeValue);
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
        this.subTypes.push(newSubTypeValue);
      }
      this.selectedSubType = true;
      this.showInputSubtype = false;
    }
  }
  
  handleCollection(): void {
    const newCollectionValue = this.rfDataModal.get('newCollectionInput')?.value;
    if (newCollectionValue !== null) {
      this.rfDataModal.get('collectionName')?.setValue(newCollectionValue);
      this.rfDataModal.get('newCollectionInput')?.setValue('');
      if (newCollectionValue !== '') {
        this.collections.push(newCollectionValue);
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
      images: ['', [Validators.required]],      
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

}
