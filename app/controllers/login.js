import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		userDidAuthenticated() {
			this.transitionToRoute('admin');
		},
	}
});
