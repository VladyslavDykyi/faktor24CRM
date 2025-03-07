"use strict";
(function () {
	$(".js-example-responsive2").select2({
		width: 'resolve',
		placeholder: 'Продаж',
		minimumResultsForSearch: -1,
	});
	$(".js-example-responsive3").select2({
		width: 'resolve',
		placeholder: 'Валюта',
		minimumResultsForSearch: -1,
	});
	$(document).ready(function () {
		const megaSelect = $('.mega-select');
		const inputSearch = $('#input-search');
		const dropMenu = $('.drop-menu');
		const cityList = $('#city');
		const countryList = $('#country');
		
		// Обробник події для input-search
		inputSearch.on('focus input', function () {
			megaSelect.addClass('active'); // Додаємо клас active до mega-select
		});
		
		// Обробник події для drop-menu-btn
		$('.drop-menu-btn').on('click', function () {
			const target = $(this).closest('.drop-menu-wrapper').attr('id'); // Отримуємо id списку (city або country)
			console.log(target)
			// Переключаємо видимість списків
			if (target === 'city') {
				cityList.css('display', 'none');
				countryList.css('display', 'block');
			} else if (target === 'country') {
				countryList.css('display', 'none');
				cityList.css('display', 'block');
			}
		});
		
		// Закриваємо випадаюче меню при кліку поза ним
		$(document).on('click', function (event) {
			if (!$(event.target).closest('.mega-select').length) {
				megaSelect.removeClass('active'); // Видаляємо клас active
				cityList.css('display', 'none'); // Приховуємо city
				countryList.css('display', 'none'); // Приховуємо country
			}
		});
	});
})();