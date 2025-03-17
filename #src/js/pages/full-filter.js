$('#datapiker1').daterangepicker({
	"locale": {
		"format": "DD-MM-YYYY",
		"separator": " - ",
		"applyLabel": "Применить",
		"cancelLabel": "Отмена",
		"fromLabel": "From",
		"toLabel": "To",
		"customRangeLabel": "Custom",
		"weekLabel": "Н",
		"daysOfWeek": [
			"Вс",
			"Пн",
			"Вт",
			"Ср",
			"Чт",
			"Пт",
			"Сб"
		],
		"monthNames": [
			"Январь",
			"Февраль",
			"Март",
			"Апрель",
			"Май",
			"Июнь",
			"Июль",
			"Август",
			"Сентябрь",
			"Октябрь",
			"Ноябрь",
			"Декабрь"
		],
		"firstDay": 1
	},
	
	"drops": "auto"
});
$(document).ready(function() {
	// Функція для закриття меню
	function closeMenu() {
		$('#full-filter-object').attr('data-open-menu', 'false');
	}
	
	// Обробник кліку на кнопку
	$('#full-filter-object').on('click', function(event) {
		event.stopPropagation(); // Зупиняємо всплиття, щоб не спрацював клік на document
		var currentState = $(this).attr('data-open-menu');
		var newState = currentState === 'false' ? 'true' : 'false';
		$(this).attr('data-open-menu', newState);
	});
	
	// Обробник кліку поза меню
	$(document).on('click', function() {
		closeMenu();
	});
	
	// Обробник кліку всередині меню, щоб не закривалося при кліку на елементи меню
	$('.multiple-menu-wrapper').on('click', function(event) {
		event.stopPropagation();
	});
	
	$('#full-filter-btn').on('click', function() {
		// Додаємо або видаляємо клас `active` на кнопці
		$(this).toggleClass('active');
		// Додаємо або видаляємо клас `active` на елементі з класом `full-filter`
		$('.full-filter').toggleClass('active');
	});
});