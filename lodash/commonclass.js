// require lodash merge method
var CommonClass = BaseClass.extend({
	init: function( userOptions ){
		var self = this;

		self.options = {};

		self.defaultOptions( userOptions );
	},
	defaultOptions: function( userOptions ){
		var self = this;

		self.options = _.merge( userOptions, self.options );
	},
	setOptions: function( userOptions ){
		var self = this;

		self.options = _.merge( self.options, userOptions );
	}
});