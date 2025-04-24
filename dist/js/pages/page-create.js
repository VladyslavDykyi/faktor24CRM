"use strict";
(function () {
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
	
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			document.querySelectorAll('input, select').forEach(el => {
				el.value = '';
				el.autocomplete = 'new-password';
			});
		}, 100);
	});
	
	$('.my-select2').on('select2:opening', function (e) {
		$('.filter select').attr("style", "display: none !important");
	});
	
	$('.my-select2').on('select2:closing', function (e) {
		$('.filter select').attr("style", "display: block !important");
	});
	
	const obj_gpt = {
		location: `Локація: Парус`,
		city: 'місто: Дніпро',
		district: 'район: Індустріальний',
		street: 'вулиця: набережна Перемоги',
		residentialComplex: 'назва комплексу: Sun City',
		typeRealEstate: 'тип нерухомості: квартира',
		numberRooms: 'кількість кімнат: 3',
		condition: 'стан нерухомості: без ремонту',
		tags: 'перелік додаткових тегів: парковка, дитячий майданчик, поруч магазини, панорамний вид з вікна',
	};

// Функція для отримання значення поля (без міток)
	const getCleanValue = (field) => {
		if ( !obj_gpt[field]) return null;
		return obj_gpt[field].split(':').slice(1).join(':').trim();
	};

// Фільтруємо та формуємо тільки заповнені поля
	const filledFields = Object.entries({
		'Локація': getCleanValue('location'),
		'Місто': getCleanValue('city'),
		'Район': getCleanValue('district'),
		'Вулиця': getCleanValue('street'),
		'Житловий комплекс': getCleanValue('residentialComplex'),
		'Тип нерухомості': getCleanValue('typeRealEstate'),
		'Кількість кімнат': getCleanValue('numberRooms'),
		'Стан': getCleanValue('condition'),
		'Додаткові переваги': getCleanValue('tags')
	}).filter(([_, value]) => value !== null);

// Формуємо фінальний запит
	const stringFetch = `Згенеруй привабливий опис для оголошення нерухомості мінімум на 1500 слів
		 українською мовою, російською, англійською. розділи ці 3 переклади через коди мов ua,ru,en Ось дані об'єкта:
		${filledFields.map(([key, value]) => `- ${key}: ${value}`).join('\n')}
		`;
	
	const createObjTextTranslition = (text) => {
		const splitText = text.trim().split('\n\n');
		const texts = {};
		
		splitText.forEach(block => {
			const [langPart, ...contentParts] = block.split(':');
			const lang = langPart.trim();
			const content = contentParts.join(':').trim();
			
			texts[lang] = content;
		});
		return texts;
	}
	const textEditor = (inputText) => {
		const textareas = document.querySelectorAll('.description-for-advertising');
		
		const translations = createObjTextTranslition(inputText);
		
		textareas.forEach(textarea => {
			const lang = textarea.dataset.textareaLang;
			if (translations[lang]) {
				textarea.value = translations[lang];
			}
		});
	}
	
	const fetchGPT = async (e) => {
		const url = 'https://api.openai.com/v1/chat/completions';
		const apiKey = 'АРІ_ключ'; // Замініть на реальний ключ
		
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{role: 'user', content: stringFetch}
					],
					temperature: 1
				})
			});
			if ( !response.ok) {
				throw new Error(`HTTP помилка! Статус: ${response.status}`);
			}
			const data = await response.json();
			
			if (data.choices && data.choices[0]) {
				const message = data.choices[0].message.content;
				textEditor(message)
			}
		} catch (error) {
			console.error('Сталася помилка:', error);
		}
	}
	
	const btn_gpt = document.querySelector('#generation-chat-gpt');
	btn_gpt.addEventListener('click', fetchGPT);
	
	const btn_add_tel = document.querySelector('.btn-new-tel');
	let phoneCounter = 1; // Лічильник для унікальних ID
	const MAX_PHONES = 3; // Максимальна кількість телефонних полів
	
	btn_add_tel.addEventListener('click', (e) => {
		// Перевіряємо кількість вже доданих полів
		const currentPhones = document.querySelectorAll('.right .item').length;
		
		if (currentPhones >= MAX_PHONES) {
			alert(`Максимальна кількість телефонів - ${MAX_PHONES}`);
			return;
		}
		
		phoneCounter++;
		const wrapper = document.querySelector('.create-filter-client-wrapper .right');
		
		// Створюємо новий елемент
		const newItem = document.createElement('div');
		newItem.className = 'item';
		newItem.innerHTML = `
        <label for="tel-contact${phoneCounter}">Телефон</label>
        <div class="item-inputText-wrapper">
            <input class="item-inputText tel-contact" id="tel-contact${phoneCounter}" type="tel" autocomplete="off">
        </div>
    `;
		
		// Додаємо перед кнопкою додавання
		const addButton = wrapper.querySelector('.add_new-tel');
		wrapper.insertBefore(newItem, addButton);
		
		// Ініціалізуємо intl-tel-input для нового поля
		initTelInput(newItem.querySelector('.tel-contact'));
		
		// Ховаємо кнопку додавання, якщо досягнуто максимум
		if (currentPhones + 1 >= MAX_PHONES) {
			btn_add_tel.style.display = 'none';
		}
	});

// Функція для ініціалізації intl-tel-input
	function initTelInput(inputElement) {
		const $input = $(inputElement);
		
		// Ініціалізація intl-tel-input
		const iti = window.intlTelInput(inputElement, {
			initialCountry: "ua",
			utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js",
			separateDialCode: true,
			nationalMode: true,
			autoPlaceholder: "aggressive",
			customPlaceholder: function(placeholder, countryData) {
				return placeholder.replace(/[0-9]/g, '_');
			}
		});
		
		// Маски для різних країн
		const countryMasks = {
			'ua': '(99) 999-99-99',
			'us': '(999) 999-9999',
			'gb': '9999 999999',
			'de': '999 99999999',
			'fr': '9 99-99-99-99',
			'pl': '999 999-999',
			'it': '999 999-9999',
			'es': '999 99-99-99',
			'default': '(999) 999-99-99'
		};
		
		// Функція для застосування маски
		function applyPhoneMask(countryCode) {
			const mask = countryMasks[countryCode] || countryMasks['default'];
			$input.unmask().mask(mask, {
				clearIfNotMatch: true
			});
		}
		
		// Обробник зміни країни
		$input.on('countrychange', function() {
			applyPhoneMask(iti.getSelectedCountryData().iso2);
		});
		
		// Обмеження введення лише цифр
		$input.on('keypress', function(e) {
			if (!/[0-9]/.test(String.fromCharCode(e.which))) {
				e.preventDefault();
			}
		});
		
		// Автоматичне форматування при втраті фокусу
		$input.on('blur', function() {
			if ($input.val()) {
				const number = iti.getNumber();
				if (number) {
					$input.val(number.replace(/[^\d]/g, ''));
				}
			}
		});
		
		// Ініціалізація при створенні
		applyPhoneMask(iti.getSelectedCountryData().iso2);
		
		// Додаткове налаштування для коректного відображення
		setTimeout(function() {
			$input.trigger('countrychange');
		}, 100);
	}

// Ініціалізуємо перше поле при завантаженні сторінки
	document.addEventListener('DOMContentLoaded', function() {
		const firstTelInput = document.querySelector('.tel-contact');
		if (firstTelInput) {
			initTelInput(firstTelInput);
			phoneCounter = 1; // Встановлюємо лічильник на 1
			
			// Перевіряємо кількість полів при завантаженні
			const currentPhones = document.querySelectorAll('.right .item').length;
			if (currentPhones >= MAX_PHONES) {
				document.querySelector('.btn-new-tel').style.display = 'none';
			}
		}
	});
	
// 	class LoadingFile {
// 		constructor () {
// 		}
//
// 	}
//
// 	const input_document = document.querySelector('#document');
// 	const wrapper_document = document.querySelector('.loading-documents');
// 	const error_document = document.querySelector('.loading-documents [for="document"] span');
// 	const validDocuments = []; // Масив для валідних файлів
// 	let noValidDocuments = []; // Масив для невалідних файлів
//
// // Функції для роботи з помилками
// 	const error_document_funk_delete = () => {
// 		if (!wrapper_document || !error_document) return;
//
// 		// Видаляємо всі помилки тільки якщо масив noValidDocuments порожній
// 		if (noValidDocuments.length === 0) {
// 			wrapper_document.classList.remove('error');
// 			const errorElements = error_document.querySelectorAll('ul.error-list, li.error');
// 			errorElements.forEach(element => element.remove());
// 		}
// 	};
//
// 	const error_document_funk = () => {
// 		if (!wrapper_document || !error_document) return;
//
// 		// Спочатку очищаємо попередні помилки
// 		const existingList = error_document.querySelector('ul.error-list');
// 		if (existingList) existingList.remove();
//
// 		// Створюємо новий список помилок
// 		if (noValidDocuments.length > 0) {
// 			wrapper_document.classList.add('error');
//
// 			// Додаємо динамічний margin-bottom в залежності від кількості помилок
// 			const marginBottomValue = `${noValidDocuments.length * 16}px`;
// 			wrapper_document.style.marginBottom = marginBottomValue;
//
// 			const listErrors = document.createElement('ul');
// 			listErrors.classList.add('error-list');
//
// 			noValidDocuments.forEach((item) => {
// 				const elem = document.createElement('li');
// 				elem.innerText = item.text;
// 				elem.classList.add('error');
// 				listErrors.append(elem);
// 			});
//
// 			error_document.append(listErrors);
// 		} else {
// 			// Якщо помилок немає, видаляємо margin-bottom та клас error
// 			wrapper_document.style.marginBottom = '';
// 			error_document_funk_delete();
// 		}
// 	};
//
// // Обробка файлів
// 	input_document.addEventListener('change', (e) => {
// 		const files = Array.from(input_document.files);
//
// 		// Очищаємо масиви при новому виборі файлів
// 		validDocuments.length = 0;
// 		noValidDocuments.length = 0;
//
// 		files.forEach((file, index) => {
// 			// Обробка PDF-файлів
// 			if (file.type === 'application/pdf') {
// 				validDocuments.push({
// 					id: validDocuments.length,
// 					name: file.name,
// 					size: file.size,
// 					width: null,
// 					height: null,
// 				});
// 				return;
// 			}
//
// 			// Перевірка чи це зображення
// 			if (!file.type.match('image.*')) {
// 				noValidDocuments.push({
// 					text: `Файл "${file.name}" не є зображенням або PDF. Допустимі лише зображення (JPG/PNG) та PDF.`
// 				});
// 				return;
// 			}
//
// 			// Обробка зображень
// 			const img = new Image();
// 			const url = URL.createObjectURL(file);
//
// 			img.onload = function() {
// 				URL.revokeObjectURL(url);
//
// 				const width = this.width;
// 				const height = this.height;
//
// 				if (width >= 800 && height >= 800) {
// 					validDocuments.push({
// 						id: validDocuments.length,
// 						name: file.name,
// 						size: file.size,
// 						width: width,
// 						height: height,
// 					});
// 				} else {
// 					noValidDocuments.push({
// 						text: `Зображення "${file.name}" (${width}x${height}) замаленьке. Мінімальний розмір: 800x800 пікселів.`
// 					});
// 				}
//
// 				// Оновлюємо помилки після обробки останнього файлу
// 				if (index === files.length - 1) {
// 					error_document_funk();
// 				}
// 			};
//
// 			img.onerror = () => {
// 				URL.revokeObjectURL(url);
// 				noValidDocuments.push({
// 					text: `Помилка завантаження зображення: ${file.name}`
// 				});
//
// 				// Оновлюємо помилки негайно при помилці завантаження
// 				error_document_funk();
// 			};
//
// 			img.src = url;
// 		});
//
// 		// Якщо не було файлів для асинхронної обробки (наприклад, тільки PDF)
// 		if (files.every(file => file.type === 'application/pdf')) {
// 			error_document_funk();
// 		}
// 	});
	class FileUploader {
		constructor(options) {
			// Обов'язкові параметри
			this.inputId = options.inputId;
			this.wrapperClass = options.wrapperClass;
			
			// Параметри з перевіркою розміру (за замовчуванням true)
			this.checkImageSize = options.checkImageSize !== false;
			
			// Мінімальні розміри тільки якщо перевірка увімкнена
			if (this.checkImageSize) {
				this.minWidth = options.minWidth || 800;
				this.minHeight = options.minHeight || 800;
			}
			
			// Знаходимо DOM-елементи
			this.input = document.querySelector(`#${this.inputId}`);
			this.wrapper = document.querySelector(`.${this.wrapperClass}`);
			this.errorContainer = this.wrapper;
				// ? this.wrapper.querySelector(`.${this.wrapperClass}`)
				// : null;
			
			// Визначаємо контейнер для рендерингу
			this.renderContainer = document.querySelector(
				this.inputId === 'document'
					? '[data-render-document]'
					: '[data-render-plan]'
			);
			
			// Масиви для файлів
			this.validDocuments = [];
			this.invalidDocuments = [];
			// Ініціалізація
			if (this.input && this.wrapper && this.errorContainer) {
				this.init();
			} else {
				console.error('Не вдалося знайти необхідні DOM-елементи');
			}
		}
		
		init() {
			this.input.addEventListener('change', (e) => this.handleFileUpload(e));
		}
		
		clearErrors() {
			if (!this.wrapper || !this.errorContainer) return;
			
			this.wrapper.classList.remove('error');
			this.wrapper.style.marginBottom = '';
			const errorElements = this.errorContainer.querySelectorAll('ul.error-list, li.error');
			errorElements.forEach(element => element.remove());
		}
		
		displayErrors() {
			if (!this.wrapper || !this.errorContainer) return;
			
			// Очищаємо попередні помилки
			this.clearErrors();
			
			// Відображаємо нові помилки, якщо вони є
			if (this.invalidDocuments.length > 0) {
				this.wrapper.classList.add('error');
				this.wrapper.style.marginBottom = `${this.invalidDocuments.length * 16}px`;
				
				const errorList = document.createElement('ul');
				errorList.classList.add('error-list');
				
				this.invalidDocuments.forEach(item => {
					const errorItem = document.createElement('li');
					errorItem.textContent = item.text;
					errorItem.classList.add('error');
					errorList.appendChild(errorItem);
				});
				
				this.errorContainer.appendChild(errorList);
			}
		}
		
		handleFileUpload(event) {
			const files = Array.from(event.target.files);
			
			// Очищаємо масиви
			this.validDocuments = [];
			this.invalidDocuments = [];
			
			// Обробляємо файли
			files.forEach((file, index) => {
				if (file.type === 'application/pdf') {
					this.handlePDF(file);
				} else if (file.type.match('image.*')) {
					this.handleImage(file, index, files.length);
				} else {
					this.handleInvalidFile(file);
				}
			});
			
			// Якщо всі файли PDF (не потребують асинхронної обробки)
			if (files.every(file => file.type === 'application/pdf')) {
				this.displayErrors();
				this.render();
			}
		}
		
		handlePDF(file) {
			this.validDocuments.push({
				id: this.validDocuments.length,
				name: file.name,
				size: file.size,
				width: null,
				height: null,
			});
		}
		
		handleImage(file, index, totalFiles) {
			const img = new Image();
			const url = URL.createObjectURL(file);
			
			img.onload = () => {
				URL.revokeObjectURL(url);
				
				const width = img.width;
				const height = img.height;
				
				if (!this.checkImageSize) {
					// Якщо перевірка вимкнена
					this.validDocuments.push({
						id: this.validDocuments.length,
						name: file.name,
						size: file.size,
						width: width,
						height: height,
					});
				} else if (width >= this.minWidth && height >= this.minHeight) {
					// Якщо перевірка увімкнена і розмір підходить
					this.validDocuments.push({
						id: this.validDocuments.length,
						name: file.name,
						size: file.size,
						width: width,
						height: height,
					});
				} else {
					// Якщо перевірка увімкнена і розмір не підходить
					this.invalidDocuments.push({
						text: `Зображення "${file.name}" (${width}x${height}) замаленьке. Мінімальний розмір: ${this.minWidth}x${this.minHeight} пікселів.`
					});
				}
				
				// Оновлюємо помилки після обробки останнього файлу
				if (index === totalFiles - 1) {
					this.displayErrors();
					this.render();
				}
			};
			
			img.onerror = () => {
				URL.revokeObjectURL(url);
				this.invalidDocuments.push({
					text: `Помилка завантаження зображення: ${file.name}`
				});
				this.displayErrors();
			};
			
			img.src = url;
		}
		
		handleInvalidFile(file) {
			this.invalidDocuments.push({
				text: `Файл "${file.name}" не є зображенням або PDF. Допустимі лише зображення (JPG/PNG) та PDF.`
			});
		}
		
		render() {
			if (!this.renderContainer) return;
			
			// Очищаємо контейнер перед рендерингом
			this.renderContainer.innerHTML = '';
			
			// Рендеримо кожен валідний документ
			this.validDocuments.forEach(item => {
				const documentItem = document.createElement('div');
				documentItem.className = 'badge rounded-pill document-item';
				if(this.inputId === 'plan') {
					documentItem.setAttribute('data-plan-id', item.id);
				} else {
					documentItem.setAttribute('data-document-id', item.id);
				}
				// Визначаємо тип контенту та джерело для Fancybox
				const isPDF = item.name.toLowerCase().endsWith('.pdf');
				const fancyboxType = isPDF ? 'iframe' : 'image';
				const fancyboxSrc = isPDF ?
					URL.createObjectURL(this.getFileByName(item.name)) :
					URL.createObjectURL(this.getFileByName(item.name));
				
				documentItem.innerHTML = `
                <span>${item.name}</span>
                <button type="button" class="fancybox-button" data-fancybox data-type="${fancyboxType}" data-src="${fancyboxSrc}" aria-label="eye" data-id="${item.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14.5 8C14.5 8 11.6 12 8 12C4.4 12 1.5 8 1.5 8C1.5 8 4.4 4 8 4C11.6 4 14.5 8 14.5 8Z"
                      stroke="#111111" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round"/>
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                      stroke="#111111" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button type="button" aria-label="Close" class="remove-document" data-id="${item.id}">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.932895 9.93359C0.708205 9.93359 0.483405 9.84787 0.311951 9.67641C-0.0310669 9.3334 -0.0310669 8.77754 0.311951 8.43452L8.43461 0.311868C8.77763 -0.0310395 9.33348 -0.0310395 9.67649 0.311868C10.0194 0.654776 10.0194 1.21074 9.67649 1.55365L1.55384 9.6763C1.38239 9.84787 1.15759 9.93359 0.932895 9.93359Z"
                      fill="#111111"/>
                    <path d="M9.05555 9.93348C8.83075 9.93348 8.60606 9.84776 8.43461 9.6763L0.311951 1.55365C-0.0310669 1.21074 -0.0310669 0.654776 0.311951 0.311868C0.654859 -0.0310395 1.21082 -0.0310395 1.55373 0.311868L9.67638 8.43452C10.0193 8.77754 10.0193 9.3334 9.67638 9.67641C9.50504 9.84776 9.28035 9.93348 9.05555 9.93348Z"
                      fill="#111111"/>
                  </svg>
                </button>
            `;
				
				this.renderContainer.appendChild(documentItem);
			});
			
			// Додаємо обробники подій для кнопок видалення
			this.addRemoveHandlers();
			
			// Ініціалізуємо Fancybox для нових елементів
			this.initFancybox();
		}
		
		addRemoveHandlers() {
			const removeButtons = this.renderContainer.querySelectorAll('.remove-document');
			removeButtons.forEach(button => {
				button.addEventListener('click', (e) => {
					e.preventDefault();
					const id = parseInt(button.getAttribute('data-id'));
					this.removeDocument(id);
				});
			});
		}
		
		removeDocument(id) {
			// Видаляємо документ з масиву
			this.validDocuments = this.validDocuments.filter(doc => doc.id !== id);
			
			// Оновлюємо ID для залишених документів
			this.validDocuments.forEach((doc, index) => {
				doc.id = index;
			});
			
			// Перерендеримо список
			this.render();
		}
		getFileByName(filename) {
			// Шукаємо файл у input.files за ім'ям
			const files = Array.from(this.input.files);
			return files.find(file => file.name === filename);
		}
		initFancybox() {
			// Ініціалізація Fancybox для всіх кнопок перегляду
			Fancybox.bind("[data-fancybox]", {
				Thumbs: false,
				Toolbar: true,
				Images: {
					zoom: true,
				},
			});
		}
	}
	class PhotoLoader {
		constructor(options) {
			// Обов'язкові параметри
			this.inputId = options.inputId;
			this.wrapperClass = options.wrapperClass || 'photo-info-list';
			this.checkImageSize = options.checkImageSize !== false;
			
			// Мінімальні розміри
			this.minWidth = options.minWidth || 800;
			this.minHeight = options.minHeight || 800;
			
			// DOM елементи
			this.input = document.querySelector(`#${this.inputId}`);
			this.wrapper = document.querySelector(`.${this.wrapperClass}`);
			this.errorContainer = this.wrapper ? this.wrapper.querySelector('.error-container') : null;
			this.renderContainer = document.querySelector('.photo-info-list');
			
			// Масиви для файлів
			this.validPhotos = [];
			this.invalidPhotos = [];
			this.photoArray = [];
			
			// Ініціалізація
			if (this.input && this.wrapper) {
				this.init();
			} else {
				console.error('Не вдалося знайти необхідні DOM-елементи');
			}
		}
		
		init() {
			this.input.addEventListener('change', (e) => this.handleFileUpload(e));
		}
		
		handleFileUpload(event) {
			const files = Array.from(event.target.files);
			// Очищаємо масиви
			this.validPhotos = [];
			this.invalidPhotos = [];
			this.photoArray = [];
			
			// Обробляємо файли
			files.forEach((file, index) => {
				if (file.type.match('image.*')) {
					this.handleImage(file, index, files.length);
				} else {
					this.handleInvalidFile(file);
				}
			});
		}
		
		handleImage(file, index, totalFiles) {
			const img = new Image();
			const url = URL.createObjectURL(file);
			
			img.onload = () => {
				URL.revokeObjectURL(url);
				
				const width = img.width;
				const height = img.height;
				
				if (!this.checkImageSize || (width >= this.minWidth && height >= this.minHeight)) {
					const photoItem = {
						id: this.validPhotos.length,
						name: file.name,
						size: file.size,
						width: width,
						height: height,
						file: file,
						isMain: this.validPhotos.length === 0 // Перше фото - головне
					};
					
					this.validPhotos.push(photoItem);
					this.photoArray.push(photoItem);
				} else {
					this.invalidPhotos.push({
						text: `Зображення "${file.name}" (${width}x${height}) замаленьке. Мінімальний розмір: ${this.minWidth}x${this.minHeight} пікселів.`,
						file: file
					});
				}
				
				if (index === totalFiles - 1) {
					this.displayErrors();
					this.render();
				}
			};
			
			img.onerror = () => {
				URL.revokeObjectURL(url);
				this.invalidPhotos.push({
					text: `Помилка завантаження зображення: ${file.name}`,
					file: file
				});
				this.displayErrors();
			};
			
			img.src = url;
		}
		
		handleInvalidFile(file) {
			this.invalidPhotos.push({
				text: `Файл "${file.name}" не є зображенням. Допустимі лише зображення (JPG/PNG).`,
				file: file
			});
		}
		
		clearErrors() {
			if (!this.wrapper || !this.errorContainer) return;
			
			this.wrapper.classList.remove('error');
			const errorElements = this.errorContainer.querySelectorAll('.error');
			errorElements.forEach(element => element.remove());
		}
		
		displayErrors() {
			if (!this.wrapper || !this.errorContainer) return;
			
			this.clearErrors();
			
			if (this.invalidPhotos.length > 0) {
				this.wrapper.classList.add('error');
				
				this.invalidPhotos.forEach(item => {
					const errorItem = document.createElement('div');
					errorItem.textContent = item.text;
					errorItem.classList.add('error');
					this.errorContainer.appendChild(errorItem);
				});
			}
		}
		
		render() {
			if (!this.renderContainer) return;
			
			// Знищуємо всі тултіпи перед оновленням DOM
			this.destroyTooltips();
			
			this.renderContainer.innerHTML = '';
			
			this.photoArray.forEach((item, index) => {
				const photoItem = document.createElement('li');
				photoItem.classList.add('photo-info-item');
				photoItem.setAttribute('data-photo-id', item.id);
				
				const photoUrl = URL.createObjectURL(item.file);
				
				photoItem.innerHTML = `
                <label>
                    <input type="radio" name="main-photo" ${item.isMain ? 'checked' : ''}
                           data-id="${item.id}">
                       <div>
                 	     <img src="${photoUrl}" alt="${item.name}"
                         data-bs-toggle="tooltip" data-bs-placement="top"
                         data-bs-title="${item.isMain ? 'Головне фото' : 'Натисніть, щоб зробити головним'}">
                       </div>
                </label>
                <div class="photo-info-item-actions">
                    <button type="button" class="btn-see" aria-label="eye"
                            data-fancybox data-src="${photoUrl}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5 8C14.5 8 11.6 12 8 12C4.4 12 1.5 8 1.5 8C1.5 8 4.4 4 8 4C11.6 4 14.5 8 14.5 8Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
                            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button type="button" class="btn-move" data-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_388_3868)">
                                <path d="M3.33301 6L1.33301 8L3.33301 10" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6 3.33301L8 1.33301L10 3.33301" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10 12.667L8 14.667L6 12.667" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.667 6L14.667 8L12.667 10" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M1.33301 8H14.6663" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M8 1.33301V14.6663" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_388_3868">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <button type="button" class="btn-delete" data-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.30007 12.4999C4.09537 12.4999 3.89057 12.4218 3.73437 12.2656C3.42188 11.9531 3.42188 11.4467 3.73437 11.1342L11.1343 3.7343C11.4468 3.4219 11.9532 3.4219 12.2657 3.7343C12.5781 4.0467 12.5781 4.55319 12.2657 4.86559L4.86576 12.2655C4.70956 12.4218 4.50477 12.4999 4.30007 12.4999Z" fill="#3585F5" />
                            <path d="M11.7 12.4998C11.4952 12.4998 11.2905 12.4217 11.1343 12.2655L3.73437 4.86559C3.42188 4.55319 3.42188 4.0467 3.73437 3.7343C4.04677 3.4219 4.55327 3.4219 4.86566 3.7343L12.2656 11.1342C12.578 11.4467 12.578 11.9531 12.2656 12.2656C12.1095 12.4217 11.9048 12.4998 11.7 12.4998Z" fill="#3585F5" />
                        </svg>
                    </button>
                </div>
            `;
				
				this.renderContainer.prepend(photoItem);
			});
			
			// Ініціалізуємо обробники подій
			this.initEventHandlers();
			this.initFancybox();
			this.initTooltips();
		}
		
		initEventHandlers() {
			// Обробник для вибору головного фото
			this.renderContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
				radio.addEventListener('change', (e) => {
					const photoId = parseInt(e.target.dataset.id);
					this.setMainPhoto(photoId);
				});
			});
			
			// Обробник для видалення фото
			this.renderContainer.querySelectorAll('.btn-delete').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const photoId = parseInt(e.currentTarget.dataset.id);
					this.deletePhoto(photoId);
				});
			});
			
			// Обробник для переміщення фото (можна реалізувати drag & drop)
			this.renderContainer.querySelectorAll('.btn-move').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const photoId = parseInt(e.currentTarget.dataset.id);
					this.movePhoto(photoId);
				});
			});
		}
		
		setMainPhoto(photoId) {
			this.photoArray.forEach(photo => {
				photo.isMain = (photo.id === photoId);
			});
			this.render();
		}
		
		deletePhoto(photoId) {
			// Знаходимо фото перед видаленням
			const photoToDelete = this.photoArray.find(photo => photo.id === photoId);
			
			// Звільняємо URL
			if (photoToDelete && photoToDelete.file) {
				const photoUrl = URL.createObjectURL(photoToDelete.file);
				URL.revokeObjectURL(photoUrl);
			}
			
			// Продовжуємо видалення
			this.photoArray = this.photoArray.filter(photo => photo.id !== photoId);
			this.validPhotos = this.validPhotos.filter(photo => photo.id !== photoId);
			
			// Оновлюємо ID для залишених фото
			this.photoArray.forEach((photo, index) => {
				photo.id = index;
				if (index === 0) photo.isMain = true;
			});
			
			this.validPhotos.forEach((photo, index) => {
				photo.id = index;
			});
			
			this.render();
		}
		
		movePhoto(photoId) {
			// Тут можна реалізувати логіку переміщення фото
			console.log(`Move photo with id: ${photoId}`);
			// Наприклад, можна використати drag & drop або кнопки вверх/вниз
		}
		
		initFancybox() {
			if (typeof Fancybox !== 'undefined') {
				// Спочатку знищуємо старі екземпляри Fancybox
				if (Fancybox.getInstance()) {
					Fancybox.getInstance().destroy();
				}
				
				// Ініціалізуємо новий Fancybox з безпечним обробником закриття
				Fancybox.bind("[data-fancybox]", {
					Thumbs: false,
					Toolbar: true,
					Images: {
						zoom: true,
					},
					on: {
						close: () => {
							// Безпечний спосіб обробки закриття
							const instance = Fancybox.getInstance();
							if (instance) {
								const slides = instance.getSlides();
								if (slides && slides.forEach) {
									slides.forEach(slide => {
										if (slide.content && slide.content.src && slide.content.src.startsWith('blob:')) {
											URL.revokeObjectURL(slide.content.src);
										}
									});
								}
							}
						},
						destroy: () => {
							// Додаткове очищення при повному знищенні
							if (Fancybox.getInstance()) {
								Fancybox.getInstance().destroy();
							}
						}
					}
				});
			}
		}
		
		initTooltips() {
			if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
				// Спочатку знищуємо старі тултіпи
				this.destroyTooltips();
				
				// Ініціалізуємо нові тултіпи
				this.tooltips = [];
				this.renderContainer.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
					this.tooltips.push(new bootstrap.Tooltip(el, {
						trigger: 'hover'
					}));
				});
			}
		}
		
		destroyTooltips() {
			if (this.tooltips) {
				this.tooltips.forEach(tooltip => {
					tooltip.dispose();
				});
				this.tooltips = [];
			}
		}
	}
	
	// Ініціалізація FileUploader після завантаження Fancybox
	function initFileUploaders() {
		// Для документів (без перевірки розміру)
		new FileUploader({
			inputId: 'document',
			wrapperClass: 'loading-documents',
			checkImageSize: false
		});
		
		// Для плану (з перевіркою розміру)
		new FileUploader({
			inputId: 'plan',
			wrapperClass: 'loading-plan',
			minWidth: 800,
			minHeight: 800
		});
	}
	new PhotoLoader({
		inputId: 'loading-photo',
		minWidth: 800,
		minHeight: 800,
		wrapperClass: 'photo-info-list'
	});
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
})();