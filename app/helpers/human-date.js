import Ember from 'ember';

export function humanDate(params/*, hash*/) {
  // mtime is in ns, we need ms
  let mtime = params[0] / 1000000;
  return new Date(mtime);
}

export default Ember.Helper.helper(humanDate);
