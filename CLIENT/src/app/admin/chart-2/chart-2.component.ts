import { Component, NgZone } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import HC_exporting from 'highcharts/modules/exporting';
import { ChartService } from '../../services/chart.service';
HC_exporting(Highcharts);

@Component({
  selector: 'app-chart-2',
  templateUrl: './chart-2.component.html',
  styleUrl: './chart-2.component.css',
})
export class Chart2Component {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | undefined;

  arrX: any[] | undefined;
  arrY: any[] | undefined;
  selectedDay: any = '7';

  constructor(
    private _chartService: ChartService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getTimeValue(this.selectedDay);
  }

  getTimeValue(maxDay: any) {
    this._chartService.getCharYear(maxDay).subscribe((data) => {
      this.ngZone.run(() => {
        this.arrX = data.arrX;
        this.arrY = data.arrY;
        this.chartOptions = {
          title: {
            text: 'Thống kê số lượng tài khoản',
            align: 'left',
          },
          xAxis: {
            categories: this.arrX,
          },
          series: [
            {
              type: 'line',
              name: 'Account User',
              data: this.arrY,
            },
          ],
        };
      });
    });
  }

  onDayChange() {
    this.getTimeValue(this.selectedDay);
  }
}
