import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'ember-5-7/app';
import config from 'ember-5-7/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
