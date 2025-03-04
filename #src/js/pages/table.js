$(document).ready(function () {
	const table = $('#example').DataTable({
		searching: false,
		ordering: false,
		processing: false,
		columns: [
			{
				data: null,
				orderable: false,
				searchable: false,
				render: function (data, type, row) {
					// Додаємо кнопку з іконкою для деталей
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
					// Додаємо кнопки для дій (бургер-меню, гео-кнопка, сортування)
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
		const button = $(this); // Отримуємо кнопку, на яку клікнули
		const img = button.find('img'); // Знаходимо <img> всередині кнопки
		
		// Змінюємо іконку кнопки
		toggleImage(img);
		
		// Отримуємо поточний рядок
		const row = button.closest('tr');
		
		// Перевіряємо, чи вже додано додатковий рядок
		const isExpanded = row.next().hasClass('dop-info-row');
		
		if (isExpanded) {
			// Якщо рядок вже розгорнуто, видаляємо його
			row.next().remove();
		} else {
			// Якщо рядок не розгорнуто, додаємо додатковий рядок
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
                                                <button class="btn" id="btn-show-text" type="button">Ещё</button>
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
                                <p class="info-footer-data">У других: <button class="info-footer-btn" id="btn-others" type="button">3</button></p>
                                <button class="info-footer-btn ms-auto" id="close-btn-other" type="button">Свернуть</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
			
			// Вставляємо додатковий рядок після поточного
			row.after(dopInfoRow);
		}
	});
	
	// Обробник кліку на кнопку "btn-others"
	$('#example tbody').on('click', '#btn-others', function () {
		const button = $(this); // Отримуємо кнопку, на яку клікнули
		const dopInfoRow = button.closest('.dop-info-row'); // Знаходимо батьківський рядок
		const tbodyDopInfo = dopInfoRow.find('.tbody-dop-info'); // Знаходимо блок .tbody-dop-info
		
		// Перевіряємо, чи вже додано блок .table-for-others
		const isOthersTableAdded = tbodyDopInfo.next().hasClass('table-for-others');
		
		if (isOthersTableAdded) {
			// Якщо блок вже додано, видаляємо його
			tbodyDopInfo.next().remove();
		} else {
			// Якщо блок не додано, вставляємо його
			const othersTable = `
                <div class="table-for-others">
                    <table id="example2" style="width:98%;">
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
			
			// Вставляємо блок .table-for-others після .tbody-dop-info
			tbodyDopInfo.after(othersTable);
		}
	});
	
	// Обробник кліку на кнопку "close-btn-other"
	$('#example tbody').on('click', '#close-btn-other', function () {
		const button = $(this); // Отримуємо кнопку, на яку клікнули
		const dopInfoRow = button.closest('.dop-info-row'); // Знаходимо батьківський рядок
		const tbodyDopInfo = dopInfoRow.find('.tbody-dop-info'); // Знаходимо блок .tbody-dop-info
		
		// Видаляємо блок .table-for-others, якщо він існує
		const othersTable = tbodyDopInfo.next('.table-for-others');
		if (othersTable.length) {
			othersTable.remove();
		}
	});
	
	/**
	 * Функція для зміни зображення між plus.svg та minus.svg.
	 * @param {jQuery} img - Елемент <img>.
	 */
	function toggleImage(img) {
		const isPlus = img.attr('src').includes('plus.svg');
		img.attr('src', img.attr('src').replace(isPlus ? 'plus.svg' : 'minus.svg', isPlus ? 'minus.svg' : 'plus.svg'));
	}
});