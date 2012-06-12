// Define libraries
require.config({
	baseUrl: 'static/js/',
	paths: {
		jquery: 'lib/jquery-1.7.1.min',
        ember: 'lib/ember-0.9.8.1.min',
        mobile: 'lib/jquery.mobile-1.1.0.min',
		text: 'lib/require/text',
		mocha: 'lib/mocha',
		chai: 'lib/chai'
	}
});

// Load our app
define( 'app', [
	'jquery',
    'app/controllers/backends',
    'app/views/count',
    'app/views/backend_button',
    'app/views/edit_backend',
    'app/views/machine_list',
    'app/views/enable_backend_button',
    'app/views/machine_add_dialog',
	'ember',
	'mobile',
	], function($, BackendsController, Count, BackendButton, EditBackend, MachineList,
			EnableBackendButton, MachineAddDialog) {
		var App = Ember.Application.create({

			VERSION: '0.3-ember',

			// Sets up mocha to run some integration tests
			specsRunner: function( chai ) {
				// Create placeholder for mocha output
				// TODO: Make this shit look better and inside body
				$( document.body ).before( '<div id="mocha"></div>' );

				// Setup mocha and expose chai matchers
				window.expect = chai.expect;
				mocha.setup('bdd');

				// Load testsuite
				require([
					'app/specs/models/store',
					'app/specs/views/basic_acceptance',
					'app/specs/controllers/todos'
				], function() {
						mocha.run().globals( [ '$', 'Ember', 'Todos' ] );
					}
				);
			},

			// Constructor
			init: function() {
				this._super();

				// Initiate main controller
				this.set(
					'backendsController',
					BackendsController.create()
				);					

				// Run specs if asked
				if ( location.hash.match( /specs/ ) ) {
					require( [ 'chai', 'mocha' ], this.specsRunner );
				}
			}
		});
		
		$(document).on( 'pagebeforeshow', '#machines', function(){
		    $('#machines-list').listview('refresh');
		});
		
		App.Select = Ember.Select.extend({
		    attributeBindings: ['name', "data-theme", "data-icon",
                "data-native-menu"]
		});
		
		App.TextField = Ember.TextField.extend({
		    attributeBindings: ['name', "data-theme"]
		});
		
		App.CountView = Count;
		App.BackendButtonView = BackendButton;
		App.EditBackendView = EditBackend;
		App.MachineListView = MachineList;
		App.EnableBackendButtonView = EnableBackendButton;
		App.onOff = ['on', 'off'];
		
		var addDialog = MachineAddDialog.create();
		addDialog.append();
		
		// Expose the application globally
		return window.Mist = App;
	}
);