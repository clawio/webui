import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		create() {
			this.sendAction('create', this.get('password'));
		},
	}
});
