import Ember from 'ember';


export default Ember.Component.extend({
	objects: [],
	viewObjects: [],
	breadcrumbs: [],
	uploadTotal: 0,
	uploadValue: 0,
	uploadFilename: "",
	uploadFilesizeRatio: "",
	isObjectBeingCreated: false,
	isTreeBeingCreated: false,
	batchMode: false,
	countSelectedObjects: 0,
	
	initializeViewObjects: function() {
		this.set('viewObjects', this.get('objects'));
	}.on('init'),
	
	objectsChanged: function() {
		// recompute filter view. This is needed because when adding new objects they are added to the current
		// view but maybe they do not meet the filter criteria. Also, they are not being added in the correct
		// order specified by the column order criteria.
		this.filterObjects();
	}.observes('objects.[]'),

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
			this.set('viewObjects', this.get('objects'));	
		} else {
			filterterm = filterterm.toLowerCase();
			let filtered = this.get('objects').filter((o) => {
				return o.pathspec.toLowerCase().indexOf(filterterm) > -1;
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

	actions: {
		processRename(data, event) {
			let newObjectName= this.get('newObjectName');
			if (event.keyCode === 13 && newObjectName)  { // enter key
				let o = this.get('viewObjects').findBy('ui_rename_input_visible', true);
				this.sendAction('renameObject', o, newObjectName);
				this.hideRenameInput();
			} else if (event.keyCode === 27) { // escape key
				this.hideRenameInput();
			}
		},
		hideRenameInput() {
			this.hideRenameInput();
		},
		processNewTree(data, event) {
			let treeName = this.get('newTreeName');
			if (event.keyCode === 13 && treeName)  { // enter key
				this.set('creatingTree', false);
				this.sendAction('createTree', treeName);
			} else if (event.keyCode === 27) { // escape key
				this.set('newTreeName', "");
				this.set('creatingTree', false);
			}
		},
		showCreatingTree() {
			this.set('newTreeName', "");
			this.set('creatingTree', true);
		
		},
		hideCreatingTree() {
			if (!this.get('processingCreateTree')) {
				this.set('newTreeName', "");
				this.set('creatingTree', false);
			}
		},
		processNewObject(data, event) {
			let objectName = this.get('newObjectName');
			if (event.keyCode === 13 && objectName)  { // enter key
				this.set('creatingObject', false);
				this.sendAction('createObject', objectName);
			} else if (event.keyCode === 27) { // escape key
				this.set('newObjectName', "");
				this.set('creatingObject', false);
			}
		},
		showCreatingObject() {
			this.set('newObjectName', "");
			this.set('creatingObject', true);
		
		},
		hideCreatingObject() {
			if (!this.get('processingCreateObject')) {
				this.set('newObjectName', "");
				this.set('creatingObject', false);
			}
		},
		triggerUpload() {
			this.$(".x-file--input :input").click();
		},
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
			if (!this.get('batchMode')) {
				if (type === 'tree' ) {
					this.sendAction('list', pathspec);
				} else {
					this.sendAction('download', pathspec);
				}
			}
		},
		delete(pathspec) {
			this.sendAction('delete', pathspec);
		},

		filter() {
			this.filterObjects();
		},

		clearFilter() {
			this.set('filterterm', '');	
			this.filterObjects();
		},

		toggleBatchMode() {
			this.set('batchMode', !this.get('batchMode'));
			this.clearSelection();
		},

		toggleSelectObject(object) {
			console.log(object);
			let o = this.viewObjects.findBy('pathspec', object.pathspec);
			Ember.set(o, 'ui_selected', !o.ui_selected);
		},

		toggleAll() {
			this.set('selectedAll', this.get('selectedAll'));
			this.objects.forEach((o) => {
				Ember.set(o, 'ui_selected', !o.ui_selected);
			});	
		},

		deleteSelected() {
			this.get('viewObjects').filterBy('ui_selected', true).forEach((o) => {
				this.sendAction('delete', o.pathspec);
				this.clearSelection();
			});		
		},

		toggleRename(o) {
			Ember.set(o, 'ui_rename_input_visible', !o.ui_rename_input_visible);
		}


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
			this.$(".new-object-input :input").focus();
		}
		// trigger focus event
		if (this.get('creatingTree')) {
			this.$(".new-tree-input :input").focus();
		}

		if (this.get('batchMode')) {
			this.$(".checkbox").checkbox();
		}
	}
});
