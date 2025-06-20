"use strict";

import {
	FileUploader,
	PhotoLoader,
	PhoneInputManager,
	RealEstateDescriptionGenerator,
	RowManager
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

new RowManager();

new RealEstateDescriptionGenerator('ваш_api_ключ', {
	model: 'gpt-3.5-turbo',
	temperature: 1,
	minWords: 2000,
	textareaSelector: '.description-for-advertising',
	btnSelector: '#generation-chat-gpt',
	languages: ['ua', 'ru', 'en'],
	// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
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
	// Для документів (без перевірки розміру)
	new FileUploader({
		inputId: 'document',
		wrapperClass: 'loading-documents',
		checkImageSize: false,
		// якщо треба щось дописати то треба дописувати class де зовнішні змінни передавання ззовні(звідси)
	});
	
	// Для плану (з перевіркою розміру)
	new FileUploader({
		inputId: 'plan',
		wrapperClass: 'loading-plan',
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


