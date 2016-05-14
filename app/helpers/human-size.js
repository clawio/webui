import Ember from 'ember';

export function humanSize(params/*, hash*/) {
	let type = params[0];
 	let bytes = params[1];
	let si = params[2];
	var thresh = si ? 1000 : 1024;
	if(bytes < thresh) return bytes + ' B';
	var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while(bytes >= thresh);
	
	return bytes.toFixed(1)+' '+units[u];
}

export default Ember.Helper.helper(humanSize);
