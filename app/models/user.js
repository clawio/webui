import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	username: attr('string'),
	email: attr('string'),
	displayName: attr('string')
});
