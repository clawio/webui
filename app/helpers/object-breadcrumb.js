import Ember from 'ember';

export function objectBreadcrumb(params) {
	var current = params[0] || "/";
	var parts = current.split('/');
	parts.shift();
	var previousPath = "";
	var breadcrumbCollection = [];
	for(var i = 0; i < parts.length; i++ ) {
		var newPath = previousPath + '/' + parts[i];
		var name = parts[i];
		breadcrumbCollection.push({
			path: newPath,
			name: name
		});
		previousPath = newPath;
	}
	return breadcrumbCollection;
}

export default Ember.Helper.helper(objectBreadcrumb);
