import Ember from 'ember';
import ObjectsListHomeRoute from './objects-list-home';

export default ObjectsListHomeRoute.extend({
	notify: Ember.inject.service('notify'),

	actions: {
		error(error, transition) {
			this.get('notify').error("tree not found");
			this.transitionTo('admin.objects-list-home');	
		}
	}
});
