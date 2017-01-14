import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		list(path) {
			console.log(path);
			this.sendAction('list', path);	
		}
	}
});
