import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrl: './create-campaign.component.css'
})
export class CreateCampaignComponent implements OnInit {

  createcampaignForm!: FormGroup

  constructor(private fb: FormBuilder) { }
  
  ngOnInit() {
    this.createcampaignForm = this.fb.group({
      campaign_name: ['', Validators.required], // Add validation if needed
      campaign_type: ['', Validators.required],
      campaign_start: ['', Validators.required],
      campaign_end: ['', Validators.required],
      campaign_script: [''],
      // Add more form controls as needed
      product_quantity_campaign_method: ['', Validators.required],
      product_quantity_campaign_value: ['', Validators.required],
      product_name: ['', Validators.required],
      product_quantity_campaign: ['', Validators.required]
    });
  }
}
