import Ember from 'ember';

export function dateString(params/*, hash*/) {
  // epoch is given in seconds but js wants ms
  let modified = params[0];
  if (modified === 0) {
  	return "Never";
  }
  modified *= 1000;
  return new Date(modified).toDateString();
}

export default Ember.Helper.helper(dateString);
