import Ember from 'ember';

export default Ember.Service.extend({
	basename(pathspec) {
		var base = pathspec.substring(pathspec.lastIndexOf('/') + 1); 
		return base;
	}
});
