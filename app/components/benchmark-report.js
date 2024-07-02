import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, computed } from "@ember/object";
import { equal, gt } from "@ember/object/computed";
import { htmlSafe } from "@ember/template";
import numeral from "numeral";

export default class BenchmarkReport extends Component {
  @tracked mode = "html";
  @equal("mode", "html") isHtmlMode;
  @equal("mode", "text") isTextMode;
  @gt("args.report.testGroupReports.length", 1) showGraph;

  chartOptions = {
    title: "Time (ms) (lower is better)",
    hAxis: {
      title: "Ember Version",
    },
    intervals: { style: "area" },
    legend: "none",
  };

  @computed("args.report.testGroupReports.[]")
  get groupedTests() {
    const tests = {};
    this.args.report.testGroupReports.forEach((testGroupReport) => {
      testGroupReport.results.forEach((result) => {
        const test = tests[result.name] || {
          name: result.name,
          data: [],
          chartData: [
            [
              "Ember Version",
              "Time in ms (lower is better)",
              { role: "interval" },
              { role: "interval" },
            ],
          ],
        };
        test.data.push({
          emberVersion: testGroupReport.emberVersion,
          result,
        });
        test.chartData.push([
          testGroupReport.emberVersion.name,
          result.mean,
          result.mean - (result.mean * result.rme) / 100,
          result.mean + (result.mean * result.rme) / 100,
        ]);

        tests[result.name] = test;
      });
    });

    return tests;
  }

  @computed("report.testGroupReports.[]")
  get asciiTable() {
    let result = "User Agent: " + navigator.userAgent + "\n";

    const featureFlags = this.get("report.featureFlags");
    if (featureFlags && featureFlags.length) {
      result += "Feature Flags: " + featureFlags.join(", ") + "\n";
    }
    result += "\n";

    const table = new window.AsciiTable("Ember Performance Suite - Results");

    table.setHeading("Name", "Speed", "Error", "Samples", "Mean");

    this.args.report.testGroupReports.forEach((testGroupReport) => {
      table.addRow(" -- Ember " + testGroupReport.emberVersion.name + " -- ");

      testGroupReport.results.forEach((item) => {
        table.addRow(
          item.name,
          numeral(item.hz).format("0,0.00") + " / sec",
          "∓" + numeral(item.rme).format("0,0.00") + "%",
          numeral(item.samples).format(),
          numeral(item.mean).format("0,0.00") + " ms",
        );
      });
    });

    return htmlSafe(result + table.toString());
  }

  @action
  switchMode(mode) {
    this.mode = mode;
  }
}
