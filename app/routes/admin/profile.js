import Ember from 'ember';

export default Ember.Route.extend({
	profile: Ember.inject.service('profile'),

	model() {
		let user = this.get('profile').getUser();
		return user; 
	}
});
