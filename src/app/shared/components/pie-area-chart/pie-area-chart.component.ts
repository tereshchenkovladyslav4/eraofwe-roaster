import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import * as echarts from 'echarts';
import ECharts = echarts.ECharts;

@Component({
    selector: 'app-pie-area-chart',
    templateUrl: './pie-area-chart.component.html',
    styleUrls: ['./pie-area-chart.component.scss'],
})
export class PieAreaChartComponent implements OnInit, OnChanges {
    @ViewChild('pieAreaChart', { static: true }) pieAreaChart: ElementRef;
    @Input() results = [];
    barEchart: ECharts;

    chartOption = {
        color: ['#747588', '#f8f8f8'],
        height: '335px',
        tooltip: {
            trigger: 'item',
            textStyle: {
                color: '#232334',
                fontSize: '12px',
                fontFamily: 'Muli',
            },
        },
        series: [
            {
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '80%'],
                label: {
                    position: 'inner',
                    fontSize: 14,
                    textStyle: {
                        fontSize: '12px',
                        fontFamily: 'Muli',
                    },
                    formatter: '{b}: {c}%',
                },
                labelLine: {
                    show: false,
                },
                data: [],
            },
        ],
    };

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        this.barEchart = echarts.init(this.pieAreaChart.nativeElement);
        this.chartOption.series[0].data = this.results;
        this.barEchart.setOption(this.chartOption);
    }
}
