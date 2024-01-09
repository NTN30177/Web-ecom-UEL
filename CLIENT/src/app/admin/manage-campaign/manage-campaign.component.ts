import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Campaign } from '../../interfaces/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-manage-campaign',
  templateUrl: './manage-campaign.component.html',
  styleUrls: ['./manage-campaign.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageCampaignComponent implements OnInit, AfterViewInit, OnDestroy {
  allCampaigns: Campaign[] = [];

  constructor(private fb: FormBuilder, private _service: CampaignService) {}

  ngOnInit(): void {
    this.campaigns();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };
    
  }

  ngAfterViewInit(): void {
    // Khởi tạo DataTables trong hàm này để đảm bảo rằng DOM đã được tạo xong
    $('#example').DataTable({
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    });
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
    console.log('Edit campaign:', campaign);
    alert("Chức năng đang được phát triển!")
  }

  deleteCampaign(campaign: Campaign): void {
    console.log('Delete campaign:', campaign);
    alert("Chức năng đang được phát triển!")
  }
}
