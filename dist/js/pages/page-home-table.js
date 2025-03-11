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
			{ data: 'price', name: 'Ціна' },
			{ data: 'contact', name: 'Контакт' },
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
                        <button type="button" class="details-control">
                            <img src="./img/icon/plus.svg" alt="">
                        </button>
                    </div>
                    `;
				}
			}
		]
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
                                            <h2 class="description-title">Заголовок текст 1 к кв пл Толбухина срочно</h2>
                                            <p class="description-text">
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
                                        <div class="block-info">
                                            <h2 class="info-title">Собственник</h2>
                                            <div class="info-avatar">
                                                <img src="./img/icon/default-avatar-table.svg" alt="">
                                            </div>
                                            <div class="info-contacts">
                                                <p class="info-contacts-name">Имя Фамилия</p>
                                                <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                                <a href="mailto:nameemail@gmail.com" class="info-contacts-mail">nameemail@gmail.com</a>
                                            </div>
                                            <div class="info-description">
                                            	<p>Покупает тому-то, продает свою там-то, звонить тогда-то текст личной заметки</p>
											</div>
                                        </div>
                                    </div>
                                    <div class="filter-tags">
                                        <div class="badge rounded-pill qwe1">Параметр из фильтра</div>
                                        <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                        <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                    </div>
                                </div>
                                <div class="info-main-right">
                                    <div class="block-info">
                                        <h2 class="info-title">Агент</h2>
                                        <div class="info-avatar">
                                            <img src="./img/icon/default-avatar-table.svg" alt="">
                                            <img src="./img/icon/company.svg" alt="">
                                        </div>
                                        <div class="info-contacts">
                                            <p class="info-contacts-name">Длинное имя Добровольский</p>
                                            <p class="info-contacts-company">Real Estate Name</p>
                                            <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                            <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                            <a href="mailto:nameemail@gmail.com" class="info-contacts-mail">nameemail@gmail.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-footer">
                                <p class="info-footer-data">ID: <span>1234567</span></p>
                                <p class="info-footer-data">Добавлено: <span>01.02.2025</span></p>
                                <p class="info-footer-data">Обновлено: <span>10.02.2025</span></p>
                                <p class="info-footer-data">Может подойти: <button class="info-footer-btn" type="button">30</button></p>
                                <p class="info-footer-data">У других: <button class="info-footer-btn btn-others" type="button">3</button></p>
                                <button class="info-footer-btn ms-auto close-btn-other" type="button">Свернуть</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
			row.after(dopInfoRow);
		}
	});
	
	// Обробник кліку на кнопку "btn-others"
	$('#example tbody').on('click', '.btn-others', function () {
		const button = $(this);
		const dopInfoRow = button.closest('.dop-info-row');
		const tbodyDopInfo = dopInfoRow.find('.tbody-dop-info');
		const isOthersTableAdded = tbodyDopInfo.next().hasClass('table-for-others');
		
		// Знаходимо кнопку "info-footer-btn", яка знаходиться поряд з #btn-others
		const infoFooterBtn = button.closest('.info-footer').find('.close-btn-other');
		
		if (isOthersTableAdded) {
			tbodyDopInfo.next().remove();
			infoFooterBtn.removeClass('active'); // Видаляємо клас "active", якщо таблиця видаляється
		} else {
			const othersTable = `
            <div class="table-for-others">
                <table id="example2" style="width:98%;  margin: auto;">
                    <col width="25.652%" valign="middle">
                    <col width="6.695%" valign="middle">
                    <col width="7.478%" valign="middle">
                    <col width="9.13%" valign="middle">
                    <col width="5.217%" valign="middle">
                    <col width="6.956%" valign="middle">
                    <col width="6.782%" valign="middle">
                    <col width="14.525%" valign="middle">
                    <col width="17.565%" valign="middle">
                    <tbody>
                        <tr>
                            <td>
                                <div class="tbody-wrapper location">
                                    <p>Южная Пальмира</p>
                                    <p>Генуэзская/Посмитного</p>
                                    <span>Аркадия, Одесса, Одесская, Украина</span>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper type">
                                    <p>2к</p>
                                    <span>Квартира</span>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper area">
                                    <p>60/40/15</p>
                                    <span>5сот</span>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper condition">
                                    <p>С ремонтом</p>
                                    <p>Новострой</p>
                                    <span> Монолит</span>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper floor">
                                    <p>4/25</p>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper photo">
                                    <img src="./img/image.png" alt="">
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper price">
                                    <p>85000</p>
                                    <span>850/м <sup>2</sup></span>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper contact">
                                    <p data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Имя Фамилия">Имя Фамилия</p>
                                    <p data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Real Estate Name">Real Estate Name</p>
                                    <a href="tel:380968796542">+380968796542</a>
                                </div>
                            </td>
                            <td>
                                <div class="tbody-wrapper block-actions">
                                    <a href="#" class="btn mail-link" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Написать">
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
                                                    <li><a class="dropdown-item" href="#">Передать</a></li>
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
                                    <button type="button" class="details-control-dop">
                                        <img src="./img/icon/plus.svg" alt="">
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
			tbodyDopInfo.after(othersTable);
			infoFooterBtn.addClass('active'); // Додаємо клас "active", якщо таблиця додається
		}
	});
	
	// Обробник кліку на кнопку "close-btn-other"
	$('#example tbody').on('click', '.close-btn-other', function () {
		const button = $(this);
		const dopInfoRow = button.closest('.dop-info-row');
		const tbodyDopInfo = dopInfoRow.find('.tbody-dop-info');
		const othersTable = tbodyDopInfo.next('.table-for-others');
		
		if (othersTable.length) {
			othersTable.remove();
			button.removeClass('active');
		}
	});
	
	// Обробник кліку на кнопку "details-control-dop"
	$('#example tbody').on('click', '.details-control-dop', function () {
		const button = $(this);
		const img = button.find('img');
		toggleImage(img);
		const row = button.closest('tr');
		const isExpanded = row.next().hasClass('dop-info-row-dop');
		if (isExpanded) {
			row.next().remove();
		} else {
			const dopInfoRow = `
            <tr class="dop-info-row-dop">
                <td colspan="9">
                    <div class="tbody-dop-info">
                        <div class="info-main">
                            <div class="info-main-left">
                                <div class="info-main-left-wrapper">
                                    <div class="description">
                                        <h2 class="description-title">Заголовок текст 1 к кв пл Толбухина срочно</h2>
                                        <p class="description-text">
                                            Отличная квартира сдается длительно порядочным людям. Евроремонт свежий. Есть
                                            вся мебель и техника и еще описание
                                            <span class="more-text" style="display: none;">
                                                Полное описание квартиры с деталями, которые скрыты по умолчанию.
                                            </span>
                                            <button class="btn btn-show-text2"  type="button">Ещё</button>
                                        </p>
                                        <p class="description-note">
                                            <strong>Примечание для агентов:</strong>
                                            <span>Текст примечание для агентов Отличная квартира сдается длительно порядочным людям. Евроремонт свежий. Есть вся мебель и техника и еще описание</span>
                                        </p>
                                    </div>
                                    <div class="block-info">
                                        <h2 class="info-title">Собственник</h2>
                                        <div class="info-avatar">
                                            <img src="./img/icon/default-avatar-table.svg" alt="">
                                        </div>
                                        <div class="info-contacts">
                                            <p class="info-contacts-name">Имя Фамилия</p>
                                            <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                            <a href="mailto:nameemail@gmail.com" class="info-contacts-mail">nameemail@gmail.com</a>
                                        </div>
                                        <div class="info-description">
                                            <p>Покупает тому-то, продает свою там-то, звонить тогда-то текст личной заметки</p>
										</div>
                                    </div>
                                </div>
                                <div class="filter-tags">
                                    <div class="badge rounded-pill qwe1">Параметр из фильтра</div>
                                    <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                    <div class="badge rounded-pill qwe2">Параметр из фильтра</div>
                                </div>
                            </div>
                            <div class="info-main-right">
                                <div class="block-info">
                                    <h2 class="info-title">Агент</h2>
                                    <div class="info-avatar">
                                        <img src="./img/icon/default-avatar-table.svg" alt="">
                                         <img src="./img/icon/company.svg" alt="">
                                    </div>
                                    <div class="info-contacts">
                                        <p class="info-contacts-name">Длинное имя Добровольский</p>
                                        <p class="info-contacts-company">Real Estate Name</p>
                                        <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                        <a href="tel:+381231257869" class="info-contacts-tel">+38 (123) 125 - 78 - 69</a>
                                        <a href="mailto:nameemail@gmail.com" class="info-contacts-mail">nameemail@gmail.com</a>
                                    </div>
                                </div>
                            </div>
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
	// Обробник кліку на кнопку "btn-show-text"
	$('#example tbody').on('click', '.btn-show-text2', function () {
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