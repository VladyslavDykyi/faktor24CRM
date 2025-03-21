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
	
	
	// $(document).ready(function () {
	// 	const megaSelect = $('.mega-select');
	// 	const inputSearch = $('#input-search');
	// 	const dropMenu = $('.drop-menu');
	// 	const cityList = $('#city');
	// 	const countryList = $('#country');
	// 	const regionList = $('#region');
	// 	const districtList = $('#district');
	// 	const btnTake = $('#btn-take');
	// 	const btnTake2 = $('#btn-take2'); // Додано для district
	// 	const arrowDown = $('.arrow-down');
	//
	// 	// Обробник події для кнопки arrow-down
	// 	arrowDown.on('click', function () {
	// 		megaSelect.toggleClass('active'); // Додаємо клас active до mega-select
	// 		countryList.css('display', 'block'); // Показуємо #country
	// 	});
	//
	// 	// Обробник події для btnTake
	// 	btnTake.on('click', function () {
	// 		const target = $(this).closest('.drop-menu-wrapper').attr('id');
	// 		if (target === 'city') {
	// 			cityList.css('display', 'none');
	// 			districtList.css('display', 'block');
	// 		} else if (target === 'country') {
	// 			districtList.css('display', 'none');
	// 			cityList.css('display', 'block');
	// 		}
	// 	});
	//
	// 	// Обробник події для btnTake2 (для district)
	// 	btnTake2.on('click', function () {
	// 		const target = $(this).closest('.drop-menu-wrapper').attr('id');
	// 		if (target === 'district') {
	// 			districtList.css('display', 'none');
	// 			// тут треба викликати функцію яка вже буде фільтрувати
	// 		}
	// 	});
	//
	// 	// Обробник події для drop-menu-btn
	// 	$('.drop-menu-btn').on('click', function () {
	// 		const target = $(this).closest('.drop-menu-wrapper').attr('id'); // Отримуємо id списку (city, country, region або district)
	// 		const isFirstItem = $(this).closest('.drop-menu-item').index() === 0; // Перевіряємо, чи це перший елемент
	//
	// 		console.log(target);
	//
	// 		// Переключаємо видимість списків
	// 		if (isFirstItem) {
	// 			// Якщо це перший елемент, відкриваємо попередній блок
	// 			if (target === 'region') {
	// 				regionList.css('display', 'none');
	// 				countryList.css('display', 'block');
	// 			} else if (target === 'city') {
	// 				cityList.css('display', 'none');
	// 				regionList.css('display', 'block');
	// 			} else if (target === 'district') {
	// 				districtList.css('display', 'none');
	// 				cityList.css('display', 'block'); // Повертаємося до city
	// 			} else if (target === 'country') {
	// 				countryList.css('display', 'none');
	// 				// Якщо немає попереднього блоку, закриваємо меню
	// 				megaSelect.removeClass('active');
	// 			}
	// 		} else {
	// 			// Якщо це не перший елемент, діємо за стандартною логікою
	// 			if (target === 'city') {
	// 				cityList.css('display', 'none');
	// 				countryList.css('display', 'block');
	// 			} else if (target === 'country') {
	// 				countryList.css('display', 'none');
	// 				regionList.css('display', 'block');
	// 			} else if (target === 'region') {
	// 				regionList.css('display', 'none');
	// 				cityList.css('display', 'block');
	// 			} else if (target === 'district') {
	// 				districtList.css('display', 'none');
	// 				cityList.css('display', 'block');
	// 			}
	// 		}
	// 	});
	//
	// 	// Закриваємо випадаюче меню при кліку поза ним
	// 	$(document).on('click', function (event) {
	// 		if (!$(event.target).closest('.mega-select').length) {
	// 			megaSelect.removeClass('active'); // Видаляємо клас active
	// 			cityList.css('display', 'none'); // Приховуємо city
	// 			countryList.css('display', 'none'); // Приховуємо country
	// 			regionList.css('display', 'none'); // Приховуємо region
	// 			districtList.css('display', 'none'); // Приховуємо district
	// 		}
	// 	});
	// });
})();