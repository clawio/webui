import Ember from 'ember';

export function dateString(params/*, hash*/) {
  // epoch is given in seconds but js wants ms
  let mtime = params[0];
  if (mtime === 0) {
  	return "Never";
  }
  mtime *= 1000;
  return new Date(mtime).toDateString();
}

export default Ember.Helper.helper(dateString);
