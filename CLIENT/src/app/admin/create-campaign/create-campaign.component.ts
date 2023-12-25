import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css'],
})
export class CreateCampaignComponent implements OnInit {
  createcampaignForm!: FormGroup;
  products: any[] = [];
  productTitles: { value: string; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private _campaignService: CampaignService,
  ) {}

  ngOnInit() {
    this.createcampaignForm = this.fb.group({
      campaign_name: ['', Validators.required],
      campaign_start: ['', Validators.required],
      campaign_end: ['', Validators.required],
      campaign_script: [''],
      campaignProducts: this.fb.array([]),

    });
    this.addCampaignProduct();

    this.getProducts();
  }
  get campaignProductsFormArray() {
    return (this.createcampaignForm.get('campaignProducts') as FormArray).controls;
  }

  addCampaignProduct() {
    const campaignProduct = this.fb.group({
      product_quantity_campaign_method: '',
      product_quantity_campaign_value: '',
      product_name: [],
      product_quantity_campaign: '',
    });

    (this.createcampaignForm.get('campaignProducts') as FormArray).push(campaignProduct);
  }

  onSubmit() {
    if (this.createcampaignForm.valid) {
      const campaignData = {
        campaignName: this.createcampaignForm.value.campaign_name,
        discountPercentage:
          this.createcampaignForm.value.product_quantity_campaign_method === '1'
            ? this.createcampaignForm.value.product_quantity_campaign_value
            : null,
        startTime: new Date(this.createcampaignForm.value.campaign_start),
        endTime: new Date(this.createcampaignForm.value.campaign_end),
        campaignImage: [],
        outofSale: [],
        quantity: this.createcampaignForm.value.product_quantity_campaign,
        campaignProduct: [
          {
            productId: null,
            quantityHasPurchase: 0,
          },
        ],
      };

      this._campaignService.postCampaigns(campaignData).subscribe(
        (response) => {
          console.log('Campaign created successfully:', response);
          alert('Lưu dữ liệu thành công');

        },
        (error) => {
          console.error('Error creating campaign:', error);
          // Handle error, e.g., show an error message
          alert('Lỗi tạo campaign!');

        }
      );
    } else {
      // Handle form validation errors
      console.log('Form is not valid');
      alert('Form is not valid');

    }
  }

  getProducts() {
    this._campaignService.getProducts().subscribe(
      (response) => {
        // Assuming the response is an array of products
        this.products = response;
        this.productTitles = response.map((product: any) => ({
          value: product.title,
          label: product.title,
        }));
      },
      (error) => {
        console.error('Error getting product list:', error);
      }
    );
  }
}
