import Ember from 'ember';
import ENV from 'webui/config/environment';

console.log(ENV);
export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	
	actions: {
		logout() { 
			this.get('session').invalidate();
		}
	}
});
