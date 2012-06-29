define('app/controllers/select_machines', ['ember'],
	/**
	 * Selected machines controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.ArrayController.extend({
			_content: [{name: 'All', id: 'all'},
			          { name: 'None', id: 'none'}],
			selection: null,

			//if only this would work...
			backendsChanged: function(){
				var content = this._content;
							
				Mist.backendsController.forEach(function(item){
					content.push({name: item.title, id: item.id});
				});
							
				this.set('content', content);
							
			}.observes('Mist.backendsController.@each'),
			
			selectionChanged: function(){
				
				var selection = this.selection.id;
				
				if(selection == 'none'){
					Mist.backendsController.forEach(function(backend){
						backend.machines.forEach(function(machine){
							console.log('deselecting machine: ' + machine.name);
							machine.set('selected', false);							
						});
					});
				} else if(selection == 'all'){
					Mist.backendsController.forEach(function(backend){
						backend.machines.forEach(function(machine){
							console.log('selecting machine: ' + machine.name);
							machine.set('selected', true);							
						});
					});
				} else {
					Mist.backendsController.forEach(function(backend){
						if(backend.id == selection){
							backend.machines.forEach(function(machine){
								console.log('selecting machine: ' + machine.name);
								machine.set('selected', true);							
							});
						} else {
							backend.machines.forEach(function(machine){
								console.log('deselecting machine: ' + machine.name);
								machine.set('selected', false);							
							});
						}
					});
				}
			}.observes('selection'),
			          
			init: function() {
				this._super();
				
				var that = this;
				
				Ember.run.next(function(){
					
					var content = that._content;
					
					Mist.backendsController.forEach(function(item){
						content.push({name: item.title, id: item.id});
					});
					
					that.set('content', content);
					
					// FIXME, race condition here
					// Perhaps it'd be better as a property?
					Mist.backendsController.addObserver('content', function(sender, machineReady, value, rev) {
						
						var content = that._content;
						
						value.forEach(function(item){
							content.push({name: item.title, id: item.id});
						});
						
						that.set('content', content);
					});
				});
				
			}
		});
	}
);