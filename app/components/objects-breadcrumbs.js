import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		list(pathspec) {
			console.log(pathspec);
			this.sendAction('list', pathspec);	
		}
	}
});
