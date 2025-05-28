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
			alert(`Максимальное количество телефонов - ${MAX_PHONES}`);
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
	function initTelInput (inputElement) {
		const $input = $(inputElement);
		
		// Ініціалізація intl-tel-input
		const iti = window.intlTelInput(inputElement, {
			initialCountry: "ua",
			utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js",
			separateDialCode: true,
			nationalMode: true,
			autoPlaceholder: "aggressive",
			customPlaceholder: function (placeholder, countryData) {
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
		function applyPhoneMask (countryCode) {
			const mask = countryMasks[countryCode] || countryMasks['default'];
			$input.unmask().mask(mask, {
				clearIfNotMatch: true
			});
		}
		
		// Обробник зміни країни
		$input.on('countrychange', function () {
			applyPhoneMask(iti.getSelectedCountryData().iso2);
		});
		
		// Обмеження введення лише цифр
		$input.on('keypress', function (e) {
			if ( !/[0-9]/.test(String.fromCharCode(e.which))) {
				e.preventDefault();
			}
		});
		
		// Автоматичне форматування при втраті фокусу
		$input.on('blur', function () {
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
		setTimeout(function () {
			$input.trigger('countrychange');
		}, 100);
	}

// Ініціалізуємо перше поле при завантаженні сторінки
	document.addEventListener('DOMContentLoaded', function () {
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

	class FileUploader {
		constructor (options) {
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
				console.error('Не удалось найти необходимые DOM-элементы');
			}
		}
		
		init () {
			this.input.addEventListener('change', (e) => this.handleFileUpload(e));
		}
		
		clearErrors () {
			if ( !this.wrapper || !this.errorContainer) return;
			
			this.wrapper.classList.remove('error');
			this.wrapper.style.marginBottom = '';
			const errorElements = this.errorContainer.querySelectorAll('ul.error-list, li.error');
			errorElements.forEach(element => element.remove());
		}
		
		displayErrors () {
			if ( !this.wrapper || !this.errorContainer) return;
			
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
		
		handleFileUpload (event) {
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
		
		handlePDF (file) {
			this.validDocuments.push({
				id: this.validDocuments.length,
				name: file.name,
				size: file.size,
				width: null,
				height: null,
			});
		}
		
		handleImage (file, index, totalFiles) {
			const img = new Image();
			const url = URL.createObjectURL(file);
			
			img.onload = () => {
				URL.revokeObjectURL(url);
				
				const width = img.width;
				const height = img.height;
				
				if ( !this.checkImageSize) {
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
						text: `Изображение "${file.name}" (${width}x${height}) маловатое. Минимальный размер: ${this.minWidth}x${this.minHeight} пікселів.`
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
					text: `Ошибка загрузки изображения: ${file.name}`
				});
				this.displayErrors();
			};
			
			img.src = url;
		}
		
		handleInvalidFile (file) {
			this.invalidDocuments.push({
				text: `Файл "${file.name}" не является изображением или PDF. Допустимы только изображения (JPG/PNG) и PDF.`
			});
		}
		
		render () {
			if ( !this.renderContainer) return;
			
			// Очищаємо контейнер перед рендерингом
			this.renderContainer.innerHTML = '';
			
			// Рендеримо кожен валідний документ
			this.validDocuments.forEach(item => {
				const documentItem = document.createElement('div');
				documentItem.className = 'badge rounded-pill document-item';
				if (this.inputId === 'plan') {
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
		
		addRemoveHandlers () {
			const removeButtons = this.renderContainer.querySelectorAll('.remove-document');
			removeButtons.forEach(button => {
				button.addEventListener('click', (e) => {
					e.preventDefault();
					const id = parseInt(button.getAttribute('data-id'));
					this.removeDocument(id);
				});
			});
		}
		
		removeDocument (id) {
			// Видаляємо документ з масиву
			this.validDocuments = this.validDocuments.filter(doc => doc.id !== id);
			
			// Оновлюємо ID для залишених документів
			this.validDocuments.forEach((doc, index) => {
				doc.id = index;
			});
			
			// Перерендеримо список
			this.render();
		}
		
		getFileByName (filename) {
			// Шукаємо файл у input.files за ім'ям
			const files = Array.from(this.input.files);
			return files.find(file => file.name === filename);
		}
		
		initFancybox () {
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
		constructor (options) {
			// Перевірка обов'язкових параметрів
			if ( !options.inputId) {
				throw new Error('Необходимо указать inputId');
			}

			// Обов'язкові параметри
			this.inputId = options.inputId;
			this.wrapperClass = options.wrapperClass || 'photo-info-list';
			this.checkImageSize = options.checkImageSize !== false;

			// Мінімальні розміри зображень
			this.minWidth = options.minWidth || 800;
			this.minHeight = options.minHeight || 800;

			// Максимальна кількість фото
			this.maxPhotos = options.maxPhotos || Infinity;

			// DOM елементи
			this.input = document.querySelector(`#${this.inputId}`);
			this.wrapper = document.querySelector(`.${this.wrapperClass}`);
			this.errorContainer = document.querySelector('.photo-info-list-wrapper > .error-container');
			this.renderContainer = document.querySelector('.photo-info-list');

			// Масиви для зберігання фото
			this.validPhotos = [];
			this.invalidPhotos = [];
			this.photoArray = [];

			// Інші властивості
			this.tooltips = new Map();
			this.isProcessing = false;
			this.globalLoader = null;
			this.imageEditor = null;

			// Ініціалізація
			if (this.input && this.wrapper) {
				this.createGlobalLoader();
				this.init();
			} else {
				console.error('Не удалось найти необходимые DOM-элементы');
			}
		}

		createGlobalLoader () {
			this.globalLoader = document.createElement('div');
			this.globalLoader.className = 'photo-loader-global';
			this.globalLoader.innerHTML = `
            <div class="photo-loader-content">
                <div class="photo-loader-spinner"></div>
                <div class="photo-loader-text">Загрузка фото...</div>
                <div class="photo-loader-progress">0%</div>
            </div>
        `;
			document.body.appendChild(this.globalLoader);
			this.globalLoader.style.display = 'none';
		}

		showLoader () {
			if (this.globalLoader) {
				this.globalLoader.style.display = 'flex';
			}
		}

		initSortable () {
			if ( !this.renderContainer || typeof Sortable === 'undefined') return;

			new Sortable(this.renderContainer, {
				animation: 150, // тривалість анімації
				ghostClass: 'sortable-ghost', // клас для "привида" елемента, який переміщається
				chosenClass: 'sortable-chosen', // клас для виділеного елемента
				dragClass: 'sortable-drag', // клас під час перетягування
				handle: '.btn-move', // елемент, за який можна тягнути
				onEnd: (evt) => this.handleSortEnd(evt) // обробник завершення перетягування
			});
		}

		handleSortEnd (evt) {
			// Оновлюємо масив photoArray відповідно до нового порядку
			const movedItem = this.photoArray[evt.oldIndex];
			this.photoArray.splice(evt.oldIndex, 1);
			this.photoArray.splice(evt.newIndex, 0, movedItem);

			// Оновлюємо відображення (необов'язково, якщо Sortable вже оновив DOM)
			this.render();
		}

		hideLoader () {
			if (this.globalLoader) {
				this.globalLoader.style.display = 'none';
			}
		}

		updateProgress (loaded, total) {
			if ( !this.globalLoader) return;
			const progress = Math.round((loaded / total) * 100);
			const progressElement = this.globalLoader.querySelector('.photo-loader-progress');
			if (progressElement) {
				progressElement.textContent = `${progress}%`;
			}
		}

		init () {
			this.input.addEventListener('change', async (e) => {
				if (this.isProcessing) return;
				this.isProcessing = true;
				this.wrapper.classList.add('loading');
				this.showLoader();

				try {
					let loadedFiles = 0;
					const totalFiles = e.target.files.length;

					const progressCallback = () => {
						loadedFiles++;
						this.updateProgress(loadedFiles, totalFiles);
					};

					await this.handleFileUpload(e, progressCallback);
				} catch (error) {
					console.error('Ошибка загрузки файлов:', error);
				} finally {
					this.isProcessing = false;
					this.wrapper.classList.remove('loading');
					this.hideLoader();
					this.updateProgress(0, 1); // Скидаємо прогрес
				}
			});
		}

		async handleFileUpload (event, progressCallback) {
			const files = Array.from(event.target.files);

			if (this.photoArray.length + files.length > this.maxPhotos) {
				this.invalidPhotos.push({
					text: `Максимальное количество фото - ${this.maxPhotos}. Добавлено не будет.`
				});
				this.displayErrors();
				return;
			}

			const processingPromises = files.map((file) => {
				return new Promise((resolve) => {
					if (file.type.match('image.*') ||
						file.name.toLowerCase().endsWith('.heic') ||
						file.name.toLowerCase().endsWith('.heif')) {
						this.handleImage(file)
							.then(() => {
								progressCallback();
								resolve();
							})
							.catch((error) => {
								console.error('Ошибка обработки изображения:', error);
								progressCallback();
								resolve();
							});
					} else {
						this.handleInvalidFile(file);
						progressCallback();
						resolve();
					}
				});
			});

			await Promise.all(processingPromises);
			this.displayResults();
		}

		handleImage (file) {
			return new Promise((resolve, reject) => {
				const isHeic = file.type === 'image/heic' ||
					file.type === 'image/heif' ||
					file.name.toLowerCase().endsWith('.heic') ||
					file.name.toLowerCase().endsWith('.heif');

				if (isHeic && typeof heic2any !== 'undefined') {
					this.convertHeicToJpg(file)
						.then(convertedFile => this.processImageFile(convertedFile, resolve, reject))
						.catch(reject);
				} else {
					this.processImageFile(file, resolve, reject);
				}
			});
		}

		convertHeicToJpg (file) {
			return new Promise((resolve, reject) => {
				heic2any({
					blob: file,
					toType: 'image/jpeg',
					quality: 0.8
				}).then(conversionResult => {
					const newFile = new File(
						[conversionResult],
						file.name.replace(/\.(heic|heif)$/i, '.jpg'),
						{type: 'image/jpeg', lastModified: Date.now()}
					);
					resolve(newFile);
				}).catch(reject);
			});
		}

		processImageFile (file, resolve, reject) {
			const img = new Image();
			const url = URL.createObjectURL(file);

			img.onerror = () => {
				URL.revokeObjectURL(url);
				this.invalidPhotos.push({
					text: `Ошибка загрузки изображения: ${file.name}`,
					file: file
				});
				reject(new Error(`Ошибка загрузки изображения: ${file.name}`));
			};

			img.onload = () => {
				URL.revokeObjectURL(url);

				try {
					const width = img.naturalWidth;
					const height = img.naturalHeight;

					if ( !this.checkImageSize || (width >= this.minWidth && height >= this.minHeight)) {
						const photoItem = {
							id: this.generateUniqueId(),
							name: file.name,
							size: file.size,
							width: width,
							height: height,
							file: file,
							isCheked: true,
							objectUrl: null,
							originalFileType: file.type
						};

						// Якщо перевірка розмірів вимкнена, обробляємо зображення
						if ( !this.checkImageSize && (width < this.minWidth || height < this.minHeight)) {
							this.resizeImageToMinimum(file, photoItem)
								.then(resizedPhoto => {
									this.validPhotos.push(resizedPhoto);
									this.photoArray.push(resizedPhoto);
									resolve();
								})
								.catch(error => {
									console.error('Ошибка при изменении размера изображения:', error);
									this.invalidPhotos.push({
										text: `Ошибка обработки изображения: ${file.name}`,
										file: file
									});
									reject(error);
								});
						} else {
							this.validPhotos.push(photoItem);
							this.photoArray.push(photoItem);
							resolve();
						}
					} else {
						this.invalidPhotos.push({
							text: `Изображение "${file.name}" (${width}x${height}) маловатое. Минимальный размер: ${this.minWidth}x${this.minHeight} пикселей.`,
							file: file
						});
						resolve();
					}
				} catch (error) {
					console.error('Ошибка обработки изображения:', error);
					this.invalidPhotos.push({
						text: `Ошибка обработки изображения: ${file.name}`,
						file: file
					});
					reject(error);
				}
			};

			img.src = url;
		}

		generateUniqueId () {
			return Date.now().toString(36) + Math.random().toString(36).substr(2);
		}

		handleInvalidFile (file) {
			this.invalidPhotos.push({
				text: `Файл "${file.name}" не является изображением. Допустимы только изображения (JPG/PNG/HEIC/HEIF).`,
				file: file
			});
		}

		clearResults () {
			this.clearOldObjectUrls();
			this.validPhotos = [];
			this.invalidPhotos = [];

			if (this.photoArray.length > 0) {
				const checkedIds = this.photoArray
					.filter(photo => photo.isCheked)
					.map(photo => photo.id);

				this.photoArray = [];
			}

			this.clearErrors();
		}

		displayResults () {
			this.displayErrors();
			this.render();
		}

		clearOldObjectUrls () {
			this.photoArray.forEach(item => {
				if (item.objectUrl) {
					URL.revokeObjectURL(item.objectUrl);
					item.objectUrl = null;
				}
			});
		}

		clearErrors () {
			if ( !this.wrapper || !this.errorContainer) return;

			this.wrapper.classList.remove('error');
			const errorElements = this.errorContainer.querySelectorAll('.error');
			errorElements.forEach(element => element.remove());
		}

		displayErrors () {
			if ( !this.wrapper || !this.errorContainer) return;

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

		render () {
			if ( !this.renderContainer) return;

			this.destroyAllTooltips();

			const uploadButton = this.renderContainer.querySelector('.photo-info-btn-wrapper');
			const fragment = document.createDocumentFragment();

			this.photoArray.forEach(item => {
				item.objectUrl = URL.createObjectURL(item.file);
				const photoItem = this.createPhotoElement(item);
				fragment.appendChild(photoItem);
			});

			const newContainer = document.createElement('ul');
			newContainer.className = this.renderContainer.className;
			newContainer.appendChild(fragment);

			if (uploadButton) {
				newContainer.appendChild(uploadButton);
			}

			const containerParent = this.renderContainer.parentNode;
			containerParent.replaceChild(newContainer, this.renderContainer);
			this.renderContainer = newContainer;

			this.initTooltips();
			this.initFancybox();
			this.initEventHandlers();
			this.initSortable();
		}

		createSpinnerElement () {
			const spinnerDiv = document.createElement('div');
			spinnerDiv.className = 'spinner-border text-primary';
			spinnerDiv.style.width = '50px';
			spinnerDiv.style.height = '50px';
			spinnerDiv.setAttribute('role', 'status');

			const spinnerSpan = document.createElement('span');
			spinnerSpan.className = 'visually-hidden';
			spinnerSpan.textContent = 'Загрузка...';

			spinnerDiv.appendChild(spinnerSpan);
			return spinnerDiv;
		}

		createPhotoElement (item) {
			const photoItem = document.createElement('li');
			photoItem.classList.add('photo-info-item');
			photoItem.setAttribute('data-photo-id', item.id);

			const spinner = this.createSpinnerElement();

			photoItem.innerHTML = `
            <label>
                <input type="checkbox" ${item.isCheked ? 'checked' : ''}
                       data-cheked-photo-id="${item.id}">
                <div class="image-container">
                </div>
            </label>
            <div class="photo-info-item-actions">
                <button type="button" class="btn-see" aria-label="eye"
                        data-fancybox data-src="${item.objectUrl}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 8C14.5 8 11.6 12 8 12C4.4 12 1.5 8 1.5 8C1.5 8 4.4 4 8 4C11.6 4 14.5 8 14.5 8Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
                        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
                    </svg>
                </button>
                <button type="button" class="btn-move" data-move-id="${item.id}">
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
                <button type="button" class="btn-delete" data-delete-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.30007 12.4999C4.09537 12.4999 3.89057 12.4218 3.73437 12.2656C3.42188 11.9531 3.42188 11.4467 3.73437 11.1342L11.1343 3.7343C11.4468 3.4219 11.9532 3.4219 12.2657 3.7343C12.5781 4.0467 12.5781 4.55319 12.2657 4.86559L4.86576 12.2655C4.70956 12.4218 4.50477 12.4999 4.30007 12.4999Z" fill="#3585F5" />
                        <path d="M11.7 12.4998C11.4952 12.4998 11.2905 12.4217 11.1343 12.2655L3.73437 4.86559C3.42188 4.55319 3.42188 4.0467 3.73437 3.7343C4.04677 3.4219 4.55327 3.4219 4.86566 3.7343L12.2656 11.1342C12.578 11.4467 12.578 11.9531 12.2656 12.2656C12.1095 12.4217 11.9048 12.4998 11.7 12.4998Z" fill="#3585F5" />
                    </svg>
                </button>
                <button type="button" class="btn-edit" data-edit-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3333 2.00004C11.5084 1.82493 11.7163 1.68602 11.9451 1.59131C12.1739 1.49659 12.4191 1.44794 12.6667 1.44794C12.9142 1.44794 13.1594 1.49659 13.3882 1.59131C13.617 1.68602 13.8249 1.82493 14 2.00004C14.1751 2.17515 14.314 2.38306 14.4087 2.61185C14.5034 2.84064 14.5521 3.08582 14.5521 3.33337C14.5521 3.58092 14.5034 3.8261 14.4087 4.05489C14.314 4.28368 14.1751 4.49159 14 4.66671L4.66667 14L1.33333 14.6667L2 11.3334L11.3333 2.00004Z" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

			const imageContainer = photoItem.querySelector('.image-container');
			imageContainer.appendChild(spinner);

			const img = new Image();
			img.src = item.objectUrl;
			img.alt = item.name;
			img.dataset.bsToggle = 'tooltip';
			img.dataset.bsPlacement = 'top';
			img.dataset.bsTitle = item.isCheked ? 'Не показывать в объявлении' :
				'Показывать в объявлении';

			img.onload = () => {
				spinner.style.display = 'none';
				imageContainer.appendChild(img);

				if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
					const tooltip = new bootstrap.Tooltip(img, {
						trigger: 'hover',
						placement: 'top'
					});
					this.tooltips.set(img, tooltip);
				}
			};

			img.onerror = () => {
				spinner.style.display = 'none';
				const errorMsg = document.createElement('div');
				errorMsg.className = 'text-danger';
				errorMsg.textContent = 'Ошибка загрузки изображения';
				imageContainer.appendChild(errorMsg);
			};

			return photoItem;
		}

		initEventHandlers () {
			if ( !this.renderContainer) return;

			this.renderContainer.addEventListener('change', (e) => {
				if (e.target.matches('input[type="checkbox"][data-cheked-photo-id]')) {
					const photoId = e.target.dataset.chekedPhotoId;
					this.togglePhotoSelection(photoId);
				}
			});

			this.renderContainer.addEventListener('click', (e) => {
				if (e.target.closest('.btn-delete')) {
					const btn = e.target.closest('.btn-delete');
					const photoId = btn.dataset.deleteId;
					this.deletePhoto(photoId);
					e.preventDefault();
				}

				if (e.target.closest('.btn-move')) {
					const btn = e.target.closest('.btn-move');
					const photoId = btn.dataset.moveId;
					this.movePhoto(photoId);
					e.preventDefault();
				}

				if (e.target.closest('.btn-edit')) {
					const btn = e.target.closest('.btn-edit');
					const photoId = btn.dataset.editId;
					this.editPhoto(photoId);
					e.preventDefault();
				}
			});
		}

		editPhoto (photoId) {
			const photo = this.photoArray.find(p => p.id === photoId);
			if ( !photo) return;

			// Create a temporary canvas to get the image data
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);

				// Initialize TUI Image Editor
				this.initImageEditor(canvas.toDataURL('image/jpeg'), photo);
			};
			img.src = photo.objectUrl;
		}
		
		initImageEditor(imageSrc, photoItem) {
			// Перевіряємо, чи це мобільний пристрій
			const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
			
			// Створюємо контейнер для редактора
			if (!document.body.classList.contains('lock')) {
				document.body.classList.add('lock');
			}
			const editorContainer = document.createElement('div');
			editorContainer.id = 'tui-image-editor-container';
			editorContainer.style.position = 'fixed';
			editorContainer.style.top = '0';
			editorContainer.style.left = '0';
			editorContainer.style.width = '100%';
			editorContainer.style.height = '100%';
			editorContainer.style.zIndex = '9999';
			editorContainer.style.backgroundColor = '#fff';
			
			// Додаємо індикатор завантаження
			const loadingDiv = document.createElement('div');
			loadingDiv.style.position = 'absolute';
			loadingDiv.style.top = '50%';
			loadingDiv.style.left = '50%';
			loadingDiv.style.transform = 'translate(-50%, -50%)';
			loadingDiv.textContent = 'Загрузка редактора...';
			editorContainer.appendChild(loadingDiv);
			
			document.body.appendChild(editorContainer);
			
			// Чекаємо, щоб DOM точно був готовий
			setTimeout(() => {
				try {
					// Видаляємо індикатор завантаження
					editorContainer.removeChild(loadingDiv);
					
					// Налаштування для редактора
					const editorOptions = {
						includeUI: {
							loadImage: {
								path: imageSrc,
								name: photoItem.name
							},
							theme: {
								'common.bi.image': '',
								'common.bisize.width': '0px',
								'common.bisize.height': '0px',
								'common.backgroundImage': 'none',
								'common.backgroundColor': '#fff',
								'common.border': '1px solid #ddd'
							},
							// Меню для мобільних та десктопних пристроїв
							menu: isMobile ? ['crop', 'resize', 'rotate'] : ['crop', 'resize', 'rotate', 'filter'],
							initMenu: isMobile ? 'crop' : '',
							uiSize: {
								width: '100%',
								height: '100%'
							},
							menuBarPosition: 'bottom',
						},
						cssMaxWidth: window.innerWidth,
						cssMaxHeight: window.innerHeight,
						selectionStyle: {
							cornerSize: 20,
							rotatingPointOffset: 70
						}
					};
					
					// Ініціалізуємо TUI Image Editor
					this.imageEditor = new tui.ImageEditor(editorContainer, editorOptions);
					// авто увімкнення чекбокса
					setTimeout(() => {
						const $elem = $('.tie-lock-aspect-ratio');
						
						$elem.trigger('click');
					}, 100);
					// Для мобільних пристроїв додатково приховуємо елементи
					if (isMobile) {
					
						setTimeout(() => {
							// Приховуємо непотрібні елементи UI
							const elementsToHide = [
								'.tui-image-editor-header-logo',
								'.tui-image-editor-range',
								'[tooltip-content="Filter"]',
							];
							// авто увімкнення чекбокса
							setTimeout(() => {
								const $elem = $('.tie-lock-aspect-ratio');
								
									$elem.trigger('click');
							}, 100);
							elementsToHide.forEach(selector => {
								const elements = document.querySelectorAll(selector);
								elements.forEach(el => el.style.display = 'none');
							});
							
							// Спрощуємо інтерфейс
							const mainMenu = document.querySelector('.tui-image-editor-main-container');
							if (mainMenu) {
								mainMenu.style.padding = '0';
								mainMenu.style.margin = '0';
							}
						}, 500);
					}
					
					// Додаємо кнопки збереження та скасування
					this.addEditorButtons(editorContainer, photoItem);
					
				} catch (error) {
					console.error('Ошибка инициализации редактора:', error);
					editorContainer.innerHTML = '<div style="color:red;padding:20px;">Ошибка загрузки редактора. Попытайтесь еще раз.</div>';
					document.body.appendChild(editorContainer);
				}
			}, 100);
		}

		addEditorButtons (editorContainer, photoItem) {
			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'btn-tui-wrapper';

			const saveButton = document.createElement('button');
			saveButton.textContent = 'Сохранить';
			saveButton.className = 'btn btn-primary  btn-tui-save';
			saveButton.onclick = () => this.saveEditedImage(photoItem);

			const cancelButton = document.createElement('button');
			cancelButton.textContent = 'Отменить';
			cancelButton.className = 'btn btn-danger btn-tui-reset';
			cancelButton.onclick = () => this.closeImageEditor();

			buttonContainer.appendChild(saveButton);
			buttonContainer.appendChild(cancelButton);
			editorContainer.appendChild(buttonContainer);
		}

		saveEditedImage (photoItem) {
			if ( !this.imageEditor) return;

			// Get edited image as blob
			const editedImageData = this.imageEditor.toDataURL();
			fetch(editedImageData)
				.then(res => res.blob())
				.then(blob => {
					// Create a new File object with the edited image
					const editedFile = new File([blob], photoItem.name, {
						type: 'image/jpeg',
						lastModified: Date.now()
					});

					// Update the photo item with the edited file
					photoItem.file = editedFile;
					photoItem.objectUrl = URL.createObjectURL(editedFile);

					// Update the display
					this.render();

					// Close the editor
					this.closeImageEditor();
				});
			// Після збереження також видаляємо клас lock
			if (document.body.classList.contains('lock')) {
				document.body.classList.remove('lock');
			}
		}

		closeImageEditor () {
			if (this.imageEditor) {
				this.imageEditor.destroy();
				this.imageEditor = null;
			}

			const editorContainer = document.getElementById('tui-image-editor-container');
			if (editorContainer) {
				editorContainer.remove();
			}

			const buttonContainer = document.querySelector('div[style*="z-index: 10000"]');
			if (buttonContainer) {
				buttonContainer.remove();
			}
			// Видаляємо клас lock з body, якщо він є
			if (document.body.classList.contains('lock')) {
				document.body.classList.remove('lock');
			}
		}

		togglePhotoSelection (photoId) {
			const photo = this.photoArray.find(p => p.id === photoId);
			if ( !photo) return;

			photo.isCheked = !photo.isCheked;

			const img = this.renderContainer.querySelector(`[data-photo-id="${photoId}"] img`);
			if (img) {
				img.setAttribute('data-bs-title',
					photo.isCheked ? 'Не показывать в объявлении' :
						'Показывать в объявлении');

				const tooltip = bootstrap.Tooltip.getInstance(img);
				if (tooltip) {
					tooltip.dispose();
					this.tooltips.delete(img);
				}

				const newTooltip = new bootstrap.Tooltip(img, {
					trigger: 'hover',
					title: img.getAttribute('data-bs-title')
				});
				this.tooltips.set(img, newTooltip);
			}
		}

		deletePhoto (photoId) {
			const photoElement = this.renderContainer.querySelector(`[data-photo-id="${photoId}"]`);
			if ( !photoElement) return;

			const photoIndex = this.photoArray.findIndex(photo => photo.id === photoId);
			if (photoIndex === -1) return;

			const img = photoElement.querySelector('img');
			if (img) {
				const tooltip = bootstrap.Tooltip.getInstance(img);
				if (tooltip) {
					tooltip.dispose();
					this.tooltips.delete(img);
				}
			}

			const photoToDelete = this.photoArray[photoIndex];
			if (photoToDelete.objectUrl) {
				try {
					URL.revokeObjectURL(photoToDelete.objectUrl);
				} catch (e) {
					console.warn('Ошибка при освобождении URL:', e);
				}
			}

			this.photoArray.splice(photoIndex, 1);
			this.validPhotos = this.validPhotos.filter(photo => photo.id !== photoId);
			photoElement.remove();
		}

		movePhoto (photoId) {
			console.log(`Переместить фото с идентификатором: ${photoId}`);
		}

		initFancybox () {
			if (typeof Fancybox === 'undefined') return;

			if (Fancybox.getInstance()) {
				Fancybox.getInstance().destroy();
			}

			Fancybox.bind("[data-fancybox]", {
				Thumbs: false,
				Toolbar: {
					display: {
						left: ["infobar"],
						middle: [],
						right: ["close"],
					},
				},
				Images: {
					zoom: true,
				},
				on: {
					close: () => {
						const instance = Fancybox.getInstance();
						if (instance) {
							const slides = instance.getSlides();
							slides && slides.forEach(slide => {
								if (slide.content.src.startsWith('blob:')) {
									URL.revokeObjectURL(slide.content.src);
								}
							});
						}
					}
				}
			});
		}

		initTooltips () {
			if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;

			const tooltipElements = this.renderContainer && this.renderContainer.querySelectorAll('[data-bs-toggle="tooltip"]') || [];

			tooltipElements.forEach(el => {
				try {
					if ( !this.tooltips.has(el)) {
						const tooltip = new bootstrap.Tooltip(el, {
							trigger: 'hover',
							placement: 'top'
						});
						this.tooltips.set(el, tooltip);
					}
				} catch (e) {
					console.warn('Ошибка при инициализации тултипа:', e);
				}
			});
		}

		destroyAllTooltips () {
			this.tooltips.forEach((tooltip, element) => {
				try {
					if (tooltip && typeof tooltip.dispose === 'function') {
						tooltip.dispose();
					}
				} catch (e) {
					console.warn('Ошибка при уничтожении тултипа:', e);
				}
			});
			this.tooltips.clear();
		}

		getSelectedPhotos () {
			return this.photoArray.filter(photo => photo.isCheked);
		}

		destroy () {
			this.clearOldObjectUrls();
			this.destroyAllTooltips();
			this.closeImageEditor();

			if (this.globalLoader) {
				this.globalLoader.remove();
				this.globalLoader = null;
			}

			if (typeof Fancybox !== 'undefined' && Fancybox.getInstance()) {
				Fancybox.getInstance().destroy();
			}

			if (this.input) {
				this.input.removeEventListener('change', this.handleFileUpload);
			}

			if (this.renderContainer) {
				this.renderContainer.removeEventListener('change', this.togglePhotoSelection);
				this.renderContainer.removeEventListener('click', this.handleContainerClick);
			}
		}

		/**
		 * Збільшує зображення до мінімального розміру, зберігаючи пропорції
		 * @param {File} file - Об'єкт файлу зображення
		 * @param {Object} photoItem - Об'єкт фото для оновлення
		 * @returns {Promise<Object>} Обіцянка, що повертає оновлений об'єкт фото
		 */
		resizeImageToMinimum (file, photoItem) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				const url = URL.createObjectURL(file);

				img.onload = () => {
					URL.revokeObjectURL(url);

					try {
						const originalWidth = img.naturalWidth;
						const originalHeight = img.naturalHeight;

						// Визначаємо, яка сторона менша
						const isWidthSmaller = originalWidth < originalHeight;

						// Розраховуємо нові розміри, зберігаючи пропорції
						let newWidth, newHeight;

						if (isWidthSmaller) {
							// Якщо ширина менша, масштабуємо по ширині
							const scaleFactor = this.minWidth / originalWidth;
							newWidth = this.minWidth;
							newHeight = Math.round(originalHeight * scaleFactor);
						} else {
							// Якщо висота менша, масштабуємо по висоті
							const scaleFactor = this.minHeight / originalHeight;
							newHeight = this.minHeight;
							newWidth = Math.round(originalWidth * scaleFactor);
						}

						// Створюємо canvas для зміни розміру
						const canvas = document.createElement('canvas');
						canvas.width = newWidth;
						canvas.height = newHeight;
						const ctx = canvas.getContext('2d');

						// Застосовуємо високоякісне масштабування
						ctx.imageSmoothingQuality = 'high';
						ctx.drawImage(img, 0, 0, newWidth, newHeight);

						// Конвертуємо canvas назад у файл
						canvas.toBlob(blob => {
							if ( !blob) {
								reject(new Error('Ошибка при создании blob из canvas'));
								return;
							}

							const resizedFile = new File([blob], file.name, {
								type: 'image/jpeg',
								lastModified: Date.now()
							});

							// Оновлюємо об'єкт фото новими даними
							const resizedPhoto = {
								...photoItem,
								file: resizedFile,
								width: newWidth,
								height: newHeight,
								size: blob.size,
								wasResized: true // Додатковий прапорець для інформації
							};

							resolve(resizedPhoto);
						}, 'image/jpeg', 0.92); // Якість 92%

					} catch (error) {
						reject(error);
					}
				};

				img.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error('Ошибка загрузки изображения для изменения размера'));
				};

				img.src = url;
			});
		}
	}
	// class PhotoLoader {
	// 	constructor(options) {
	// 		// Перевірка обов'язкових параметрів
	// 		if (!options.inputId) {
	// 			throw new Error('Необходимо указать inputId');
	// 		}
	// 		this.originalImageSrc = null;
	// 		// Обов'язкові параметри
	// 		this.inputId = options.inputId;
	// 		this.wrapperClass = options.wrapperClass || 'photo-info-list';
	// 		this.checkImageSize = options.checkImageSize !== false;
	//
	// 		// Мінімальні розміри зображень
	// 		this.minWidth = options.minWidth || 800;
	// 		this.minHeight = options.minHeight || 800;
	//
	// 		// Максимальна кількість фото
	// 		this.maxPhotos = options.maxPhotos || Infinity;
	//
	// 		// DOM елементи
	// 		this.input = document.querySelector(`#${this.inputId}`);
	// 		this.wrapper = document.querySelector(`.${this.wrapperClass}`);
	// 		this.errorContainer = document.querySelector('.photo-info-list-wrapper > .error-container');
	// 		this.renderContainer = document.querySelector('.photo-info-list');
	//
	// 		// Масиви для зберігання фото
	// 		this.validPhotos = [];
	// 		this.invalidPhotos = [];
	// 		this.photoArray = [];
	//
	// 		// Інші властивості
	// 		this.tooltips = new Map();
	// 		this.isProcessing = false;
	// 		this.globalLoader = null;
	// 		this.cropper = null;
	// 		this.currentEditedPhoto = null;
	// 		this.applyFiltersTimeout = null;
	// 		this.lastApplyTime = 0;
	//
	// 		// Ініціалізація
	// 		if (this.input && this.wrapper) {
	// 			this.createGlobalLoader();
	// 			this.init();
	// 		} else {
	// 			console.error('Не удалось найти необходимые DOM-элементы');
	// 		}
	// 	}
	//
	// 	createGlobalLoader () {
	// 		this.globalLoader = document.createElement('div');
	// 		this.globalLoader.className = 'photo-loader-global';
	// 		this.globalLoader.innerHTML = `
    //         <div class="photo-loader-content">
    //             <div class="photo-loader-spinner"></div>
    //             <div class="photo-loader-text">Загрузка фото...</div>
    //             <div class="photo-loader-progress">0%</div>
    //         </div>
    //     `;
	// 		document.body.appendChild(this.globalLoader);
	// 		this.globalLoader.style.display = 'none';
	// 	}
	//
	// 	showLoader () {
	// 		if (this.globalLoader) {
	// 			this.globalLoader.style.display = 'flex';
	// 		}
	// 	}
	//
	// 	initSortable () {
	// 		if ( !this.renderContainer || typeof Sortable === 'undefined') return;
	//
	// 		new Sortable(this.renderContainer, {
	// 			animation: 150, // тривалість анімації
	// 			ghostClass: 'sortable-ghost', // клас для "привида" елемента, який переміщається
	// 			chosenClass: 'sortable-chosen', // клас для виділеного елемента
	// 			dragClass: 'sortable-drag', // клас під час перетягування
	// 			handle: '.btn-move', // елемент, за який можна тягнути
	// 			onEnd: (evt) => this.handleSortEnd(evt) // обробник завершення перетягування
	// 		});
	// 	}
	//
	// 	handleSortEnd (evt) {
	// 		// Оновлюємо масив photoArray відповідно до нового порядку
	// 		const movedItem = this.photoArray[evt.oldIndex];
	// 		this.photoArray.splice(evt.oldIndex, 1);
	// 		this.photoArray.splice(evt.newIndex, 0, movedItem);
	//
	// 		// Оновлюємо відображення (необов'язково, якщо Sortable вже оновив DOM)
	// 		this.render();
	// 	}
	//
	// 	hideLoader () {
	// 		if (this.globalLoader) {
	// 			this.globalLoader.style.display = 'none';
	// 		}
	// 	}
	//
	// 	updateProgress (loaded, total) {
	// 		if ( !this.globalLoader) return;
	// 		const progress = Math.round((loaded / total) * 100);
	// 		const progressElement = this.globalLoader.querySelector('.photo-loader-progress');
	// 		if (progressElement) {
	// 			progressElement.textContent = `${progress}%`;
	// 		}
	// 	}
	//
	// 	init () {
	// 		this.input.addEventListener('change', async (e) => {
	// 			if (this.isProcessing) return;
	// 			this.isProcessing = true;
	// 			this.wrapper.classList.add('loading');
	// 			this.showLoader();
	//
	// 			try {
	// 				let loadedFiles = 0;
	// 				const totalFiles = e.target.files.length;
	//
	// 				const progressCallback = () => {
	// 					loadedFiles++;
	// 					this.updateProgress(loadedFiles, totalFiles);
	// 				};
	//
	// 				await this.handleFileUpload(e, progressCallback);
	// 			} catch (error) {
	// 				console.error('Ошибка загрузки файлов:', error);
	// 			} finally {
	// 				this.isProcessing = false;
	// 				this.wrapper.classList.remove('loading');
	// 				this.hideLoader();
	// 				this.updateProgress(0, 1); // Скидаємо прогрес
	// 			}
	// 		});
	// 	}
	//
	// 	async handleFileUpload (event, progressCallback) {
	// 		const files = Array.from(event.target.files);
	//
	// 		if (this.photoArray.length + files.length > this.maxPhotos) {
	// 			this.invalidPhotos.push({
	// 				text: `Максимальное количество фото - ${this.maxPhotos}. Добавлено не будет.`
	// 			});
	// 			this.displayErrors();
	// 			return;
	// 		}
	//
	// 		const processingPromises = files.map((file) => {
	// 			return new Promise((resolve) => {
	// 				if (file.type.match('image.*') ||
	// 					file.name.toLowerCase().endsWith('.heic') ||
	// 					file.name.toLowerCase().endsWith('.heif')) {
	// 					this.handleImage(file)
	// 						.then(() => {
	// 							progressCallback();
	// 							resolve();
	// 						})
	// 						.catch((error) => {
	// 							console.error('Ошибка обработки изображения:', error);
	// 							progressCallback();
	// 							resolve();
	// 						});
	// 				} else {
	// 					this.handleInvalidFile(file);
	// 					progressCallback();
	// 					resolve();
	// 				}
	// 			});
	// 		});
	//
	// 		await Promise.all(processingPromises);
	// 		this.displayResults();
	// 	}
	//
	// 	handleImage (file) {
	// 		return new Promise((resolve, reject) => {
	// 			const isHeic = file.type === 'image/heic' ||
	// 				file.type === 'image/heif' ||
	// 				file.name.toLowerCase().endsWith('.heic') ||
	// 				file.name.toLowerCase().endsWith('.heif');
	//
	// 			if (isHeic && typeof heic2any !== 'undefined') {
	// 				this.convertHeicToJpg(file)
	// 					.then(convertedFile => this.processImageFile(convertedFile, resolve, reject))
	// 					.catch(reject);
	// 			} else {
	// 				this.processImageFile(file, resolve, reject);
	// 			}
	// 		});
	// 	}
	//
	// 	convertHeicToJpg (file) {
	// 		return new Promise((resolve, reject) => {
	// 			heic2any({
	// 				blob: file,
	// 				toType: 'image/jpeg',
	// 				quality: 0.8
	// 			}).then(conversionResult => {
	// 				const newFile = new File(
	// 					[conversionResult],
	// 					file.name.replace(/\.(heic|heif)$/i, '.jpg'),
	// 					{type: 'image/jpeg', lastModified: Date.now()}
	// 				);
	// 				resolve(newFile);
	// 			}).catch(reject);
	// 		});
	// 	}
	//
	// 	processImageFile (file, resolve, reject) {
	// 		const img = new Image();
	// 		const url = URL.createObjectURL(file);
	//
	// 		img.onerror = () => {
	// 			URL.revokeObjectURL(url);
	// 			this.invalidPhotos.push({
	// 				text: `Ошибка загрузки изображения: ${file.name}`,
	// 				file: file
	// 			});
	// 			reject(new Error(`Ошибка загрузки изображения: ${file.name}`));
	// 		};
	//
	// 		img.onload = () => {
	// 			URL.revokeObjectURL(url);
	//
	// 			try {
	// 				const width = img.naturalWidth;
	// 				const height = img.naturalHeight;
	//
	// 				if ( !this.checkImageSize || (width >= this.minWidth && height >= this.minHeight)) {
	// 					const photoItem = {
	// 						id: this.generateUniqueId(),
	// 						name: file.name,
	// 						size: file.size,
	// 						width: width,
	// 						height: height,
	// 						file: file,
	// 						isCheked: true,
	// 						objectUrl: null,
	// 						originalFileType: file.type
	// 					};
	//
	// 					// Якщо перевірка розмірів вимкнена, обробляємо зображення
	// 					if ( !this.checkImageSize && (width < this.minWidth || height < this.minHeight)) {
	// 						this.resizeImageToMinimum(file, photoItem)
	// 							.then(resizedPhoto => {
	// 								this.validPhotos.push(resizedPhoto);
	// 								this.photoArray.push(resizedPhoto);
	// 								resolve();
	// 							})
	// 							.catch(error => {
	// 								console.error('Ошибка при изменении размера изображения:', error);
	// 								this.invalidPhotos.push({
	// 									text: `Ошибка обработки изображения: ${file.name}`,
	// 									file: file
	// 								});
	// 								reject(error);
	// 							});
	// 					} else {
	// 						this.validPhotos.push(photoItem);
	// 						this.photoArray.push(photoItem);
	// 						resolve();
	// 					}
	// 				} else {
	// 					this.invalidPhotos.push({
	// 						text: `Изображение "${file.name}" (${width}x${height}) маловатое. Минимальный размер: ${this.minWidth}x${this.minHeight} пикселей.`,
	// 						file: file
	// 					});
	// 					resolve();
	// 				}
	// 			} catch (error) {
	// 				console.error('Ошибка обработки изображения:', error);
	// 				this.invalidPhotos.push({
	// 					text: `Ошибка обработки изображения: ${file.name}`,
	// 					file: file
	// 				});
	// 				reject(error);
	// 			}
	// 		};
	//
	// 		img.src = url;
	// 	}
	//
	// 	generateUniqueId () {
	// 		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	// 	}
	//
	// 	handleInvalidFile (file) {
	// 		this.invalidPhotos.push({
	// 			text: `Файл "${file.name}" не является изображением. Допустимы только изображения (JPG/PNG/HEIC/HEIF).`,
	// 			file: file
	// 		});
	// 	}
	//
	// 	clearResults () {
	// 		this.clearOldObjectUrls();
	// 		this.validPhotos = [];
	// 		this.invalidPhotos = [];
	//
	// 		if (this.photoArray.length > 0) {
	// 			const checkedIds = this.photoArray
	// 				.filter(photo => photo.isCheked)
	// 				.map(photo => photo.id);
	//
	// 			this.photoArray = [];
	// 		}
	//
	// 		this.clearErrors();
	// 	}
	//
	// 	displayResults () {
	// 		this.displayErrors();
	// 		this.render();
	// 	}
	//
	// 	clearOldObjectUrls () {
	// 		this.photoArray.forEach(item => {
	// 			if (item.objectUrl) {
	// 				URL.revokeObjectURL(item.objectUrl);
	// 				item.objectUrl = null;
	// 			}
	// 		});
	// 	}
	//
	// 	clearErrors () {
	// 		if ( !this.wrapper || !this.errorContainer) return;
	//
	// 		this.wrapper.classList.remove('error');
	// 		const errorElements = this.errorContainer.querySelectorAll('.error');
	// 		errorElements.forEach(element => element.remove());
	// 	}
	//
	// 	displayErrors () {
	// 		if ( !this.wrapper || !this.errorContainer) return;
	//
	// 		this.clearErrors();
	//
	// 		if (this.invalidPhotos.length > 0) {
	// 			this.wrapper.classList.add('error');
	//
	// 			this.invalidPhotos.forEach(item => {
	// 				const errorItem = document.createElement('div');
	// 				errorItem.textContent = item.text;
	// 				errorItem.classList.add('error');
	// 				this.errorContainer.appendChild(errorItem);
	// 			});
	// 		}
	// 	}
	//
	// 	render () {
	// 		if ( !this.renderContainer) return;
	//
	// 		this.destroyAllTooltips();
	//
	// 		const uploadButton = this.renderContainer.querySelector('.photo-info-btn-wrapper');
	// 		const fragment = document.createDocumentFragment();
	//
	// 		this.photoArray.forEach(item => {
	// 			item.objectUrl = URL.createObjectURL(item.file);
	// 			const photoItem = this.createPhotoElement(item);
	// 			fragment.appendChild(photoItem);
	// 		});
	//
	// 		const newContainer = document.createElement('ul');
	// 		newContainer.className = this.renderContainer.className;
	// 		newContainer.appendChild(fragment);
	//
	// 		if (uploadButton) {
	// 			newContainer.appendChild(uploadButton);
	// 		}
	//
	// 		const containerParent = this.renderContainer.parentNode;
	// 		containerParent.replaceChild(newContainer, this.renderContainer);
	// 		this.renderContainer = newContainer;
	//
	// 		this.initTooltips();
	// 		this.initFancybox();
	// 		this.initEventHandlers();
	// 		this.initSortable();
	// 	}
	//
	// 	createSpinnerElement () {
	// 		const spinnerDiv = document.createElement('div');
	// 		spinnerDiv.className = 'spinner-border text-primary';
	// 		spinnerDiv.style.width = '50px';
	// 		spinnerDiv.style.height = '50px';
	// 		spinnerDiv.setAttribute('role', 'status');
	//
	// 		const spinnerSpan = document.createElement('span');
	// 		spinnerSpan.className = 'visually-hidden';
	// 		spinnerSpan.textContent = 'Загрузка...';
	//
	// 		spinnerDiv.appendChild(spinnerSpan);
	// 		return spinnerDiv;
	// 	}
	//
	// 	createPhotoElement (item) {
	// 		const photoItem = document.createElement('li');
	// 		photoItem.classList.add('photo-info-item');
	// 		photoItem.setAttribute('data-photo-id', item.id);
	//
	// 		const spinner = this.createSpinnerElement();
	//
	// 		photoItem.innerHTML = `
    //         <label>
    //             <input type="checkbox" ${item.isCheked ? 'checked' : ''}
    //                    data-cheked-photo-id="${item.id}">
    //             <div class="image-container">
    //             </div>
    //         </label>
    //         <div class="photo-info-item-actions">
    //             <button type="button" class="btn-see" aria-label="eye"
    //                     data-fancybox data-src="${item.objectUrl}">
    //                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M14.5 8C14.5 8 11.6 12 8 12C4.4 12 1.5 8 1.5 8C1.5 8 4.4 4 8 4C11.6 4 14.5 8 14.5 8Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
    //                     <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#3585F5" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" />
    //                 </svg>
    //             </button>
    //             <button type="button" class="btn-move" data-move-id="${item.id}">
    //                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <g clip-path="url(#clip0_388_3868)">
    //                         <path d="M3.33301 6L1.33301 8L3.33301 10" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                         <path d="M6 3.33301L8 1.33301L10 3.33301" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                         <path d="M10 12.667L8 14.667L6 12.667" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                         <path d="M12.667 6L14.667 8L12.667 10" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                         <path d="M1.33301 8H14.6663" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                         <path d="M8 1.33301V14.6663" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    //                     </g>
    //                     <defs>
    //                         <clipPath id="clip0_388_3868">
    //                             <rect width="16" height="16" fill="white" />
    //                         </clipPath>
    //                     </defs>
    //                 </svg>
    //             </button>
    //             <button type="button" class="btn-delete" data-delete-id="${item.id}">
    //                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M4.30007 12.4999C4.09537 12.4999 3.89057 12.4218 3.73437 12.2656C3.42188 11.9531 3.42188 11.4467 3.73437 11.1342L11.1343 3.7343C11.4468 3.4219 11.9532 3.4219 12.2657 3.7343C12.5781 4.0467 12.5781 4.55319 12.2657 4.86559L4.86576 12.2655C4.70956 12.4218 4.50477 12.4999 4.30007 12.4999Z" fill="#3585F5" />
    //                     <path d="M11.7 12.4998C11.4952 12.4998 11.2905 12.4217 11.1343 12.2655L3.73437 4.86559C3.42188 4.55319 3.42188 4.0467 3.73437 3.7343C4.04677 3.4219 4.55327 3.4219 4.86566 3.7343L12.2656 11.1342C12.578 11.4467 12.578 11.9531 12.2656 12.2656C12.1095 12.4217 11.9048 12.4998 11.7 12.4998Z" fill="#3585F5" />
    //                 </svg>
    //             </button>
    //             <button type="button" class="btn-edit" data-edit-id="${item.id}">
    //                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M11.3333 2.00004C11.5084 1.82493 11.7163 1.68602 11.9451 1.59131C12.1739 1.49659 12.4191 1.44794 12.6667 1.44794C12.9142 1.44794 13.1594 1.49659 13.3882 1.59131C13.617 1.68602 13.8249 1.82493 14 2.00004C14.1751 2.17515 14.314 2.38306 14.4087 2.61185C14.5034 2.84064 14.5521 3.08582 14.5521 3.33337C14.5521 3.58092 14.5034 3.8261 14.4087 4.05489C14.314 4.28368 14.1751 4.49159 14 4.66671L4.66667 14L1.33333 14.6667L2 11.3334L11.3333 2.00004Z" stroke="#3585F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    //                 </svg>
    //             </button>
    //         </div>
    //     `;
	//
	// 		const imageContainer = photoItem.querySelector('.image-container');
	// 		imageContainer.appendChild(spinner);
	//
	// 		const img = new Image();
	// 		img.src = item.objectUrl;
	// 		img.alt = item.name;
	// 		img.dataset.bsToggle = 'tooltip';
	// 		img.dataset.bsPlacement = 'top';
	// 		img.dataset.bsTitle = item.isCheked ? 'Не показывать в объявлении' :
	// 			'Показывать в объявлении';
	//
	// 		img.onload = () => {
	// 			spinner.style.display = 'none';
	// 			imageContainer.appendChild(img);
	//
	// 			if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
	// 				const tooltip = new bootstrap.Tooltip(img, {
	// 					trigger: 'hover',
	// 					placement: 'top'
	// 				});
	// 				this.tooltips.set(img, tooltip);
	// 			}
	// 		};
	//
	// 		img.onerror = () => {
	// 			spinner.style.display = 'none';
	// 			const errorMsg = document.createElement('div');
	// 			errorMsg.className = 'text-danger';
	// 			errorMsg.textContent = 'Ошибка загрузки изображения';
	// 			imageContainer.appendChild(errorMsg);
	// 		};
	//
	// 		return photoItem;
	// 	}
	//
	// 	initEventHandlers () {
	// 		if ( !this.renderContainer) return;
	//
	// 		this.renderContainer.addEventListener('change', (e) => {
	// 			if (e.target.matches('input[type="checkbox"][data-cheked-photo-id]')) {
	// 				const photoId = e.target.dataset.chekedPhotoId;
	// 				this.togglePhotoSelection(photoId);
	// 			}
	// 		});
	//
	// 		this.renderContainer.addEventListener('click', (e) => {
	// 			if (e.target.closest('.btn-delete')) {
	// 				const btn = e.target.closest('.btn-delete');
	// 				const photoId = btn.dataset.deleteId;
	// 				this.deletePhoto(photoId);
	// 				e.preventDefault();
	// 			}
	//
	// 			if (e.target.closest('.btn-move')) {
	// 				const btn = e.target.closest('.btn-move');
	// 				const photoId = btn.dataset.moveId;
	// 				this.movePhoto(photoId);
	// 				e.preventDefault();
	// 			}
	//
	// 			if (e.target.closest('.btn-edit')) {
	// 				const btn = e.target.closest('.btn-edit');
	// 				const photoId = btn.dataset.editId;
	// 				this.editPhoto(photoId);
	// 				e.preventDefault();
	// 			}
	// 		});
	// 	}
	// 	editPhoto(photoId) {
	// 		const photo = this.photoArray.find(p => p.id === photoId);
	// 		if (!photo) return;
	//
	// 		this.currentEditedPhoto = photo;
	// 		this.createCropperModal(photo.objectUrl);
	// 	}
	//
	// 	createCropperModal(imageSrc) {
	// 		// Перевірка, чи вже відкрито модальне вікно
	// 		if (document.getElementById('cropper-modal')) {
	// 			this.closeCropper();
	// 		}
	// 		// Створюємо модальне вікно
	// 		const modal = document.createElement('div');
	// 		modal.id = 'cropper-modal';
	// 		modal.style.position = 'fixed';
	// 		modal.style.top = '0';
	// 		modal.style.left = '0';
	// 		modal.style.width = '100%';
	// 		modal.style.height = '100%';
	// 		modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
	// 		modal.style.zIndex = '9999';
	// 		modal.style.display = 'flex';
	// 		modal.style.flexDirection = 'column';
	// 		modal.style.justifyContent = 'center';
	// 		modal.style.alignItems = 'center';
	//
	// 		// Головний контейнер
	// 		const mainContainer = document.createElement('div');
	// 		mainContainer.style.display = 'flex';
	// 		mainContainer.style.flexDirection = 'column';
	// 		mainContainer.style.maxWidth = '90%';
	// 		mainContainer.style.maxHeight = '90%';
	// 		mainContainer.style.width = '1000px';
	// 		mainContainer.style.background = '#fff';
	// 		mainContainer.style.borderRadius = '8px';
	// 		mainContainer.style.overflow = 'hidden';
	//
	// 		// Контейнер для зображення
	// 		const imgContainer = document.createElement('div');
	// 		imgContainer.style.flex = '1';
	// 		imgContainer.style.position = 'relative';
	// 		imgContainer.style.height = '500px';
	// 		imgContainer.style.overflow = 'hidden';
	//
	// 		// Зображення для обрізки
	// 		const img = document.createElement('img');
	// 		img.id = 'cropper-image';
	// 		img.src = imageSrc;
	// 		img.style.maxWidth = '100%';
	// 		img.style.maxHeight = '100%';
	//
	// 		// Контейнер для налаштувань
	// 		const settingsContainer = document.createElement('div');
	// 		settingsContainer.style.padding = '20px';
	// 		settingsContainer.style.backgroundColor = '#f5f5f5';
	// 		settingsContainer.style.borderTop = '1px solid #ddd';
	//
	// 		// Розділ обрізки та повороту
	// 		const cropSection = document.createElement('div');
	// 		cropSection.style.marginBottom = '20px';
	//
	// 		const cropTitle = document.createElement('h3');
	// 		cropTitle.textContent = 'Обрізка та поворот';
	// 		cropTitle.style.marginBottom = '10px';
	// 		cropTitle.style.fontSize = '16px';
	//
	// 		const cropButtons = document.createElement('div');
	// 		cropButtons.style.display = 'flex';
	// 		cropButtons.style.gap = '10px';
	// 		cropButtons.style.flexWrap = 'wrap';
	//
	// 		const rotateLeftBtn = this.createButton('↺ Повернути ліворуч', 'rotate-left');
	// 		const rotateRightBtn = this.createButton('↻ Повернути праворуч', 'rotate-right');
	// 		const flipHorizontalBtn = this.createButton('↔ Дзеркало по горизонталі', 'flip-horizontal');
	// 		const flipVerticalBtn = this.createButton('↕ Дзеркало по вертикалі', 'flip-vertical');
	// 		const resetBtn = this.createButton('⟲ Скинути', 'reset');
	// 		const cropBtn = this.createButton('Обрізати', 'crop');
	//
	// 		cropButtons.appendChild(rotateLeftBtn);
	// 		cropButtons.appendChild(rotateRightBtn);
	// 		cropButtons.appendChild(flipHorizontalBtn);
	// 		cropButtons.appendChild(flipVerticalBtn);
	// 		cropButtons.appendChild(resetBtn);
	// 		cropButtons.appendChild(cropBtn);
	//
	// 		cropSection.appendChild(cropTitle);
	// 		cropSection.appendChild(cropButtons);
	//
	// 		// Розділ кольорових налаштувань
	// 		const colorSection = document.createElement('div');
	// 		colorSection.style.marginBottom = '20px';
	//
	// 		const colorTitle = document.createElement('h3');
	// 		colorTitle.textContent = 'Кольорові налаштування';
	// 		colorTitle.style.marginBottom = '10px';
	// 		colorTitle.style.fontSize = '16px';
	//
	// 		const colorControls = document.createElement('div');
	// 		colorControls.style.display = 'grid';
	// 		colorControls.style.gridTemplateColumns = '1fr 1fr';
	// 		colorControls.style.gap = '15px';
	//
	// 		// Додаємо слайдери
	// 		this.createSliderControl(colorControls, 'Яскравість', 'brightness', 0, 200, 100);
	// 		this.createSliderControl(colorControls, 'Контрастність', 'contrast', 0, 200, 100);
	// 		this.createSliderControl(colorControls, 'Насиченість', 'saturation', 0, 200, 100);
	// 		this.createSliderControl(colorControls, 'Температура', 'temperature', -100, 100, 0);
	//
	// 		colorSection.appendChild(colorTitle);
	// 		colorSection.appendChild(colorControls);
	//
	// 		// Попередній перегляд
	// 		const previewSection = document.createElement('div');
	//
	// 		const previewTitle = document.createElement('h3');
	// 		previewTitle.textContent = 'Попередній перегляд';
	// 		previewTitle.style.marginBottom = '10px';
	// 		previewTitle.style.fontSize = '16px';
	//
	// 		const previewContainer = document.createElement('div');
	// 		previewContainer.className = 'preview';
	// 		previewContainer.style.width = '100px';
	// 		previewContainer.style.height = '100px';
	// 		previewContainer.style.overflow = 'hidden';
	// 		previewContainer.style.border = '1px solid #ddd';
	// 		previewContainer.style.marginTop = '10px';
	//
	// 		previewSection.appendChild(previewTitle);
	// 		previewSection.appendChild(previewContainer);
	//
	// 		// Кнопки дій
	// 		const actionButtons = document.createElement('div');
	// 		actionButtons.style.display = 'flex';
	// 		actionButtons.style.justifyContent = 'flex-end';
	// 		actionButtons.style.gap = '10px';
	// 		actionButtons.style.marginTop = '20px';
	//
	// 		const cancelBtn = this.createButton('Скасувати', 'cancel', true);
	// 		const saveBtn = this.createButton('Зберегти', 'save', false);
	//
	// 		actionButtons.appendChild(cancelBtn);
	// 		actionButtons.appendChild(saveBtn);
	//
	// 		// Збираємо всі розділи
	// 		settingsContainer.appendChild(cropSection);
	// 		settingsContainer.appendChild(colorSection);
	// 		settingsContainer.appendChild(previewSection);
	// 		settingsContainer.appendChild(actionButtons);
	//
	// 		imgContainer.appendChild(img);
	// 		mainContainer.appendChild(imgContainer);
	// 		mainContainer.appendChild(settingsContainer);
	// 		modal.appendChild(mainContainer);
	//
	// 		document.body.appendChild(modal);
	// 		document.body.classList.add('lock');
	//
	// 		// Ініціалізуємо Cropper.js
	// 		this.initCropper(img, previewContainer);
	//
	// 		// Обробники подій
	// 		rotateLeftBtn.addEventListener('click', () => this.rotateImage(-90));
	// 		rotateRightBtn.addEventListener('click', () => this.rotateImage(90));
	// 		flipHorizontalBtn.addEventListener('click', () => this.flipImage('horizontal'));
	// 		flipVerticalBtn.addEventListener('click', () => this.flipImage('vertical'));
	// 		resetBtn.addEventListener('click', () => this.resetImage());
	// 		cropBtn.addEventListener('click', () => this.cropImage());
	// 		cancelBtn.addEventListener('click', () => this.closeCropper());
	// 		saveBtn.addEventListener('click', () => this.saveCroppedImage());
	//
	// 		const cropSizeBtn = document.createElement('button');
	// 		cropSizeBtn.textContent = 'Зменшити область';
	// 		cropSizeBtn.className = 'btn btn-info';
	// 		cropSizeBtn.addEventListener('click', () => {
	// 			this.setCropBoxSize(60); // Встановлюємо 60% від розміру зображення
	// 		});
	// 		buttonsContainer.insertBefore(cropSizeBtn, buttonsContainer.firstChild);
	// 	}
	//
	// 	createButton(text, className, isSecondary = false) {
	// 		const button = document.createElement('button');
	// 		button.textContent = text;
	// 		button.className = `btn ${isSecondary ? 'btn-secondary' : 'btn-primary'}`;
	// 		button.style.padding = '8px 15px';
	// 		button.style.borderRadius = '4px';
	// 		button.style.border = 'none';
	// 		button.style.cursor = 'pointer';
	// 		button.style.fontSize = '14px';
	// 		if (isSecondary) {
	// 			button.style.backgroundColor = '#6c757d';
	// 			button.style.color = '#fff';
	// 		} else {
	// 			button.style.backgroundColor = '#4CAF50';
	// 			button.style.color = '#fff';
	// 		}
	// 		return button;
	// 	}
	//
	// 	createSliderControl(container, labelText, id, min, max, value) {
	// 		const controlGroup = document.createElement('div');
	// 		controlGroup.style.display = 'flex';
	// 		controlGroup.style.flexDirection = 'column';
	// 		controlGroup.style.gap = '5px';
	//
	// 		// Створюємо label з окремим span для значення
	// 		const label = document.createElement('label');
	// 		label.style.fontSize = '14px';
	//
	// 		const labelTextNode = document.createTextNode(`${labelText}: `);
	// 		label.appendChild(labelTextNode);
	//
	// 		const valueSpan = document.createElement('span');
	// 		valueSpan.id = `${id}-value`;
	// 		valueSpan.textContent = value;
	// 		label.appendChild(valueSpan);
	//
	// 		const slider = document.createElement('input');
	// 		slider.type = 'range';
	// 		slider.id = id;
	// 		slider.min = min;
	// 		slider.max = max;
	// 		slider.value = value;
	// 		slider.style.width = '100%';
	//
	// 		slider.addEventListener('input', (e) => {
	// 			// Перевіряємо, чи існує елемент перед оновленням
	// 			const valueElement = document.getElementById(`${id}-value`);
	// 			if (valueElement) {
	// 				valueElement.textContent = e.target.value;
	// 			}
	// 			this.applyImageFilters();
	// 		});
	//
	// 		controlGroup.appendChild(label);
	// 		controlGroup.appendChild(slider);
	// 		container.appendChild(controlGroup);
	// 	}
	//
	// 	initCropper(imgElement, previewContainer) {
	// 		this.cropper = new Cropper(imgElement, {
	// 			aspectRatio: NaN,
	// 			viewMode: 1,
	// 			autoCropArea: 0.3,
	// 			responsive: true,
	// 			preview: previewContainer,
	// 			checkCrossOrigin: false,
	// 			background: false,
	// 			modal: false,
	// 			guides: false,
	// 			center: false,
	// 			highlight: false,
	// 			cropBoxMovable: true,
	// 			cropBoxResizable: true,
	// 			toggleDragModeOnDblclick: false,
	// 			ready: () => {
	// 				this.originalImageData = this.cropper.getImageData();
	// 			}
	// 		});
	// 	}
	//
	// 	rotateImage(degrees) {
	// 		if (this.cropper) {
	// 			this.cropper.rotate(degrees);
	// 		}
	// 	}
	//
	// 	flipImage(direction) {
	// 		if (this.cropper) {
	// 			if (direction === 'horizontal') {
	// 				const scaleX = this.cropper.getData().scaleX || 1;
	// 				this.cropper.scaleX(-scaleX);
	// 			} else {
	// 				const scaleY = this.cropper.getData().scaleY || 1;
	// 				this.cropper.scaleY(-scaleY);
	// 			}
	// 		}
	// 	}
	//
	// 	resetImage() {
	// 		if (this.cropper && this.originalImageSrc) {
	// 			// Скидаємо всі повзунки
	// 			document.getElementById('size').value = 100;
	// 			document.getElementById('brightness').value = 0;
	// 			document.getElementById('contrast').value = 0;
	// 			document.getElementById('saturation').value = 0;
	// 			document.getElementById('temperature').value = 0;
	// 			document.getElementById('rotate').value = 0;
	//
	// 			// Оновлюємо відображення значень
	// 			document.querySelectorAll('input[type="range"] + span').forEach(span => {
	// 				span.textContent = span.previousElementSibling.value;
	// 			});
	//
	// 			// Відновлюємо оригінальне зображення
	// 			const imageElement = document.getElementById('cropper-image');
	// 			imageElement.src = this.originalImageSrc;
	// 			this.cropper.replace(this.originalImageSrc);
	//
	// 			// Скидаємо всі трансформації
	// 			this.cropper.reset();
	//
	// 			// Встановлюємо початковий розмір області обрізання
	// 			const imageData = this.cropper.getImageData();
	// 			const cropBoxWidth = imageData.naturalWidth * 0.8;
	// 			const cropBoxHeight = imageData.naturalHeight * 0.8;
	//
	// 			this.cropper.setCropBoxData({
	// 				width: cropBoxWidth,
	// 				height: cropBoxHeight,
	// 				left: (imageData.width - cropBoxWidth) / 2,
	// 				top: (imageData.height - cropBoxHeight) / 2
	// 			});
	// 		}
	// 	}
	// 	setCropBoxSize(percent) {
	// 		if (!this.cropper) return;
	//
	// 		const imageData = this.cropper.getImageData();
	// 		const newWidth = imageData.naturalWidth * (percent / 100);
	// 		const newHeight = imageData.naturalHeight * (percent / 100);
	//
	// 		this.cropper.setCropBoxData({
	// 			width: newWidth,
	// 			height: newHeight,
	// 			left: (imageData.width - newWidth) / 2,
	// 			top: (imageData.height - newHeight) / 2
	// 		});
	// 	}
	// 	cropImage() {
	// 		if (this.cropper) {
	// 			const canvas = this.cropper.getCroppedCanvas();
	// 			if (canvas) {
	// 				const img = document.getElementById('cropper-image');
	// 				img.src = canvas.toDataURL('image/png');
	// 				this.cropper.replace(img.src);
	// 			}
	// 		}
	// 	}
	//
	// 	applyImageFilters() {
	// 		if (!this.cropper) return;
	//
	// 		// Отримуємо canvas з cropper
	// 		const canvas = this.cropper.getCroppedCanvas();
	//
	// 		// Перевіряємо, чи canvas існує і має позитивні розміри
	// 		if (!canvas || canvas.width === 0 || canvas.height === 0) {
	// 			console.warn('Canvas is not ready or has zero dimensions');
	// 			return;
	// 		}
	//
	// 		const brightness = document.getElementById('brightness').value;
	// 		const contrast = document.getElementById('contrast').value;
	// 		const saturation = document.getElementById('saturation').value;
	// 		const temperature = document.getElementById('temperature').value;
	//
	// 		let filter = `
    //     brightness(${brightness}%)
    //     contrast(${contrast}%)
    //     saturate(${saturation}%)
    // `;
	//
	// 		if (temperature > 0) {
	// 			filter += ` sepia(${temperature}%) hue-rotate(-${temperature * 0.3}deg)`;
	// 		} else if (temperature < 0) {
	// 			filter += ` sepia(${-temperature}%) hue-rotate(${-temperature * 0.3}deg)`;
	// 		}
	//
	// 		// Створюємо тимчасовий canvas для застосування фільтрів
	// 		const tempCanvas = document.createElement('canvas');
	// 		tempCanvas.width = canvas.width;
	// 		tempCanvas.height = canvas.height;
	// 		const ctx = tempCanvas.getContext('2d');
	//
	// 		try {
	// 			// Застосовуємо фільтри
	// 			ctx.filter = filter.trim(); // Видаляємо зайві пробіли
	// 			ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
	//
	// 			// Оновлюємо зображення в cropper
	// 			const img = document.getElementById('cropper-image');
	// 			img.src = tempCanvas.toDataURL('image/jpeg', 0.92);
	// 			this.cropper.replace(img.src, false); // false - щоб зберегти поточні трансформації
	// 		} catch (error) {
	// 			console.error('Error applying filters:', error);
	// 		}
	// 	}
	//
	// 	saveCroppedImage() {
	// 		if (!this.cropper || !this.currentEditedPhoto) return;
	//
	// 		const canvas = this.cropper.getCroppedCanvas({
	// 			minWidth: this.minWidth,
	// 			minHeight: this.minHeight,
	// 			maxWidth: 4096,
	// 			maxHeight: 4096,
	// 			fillColor: '#fff',
	// 			imageSmoothingEnabled: true,
	// 			imageSmoothingQuality: 'high',
	// 		});
	// 		if (!canvas) return;
	//
	// 		canvas.toBlob((blob) => {
	// 			if (!blob) {
	// 				console.error('Помилка при створенні blob з canvas');
	// 				return;
	// 			}
	//
	// 			const editedFile = new File([blob], this.currentEditedPhoto.name, {
	// 				type: 'image/jpeg',
	// 				lastModified: Date.now()
	// 			});
	//
	// 			// Оновлюємо фото в масиві
	// 			this.currentEditedPhoto.file = editedFile;
	// 			this.currentEditedPhoto.objectUrl = URL.createObjectURL(editedFile);
	// 			this.currentEditedPhoto.width = canvas.width;
	// 			this.currentEditedPhoto.height = canvas.height;
	// 			this.currentEditedPhoto.size = blob.size;
	//
	// 			// Оновлюємо відображення
	// 			this.render();
	//
	// 			// Закриваємо редактор
	// 			this.closeCropper();
	// 		}, 'image/jpeg', 0.92);
	// 	}
	//
	// 	closeCropper() {
	// 		if (this.cropper) {
	// 			this.cropper.destroy();
	// 			this.cropper = null;
	// 		}
	//
	// 		const modal = document.getElementById('cropper-modal');
	// 		if (modal) {
	// 			modal.remove();
	// 		}
	//
	// 		document.body.classList.remove('lock');
	// 		this.currentEditedPhoto = null;
	// 	}
	//
	// 	saveEditedImage (photoItem) {
	// 		if ( !this.imageEditor) return;
	//
	// 		// Get edited image as blob
	// 		const editedImageData = this.imageEditor.toDataURL();
	// 		fetch(editedImageData)
	// 			.then(res => res.blob())
	// 			.then(blob => {
	// 				// Create a new File object with the edited image
	// 				const editedFile = new File([blob], photoItem.name, {
	// 					type: 'image/jpeg',
	// 					lastModified: Date.now()
	// 				});
	//
	// 				// Update the photo item with the edited file
	// 				photoItem.file = editedFile;
	// 				photoItem.objectUrl = URL.createObjectURL(editedFile);
	//
	// 				// Update the display
	// 				this.render();
	//
	// 				// Close the editor
	// 				this.closeImageEditor();
	// 			});
	// 		// Після збереження також видаляємо клас lock
	// 		if (document.body.classList.contains('lock')) {
	// 			document.body.classList.remove('lock');
	// 		}
	// 	}
	//
	// 	closeImageEditor () {
	// 		if (this.imageEditor) {
	// 			this.imageEditor.destroy();
	// 			this.imageEditor = null;
	// 		}
	//
	// 		const editorContainer = document.getElementById('tui-image-editor-container');
	// 		if (editorContainer) {
	// 			editorContainer.remove();
	// 		}
	//
	// 		const buttonContainer = document.querySelector('div[style*="z-index: 10000"]');
	// 		if (buttonContainer) {
	// 			buttonContainer.remove();
	// 		}
	// 		// Видаляємо клас lock з body, якщо він є
	// 		if (document.body.classList.contains('lock')) {
	// 			document.body.classList.remove('lock');
	// 		}
	// 	}
	//
	// 	togglePhotoSelection (photoId) {
	// 		const photo = this.photoArray.find(p => p.id === photoId);
	// 		if ( !photo) return;
	//
	// 		photo.isCheked = !photo.isCheked;
	//
	// 		const img = this.renderContainer.querySelector(`[data-photo-id="${photoId}"] img`);
	// 		if (img) {
	// 			img.setAttribute('data-bs-title',
	// 				photo.isCheked ? 'Не показывать в объявлении' :
	// 					'Показывать в объявлении');
	//
	// 			const tooltip = bootstrap.Tooltip.getInstance(img);
	// 			if (tooltip) {
	// 				tooltip.dispose();
	// 				this.tooltips.delete(img);
	// 			}
	//
	// 			const newTooltip = new bootstrap.Tooltip(img, {
	// 				trigger: 'hover',
	// 				title: img.getAttribute('data-bs-title')
	// 			});
	// 			this.tooltips.set(img, newTooltip);
	// 		}
	// 	}
	//
	// 	deletePhoto (photoId) {
	// 		const photoElement = this.renderContainer.querySelector(`[data-photo-id="${photoId}"]`);
	// 		if ( !photoElement) return;
	//
	// 		const photoIndex = this.photoArray.findIndex(photo => photo.id === photoId);
	// 		if (photoIndex === -1) return;
	//
	// 		const img = photoElement.querySelector('img');
	// 		if (img) {
	// 			const tooltip = bootstrap.Tooltip.getInstance(img);
	// 			if (tooltip) {
	// 				tooltip.dispose();
	// 				this.tooltips.delete(img);
	// 			}
	// 		}
	//
	// 		const photoToDelete = this.photoArray[photoIndex];
	// 		if (photoToDelete.objectUrl) {
	// 			try {
	// 				URL.revokeObjectURL(photoToDelete.objectUrl);
	// 			} catch (e) {
	// 				console.warn('Ошибка при освобождении URL:', e);
	// 			}
	// 		}
	//
	// 		this.photoArray.splice(photoIndex, 1);
	// 		this.validPhotos = this.validPhotos.filter(photo => photo.id !== photoId);
	// 		photoElement.remove();
	// 	}
	//
	// 	movePhoto (photoId) {
	// 		console.log(`Переместить фото с идентификатором: ${photoId}`);
	// 	}
	//
	// 	initFancybox () {
	// 		if (typeof Fancybox === 'undefined') return;
	//
	// 		if (Fancybox.getInstance()) {
	// 			Fancybox.getInstance().destroy();
	// 		}
	//
	// 		Fancybox.bind("[data-fancybox]", {
	// 			Thumbs: false,
	// 			Toolbar: {
	// 				display: {
	// 					left: ["infobar"],
	// 					middle: [],
	// 					right: ["close"],
	// 				},
	// 			},
	// 			Images: {
	// 				zoom: true,
	// 			},
	// 			on: {
	// 				close: () => {
	// 					const instance = Fancybox.getInstance();
	// 					if (instance) {
	// 						const slides = instance.getSlides();
	// 						slides && slides.forEach(slide => {
	// 							if (slide.content.src.startsWith('blob:')) {
	// 								URL.revokeObjectURL(slide.content.src);
	// 							}
	// 						});
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
	//
	// 	initTooltips () {
	// 		if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
	//
	// 		const tooltipElements = this.renderContainer && this.renderContainer.querySelectorAll('[data-bs-toggle="tooltip"]') || [];
	//
	// 		tooltipElements.forEach(el => {
	// 			try {
	// 				if ( !this.tooltips.has(el)) {
	// 					const tooltip = new bootstrap.Tooltip(el, {
	// 						trigger: 'hover',
	// 						placement: 'top'
	// 					});
	// 					this.tooltips.set(el, tooltip);
	// 				}
	// 			} catch (e) {
	// 				console.warn('Ошибка при инициализации тултипа:', e);
	// 			}
	// 		});
	// 	}
	//
	// 	destroyAllTooltips () {
	// 		this.tooltips.forEach((tooltip, element) => {
	// 			try {
	// 				if (tooltip && typeof tooltip.dispose === 'function') {
	// 					tooltip.dispose();
	// 				}
	// 			} catch (e) {
	// 				console.warn('Ошибка при уничтожении тултипа:', e);
	// 			}
	// 		});
	// 		this.tooltips.clear();
	// 	}
	//
	// 	getSelectedPhotos () {
	// 		return this.photoArray.filter(photo => photo.isCheked);
	// 	}
	//
	// 	destroy () {
	// 		this.clearOldObjectUrls();
	// 		this.destroyAllTooltips();
	// 		this.closeImageEditor();
	//
	// 		if (this.globalLoader) {
	// 			this.globalLoader.remove();
	// 			this.globalLoader = null;
	// 		}
	//
	// 		if (typeof Fancybox !== 'undefined' && Fancybox.getInstance()) {
	// 			Fancybox.getInstance().destroy();
	// 		}
	//
	// 		if (this.input) {
	// 			this.input.removeEventListener('change', this.handleFileUpload);
	// 		}
	//
	// 		if (this.renderContainer) {
	// 			this.renderContainer.removeEventListener('change', this.togglePhotoSelection);
	// 			this.renderContainer.removeEventListener('click', this.handleContainerClick);
	// 		}
	// 	}
	//
	// 	/**
	// 	 * Збільшує зображення до мінімального розміру, зберігаючи пропорції
	// 	 * @param {File} file - Об'єкт файлу зображення
	// 	 * @param {Object} photoItem - Об'єкт фото для оновлення
	// 	 * @returns {Promise<Object>} Обіцянка, що повертає оновлений об'єкт фото
	// 	 */
	// 	resizeImageToMinimum (file, photoItem) {
	// 		return new Promise((resolve, reject) => {
	// 			const img = new Image();
	// 			const url = URL.createObjectURL(file);
	//
	// 			img.onload = () => {
	// 				URL.revokeObjectURL(url);
	//
	// 				try {
	// 					const originalWidth = img.naturalWidth;
	// 					const originalHeight = img.naturalHeight;
	//
	// 					// Визначаємо, яка сторона менша
	// 					const isWidthSmaller = originalWidth < originalHeight;
	//
	// 					// Розраховуємо нові розміри, зберігаючи пропорції
	// 					let newWidth, newHeight;
	//
	// 					if (isWidthSmaller) {
	// 						// Якщо ширина менша, масштабуємо по ширині
	// 						const scaleFactor = this.minWidth / originalWidth;
	// 						newWidth = this.minWidth;
	// 						newHeight = Math.round(originalHeight * scaleFactor);
	// 					} else {
	// 						// Якщо висота менша, масштабуємо по висоті
	// 						const scaleFactor = this.minHeight / originalHeight;
	// 						newHeight = this.minHeight;
	// 						newWidth = Math.round(originalWidth * scaleFactor);
	// 					}
	//
	// 					// Створюємо canvas для зміни розміру
	// 					const canvas = document.createElement('canvas');
	// 					canvas.width = newWidth;
	// 					canvas.height = newHeight;
	// 					const ctx = canvas.getContext('2d');
	//
	// 					// Застосовуємо високоякісне масштабування
	// 					ctx.imageSmoothingQuality = 'high';
	// 					ctx.drawImage(img, 0, 0, newWidth, newHeight);
	//
	// 					// Конвертуємо canvas назад у файл
	// 					canvas.toBlob(blob => {
	// 						if ( !blob) {
	// 							reject(new Error('Ошибка при создании blob из canvas'));
	// 							return;
	// 						}
	//
	// 						const resizedFile = new File([blob], file.name, {
	// 							type: 'image/jpeg',
	// 							lastModified: Date.now()
	// 						});
	//
	// 						// Оновлюємо об'єкт фото новими даними
	// 						const resizedPhoto = {
	// 							...photoItem,
	// 							file: resizedFile,
	// 							width: newWidth,
	// 							height: newHeight,
	// 							size: blob.size,
	// 							wasResized: true // Додатковий прапорець для інформації
	// 						};
	//
	// 						resolve(resizedPhoto);
	// 					}, 'image/jpeg', 0.92); // Якість 92%
	//
	// 				} catch (error) {
	// 					reject(error);
	// 				}
	// 			};
	//
	// 			img.onerror = () => {
	// 				URL.revokeObjectURL(url);
	// 				reject(new Error('Ошибка загрузки изображения для изменения размера'));
	// 			};
	//
	// 			img.src = url;
	// 		});
	// 	}
	// }
	// Ініціалізація FileUploader після завантаження Fancybox
	function initFileUploaders () {
		// Для документів (без перевірки розміру)
		new FileUploader({
			inputId: 'document',
			wrapperClass: 'loading-documents',
			checkImageSize: false,
		});
		new PhotoLoader({
			inputId: 'loading-photo',
			checkImageSize: false,
			minWidth: 800,
			minHeight: 800,
			wrapperClass: 'photo-info-list',
			maxPhotos: 20,
		});
		// Для плану (з перевіркою розміру)
		new FileUploader({
			inputId: 'plan',
			wrapperClass: 'loading-plan',
			checkImageSize: false,
		});
	}
	
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