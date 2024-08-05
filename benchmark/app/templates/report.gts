import RouteTemplate from 'ember-route-template';

import BenchmarkReport from '../components/benchmark-report';

interface Report {
  featureFlags: string[];
  testGroupReports: {
    emberVersion: {
      name: string;
    };
    results: {
      name: string;
      rme: number;
      samples: number;
      hz: number;
      mean: number;
    }[];
  }[];
}

function buildData(): Report {
  return null as unknown as Report;
}

export default RouteTemplate(<template><BenchmarkReport @report={{(buildData)}} /></template>);
