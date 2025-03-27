"use strict";
(function () {
	
	$(".js-example-responsive2").select2({
		width: 'resolve',
		placeholder: 'Все по умолчанию',
		minimumResultsForSearch: -1,
	});
	
	$(".js-example-responsive3").select2({
		width: 'resolve',
		placeholder: 'Валюта',
		minimumResultsForSearch: -1,
	});
	
	$(".js-example-responsive1").select2({
		width: 'resolve',
		placeholder: 'Выбрать',
		minimumResultsForSearch: -1,
	});
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			document.querySelectorAll('input, select').forEach(el => {
				el.value = '';
				el.autocomplete = 'new-password';
			});
		}, 100);
	});
	
})();