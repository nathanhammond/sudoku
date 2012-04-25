/*!
 * jQuery TextChange Plugin
 * http://www.zurb.com/playground/jquery-text-change-custom-event
 *
 * Copyright 2010, ZURB
 * Released under the MIT License
 */
(function ($) {
	$.event.special.textchange = {
		setup: function (data, namespaces) {
			$this = $(this);
			var current = this.document ? $(this.document.body).html() : $this.val();

			$this.bind('keyup.textchange keydown.textchange keypress.textchange change.textchange', $.event.special.textchange.handler);
			$this.bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
			$this.data('lastValue', current);
		},

		teardown: function (namespaces) {
			$(this).unbind('.textchange');
		},

		handler: function (event) {
			$.event.special.textchange.triggerIfChanged($(this));
		},

		delayedHandler: function (event) {
			var element = $(this);
			setTimeout(function () {
				$.event.special.textchange.triggerIfChanged(element);
			}, 1);
		},

		triggerIfChanged: function (element) {
			var current = element.get(0).document ? $(element.get(0).document.body).html() : element.val();
			if (current !== element.data('lastValue')) {
				element.trigger('textchange', element.data('lastValue'));
				element.data('lastValue', current);
			}
		}
	};
})(jQuery);