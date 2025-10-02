"use strict";

import {
	FileUploader,
	PhotoLoader,
	PhoneInputManager,
} from "./function_on_pages-create.js";

$(".js-example-responsive2-currency").select2({
	width: 'resolve',
	placeholder: 'Валюта',
	minimumResultsForSearch: -1,
});

$(".js-example-responsive2").select2({
	width: 'resolve',
	placeholder: 'Выбрать',
	minimumResultsForSearch: -1,
});
$(".js-example-responsive3").select2({
	width: 'resolve',
	placeholder: 'Выбрать',
});
$(".js-example-responsive4").select2({
	width: 'resolve',
	placeholder: 'Введите теги через запятую',
});
$(".js-example-responsive5").select2({
	width: 'resolve',
	placeholder: '--',
});

$('.my-select2').on('select2:opening', function (e) {
	$('.filter select').attr("style", "display: none !important");
});

$('.my-select2').on('select2:closing', function (e) {
	$('.filter select').attr("style", "display: block !important");
});

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		document.querySelectorAll('input, select').forEach(el => {
			el.value = '';
			el.autocomplete = 'new-password';
		});
	}, 100);
});

new PhoneInputManager({
	btnSelector: '.btn-new-tel',
	wrapperSelector: '.create-filter-client-wrapper .right',
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

// Ініціалізація FileUploader після завантаження Fancybox
function initFileUploaders () {
	new FileUploader({
		inputIdSelector: '#document-logo',
		wrapperClassSelector: '.loading-logo',
		renderContainerSelector: '.loading-logo [data-render-document]',
		errorContainer: '.loading-logo .error-container',
		maxCountPhoto: 1,
		checkImageSize: false,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
	// Для документів (без перевірки розміру)
	new FileUploader({
		inputIdSelector: '#document',
		wrapperClassSelector: '.loading-documents',
		renderContainerSelector: '.document [data-render-document]',
		errorContainer: '.document .error-container',
		maxCountPhoto: 10,
		checkImageSize: false,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
	// Для плану (з перевіркою розміру)
	new FileUploader({
		inputIdSelector: '#loading-plan',
		wrapperClassSelector: '.loading-plan',
		renderContainerSelector: '.loading-plan [data-render-document]',
		errorContainer: '.loading-plan .error-container',
		maxCountPhoto: 10,
		checkImageSize: false,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
	
	// цей код для ініціалізації завантаження планів для секцій\корпусів
	new FileUploader({
		inputIdSelector: '#loading-plan-1',
		wrapperClassSelector: '[data-plan-id="plan-1"]',
		renderContainerSelector: '[data-plan-id="plan-file-error-1"] [data-render-document]',
		errorContainer: '[data-plan-id="plan-file-error-1"] .error-container',
		maxCountPhoto: 2,
		checkImageSize: false,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
	
	new PhotoLoader({
		inputId: 'loading-photo',
		checkImageSize: false,
		minWidth: 800,
		minHeight: 800,
		wrapperClass: 'photo-info-list',
		maxPhotos: 20,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
}

// Чекаємо, поки завантажиться Fancybox, якщо ми його тільки що підключили
if (typeof Fancybox !== 'undefined') {
	initFileUploaders();
} else {
	const checkFancybox = setInterval(() => {
		if (window.Fancybox) {
			clearInterval(checkFancybox);
			initFileUploaders();
		}
	}, 200);
}