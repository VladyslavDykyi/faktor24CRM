"use strict";
(function () {
	window.addEventListener('load', () => {
		document.querySelectorAll('input, select').forEach(field => {
			field.setAttribute('autocomplete', 'off');
		});
	});
})();