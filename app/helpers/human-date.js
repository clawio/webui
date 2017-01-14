import Ember from 'ember';

export function humanDate(params/*, hash*/) {
  // modified is in ns, we need ms
  //let modified = params[0] / 1000000;
  let modified = params[0] * 1000;
  return new Date(modified);
}

export default Ember.Helper.helper(humanDate);
