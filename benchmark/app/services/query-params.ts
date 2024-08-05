import { cached } from '@glimmer/tracking';
import { isDestroyed, isDestroying } from '@ember/destroyable';
import Service, { service } from '@ember/service';

import { link } from 'reactiveweb/link';

import type RouterService from '@ember/routing/router-service';

type QPs = Record<string, string | number>;

/**
 * A light QP service.
 * Contsraints:
 * - every QP is defined at the application-level
 * - all QPs are sticky
 * - setting QPs cannot happen synchronously, because setting QPs
 *   requires a transition.
 *   (also true of the default way to use QPs, but they hide it)
 */
export default class QueryParams extends Service {
  @service declare router: RouterService;

  @link emberVersions = new QPArray('emberVersions', (...args) => this.setQP(...args));
  @link benchmarks = new QPArray('benchmarks', (...args) => this.setQP(...args));

  /**
   * Allows batching QP updates
   */
  get queryParams(): QPs {
    return (this.router.currentRoute?.queryParams ?? {}) as QPs;
  }
  #frame?: number;
  #qps?: QPs;
  setQP = (qps: QPs) => {
    if (this.#frame) cancelAnimationFrame(this.#frame);

    this.#qps = {
      ...this.queryParams,
      ...this.#qps,
      ...qps,
    };

    this.#frame = requestAnimationFrame(() => {
      if (isDestroyed(this) || isDestroying(this)) return;

      this.router.transitionTo({
        queryParams: this.#qps,
      });
    });
  };
}

class QPArray {
  @service declare router: RouterService;

  #name: string;
  #setQP: (qps: QPs) => void;

  constructor(name: string, setQP: (qps: QPs) => void) {
    this.#name = name;
    this.#setQP = setQP;
  }

  get queryParams(): QPs {
    return (this.router.currentRoute?.queryParams ?? {}) as QPs;
  }

  @cached
  get value() {
    return decodeJSONArrayURI(this.queryParams[this.#name]);
  }

  set = (item: string[]) => this.#setQP({ [this.#name]: JSON.stringify(item) });

  hasItem = (item: string) => this.value.includes(item);

  remove = (item: string) => {
    if (this.hasItem(item)) {
      let without = this.value.filter((v: string) => v !== item);

      this.set(without);
    }
  };

  add = (item: string) => {
    if (this.hasItem(item)) return;

    let added = [...this.value, item];

    this.set(added);
  };

  toggle = (item: string) => {
    if (this.hasItem(item)) {
      this.remove(item);

      return;
    }

    this.add(item);
  };
}

function decodeJSONArrayURI(raw?: unknown) {
  if (!raw) return [];
  if (typeof raw !== 'string') return [];

  let decoded = decodeURIComponent(raw);

  try {
    let parsed = JSON.parse(decoded);

    return parsed;
  } catch (e) {
    console.error(e);

    return [];
  }
}
