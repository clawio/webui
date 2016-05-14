import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	profile: Ember.inject.service('profile'),

	model() {
		return this.get('profile').getUser();	
	}
});
