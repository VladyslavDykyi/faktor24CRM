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
})();