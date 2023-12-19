import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Campaign } from '../../interfaces/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-manage-campaign',
  templateUrl: './manage-campaign.component.html',
  styleUrls: ['./manage-campaign.component.css'],
})
export class ManageCampaignComponent implements OnInit, OnDestroy {
  allCampaigns: Campaign[] = [];

  constructor(private fb: FormBuilder, private _service: CampaignService) {}

  ngOnInit(): void {
    this.campaigns();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  }

  campaigns(): void {
    this._service.getCampaigns().subscribe((response: Campaign[]) => {
      this.allCampaigns = response;
      this.dtTrigger.next(null);
    });
  }

  getCurrentCampaigns(): Campaign[] {
    const currentDate = new Date();
    return this.allCampaigns.filter(campaign => new Date(campaign.startDate) <= currentDate && new Date(campaign.endDate) >= currentDate);
  }

  getPastCampaigns(): Campaign[] {
    const currentDate = new Date();
    return this.allCampaigns.filter(campaign => new Date(campaign.endDate) < currentDate);
  }

  getFutureCampaigns(): Campaign[] {
    const currentDate = new Date();
    return this.allCampaigns.filter(campaign => new Date(campaign.startDate) > currentDate);
  }

  editCampaign(campaign: Campaign): void {
    // Implement edit logic here
    console.log('Edit campaign:', campaign);
  }

  deleteCampaign(campaign: Campaign): void {
    // Implement delete logic here
    console.log('Delete campaign:', campaign);
  }
}
