yajsoopl
========

Yet another js oop library. Library contains two simple classes for inheritance.

* BaseClass – class with recursive calling init functions. Classes is not just methods of prototype. In initialization method of class can be usefull instructions, so we don't want duplicate it in child constructor, so we need recursive calling for parents init functions.
* CommonClass – class with usefull options convention and methods.


# Описание

Есть важные вещи, которые мне нужны были при наследовании

1. Простое расширение родительского класса.
2. Автоматический вызов родительских функций инициализации.

Второе самое важное, так как все варианты реализации наследования в интернете подразумевают, что мы просто расширяем дочерний класс, добавляя родительские методы через прототип, но это не так. При создании класса, часто происходит его инициализация на основе переданных ему параметров, задаются какие-то дефолтные свойства, создаются элементы и многое другое. При создании дочернего класса все это нам требуется делать снова.

Для решения этой проблемы был создан `BaseClass`. Имеется две версии: для `lodash` и `jQuery`. По сути из этих библиотек требуется только функция объединения двух объектов, это `_.assign` и `$.extend` соответственно. Если их определить самостоятельно, можно избавиться от зависимостей.

Кроме этого хотелось решить проблему однотипных действий работы с параметрами, для этих целей был создан `CommonClass`, который наследуется от `BaseClass`, добавляя два удобных метода для работы с опциями.

Оба класса в двух вариантах размещены [в публичном репозитории](https://github.com/vedyakov/yajsoopl).
Начнем по порядку и рассмотрим версии с использованием `jQuery`.

Добавить в проект с помощью bower'a можно так

    "yajsoopl": "git://github.com/vedyakov/yajsoopl.git",

## BaseClass

Используются следующие соглашения:

1. Функция, которая автоматически должна быть вызвана при создании наследника данного класса, должна иметь имя `init`.
2. Класс использует метод `initialize` для рекурсивного вызова функции `init` на каждом уровне каскада наследования. Поэтому если целью не является изменение поведения данного класса, не стоит переопределять метод `initialize`.

Расширение класса происходит через метод *класса* `extend`, взятый из `Backbone`.

Пример использования

    // Объявим родительский класс как расширение базового
    var Parent = BaseClass.extend({
            init: function( userOptions ){
            var self = this;

            console.log( 'parent init', userOptions );
        },
        parentMethod: function(){
            console.log( 'parent method' );
        }
    });

    // Создадим дочерний класс, расширив родительский
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
    // console:
    // => parent init a
    // => child init a

    a.childMethod(); // => child method
    a.parentMethod(); // => parent method

Как видно по вызову консоли, вызов фунций `init` идет от родителей в сторону детей, что в общем-то логично. Есть очень специфические случаи, когда требуется так же обратная очередь вызова, чтобы дочерние классы успели переопределить свойства родителей, но на самом деле это скорее индикатор проблемы в коде. Если уж очень потребуется, как я сказал выше всегда можно переопределить метод initialize отвечающий за рекурсивный вызов функции init, сделав вызов метода, например, preinit при его наличии, до перехода на предыдущий уровень каскада наследования.

## CommonClass

Класс отличается тем, что приняты дополнительные соглашения:

1. При инициализации класса, ему передаются первым параметром опции в виде объекта
2. Опции экземпляра класса стоит хранить в свойстве options.

На самом деле, код класса очень простой, так что приведу его здесь

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

В функции `init` определяется свойство `options` как пустой объект, далее он объединяется с теми, что были переданы как параметр при создании класса, с приоритетом последних.

Пример, использования:

    // Создадим некоторый базовый класс для блока,
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

            // Опредеяем значения по умолчанию
            // только для добавившихся настроек
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
    // => options.$ should be defined

    console.log( a.options );
    // => { text="Default text", $=false, width=100, height=100}

    a = new BlockWithText({
        $: $( document.body ),
        width: 200
    });
    console.log( a.options );
    // => { text="Default text", $= Object[], width=200, height=100}

    a = new BlockWithText({
        $: $( document.body ),
        width: 200,
        text: 'My text'
    });
    console.log( a.options );
    // => { text="My text", $= Object[], width=200, height=100}

Так как объединение опций является рекурсивным, то не стоит экономить на спичках и писать

    {
        shareTitle: '...',
        shareDescriptions: '...'
    }

лучше писать

    {
        share {
            title: '...',
            descriptions: '...'
        }
    }

Кроме этого, соглашение касается лишь первого параметра, и хоть я крайне рекомендую, все настройки передавать через опции, где будет удобная работа с дефолтными значениями, все же можно передать и другие параметры и они не потеряются.

    var BlockExtended = BlockWithText.extend({
        init: function( userOptions, additionalParameters ){
            var self = this;

            console.log( additionalParameters );
        }
    });

    var a = new BlockExtended({
        $: $( document.body ),
        width: 200,
        text: 'My text'
    }, 'Additional parameters' );
    // => Additional parameters

    console.log( a.options );
    // => { text="My text", $= Object[], width=200, height=100}


> Written with [StackEdit](https://stackedit.io/).