import Ember from 'ember';

export default Ember.Component.extend({
	notify: Ember.inject.service('notify'),

	actions: {
		markAsReaded(msg) {
			this.get('notify').markAsReaded(msg);	
		},	
	},

	latestMessage: function() {
		let val = this.get('notify').messages.filterBy('readed', false);
		// just return the latest message to not pollute the interface with messages
		if (val.length > 0) {
			return val[val.length -1];
		}
	}.property('notify.messages.[]'),
});
