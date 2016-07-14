import Ember from 'ember';

export default Ember.Route.extend({
	link: Ember.inject.service('link'),

	model(params) {
		this.set('params', params);
		return new Ember.RSVP.Promise((resolve, reject) => {
			this.get('link').isProtected(params.token)
			.then((data) => {
				if (data.isProtected) {
					resolve(data)
				} else {
					// trigger
				}
			})
			.catch((error) => {
				if (error.status === 404) {
					resolve(null);	
				} else {
					reject(error);
				}
			}) 
	       	});
	},

	actions: {
		validate(secret) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'validating', true);
			this.get('link').info(this.get('params').token, secret)
			.then((link) => {
				Ember.set(model, 'link', link);
			})
			.catch(() => {
				Ember.set(model, 'error', "secret is invalid");
			}) 
			.finally(() => {
				Ember.set(model, 'validating', false);
			})
		}
	}
});
