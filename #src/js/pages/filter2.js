"use strict";
(function () {
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			document.querySelectorAll('input, select').forEach(el => {
				el.value = '';
				el.autocomplete = 'new-password';
			});
		}, 100);
	});
	$('.js-example-responsive2').on('select2:opening', function (e) {
		$('.filter select').attr("style", "display: none !important");
	});
	
	$('.js-example-responsive2').on('select2:closing', function (e) {
		$('.filter select').attr("style", "display: block !important");
	});
})();