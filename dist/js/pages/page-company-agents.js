$(document).ready(function () {
	const table = $('#example').DataTable({
		searching: false,
		ordering: false,
		processing: false,
		pagingType: "simple_numbers",
		language: {
			url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/ru.json" // Підключення локалізації
		},
		columns: [
			{
				data: null,
				orderable: false,
				searchable: false,
				render: function (data, type, row) {
					return `
                      <div class="tbody-wrapper checkBox">
                          <label class="my-custom-input">
                              <input type="checkbox">
                              <span class="my-custom-box"></span>
                          </label>
                      </div>
                    `;
				}
			},
			{ data: 'photo', name: 'Фото' },
			{ data: 'agent', name: 'Агент' },
			{ data: 'position', name: 'Должность' },
			{ data: 'offices', name: 'Офис' },
			{ data: 'object', name: 'Объ' },
			{ data: 'client', name: 'Кли' },
			{ data: 'succeed', name: 'Усп' },
			{ data: 'nosucceed', name: 'Не усп' },
			{ data: 'activeuntil', name: 'Активный до' },
			{
				data: null,
				orderable: false,
				searchable: false,
				render: function (data, type, row) {
					return `
                     <div class="tbody-wrapper block-actions">
                     	<a href="#" class="btn mail-link" data-bs-toggle="tooltip" data-bs-placement="top"
						   data-bs-title="Написать">
							<img src="./img/icon/mail.svg" alt="">
						</a>
                        <div class="block-actions-wrapper">
                           <label class="bookmark">
                              <input type="checkbox">
                              <span>
                                  <img class="non-checked" src="./img/icon/bookmark.svg" alt="">
                                  <img class="on-checked" src="./img/icon/bookmark-cheked.svg" alt="">
                              </span>
                           </label>
                           <div class="menu-burger">
                              <div class="dropdown">
                                 <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                     <img src="./img/icon/burger-blue.svg" alt="">
                                 </button>
                                 <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Обновить</a></li>
                                    <li><a class="dropdown-item" href="#">Редактировать</a></li>
                                    <li><a class="dropdown-item" href="#">Удалить</a></li>
                                    <li><a class="dropdown-item" href="#">Отложить</a></li>
                                    <li><a class="dropdown-item" href="#">Передати</a></li>
                                 </ul>
                              </div>
                           </div>
                           <div class="menu-info">
                              <div class="dropdown">
                                 <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                     <img src="./img/icon/copylinked.svg" alt="">
                                 </button>
                                 <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#"><span>На сайте</span></a></li>
                                    <li><a class="dropdown-item" href="#"><span>На Rem.ua</span></a></li>
                                    <li><a class="dropdown-item" href="#"><span>Видео Youtube</span></a></li>
                                    <li><a class="dropdown-item" href="#"><span>На карте</span></a></li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                    </div>
                    `;
				}
			}
		],
		// Добавьте этот callback для инициализации после создания таблицы
		initComplete: function(settings, json) {
			// Инициализация Select2 для элементов, которые уже есть в DOM
			$(".js-example-responsive3.position-select").select2({
				width: 'resolve',
				placeholder: 'Должность',
			});
			// Инициализация Select2 для элементов, которые уже есть в DOM
			$(".js-example-responsive3.offices-select").select2({
				width: 'resolve',
				placeholder: 'Офис',
			});
		},
		// Или используйте drawCallback для инициализации при каждом перерисовывании таблицы
		drawCallback: function(settings) {
			$(".js-example-responsive3.position-select").select2({
				width: 'resolve',
				placeholder: 'Должность',
			});
			// Инициализация Select2 для элементов, которые уже есть в DOM
			$(".js-example-responsive3.offices-select").select2({
				width: 'resolve',
				placeholder: 'Офис',
			});
		}
	});
	
	$('thead .my-custom-input input').on('change', function() {
		let isChecked = $(this).prop('checked');
		$('tbody .my-custom-input input').prop('checked', isChecked);
	}).end().on('change', 'tbody .my-custom-input input', function() {
		let allChecked = $('tbody .my-custom-input input:checked').length ===
			$('tbody .my-custom-input input').length;
		$('thead .my-custom-input input').prop('checked', allChecked);
	});
	
	const initTooltips = function () {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	};
	
	// Викликаємо ініціалізацію Tooltip після створення таблиці
	initTooltips();
	
	// Викликаємо ініціалізацію Tooltip після оновлення таблиці
	table.on('draw', function () {
		initTooltips();
	});
	
	// Викликаємо ініціалізацію Tooltip після динамічного додавання рядків
	$('#example tbody').on('click', '.details-control, .details-control-dop, #btn-others', function () {
		setTimeout(() => {
			initTooltips();
			
		}, 0);
	});
	$(".js-example-responsive2.position").select2({
		width: 'resolve',
		placeholder: 'Должность',
	});
	$(".js-example-responsive2.statusagents").select2({
		width: 'resolve',
		placeholder: 'Статус агентов',
	});
	$(".js-example-responsive2.company").select2({
		width: 'resolve',
		placeholder: 'Компания',
	});
	$(".js-example-responsive2.offices").select2({
		width: 'resolve',
		placeholder: 'Офис',
	});
});