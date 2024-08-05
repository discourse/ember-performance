import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

import AreaChart from './area-chart';
import { formatNumber } from './utils';

export default class BenchmarkReport extends Component {
  @tracked mode = 'html';

  get isHtmlMode() {
    return this.mode === 'html';
  }

  get isTextMode() {
    return this.mode === 'text';
  }

  get showGraph() {
    return this.args.report.length > 1;
  }

  chartOptions = {
    title: 'Time (ms) (lower is better)',
    hAxis: {
      title: 'Ember Version',
    },
    intervals: { style: 'area' },
    legend: 'none',
  };

  get groupedTests() {
    const tests = {};

    this.args.report.forEach(({ name, version, results: result }) => {
      const test = tests[name] || {
        name: name,
        data: [],
        chartData: [
          [
            'Ember Version',
            'Time in ms (lower is better)',
            { role: 'interval' },
            { role: 'interval' },
          ],
        ],
      };

      test.data.push({
        emberVersion: version,
        result,
      });

      test.chartData.push({
        emberVersion: version,
        mean: result.mean,
        margin_error_lower: Math.max(result.mean - (result.mean * result.rme) / 100, 0),
        margin_error_upper: result.mean + (result.mean * result.rme) / 100,
      });

      tests[result.name] = test;
    });

    return tests;
  }

  get asciiTable() {
    let result = 'User Agent: ' + navigator.userAgent + '\n';

    result += '\n';

    const table = new window.AsciiTable('Ember Performance Suite - Results');

    table.setHeading('Name', 'Speed', 'Error', 'Samples', 'Mean');

    this.args.report.forEach(({ name, version, results }) => {
      table.addRow(' -- Ember ' + version + ' -- ');

      results.forEach((item) => {
        table.addRow(
          item.name,
          formatNumber(item.hz, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + ' / sec',
          '∓' +
            formatNumber(item.rme, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            '%',
          formatNumber(item.samples, {
            maximumFractionDigits: 0,
          }),
          formatNumber(item.mean) + ' ms'
        );
      });
    });

    return htmlSafe(result + table.toString());
  }

  @action
  switchMode(mode, event) {
    event.preventDefault();
    this.mode = mode;
  }

  <template>
    <h4>Results:</h4>

    <ul class="nav nav-tabs">
      <li role="presentation" class={{if this.isHtmlMode "active"}}>
        <a href {{on "click" (fn this.switchMode "html")}}>HTML</a>
      </li>
      <li role="presentation" class={{if this.isTextMode "active"}}>
        <a href {{on "click" (fn this.switchMode "text")}}>Text</a>
      </li>
    </ul>

    {{#if this.isHtmlMode}}
      {{#each-in this.groupedTests as |name test|}}
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">{{test.name}}</h3>
          </div>
          <div class="panel-body">
            {{#if this.showGraph}}
              <AreaChart @data={{test.chartData}} @options={{this.chartOptions}} />
            {{/if}}
            <table class="table table-striped table-hover table-condensed table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th class="numeric">Speed</th>
                  <th class="numeric">Error</th>
                  <th class="numeric">Samples</th>
                  <th class="numeric">Mean</th>
                </tr>
              </thead>
              <tbody>
                {{#each test.data as |item|}}
                  <tr>
                    <td>
                      <strong>{{test.name}}</strong>
                      <span class="label label-primary">{{item.emberVersion.name}}</span>
                    </td>
                    <td class="numeric">{{formatNumber
                        item.result.hz
                        minimumFractionDigits=2
                        maximumFractionDigits=2
                      }}
                      / sec
                    </td>
                    <td class="numeric">&#x2213;
                      {{formatNumber
                        item.result.rme
                        minimumFractionDigits=2
                        maximumFractionDigits=2
                      }}%
                    </td>
                    <td class="numeric">{{item.result.samples}}</td>
                    <td class="numeric">{{formatNumber item.result.mean mode="auto"}}
                      ms
                    </td>
                  </tr>
                {{/each}}
              </tbody>
            </table>
          </div>
        </div>
      {{/each-in}}
    {{else}}
      <pre class="text-results">{{this.asciiTable}}</pre>
    {{/if}}

    <hr />
  </template>
}
