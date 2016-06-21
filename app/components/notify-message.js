import Ember from 'ember';

export default Ember.Component.extend({
	notify: Ember.inject.service('notify'),

	actions: {
		markAsReaded(msg) {
			this.get('notify').markAsReaded(msg);	
		},	
	},

	messages: function() {
		let val = this.get('notify').messages.filterBy('readed', false);
		console.log(val);
		return val;
	}.property('notify.messages.[]'),
});
