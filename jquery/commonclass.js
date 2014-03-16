// require jQuery extend method
var CommonClass = BaseClass.extend({
	init: function( userOptions ){
		var self = this;

		self.options = {};

		self.defaultOptions( userOptions );
	},
	defaultOptions: function( userOptions ){
		var self = this;

		self.options = $.extend( true, userOptions, self.options );
	},
	setOptions: function( userOptions ){
		var self = this;

		self.options = $.extend( true, self.options, userOptions );
	}
});