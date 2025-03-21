"use strict";
(function () {
	$(document).ready(function() {
		// Відкриття/закриття головного меню по кнопці
		$('#btn-open-menu').on('click', function() {
			$('.my-dropdown-list-wrapper').toggle();
		});
		
		// Обробник для вибору країни
		$('.my-dropdown-item-radio[name="country"]').on('click', function() {
			// Закриваємо всі внутрішні блоки
			$('.my-dropdown-next-list').hide();
			
			// Відкриваємо внутрішній блок для обраної країни
			$(this).closest('.my-dropdown-item').find('.my-dropdown-next-list').show();
			
			// Закриваємо правий блок, якщо він був відкритий
			$('.my-dropdown-list.second').hide();
			clearSecondBlockCheckboxes(); // Очищаємо чекбокси при закритті блоку
		});
		
		// Обробник для вибору області
		$('.my-dropdown-item-radio[name="district"]').on('click', function() {
			// Перевіряємо, чи обрана радіокнопка
			if ($(this).is(':checked')) {
				// Відкриваємо правий блок
				$('.my-dropdown-list.second').show();
			}
		});
		
		// Обробник для вибору чекбокса міста
		$('.my-dropdown-item-checkbox').on('change', function() {
			// Отримуємо внутрішній блок, який потрібно відобразити/приховати
			const nextList = $(this).closest('.my-dropdown-item').find('.my-dropdown-next-list');
			
			// Якщо чекбокс обраний, відображаємо внутрішній блок
			if ($(this).is(':checked')) {
				nextList.show();
			} else {
				// Якщо чекбокс не обраний, приховуємо внутрішній блок
				nextList.hide();
				clearInnerCheckboxes(nextList); // Очищаємо внутрішні чекбокси
			}
		});
		
		// Закриття меню при кліку поза ним
		$(document).on('click', function(event) {
			if (!$(event.target).closest('.my-dropdown').length) {
				$('.my-dropdown-list-wrapper').hide();
				clearSecondBlockCheckboxes(); // Очищаємо чекбокси при закритті меню
			}
		});
		
		// Додаткова логіка для відображення вкладених елементів при виборі радіокнопки
		$('.my-dropdown-item-radio').on('change', function() {
			// Якщо обрана радіокнопка країни
			if ($(this).attr('name') === 'country') {
				// Закриваємо всі внутрішні блоки
				$('.my-dropdown-next-list').hide();
				
				// Відкриваємо внутрішній блок для обраної країни
				$(this).closest('.my-dropdown-item').find('.my-dropdown-next-list').show();
				
				// Закриваємо правий блок
				$('.my-dropdown-list.second').hide();
				clearSecondBlockCheckboxes(); // Очищаємо чекбокси при закритті блоку
			}
			
			// Якщо обрана радіокнопка області
			if ($(this).attr('name') === 'district') {
				// Перевіряємо, чи обрана радіокнопка
				if ($(this).is(':checked')) {
					// Відкриваємо правий блок
					$('.my-dropdown-list.second').show();
				}
			}
		});
		
		// Функція для очищення чекбоксів у блоці .my-dropdown-list.second
		function clearSecondBlockCheckboxes() {
			$('.my-dropdown-list.second .my-dropdown-item-checkbox').each(function() {
				$(this).prop('checked', false); // Скидаємо стан чекбокса
				$(this).closest('.my-dropdown-item').find('.my-dropdown-next-list').hide(); // Приховуємо внутрішній блок
			});
		}
		
		// Функція для очищення внутрішніх чекбоксів
		function clearInnerCheckboxes(parentElement) {
			parentElement.find('.my-dropdown-item-checkbox').each(function() {
				$(this).prop('checked', false); // Скидаємо стан чекбокса
			});
		}
	});
})();