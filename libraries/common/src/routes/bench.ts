import Route from '@ember/routing/route';

export default class Bench extends Route {
  async beforeModel(transition) {
    let name = transition.to.params.name;

    console.log(name, transition);

    if (name === 'index.html') {
    }
  }
}
