import { Input } from '@ember/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

import RouteTemplate from 'ember-route-template';

import BenchmarkReport from '../components/benchmark-report';

export default RouteTemplate(
  <template>
    {{#if @controller.report}}
      <BenchmarkReport @report={{@controller.report}} />
    {{/if}}

    <h4>
      Tests:
      <button
        {{on "click" @controller.selectAllTests}}
        type="button"
        class="btn btn-default btn-xs"
      >All</button>
      <button
        {{on "click" @controller.selectNoTests}}
        type="button"
        class="btn btn-default btn-xs"
      >None</button>
    </h4>

    <div class="form-group">
      {{#each @controller.model as |test|}}
        <div>
          <label>
            <input
              type="checkbox"
              checked={{test.isEnabled}}
              {{on "change" (fn @controller.toggleEnabled test)}}
            />
            {{test.name}}
          </label>
        </div>
      {{/each}}
    </div>

    <h4>
      Versions:
      <button
        {{on "click" @controller.selectAllVersions}}
        type="button"
        class="btn btn-default btn-xs"
      >All</button>
      <button
        {{on "click" @controller.selectNoVersions}}
        type="button"
        class="btn btn-default btn-xs"
      >None</button>
    </h4>
    <div class="form-group">
      {{#each @controller.emberVersions as |emberVersion|}}
        <div>
          <label>

            <input
              type="checkbox"
              checked={{emberVersion.isEnabled}}
              {{on "change" (fn @controller.toggleEnabled emberVersion)}}
            />

            {{emberVersion.name}}
            {{#if emberVersion.isCustom}}
              {{#if emberVersion.isEnabled}}
                <br />PATH:
                <Input @value={{emberVersion.path}} />
                <br />COMPILER PATH:
                <Input @value={{emberVersion.compilerPath}} />
              {{/if}}
            {{/if}}
          </label>
        </div>
      {{/each}}
    </div>

    <label>Feature Flags</label>
    {{#if @controller.featureFlags}}
      <table class="table">
        <tbody>
          {{#each @controller.featureFlags as |featureFlag|}}
            <tr>
              <td style="width: 20%">{{featureFlag}}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-danger btn-xs"
                  {{on "click" (fn @controller.removeFeature featureFlag)}}
                >remove</button>
              </td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    {{/if}}
    <div class="form-group">
      <input
        value={{@controller.newFlagName}}
        placeholder="Flag Name"
        {{on "input" @controller.updateNewFlagName}}
      />
      <button
        type="button"
        class="btn :btn-default :btn-xs {{if @controller.addFeatureDisabled 'disabled'}}"
        {{on "click" @controller.addFeature}}
      >Add Feature
      </button>
    </div>

    <div class="footer">
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" @controller.start}}
        disabled={{@controller.cantStart}}
      >Run Tests</button>
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" @controller.profile}}
        disabled={{@controller.cantStart}}
      >Run Tests with Profile</button>
    </div>
  </template>
);
