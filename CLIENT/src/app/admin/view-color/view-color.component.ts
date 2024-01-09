import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { SortPaginationService } from '../../services/sort-pagination.service';

@Component({
  selector: 'app-view-color',
  templateUrl: './view-color.component.html',
  styleUrls: ['./view-color.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewColorComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  listColor:any;
  constructor(private _sortPaginationService: SortPaginationService) {}

  ngOnInit(): void {
    this.getColor()
    if (!$.fn.dataTable.isDataTable('#example')) {
      this.dtOptions = {
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
        },
      };
      this.dtTrigger.next(null);
    }
  }
  getColor() {
    this._sortPaginationService.getColor().subscribe((data) => {
      this.listColor = data;
      console.log(data, 'data');
    });
  }
}
