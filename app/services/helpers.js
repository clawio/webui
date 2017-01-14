import Ember from 'ember';

export default Ember.Service.extend({
	basename(path) {
		var base = path.substring(path.lastIndexOf('/') + 1); 
		return base;
	}
});
