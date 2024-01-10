// Import necessary Angular modules and Highcharts
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_drilldown from 'highcharts/modules/drilldown'; // Import the drilldown module
import { ChartService } from '../../services/chart.service';

HC_exporting(Highcharts);
HC_drilldown(Highcharts);

@Component({
  selector: 'app-chart-1',
  templateUrl: './chart-1.component.html',
  styleUrl: './chart-1.component.css',
})
export class Chart1Component implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | undefined;
  arrX: any[];
  arrDetail: any[];

  constructor(private _chartService: ChartService) {
    this.arrX = [];
    this.arrDetail = [];
  }

  ngOnInit(): void {
    this._chartService.getChartData1().subscribe((data: any) => {
      console.log(data);
      this.arrX = data.arrX;
      this.arrDetail = data.arrDetail;
      console.log(data.arrDetail,'1111')
      this.chartOptions = {
        chart: {
          type: 'column',
        },
        title: {
          align: 'left',
          text: 'Thống kê kho',
        },
        xAxis: {
          type: 'category',
          categories: this.arrX.map((item) => item.name),
        },
        series: [
          {
            type: 'column',
            name: 'Tổng kho',
            colorByPoint: true,
            data: this.arrX,
          },
        ],
        drilldown: {
          series: this.arrDetail, 
        },
      };
    });
  }
}
