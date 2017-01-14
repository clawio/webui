import Ember from 'ember';


export default Ember.Component.extend({
	helpers: Ember.inject.service('helpers'),

	files: [],
	viewObjects: [],
	filterterm: "",

	breadcrumbs: [],


	uploadTotal: 0,
	uploadValue: 0,
	uploadFilename: "",
	uploadFilesizeRatio: "",

	batchMode: false,
	countSelectedObjects: 0,

	shareLink: null,
	
	actions: {
		processRename(data, event) {
			let newObjectName= this.get('newObjectName');
			console.log(newObjectName);
			if (event.keyCode === 13 && newObjectName)  { // enter key
				let o = this.get('viewObjects').findBy('ui_rename_input_visible', true);

				// trigger rename only if new name is different from old name 
				if (this.get('helpers').basename(o.path) !== newObjectName) {
					this.sendAction('renameObject', o, newObjectName);
				}
				this.hideRenameInput();
			} else if (event.keyCode === 27) { // escape key
				this.hideRenameInput();
			}
		},

		hideRenameInput() {
			this.hideRenameInput();
		},

		showTreeInput() {
			this.sendAction('showTreeInput');
		},

		showBlobInput() {
			this.sendAction('showBlobInput');
		},

		triggerUpload() {
			this.$(".x-file--input :input").click();
		},
		didSelectFiles(files) {
			this.sendAction('upload', files);	
		},

		examine(path) {
			this.sendAction('examine', path);		
		},

		list(path) {
			this.sendAction('list', path);
		},

		default(type, path) {
			if (!this.get('batchMode')) {
				if (type === 'tree' ) {
					this.sendAction('list', path);
				} else {
					this.sendAction('download', path);
				}
			}
		},

		delete(path) {
			this.sendAction('delete', path);
		},

		filter() {
			this.filterObjects();
		},

		toggleBatchMode() {
			this.set('batchMode', !this.get('batchMode'));
			this.clearSelection();
		},

		toggleSelectObject(file) {
			let o = this.viewObjects.findBy('path', file.path);
			Ember.set(o, 'ui_selected', !o.ui_selected);
		},

		toggleAll() {
			this.set('selectedAll', this.get('selectedAll'));
			this.files.forEach((o) => {
				Ember.set(o, 'ui_selected', !o.ui_selected);
			});	
		},

		deleteSelected() {
			this.get('viewObjects').filterBy('ui_selected', true).forEach((o) => {
				this.sendAction('delete', o.path);
				this.clearSelection();
			});		
		},

		toggleRename(o) {
			this.set('newObjectName', this.get('helpers').basename(o.path));
			Ember.set(o, 'ui_rename_input_visible', !o.ui_rename_input_visible);
		},

		share(o) {
			this.set('shareObject', o);
			this.sendAction('share', o);
		},

		createShareLink(password, epoch) {
			this.sendAction('createShareLink', this.get('shareObject'), password, epoch);
		},
		deleteShareLink(token) {
			this.sendAction('deleteShareLink', token);
		}
	},
	
	initializeViewObjects: function() {
		this.set('viewObjects', this.get('files'));
	}.on('init'),
	
	filesChanged: function() {
		// recompute filter view. This is needed because when adding new files they are added to the current
		// view but maybe they do not meet the filter criteria. Also, they are not being added in the correct
		// order specified by the column order criteria.
		this.filterObjects();
	}.observes('files.[]'),

	filtertermChanged: function() {
		this.filterObjects();
	}.observes('filterterm'),

	selectedObjects: function() {
		let viewObjects = this.get('viewObjects');	
		let selected = viewObjects.filterBy('ui_selected', true).get('length');
		// TODO(labkode) the best way to achieve this behaviour is to rely on the selectedAll
		// attribute but then we mute it twice and it is not allowed in Ember. A better solution
		// may be to use computed properties.
		if (selected >= viewObjects.length) {
			this.$(".checkbox.select-all").prop("checked", true);
			this.$(".checkbox.select-all").prop("indeterminate", false);
		} else if (selected === 0) {
			this.$(".checkbox.select-all").prop("checked", false);
			this.$(".checkbox.select-all").prop("indeterminate", false);
		} else {
			this.$(".checkbox.select-all").prop("indeterminate", true);
		}
		return selected;
	}.property('viewObjects.@each.ui_selected'),

	selectedAllChanged: function() {
		let selected = this.get('selectedAll');
		if (selected) {
			this.get('viewObjects').setEach('ui_selected', true);	
		} else {
			this.get('viewObjects').setEach('ui_selected', false);
		}	
	}.observes('selectedAll'),


	filterObjects() {
		let filterterm = this.get('filterterm');
		if (!filterterm) {
			this.set('viewObjects', this.get('files'));	
		} else {
			filterterm = filterterm.toLowerCase();
			let filtered = this.get('files').filter((o) => {
				return o.path.toLowerCase().indexOf(filterterm) > -1;
			});
			this.set('viewObjects', filtered);
		}
	},

	clearSelection() {
		this.get('viewObjects').setEach('ui_selected', false);
		this.set('selectedAll', false);
	},

	hideRenameInput() {
		let o = this.get('viewObjects').findBy('ui_rename_input_visible', true);
		Ember.set(o, 'ui_rename_input_visible', false);
		this.set('newObjectName', "");
	},

	didInsertElement() {
		this.$(".x-file--input").css("display", "none"); // to limit the width of the menu
	},

	didRender() {
		// TODO(labkode) this event is triggered too many times because of the upload progress handler
		this.$(".dropdown").dropdown();
		this.$(".rename-input").focus();

		// trigger focus event
		if (this.get('creatingObject')) {
			this.$(".new-file-input :input").focus();
		}
		// trigger focus event
		if (this.get('creatingTree')) {
			this.$(".new-tree-input :input").focus();
		}

		if (this.get('batchMode')) {
			this.$(".checkbox").checkbox();
		}

		// add modTime popup to all elements
		this.get('viewObjects').forEach((o) => {
			let popup = Ember.$(`[data-clawio-path='${o.path}'] .clawio-modtime  small`);
			popup.popup();	
		});
	},
});
