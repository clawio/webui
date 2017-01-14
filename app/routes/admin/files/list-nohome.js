import Ember from 'ember';
import FilesListHomeRoute from './list-home';

export default FilesListHomeRoute.extend({
	notify: Ember.inject.service('notify'),

	actions: {
		error() {
			this.get('notify').error("folder not found");
			this.transitionTo('admin.files.list-home');	
		}
	}
});
