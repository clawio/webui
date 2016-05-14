import Ember from 'ember';

export function basename(params/*, hash*/) {
	let str = params[0];
	var base = new String(str).substring(str.lastIndexOf('/') + 1); 
	return base;
}

export default Ember.Helper.helper(basename);
