"use strict";

import {
	PhoneInputManager, PhotoLoaderMini,
} from "./function_on_pages-create.js";

$("#select-company").select2({
	width: 'resolve',
	placeholder: 'Выберите компанию',
	minimumResultsForSearch: -1,
});

$(".js-example-responsive2").select2({
	width: 'resolve',
	minimumResultsForSearch: -1,
});

new PhotoLoaderMini({
	inputId: 'loading-photo',
	wrapperClass: 'photo-info-list'
});

new PhoneInputManager({
	btnSelector: '.btn-new-tel',
	wrapperSelector: '.block-row .phone',
	inputClass: 'tel-contact',
	maxPhones: 5,
	initialCountry: 'ua',
	utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js',
	countryMasks: {
		'ua': '(99) 999-99-99',
		'us': '(999) 999-9999',
		'gb': '9999 999999',
		'de': '999 99999999',
		'fr': '9 99-99-99-99',
		'pl': '999 999-999',
		'it': '999 999-9999',
		'es': '999 99-99-99',
		'default': '(999) 999-99-99'
	},
	// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
});
new PhoneInputManager({
	btnSelector: '.btn-new-tel',
	wrapperSelector: '.block-row .company-branch-phone',
	inputClass: 'tel-contact',
	maxPhones: 5,
	initialCountry: 'ua',
	utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js',
	countryMasks: {
		'ua': '(99) 999-99-99',
		'us': '(999) 999-9999',
		'gb': '9999 999999',
		'de': '999 99999999',
		'fr': '9 99-99-99-99',
		'pl': '999 999-999',
		'it': '999 999-9999',
		'es': '999 99-99-99',
		'default': '(999) 999-99-99'
	},
	// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
});

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		document.querySelectorAll('input, select').forEach(el => {
			el.value = '';
			el.autocomplete = 'new-password';
		});
	}, 100);
});