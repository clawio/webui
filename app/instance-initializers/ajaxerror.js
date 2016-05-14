import Ember from 'ember';

export function initialize(application) {
        var session = application.lookup('session:main');
        Ember.$(document).ajaxError(function( event, jqxhr, settings, exception ) {
            var url = settings.url;
            var response = jqxhr.responseJSON;
            
	    //check if we have authorized this url (same as prefilter)
            if(jqxhr.status === 401){
                    session.invalidate();
            }
        });
}

export default {
  name: 'ajaxerror',
  initialize
};
