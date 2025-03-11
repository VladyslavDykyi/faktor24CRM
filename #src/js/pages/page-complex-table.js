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
                              <span></span>
                          </label>
                      </div>
                    `;
				}
			},
			{ data: 'location', name: 'Локація' },
			{ data: 'type', name: 'Тип' },
			{ data: 'area', name: 'Площа' },
			{ data: 'condition', name: 'Стан' },
			{ data: 'floor', name: 'Поверх' },
			{ data: 'photo', name: 'Фото' },
			{ data: 'price', name: 'Цена от' },
			{ data: 'contact', name: 'Контакт' },
			{
				data: null,
				orderable: false,
				searchable: false,
				render: function (data, type, row) {
					return `
                     <div class="tbody-wrapper block-actions">
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
                        <button type="button" class="details-control">
                            <img src="./img/icon/plus.svg" alt="">
                        </button>
                    </div>
                    `;
				}
			}
		]
	});
	
	table.on('draw', function() {
		// Отримуємо кількість записів, які відображаються
		const recordsDisplay = table.page.info().recordsDisplay;
		
		// Змінюємо текст елемента, обгортаючи кількість записів у тег <b>
		$('#example_info').html('Количество комплексов: <b>' + recordsDisplay + '</b>');
	});
	
	// Обробник кліку на кнопку "деталі" всередині таблиці
	$('#example tbody').on('click', '.details-control', function () {
		const button = $(this);
		const img = button.find('img');
		toggleImage(img);
		const row = button.closest('tr');
		const isExpanded = row.next().hasClass('dop-info-row');
		if (isExpanded) {
			row.next().remove();
		} else {
			const dopInfoRow = `
                <tr class="dop-info-row">
                    <td colspan="10" style="border-bottom: none;">
                        <div class="tbody-dop-info">
                            <div class="info-main">
                                <div class="info-main-left">
                                    <div class="info-main-left-wrapper">
                                        <div class="description">
                                            <p class="description-text">
                                                <strong>Примечание для агентов:</strong>
                                                Отличная квартира сдается длительно порядочным людям. Евроремонт свежий. Есть
                                                вся мебель и техника и еще описание
                                                <span class="more-text" style="display: none;">
                                                    Полное описание квартиры с деталями, которые скрыты по умолчанию.
                                                </span>
                                                <button class="btn btn-show-text" type="button">Ещё</button>
                                            </p>
                                            <p class="description-note">
                                                <strong>Примечание для агентов:</strong>
                                                <span>Текст примечание для агентов Отличная квартира сдается длительно порядочным людям. Евроремонт свежий. Есть вся мебель и техника и еще описание</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="filter-tags">
                                        <div class="badge rounded-pill qwe1">Параметр из фильтра</div>
                                        <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                        <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                    </div>
                                </div>
                            </div>
                            <div class="type-areas">
	                            <ul class="type-areas-list">
	                            	<li class="type-areas-item active">
	                            		<strong class="type-areas-title">Студии</strong>
	                            		<p class="type-areas-text">
		                                    <span>S от 23 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
									<li class="type-areas-item">
	                                    <strong class="type-areas-title">1 комн</strong>
	                                    <p class="type-areas-text">
		                                    <span>S от 30 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
									<li class="type-areas-item">
	                            		<strong class="type-areas-title">2 комн</strong>
	                            		<p class="type-areas-text">
		                                    <span>S от 56 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
									<li class="type-areas-item">
	                            		<strong class="type-areas-title">3 комн</strong>
	                            		<p class="type-areas-text">
		                                    <span>S от 87 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
									<li class="type-areas-item">
	                            		<strong class="type-areas-title">4 комн</strong>
	                            		<p class="type-areas-text">
		                                   <span>нет в базе</span>
										</p>
									</li>
									<li class="type-areas-item">
	                            		<strong class="type-areas-title">5+ комн</strong>
	                            		<p class="type-areas-text">
		                                    <span>нет в базе</span>
										</p>
									</li>
									<li class="type-areas-item">
	                            		<strong class="type-areas-title">Коммерч</strong>
	                            		<p class="type-areas-text">
		                                    <span>S от 23 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
	                            	<li class="type-areas-item">
	                            		<strong class="type-areas-title">Дома</strong>
	                            		<p class="type-areas-text">
		                                    <span>S от 23 м²</span>
		                                    <span>от 18 000$</span>
										</p>
									</li>
								</ul>
							</div>
                            <div class="table-for-others">
				                <table id="example2" style="width:98%; margin: auto;">
				                    <tbody>
				                        <tr>
				                            <td>
				                                <div class="tbody-wrapper location">
				                                    <p>Южная Пальмира дом 1 2024 г.</p>
				                                    <p>Генуэзская 5/1</p>
				                                    <span>Аркадия, Одесса, Одесская длинная, Украина</span>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p>С ремонтом</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p>Новострой</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p> Монолит</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper floor">
				                                    <p>25 этажей</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper photo">
				                                    <img src="./img/image.png" alt="">
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper price">
				                                    <p>от 85000</p>
				                                    <span>от 850/м <sup>2</sup></span>
				                                </div>
				                            </td>
				                        </tr>
				                        <tr>
				                            <td>
				                                <div class="tbody-wrapper location">
				                                    <p>Южная Пальмира дом 1 2024 г.</p>
				                                    <p>Генуэзская 5/1</p>
				                                    <span>Аркадия, Одесса, Одесская длинная, Украина</span>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p>С ремонтом</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p>Новострой</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper condition">
				                                    <p> Монолит</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper floor">
				                                    <p>25 этажей</p>
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper photo">
				                                    <img src="./img/image.png" alt="">
				                                </div>
				                            </td>
				                            <td>
				                                <div class="tbody-wrapper price">
				                                    <p>от 85000</p>
				                                    <span>от 850/м <sup>2</sup></span>
				                                </div>
				                            </td>
				                        </tr>
				                    </tbody>
				                </table>
				            </div>
                            <div class="info-footer">
                                <p class="info-footer-data">ID: <span>1234567</span></p>
                                <p class="info-footer-data">Добавлено: <span>01.02.2025</span></p>
                                <p class="info-footer-data">Обновлено: <span>10.02.2025</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
			row.after(dopInfoRow);
		}
	});
	
	// Обробник кліку на кнопку "btn-show-text"
	$('#example tbody').on('click', '.btn-show-text', function () {
		const button = $(this);
		const container = button.closest('.description-text');
		const moreText = container.find('.more-text');
		const mainText = container.contents().filter(function () {
			return this.nodeType === 3;
		});
		
		if (moreText.is(':visible')) {
			moreText.hide();
			mainText.show();
			button.text('Ещё');
		} else {
			moreText.show();
			mainText.hide();
			button.text('Скрыть');
		}
	});
	
	function toggleImage(img) {
		const isPlus = img.attr('src').includes('plus.svg');
		img.attr('src', img.attr('src').replace(isPlus ? 'plus.svg' : 'minus.svg', isPlus ? 'minus.svg' : 'plus.svg'));
	}
	$('thead .my-custom-input input').on('change', function () {
		let isChecked = $(this).prop('checked');
		$('tbody .my-custom-input input').prop('checked', isChecked);
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
	
});