"use strict";

import {
	FileUploader,
	PhotoLoader,
	PhoneInputManager,
	RealEstateDescriptionGenerator
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


$(document).ready(function () {
	// Обробник відкриття меню
	$('.multiple-menu-btn').on('click', function (event) {
		event.stopPropagation(); // Зупиняємо всплиття
		const currentState = $(this).attr('data-open-menu');
		const newState = currentState === 'false' ? 'true' : 'false';
		$(this).attr('data-open-menu', newState);
	});
	
	// Обробник кліку поза меню
	$(document).on('click', function () {
		$('.multiple-menu-btn').attr('data-open-menu', 'false');
	});
	
	// Обробник кліку всередині меню, щоб не закривалося при кліку на елементи меню
	$('.multiple-menu-wrapper').on('click', function (event) {
		event.stopPropagation();
	});
	
	// Обробник для всіх чекбоксів
	$(document).on('change', '.multiple-menu-list input[type="checkbox"]', function () {
		const $currentList = $(this).closest('.multiple-menu-list'); // Поточний список
		const $allCheckbox = $currentList.find('input[data-name="checkbox-all"]'); // Чекбокс "Все" в поточному списку
		const $otherCheckboxes = $currentList.find('input[type="checkbox"]').not($allCheckbox); // Інші чекбокси
		if ($(this).data('name') === 'checkbox-all') {
			// Якщо змінений чекбокс "Все"
			if ($(this).is(':checked')) {
				// Якщо "Все" обрано, знімаємо галочки з інших чекбоксів
				$otherCheckboxes.prop('checked', false);
			}
		} else {
			// Якщо змінений будь-який інший чекбокс
			if ($(this).is(':checked')) {
				// Якщо обрано інший чекбокс, знімаємо галочку з "Все"
				$allCheckbox.prop('checked', false);
			}
			// Перевіряємо, чи всі інші чекбокси не вибрані
			if ($otherCheckboxes.filter(':checked').length === 0) {
				// Якщо жоден інший чекбокс не вибрано, ставимо галочку на "Все"
				$allCheckbox.prop('checked', true);
			}
		}
	});
});