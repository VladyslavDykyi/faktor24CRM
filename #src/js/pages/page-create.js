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
			this.errorContainer = this.wrapper
				? this.wrapper.querySelector(`[for="${this.inputId}"] span`)
				: null;
			
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
				height: null
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
						height: height
					});
				} else if (width >= this.minWidth && height >= this.minHeight) {
					// Якщо перевірка увімкнена і розмір підходить
					this.validDocuments.push({
						id: this.validDocuments.length,
						name: file.name,
						size: file.size,
						width: width,
						height: height
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
				documentItem.setAttribute('data-document-id', item.id);
				
				// Визначаємо тип контенту та джерело для Fancybox
				const isPDF = item.name.toLowerCase().endsWith('.pdf');
				const fancyboxType = isPDF ? 'iframe' : 'image';
				const fancyboxSrc = isPDF ?
					URL.createObjectURL(this.getFileByName(item.name)) :
					URL.createObjectURL(this.getFileByName(item.name));
				
				documentItem.innerHTML = `
                ${item.name}
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

//document.addEventListener('DOMContentLoaded', () => {
	// Підключаємо Fancybox CSS та JS (якщо ще не підключено)
	// if (!document.querySelector('link[href*="fancybox"]')) {
	// 	const fancyboxCSS = document.createElement('link');
	// 	fancyboxCSS.rel = 'stylesheet';
	// 	fancyboxCSS.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
	// 	document.head.appendChild(fancyboxCSS);
	//
	// 	const fancyboxJS = document.createElement('script');
	// 	fancyboxJS.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
	// 	document.head.appendChild(fancyboxJS);
	// }
	//
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
	
	// Чекаємо, поки завантажиться Fancybox, якщо ми його тільки що підключили
	if (window.Fancybox) {
		initFileUploaders();
	} else {
		const checkFancybox = setInterval(() => {
			if (window.Fancybox) {
				clearInterval(checkFancybox);
				initFileUploaders();
			}
		}, 100);
	}
})();