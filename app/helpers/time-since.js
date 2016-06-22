import Ember from 'ember';

export function timeSince(params/*, hash*/) {
	// data is given in nanoseconds so we need to convert it to ms 
	let date = params[0] / 1000000;

	let seconds = Math.floor((new Date() - date) / 1000);
	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
	return interval + " years ago";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
	return interval + " months ago";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
	return interval + " days ago";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
	return interval + " hours ago";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
	return interval + " minutes ago";
	}
	let s = Math.floor(seconds);
	if (s === 0) {
		return "now";
	}
	return s + " seconds ago";
}

export default Ember.Helper.helper(timeSince);
