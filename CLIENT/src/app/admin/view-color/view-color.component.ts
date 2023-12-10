import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-color',
  templateUrl: './view-color.component.html',
  styleUrl: './view-color.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ViewColorComponent implements OnInit {
  constructor() {}
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    $(document).ready(function() {
      $('#example').DataTable({language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },});
  } );
    
  }

}
