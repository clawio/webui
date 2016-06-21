import Ember from 'ember';

export default Ember.Component.extend({
	notify: Ember.inject.service('notify'),

	a: function() {
		return this.get('notify').messages.length;
	}.property('notify.messages.[]'),
});
