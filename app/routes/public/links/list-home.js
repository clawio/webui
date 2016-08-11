import Ember from 'ember';

export default Ember.Route.extend({
  link: Ember.inject.service('link'),

  model(params) {
    this.set('params', params);
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('link').ls(params.token, "")
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
            reject(error);
        })
    });
  },

  actions: {
    error() {
      this.transitionTo('public.links.info', this.get('params').token);
    }
  }
});
