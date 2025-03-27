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
	$('.select2-container')
		.off('touchstart')
		.on('touchstart', function (e) {
			e.stopPropagation();
		})
		.siblings('select')
		.off('select2:open')
		.on('select2:open', function () {
			$('.select2-results__options')
				.off('touchstart')
				.on('touchstart', 'li', function (e) {
					e.stopPropagation();
				});
		});
})();