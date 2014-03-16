// Base class for extending with recursive called init functions
// require jQuery extend method
var BaseClass = function(){
	var self = this;

	// Convert arguments pseudo-array to array
	var args = Array.prototype.slice.call(arguments);

	// Add context to arguments
	args.unshift( self );

	// Call initialize from current context
	self.initialize.apply( self, args );
};

BaseClass.prototype = {
	// Recursive call all init functions
	initialize: function(){
		var context = this;

		var args = Array.prototype.slice.call(arguments),
			currentLevel = args[ 0 ], // get current class
			initArguments = args.slice(1), // get arguments

			currentConstructor = currentLevel.constructor; // get constructor for current class

		// call parent initialize function if it is exist
		if ( typeof currentConstructor.__super__ !== 'undefined' ) {
			if ( typeof currentConstructor.__super__.initialize === 'function' ) {
				args[ 0 ] = currentConstructor.__super__;

				currentConstructor.__super__.initialize.apply( context, args );
			}
		}

		// call current class init function
		if ( typeof currentLevel.init === 'function' ) {
			currentLevel.init.apply( context, initArguments );
		}
	}
};

BaseClass.extend = function( protoProps, staticProps) {
	var parent = this;
	var child;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your `extend` definition), or defaulted
	// by us to simply call the parent's constructor.
	if ( protoProps && protoProps.hasOwnProperty('constructor') ) {
		child = protoProps.constructor;
	} else {
		child = function(){ return parent.apply(this, arguments); };
	}

	// Add static properties to the constructor function, if supplied.
	$.extend( child, parent, staticProps);

	//Set the prototype chain to inherit from parent, without calling parent's constructor function.
	var Surrogate = function(){ this.constructor = child; };
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;

	// Add prototype properties (instance properties) to the subclass, if supplied.
	if ( protoProps ) {
		child.prototype = $.extend( child.prototype, protoProps );
	}

	//Set a convenience property in case the parent's prototype is needed later.
	child.__super__ = parent.prototype;

	return child;
};