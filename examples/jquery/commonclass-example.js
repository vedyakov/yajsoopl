// Содадим некоторый базовый класс для блока,
// который ждет в опциях jQuery элемент и размеры,
// которые надо принять элементу

var Block = CommonClass.extend({
	init: function( userOptions ){
		var self = this;

		// значение по умолчанию
		self.defaultOptions({
			$: false,
			width: 100,
			height: 100
		});

		// элемент нам нужен, так что выведем ошибку
		if ( !self.options.$ ) {
			console.error( 'options.$ should be defined' );
		} else {
			// изменим размеры блока, если элемент передали
			self.options.$
				.width( self.options.width )
				.height( self.options.height );
		}
	}
});

// Создадим класс для блока с текстом и с размерами
// Проверка наличия элемента и присвоение размеров,
// исполнятся при рекурсивном вызове функции init
// для родительского класс, так что нам не надо писать
// тоже самое. Добавим собственно опции про текст и его вывод
var BlockWithText = Block.extend({
	init: function( userOptions ){
		var self = this;

		self.defaultOptions({
			text: 'Default text'
		});

		// Если бы мы не выводили ошибку, а кидали её,
		// в родительском классе, то
		// проверку тут не пришлось бы писать
		if ( self.options.$ ) {
			self.options.$.text( self.options.text );
		}
	}
});

// Примеры
var a = new BlockWithText();
console.log( a.options );

a = new BlockWithText({
	$: $( document.body ),
	width: 200
});
console.log( a.options );

a = new BlockWithText({
	$: $( document.body ),
	width: 200,
	text: 'My text'
});
console.log( a.options );

var BlockExtended = BlockWithText.extend({
	init: function( userOptions, additionalParameters ){
		var self = this;

		console.log( additionalParameters );
	}
});

a = new BlockExtended({
	$: $( document.body ),
	width: 200,
	text: 'My text'
}, 'Additional parameters' );
// => Additional parameters

console.log( a.options );
// => { text="My text", $=	Object[], width=200, height=100}