import Ember from 'ember';

export default Ember.Component.extend({
	link: null,

	actions: {
		unlink()  {
			this.sendAction('unlink', this.get('link').token);
		}
	}
});
