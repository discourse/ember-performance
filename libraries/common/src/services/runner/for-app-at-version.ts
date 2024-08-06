import { getOwner } from '@ember/owner';
import Service from '@ember/service';

export default class ForAppAtVersion extends Service {
  get env() {
    let env = getOwner(this).resolveRegistration('config:environment');

    return env;
  }

  get emberVersion() {
    let versionSpecifier = this.env.deps['ember-source'];

    let cleaned = versionSpecifier.replace(/(\^|~|>=|<|>|<=)/, '');

    return cleaned;
  }
}
