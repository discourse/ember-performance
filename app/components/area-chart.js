import Component from "@glimmer/component";
import { schedule } from "@ember/runloop";
import Chart from "chart.js/auto";

export default class AreaChart extends Component {
  limit = 8;
  total = 0;
  options = null;

  // willDestroyElement() {
  //   super.willDestroyElement(...arguments);
  //
  //   window.removeEventListener("resize", this._resizeHandler);
  //
  //   this._resetChart();
  // }
  //
  // didReceiveAttrs() {
  //   super.didReceiveAttrs(...arguments);
  //   this.scheduleChartRendering();
  // }

  scheduleChartRendering = (element) => {
    schedule("afterRender", () => {
      this._renderChart(element && element.querySelector(".chart-canvas"));
    });
  };

  _renderChart(canvasElement) {
    if (!canvasElement) {
      return;
    }

    const context = canvasElement.getContext("2d");
    const chartData = this.args.data;

    const [axis, ...datasets] = chartData;

    const labels = datasets.map((d) => d[0]);

    const data = {
      labels,
      datasets: [
        {
          data: datasets.map((v) => v[1]),
          backgroundColor: "transparent",
          borderColor: "red",
          pointRadius: 2,
          borderWidth: 5,
        },
        {
          data: datasets.map((v) => v[2]),
          backgroundColor: "rgb(0, 0, 0, 0.1)",
          borderColor: "transparent",
          fill: 0,
          pointRadius: 0,
          borderWidth: 1,
          pointBackgroundColor: "blue",
          pointBorderColor: "purple",
        },
        {
          data: datasets.map((v) => v[3]),
          backgroundColor: "rgb(0, 0, 0, 0.1)",
          borderColor: "transparent",
          fill: 0,
          pointRadius: 0,
          borderWidth: 1,
          pointBackgroundColor: "blue",
          pointBorderColor: "purple",
        },
      ],
    };

    this._resetChart();

    if (!canvasElement) {
      return;
    }

    this._chart = new Chart(context, this._buildChartConfig(data, { axis }));
  }

  _buildChartConfig(data, { axis } = {}) {
    return {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 50,
        scales: {
          x: {
            type: "category",
            title: {
              display: axis?.[0],
              text: axis?.[0],
            },
            grid: {
              drawOnChartArea: false,
              drawTicks: true,
            },
          },
          y: {
            type: "linear",
            grace: "5%",
            title: {
              display: false,
            },
          },
        },
        plugins: {
          title: {
            display: axis?.[1],
            align: "start",
            text: axis?.[1],
          },
          legend: {
            display: false,
          },
          filler: {
            propagate: false,
          },
          customTitle: {
            display: true,
            text: "Number of defects",
            color: "blue",
          },
        },
        pointBackgroundColor: "#fff",
        radius: 10,
        interaction: {
          intersect: false,
        },
      },
    };
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}
