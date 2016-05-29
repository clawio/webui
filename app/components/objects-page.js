import Ember from 'ember';


export default Ember.Component.extend({
	init () {
		this._super(...arguments);
		this.set('_originalObjects', this.get('objects'));
	},

	actions: {
		didSelectFiles(files) {
			this.sendAction('upload', files);	
		},
		examine(pathspec) {
			this.sendAction('examine', pathspec);		
		},
		list(pathspec) {
			this.sendAction('list', pathspec);
		},

		default(type, pathspec) {
			if (type === 0 ) {
				this.sendAction('list', pathspec);
			} else {
				this.sendAction('download', pathspec);
			}
		},

		delete(pathspec) {
			this.sendAction('delete', pathspec);
		},

		filter() {
			let filterterm = this.get('filterterm');
			if (!filterterm) {
				this.set('objects', this.get('_originalObjects'));	
			} else {
				filterterm = filterterm.toLowerCase();
				let filtered = this.get('objects').filter((o) => {
					return o.pathspec.toLowerCase().indexOf(filterterm) > -1;
				});
				this.set('objects', filtered);
			}
		},
		

	},
	didInsertElement() {
	    Ember.run.scheduleOnce('afterRender', this, function() {
		this.$(".dropdown").dropdown();
            });
	}
});
