import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		userDidLogin() {
			console.log('userDidLogin login-page');
			this.transitionToRoute('admin');
		},
	}
});
