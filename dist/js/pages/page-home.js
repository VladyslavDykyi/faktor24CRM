"use strict";
(function () {
	$('#example').DataTable({
		searching: false,
		"ordering": false,
		});
	
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
	// $(document).ready(function () {
	// 	// Ініціалізація DataTables
	// 	const table = $('#example').DataTable({
	// 		searching: false,
	// 		ordering: false,
	// 		info: true,
	// 		columns: [
	// 			{ data: null, orderable: false, searchable: false }, // Перша колонка (кнопка)
	// 			{ data: 'location' }, // Локація
	// 			{ data: 'type' }, // Тип
	// 			{ data: 'area' }, // Площа
	// 			{ data: 'condition' }, // Стан
	// 			{ data: 'floor' }, // Поверх
	// 			{ data: 'photo' }, // Фото
	// 			{ data: 'price' }, // Ціна
	// 			{ data: 'contact' }, // Контакт
	// 			{ data: null, orderable: false, searchable: false } // Остання колонка (кнопки дій)
	// 		],
	// 		columnDefs: [
	// 			{
	// 				targets: -1, // Остання колонка
	// 				render: function (data, type, row) {
	// 					return `
    //                     <div class="block-actions tbody-wrapper">
    //                         <div class="block-actions-wrapper">
    //                             <a href="#" class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Написать агенту">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M2.33304 3.33268C2.14894 3.33268 1.9997 3.48192 1.9997 3.66602V12.3327C1.9997 12.5168 2.14894 12.666 2.33304 12.666H13.6664C13.8505 12.666 13.9997 12.5168 13.9997 12.3327V3.66602C13.9997 3.48192 13.8505 3.33269 13.6664 3.33269L2.33304 3.33268ZM1.33304 3.66602C1.33304 3.11373 1.78075 2.66602 2.33304 2.66602L13.6664 2.66602C14.2187 2.66602 14.6664 3.11373 14.6664 3.66602V12.3327C14.6664 12.885 14.2187 13.3327 13.6664 13.3327H2.33304C1.78075 13.3327 1.33304 12.885 1.33304 12.3327V3.66602Z" fill="#0062FF"/>
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M1.39329 4.07486C1.49886 3.92404 1.70671 3.88736 1.85752 3.99293L7.9997 8.29246L14.1419 3.99293C14.2927 3.88736 14.5005 3.92404 14.6061 4.07486C14.7117 4.22567 14.675 4.43352 14.5242 4.53909L8.19086 8.97242C8.07608 9.05276 7.92332 9.05276 7.80855 8.97242L1.47522 4.53909C1.3244 4.43352 1.28772 4.22567 1.39329 4.07486Z" fill="#0062FF"/>
    //                                 </svg>
    //                             </a>
    //                             <div class="block-actions-wrapper">
    //                                 <div class="menu-info">
    //                                     <div class="dropdown">
    //                                         <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70524 2.32252C9.36872 1.68108 10.2574 1.32609 11.1799 1.33412C12.1024 1.34214 12.9848 1.71254 13.637 2.36542C14.2893 3.01829 14.6592 3.9014 14.6672 4.82453C14.6752 5.74766 14.3207 6.63706 13.6799 7.30118L13.6759 7.30535L11.7651 9.21796C11.4085 9.57504 10.9792 9.85125 10.5066 10.0277C10.0339 10.2042 9.52883 10.2769 9.02561 10.2408C8.52239 10.2048 8.03282 10.0608 7.59011 9.81867C7.14739 9.57656 6.76191 9.24198 6.45977 8.83766C6.34957 8.69019 6.37979 8.48131 6.52726 8.37111C6.67473 8.26091 6.88361 8.29113 6.9938 8.4386C7.23873 8.76636 7.5512 9.03754 7.90999 9.23376C8.26878 9.42998 8.66551 9.54665 9.07328 9.57588C9.48105 9.60512 9.89034 9.54622 10.2734 9.40319C10.6564 9.26016 11.0043 9.03634 11.2934 8.74687L13.2021 6.83625C13.7203 6.29813 14.007 5.57791 14.0005 4.83032C13.994 4.08178 13.6941 3.36581 13.1654 2.83659C12.6367 2.30738 11.9216 2.00726 11.1741 2.00076C10.4274 1.99426 9.70792 2.28129 9.17031 2.80019L8.07654 3.88867C7.94606 4.01853 7.735 4.01802 7.60514 3.88753C7.47528 3.75704 7.47579 3.54599 7.60628 3.41613L8.70524 2.32252Z" fill="#0062FF"/>
    //                                                 <path fill-rule="evenodd" clip-rule="evenodd" d="M5.49471 5.97355C5.96739 5.79705 6.47247 5.72437 6.97569 5.76045C7.47891 5.79652 7.96848 5.94051 8.4112 6.18262C8.85391 6.42474 9.2394 6.75931 9.54153 7.16363C9.65173 7.3111 9.62152 7.51998 9.47405 7.63018C9.32658 7.74038 9.1177 7.71017 9.0075 7.5627C8.76257 7.23493 8.45011 6.96375 8.09132 6.76754C7.73252 6.57132 7.33579 6.45464 6.92802 6.42541C6.52025 6.39618 6.11097 6.45507 5.72792 6.5981C5.34487 6.74113 4.99701 6.96496 4.70793 7.25442L2.79921 9.16504C2.28101 9.70316 1.99427 10.4234 2.00076 11.171C2.00726 11.9195 2.30721 12.6355 2.8359 13.1647C3.36458 13.6939 4.07969 13.994 4.82719 14.0005C5.57375 14.007 6.29309 13.7201 6.83066 13.2014L7.9177 12.1133C8.04781 11.9831 8.25886 11.983 8.3891 12.1131C8.51934 12.2432 8.51945 12.4542 8.38934 12.5845L7.29609 13.6788C6.63262 14.3202 5.7439 14.6752 4.82139 14.6672C3.89888 14.6592 3.0165 14.2888 2.36426 13.6359C1.71203 12.983 1.34213 12.0999 1.33412 11.1768C1.3261 10.2536 1.68062 9.36423 2.32141 8.70011L2.32543 8.69594L4.23621 6.78334C4.59283 6.42625 5.02206 6.15004 5.49471 5.97355Z" fill="#0062FF"/>
    //                                             </svg>
    //                                         </button>
    //                                         <ul class="dropdown-menu">
    //                                             <li><a class="dropdown-item" href="#"><span>На сайте</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>Скачать PDF</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>Telegram</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>Viber</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>Whatsapp</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>На Rem.ua</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>Видео Youtube</span></a></li>
    //                                             <li><a class="dropdown-item" href="#"><span>На карте</span></a></li>
    //                                         </ul>
    //                                     </div>
    //                                 </div>
    //                                 <label class="bookmark">
    //                                     <input type="checkbox">
    //                                     <span>
    //                                         <svg class="non-checked" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                             <path fill-rule="evenodd" clip-rule="evenodd" d="M4.33398 2.66667C4.14989 2.66667 4.00065 2.81591 4.00065 3V12.9931L7.79846 10.0956C7.91786 10.0045 8.08344 10.0045 8.20284 10.0956L12.0007 12.9931V3C12.0007 2.81591 11.8514 2.66667 11.6673 2.66667H4.33398ZM3.33398 3C3.33398 2.44772 3.7817 2 4.33398 2H11.6673C12.2196 2 12.6673 2.44772 12.6673 3V13.6667C12.6673 13.7934 12.5954 13.9092 12.4818 13.9654C12.3682 14.0216 12.2326 14.0086 12.1318 13.9317L8.00065 10.7799L3.8695 13.9317C3.76873 14.0086 3.63308 14.0216 3.51947 13.9654C3.40587 13.9092 3.33398 13.7934 3.33398 13.6667V3Z" fill="#0062FF"/>
    //                                         </svg>
    //                                         <svg class="on-checked" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                                             <path d="M13.3327 14.354C13.3327 14.6248 13.0269 14.7826 12.8062 14.6256L7.99935 11.2078L3.19251 14.6256C2.97182 14.7826 2.66602 14.6248 2.66602 14.354V2.66667C2.66602 2.29848 2.96449 2 3.33268 2H12.666C13.0342 2 13.3327 2.29848 13.3327 2.66667V14.354Z" fill="#0062FF"/>
    //                                         </svg>
    //                                     </span>
    //                                 </label>
    //                                 <div class="menu-burger">
    //                                     <div class="dropdown">
    //                                         <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                                             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    //                                                 <path d="M17.5 21C17.5 21.8284 16.8284 22.5 16 22.5C15.1716 22.5 14.5 21.8284 14.5 21C14.5 20.1716 15.1716 19.5 16 19.5C16.8284 19.5 17.5 20.1716 17.5 21ZM17.5 16C17.5 16.8284 16.8284 17.5 16 17.5C15.1716 17.5 14.5 16.8284 14.5 16C14.5 15.1716 15.1716 14.5 16 14.5C16.8284 14.5 17.5 15.1716 17.5 16ZM17.5 11C17.5 11.8284 16.8284 12.5 16 12.5C15.1716 12.5 14.5 11.8284 14.5 11C14.5 10.1716 15.1716 9.5 16 9.5C16.8284 9.5 17.5 10.1716 17.5 11Z" fill="#0062FF"/>
    //                                             </svg>
    //                                         </button>
    //                                         <ul class="dropdown-menu">
    //                                             <li><a class="dropdown-item" href="#">Обновить</a></li>
    //                                             <li><a class="dropdown-item" href="#">Редактировать</a></li>
    //                                             <li><a class="dropdown-item" href="#">Удалить</a></li>
    //                                             <li><a class="dropdown-item" href="#">Отложить</a></li>
    //                                             <li><a class="dropdown-item" href="#">Передать</a></li>
    //                                         </ul>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <button type="button" class="details-control">
    //                                 <svg class="minus" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M5 12C5 11.4477 5.44772 11 6 11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H6C5.44772 13 5 12.5523 5 12Z" fill="#182234"/>
    //                                 </svg>
    //                                 <svg class="plus" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C12.5523 5 13 5.44772 13 6V11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H11V6C11 5.44772 11.4477 5 12 5Z" fill="#182234"/>
    //                                 </svg>
    //                             </button>
    //                         </div>
    //                     </div>
    //                 `;
	// 				}
	// 			}
	// 		],
	// 		data: [
	// 			{
	// 				location: 'Южная Пальмира, Генуэзская/Посмитного, Аркадия, Одесса, Одесская, Украина',
	// 				type: '2к Квартира',
	// 				area: '60/40/15 5сот',
	// 				condition: 'С ремонтом, Новострой, Монолит',
	// 				floor: '4/25',
	// 				photo: '<img src="./img/image.png" alt="">',
	// 				price: '85000 (850/м²)',
	// 				contact: 'Имя Фамилия, Real Estate Name, +380968796542',
	// 				salary: 85000
	// 			}
	// 			// Додайте інші рядки даних тут
	// 		]
	// 	});
	//
	// 	// Обробник події для кнопки details-control
	// 	$('#example tbody').on('click', 'td .details-control', function () {
	// 		const tr = $(this).closest('tr');
	// 		const row = table.row(tr);
	// 		const salary = $(this).data('salary');
	//
	// 		if (row.child.isShown()) {
	// 			row.child.hide();
	// 			$(this).text('▶');
	// 		} else {
	// 			row.child('<strong>Salary:</strong> $' + salary).show();
	// 			$(this).text('▼');
	// 		}
	// 	});
	//
	// 	// Додавання нового порожнього рядка під поточним рядком
	// 	$('#example tbody').on('click', 'button.details-control', function () {
	// 		const currentRow = $(this).closest('tr'); // Поточний рядок
	// 		const newRow = $('<tr>').html(`
    //         <td colspan="10">
    //             <div class="tbody-wrapper checkBox">
    //                 <label class="my-custom-input">
    //                     <input type="checkbox">
    //                     <span></span>
    //                 </label>
    //             </div>
    //             <div class="tbody-wrapper location">
    //                 <p>Нова локація</p>
    //                 <p>Нова адреса</p>
    //                 <span>Нове місто, Нова область, Україна</span>
    //             </div>
    //             <div class="tbody-wrapper type">
    //                 <p>3к</p>
    //                 <span>Квартира</span>
    //             </div>
    //             <div class="tbody-wrapper area">
    //                 <p>80/50/20</p>
    //                 <span>6сот</span>
    //             </div>
    //             <div class="tbody-wrapper condition">
    //                 <p>Без ремонту</p>
    //                 <p>Новострой</p>
    //                 <span>Монолит</span>
    //             </div>
    //             <div class="tbody-wrapper floor">
    //                 <p>5/25</p>
    //             </div>
    //             <div class="tbody-wrapper photo">
    //                 <img src="./img/image.png" alt="">
    //             </div>
    //             <div class="tbody-wrapper price">
    //                 <p>95000</p>
    //                 <span>950/м <sup>2</sup></span>
    //             </div>
    //             <div class="tbody-wrapper contact">
    //                 <p data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Нове імя">Нове імя</p>
    //                 <p data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Нова агенція">Нова агенція</p>
    //                 <a href="tel:380968796542">+380968796542</a>
    //             </div>
    //             <div class="block-actions tbody-wrapper">
    //                 <div class="block-actions-wrapper">
    //                     <a href="#" class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Написать агенту">
    //                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                             <path fill-rule="evenodd" clip-rule="evenodd" d="M2.33304 3.33268C2.14894 3.33268 1.9997 3.48192 1.9997 3.66602V12.3327C1.9997 12.5168 2.14894 12.666 2.33304 12.666H13.6664C13.8505 12.666 13.9997 12.5168 13.9997 12.3327V3.66602C13.9997 3.48192 13.8505 3.33269 13.6664 3.33269L2.33304 3.33268ZM1.33304 3.66602C1.33304 3.11373 1.78075 2.66602 2.33304 2.66602L13.6664 2.66602C14.2187 2.66602 14.6664 3.11373 14.6664 3.66602V12.3327C14.6664 12.885 14.2187 13.3327 13.6664 13.3327H2.33304C1.78075 13.3327 1.33304 12.885 1.33304 12.3327V3.66602Z" fill="#0062FF"/>
    //                             <path fill-rule="evenodd" clip-rule="evenodd" d="M1.39329 4.07486C1.49886 3.92404 1.70671 3.88736 1.85752 3.99293L7.9997 8.29246L14.1419 3.99293C14.2927 3.88736 14.5005 3.92404 14.6061 4.07486C14.7117 4.22567 14.675 4.43352 14.5242 4.53909L8.19086 8.97242C8.07608 9.05276 7.92332 9.05276 7.80855 8.97242L1.47522 4.53909C1.3244 4.43352 1.28772 4.22567 1.39329 4.07486Z" fill="#0062FF"/>
    //                         </svg>
    //                     </a>
    //                     <div class="block-actions-wrapper">
    //                         <div class="menu-info">
    //                             <div class="dropdown">
    //                                 <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                                         <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70524 2.32252C9.36872 1.68108 10.2574 1.32609 11.1799 1.33412C12.1024 1.34214 12.9848 1.71254 13.637 2.36542C14.2893 3.01829 14.6592 3.9014 14.6672 4.82453C14.6752 5.74766 14.3207 6.63706 13.6799 7.30118L13.6759 7.30535L11.7651 9.21796C11.4085 9.57504 10.9792 9.85125 10.5066 10.0277C10.0339 10.2042 9.52883 10.2769 9.02561 10.2408C8.52239 10.2048 8.03282 10.0608 7.59011 9.81867C7.14739 9.57656 6.76191 9.24198 6.45977 8.83766C6.34957 8.69019 6.37979 8.48131 6.52726 8.37111C6.67473 8.26091 6.88361 8.29113 6.9938 8.4386C7.23873 8.76636 7.5512 9.03754 7.90999 9.23376C8.26878 9.42998 8.66551 9.54665 9.07328 9.57588C9.48105 9.60512 9.89034 9.54622 10.2734 9.40319C10.6564 9.26016 11.0043 9.03634 11.2934 8.74687L13.2021 6.83625C13.7203 6.29813 14.007 5.57791 14.0005 4.83032C13.994 4.08178 13.6941 3.36581 13.1654 2.83659C12.6367 2.30738 11.9216 2.00726 11.1741 2.00076C10.4274 1.99426 9.70792 2.28129 9.17031 2.80019L8.07654 3.88867C7.94606 4.01853 7.735 4.01802 7.60514 3.88753C7.47528 3.75704 7.47579 3.54599 7.60628 3.41613L8.70524 2.32252Z" fill="#0062FF"/>
    //                                         <path fill-rule="evenodd" clip-rule="evenodd" d="M5.49471 5.97355C5.96739 5.79705 6.47247 5.72437 6.97569 5.76045C7.47891 5.79652 7.96848 5.94051 8.4112 6.18262C8.85391 6.42474 9.2394 6.75931 9.54153 7.16363C9.65173 7.3111 9.62152 7.51998 9.47405 7.63018C9.32658 7.74038 9.1177 7.71017 9.0075 7.5627C8.76257 7.23493 8.45011 6.96375 8.09132 6.76754C7.73252 6.57132 7.33579 6.45464 6.92802 6.42541C6.52025 6.39618 6.11097 6.45507 5.72792 6.5981C5.34487 6.74113 4.99701 6.96496 4.70793 7.25442L2.79921 9.16504C2.28101 9.70316 1.99427 10.4234 2.00076 11.171C2.00726 11.9195 2.30721 12.6355 2.8359 13.1647C3.36458 13.6939 4.07969 13.994 4.82719 14.0005C5.57375 14.007 6.29309 13.7201 6.83066 13.2014L7.9177 12.1133C8.04781 11.9831 8.25886 11.983 8.3891 12.1131C8.51934 12.2432 8.51945 12.4542 8.38934 12.5845L7.29609 13.6788C6.63262 14.3202 5.7439 14.6752 4.82139 14.6672C3.89888 14.6592 3.0165 14.2888 2.36426 13.6359C1.71203 12.983 1.34213 12.0999 1.33412 11.1768C1.3261 10.2536 1.68062 9.36423 2.32141 8.70011L2.32543 8.69594L4.23621 6.78334C4.59283 6.42625 5.02206 6.15004 5.49471 5.97355Z" fill="#0062FF"/>
    //                                     </svg>
    //                                 </button>
    //                                 <ul class="dropdown-menu">
    //                                     <li><a class="dropdown-item" href="#"><span>На сайте</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>Скачать PDF</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>Telegram</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>Viber</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>Whatsapp</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>На Rem.ua</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>Видео Youtube</span></a></li>
    //                                     <li><a class="dropdown-item" href="#"><span>На карте</span></a></li>
    //                                 </ul>
    //                             </div>
    //                         </div>
    //                         <label class="bookmark">
    //                             <input type="checkbox">
    //                             <span>
    //                                 <svg class="non-checked" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M4.33398 2.66667C4.14989 2.66667 4.00065 2.81591 4.00065 3V12.9931L7.79846 10.0956C7.91786 10.0045 8.08344 10.0045 8.20284 10.0956L12.0007 12.9931V3C12.0007 2.81591 11.8514 2.66667 11.6673 2.66667H4.33398ZM3.33398 3C3.33398 2.44772 3.7817 2 4.33398 2H11.6673C12.2196 2 12.6673 2.44772 12.6673 3V13.6667C12.6673 13.7934 12.5954 13.9092 12.4818 13.9654C12.3682 14.0216 12.2326 14.0086 12.1318 13.9317L8.00065 10.7799L3.8695 13.9317C3.76873 14.0086 3.63308 14.0216 3.51947 13.9654C3.40587 13.9092 3.33398 13.7934 3.33398 13.6667V3Z" fill="#0062FF"/>
    //                                 </svg>
    //                                 <svg class="on-checked" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //                                     <path d="M13.3327 14.354C13.3327 14.6248 13.0269 14.7826 12.8062 14.6256L7.99935 11.2078L3.19251 14.6256C2.97182 14.7826 2.66602 14.6248 2.66602 14.354V2.66667C2.66602 2.29848 2.96449 2 3.33268 2H12.666C13.0342 2 13.3327 2.29848 13.3327 2.66667V14.354Z" fill="#0062FF"/>
    //                                 </svg>
    //                             </span>
    //                         </label>
    //                         <div class="menu-burger">
    //                             <div class="dropdown">
    //                                 <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    //                                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    //                                         <path d="M17.5 21C17.5 21.8284 16.8284 22.5 16 22.5C15.1716 22.5 14.5 21.8284 14.5 21C14.5 20.1716 15.1716 19.5 16 19.5C16.8284 19.5 17.5 20.1716 17.5 21ZM17.5 16C17.5 16.8284 16.8284 17.5 16 17.5C15.1716 17.5 14.5 16.8284 14.5 16C14.5 15.1716 15.1716 14.5 16 14.5C16.8284 14.5 17.5 15.1716 17.5 16ZM17.5 11C17.5 11.8284 16.8284 12.5 16 12.5C15.1716 12.5 14.5 11.8284 14.5 11C14.5 10.1716 15.1716 9.5 16 9.5C16.8284 9.5 17.5 10.1716 17.5 11Z" fill="#0062FF"/>
    //                                     </svg>
    //                                 </button>
    //                                 <ul class="dropdown-menu">
    //                                     <li><a class="dropdown-item" href="#">Обновить</a></li>
    //                                     <li><a class="dropdown-item" href="#">Редактировать</a></li>
    //                                     <li><a class="dropdown-item" href="#">Удалить</a></li>
    //                                     <li><a class="dropdown-item" href="#">Отложить</a></li>
    //                                     <li><a class="dropdown-item" href="#">Передать</a></li>
    //                                 </ul>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <button type="button" class="details-control">
    //                         <svg class="minus" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path fill-rule="evenodd" clip-rule="evenodd" d="M5 12C5 11.4477 5.44772 11 6 11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H6C5.44772 13 5 12.5523 5 12Z" fill="#182234"/>
    //                         </svg>
    //                         <svg class="plus" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                             <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C12.5523 5 13 5.44772 13 6V11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H11V6C11 5.44772 11.4477 5 12 5Z" fill="#182234"/>
    //                         </svg>
    //                     </button>
    //                 </div>
    //             </div>
    //         </td>
    //     `);
	//
	// 		// Вставляємо новий рядок під поточним
	// 		currentRow.after(newRow);
	// 	});
	// });
	$(document).ready(function () {
		
		const $cityInput = $('#city');
		const $listCountry = $('#list-country');
		const $listOblast = $('#list-oblast');
		const $listCity = $('#list-city');
		const $listStreet = $('#list-street');
		const $dropMenu = $('.drop-menu');
		
		function hideAllLists() {
			$listCountry.hide();
			$listOblast.hide();
			$listCity.hide();
			$listStreet.hide();
		}
		
		$cityInput.on('input', function () {
			if ($cityInput.val().trim() !== '') {
				$listCountry.show();
				$listOblast.hide();
				$listCity.hide();
				$listStreet.hide();
			} else {
				hideAllLists();
			}
		});
		
		$listCountry.find('input[type="radio"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listOblast.show();
				$listCity.hide();
				$listStreet.hide();
			}
		});
		
		$listOblast.find('input[type="radio"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listCity.show();
				$listStreet.hide();
			}
		});
		
		$listCity.find('input[type="checkbox"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listStreet.show();
			}
		});
		
		$(document).on('click', function (event) {
			if (!$(event.target).closest($dropMenu).length && !$(event.target).is($cityInput)) {
				hideAllLists();
			}
		});
		
		$dropMenu.on('click', function (event) {
			event.stopPropagation();
		});
	});
	$('thead .my-custom-input input').on('change', function () {
		let isChecked = $(this).prop('checked');
		$('tbody .my-custom-input input').prop('checked', isChecked);
	});
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
})();