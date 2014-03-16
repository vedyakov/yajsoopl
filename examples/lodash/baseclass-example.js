var Parent = BaseClass.extend({
	init: function( userOptions ){
		var self = this;
		console.log( 'parent init', userOptions );
	},
	parentMethod: function(){
		console.log( 'parent method' );
	}
});

var Child = Parent.extend({
	init: function( userOptions ){
		var self = this;

		console.log( 'child init', userOptions );
	},
	childMethod: function(){
		console.log( 'child method' );
	}
});

var a = new Child( 'a' );