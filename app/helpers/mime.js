import Ember from 'ember';

export function mime(params) {
  const type = params[0];
  const mime = params[1];

  if (type === 0) {
  	return 'yellow folder open';
  } else {
	if (!mime) {
  		return 'cube';
	}
	if (mime === 'application/pdf') {
		return 'blue file pdf outline';
	}
	if (mime === 'application/javascript') {
		return 'blue code outline';
	}
	if (mime === 'application/xml') {
		return 'blue file code outline';
	}
	if (mime.indexOf('image') > -1) {
		return 'blue camera retro';
	}
	if (mime.indexOf('html') > -1) {
		return 'blue html5';
	}
	if (mime.indexOf('css') > -1) {
		return 'blue css3';
	}

	// TODO(labkode) fallback to extension
  	return 'cube';
  }
}

export default Ember.Helper.helper(mime);
