import Ember from 'ember';

export default Ember.Route.extend({
	link: Ember.inject.service('link'),

	model(params) {
		this.set('params', params);
		return new Ember.RSVP.Promise((resolve, reject) => {
			this.get('link').isProtected(params.token)
			.then((data) => {
				resolve(data)
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

	afterModel() {
		let model = this.modelFor(this.routeName);
		if (model && model.protected === false) { // link is not protected
			this.get('link').saveLinkCredentials(this.get('params').token, '');
			this.transitionTo('public.links.examine', this.get('params').token);
			return;
		}
	},

	actions: {
		validate(secret) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'validating', true);
			this.get('link').info(this.get('params').token, secret)
			.then((link) => {
				this.get('link').saveLinkCredentials(this.get('params').token, secret);
				this.transitionTo('public.links.examine', this.get('params').token);
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
