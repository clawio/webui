import Ember from 'ember';

export default Ember.Route.extend({
	notify: Ember.inject.service('notify'),

	model() {
		return this.get('notify').messages;	
	}
});
