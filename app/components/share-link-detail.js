import Ember from 'ember';

export default Ember.Component.extend({
	link: null,

	actions: {
		unlink()  {
			alert('unlink');	
		}
	}
});
