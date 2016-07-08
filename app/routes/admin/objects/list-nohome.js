import Ember from 'ember';
import ObjectsListHomeRoute from './list-home';

export default ObjectsListHomeRoute.extend({
	notify: Ember.inject.service('notify'),

	actions: {
		error() {
			this.get('notify').error("tree not found");
			this.transitionTo('admin.objects.list-home');	
		}
	}
});
