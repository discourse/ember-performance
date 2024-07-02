import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, computed } from "@ember/object";
import { equal, gt } from "@ember/object/computed";
import { htmlSafe } from "@ember/template";
import { formatNumber } from "../helpers/format-number";

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

        test.chartData.push({
          emberVersion: testGroupReport.emberVersion.name,
          mean: result.mean,
          margin_error_lower: Math.max(
            result.mean - (result.mean * result.rme) / 100,
            0,
          ),
          margin_error_upper: result.mean + (result.mean * result.rme) / 100,
        });

        tests[result.name] = test;
      });
    });

    return tests;
  }

  get asciiTable() {
    let result = "User Agent: " + navigator.userAgent + "\n";

    const featureFlags = this.args.report.featureFlags;
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
          formatNumber(item.hz, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + " / sec",
          "∓" +
            formatNumber(item.rme, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "%",
          formatNumber(item.samples, {
            maximumFractionDigits: 0,
          }),
          formatNumber(item.mean) + " ms",
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
