import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WebsocketService } from '../services/websocket.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  data: any;
  coinList: string[] = [
    'Bitcoin',
    'Ethereum',
    'Dogecoin',
    'Tron',
    'Binance',
    'Litecoin',
    'Ultra',
  ];
  selectedCoin: any = 'bitcoin';
  url = `wss://ws.coincap.io/prices?assets=`;
  labels: any[] = [];
  count: number = 0;
  coinData: any[] = [];

  lineStyle: number = 0; //0 for straight lines, bigger number for some curve

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.coinData,
        label: this.selectedCoin.toUpperCase(),
        backgroundColor: 'rgba(148,159,255,0.2)',
        borderColor: 'rgba(148,159,255,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: this.labels,
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: this.lineStyle,
      },
    },
    scales: {
      x: {},
      'y-axis-0': {
        position: 'left',
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  public lineChartType: ChartType = 'line';
  constructor(
    private wss: WebsocketService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.connectAndSub(this.selectedCoin);
  }

  async connectAndSub(coin: string) {
    if (this.chart) {
      this.coinData = [];
      this.labels = [];
      this.chart.data!.datasets[0].label = coin.toUpperCase();
      this.chart.data!.datasets[0].data = this.coinData;
      this.chart.data!.labels = this.labels;
      this.chart.update();
    }
    const fullUrl = this.url + coin;
    this.wss.create(fullUrl);
    this.wss.subject?.pipe(retry()).subscribe(async (res: any) => {
      this.count += 1;
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      if (res) {
        const tempTime = new Date().getTime() / 1000;
        if (tempTime - now.getTime() / 1000 > 120) {
          this.coinData.shift();
          this.labels.shift();
        }
        this.labels.push(time);
        this.coinData.push(res[coin]);
        this.chart?.update();
      }
    });
    const toast = await this.toastCtrl.create({
      message: `Tracking ${coin}!`,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  onSelect(event: any) {
    this.wss.subject?.complete();
    this.connectAndSub(event);
  }
}
