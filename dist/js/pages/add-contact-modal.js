import {PhotoLoaderMini, PhoneInputManager } from "./function_on_pages-create.js";
class FileUploader {
	constructor(options) {
		// Обов'язкові параметри
		this.inputId = options.inputId;
		this.wrapperClass = options.wrapperClass;
		this.renderContainerSelector = options.renderContainerSelector;
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
		this.renderContainer = document.querySelector(this.renderContainerSelector);
		// Масиви для файлів
		this.validDocuments = [];
		this.invalidDocuments = [];
		this.pendingImages = 0; // Лічильник для асинхронної обробки
		this.idCounter = 0; // Лічильник для унікальних ID
		
		// Перевіряємо, чи всі необхідні елементи існують
		if (this.input && this.wrapper && this.renderContainer) {
			this.init();
		} else {
			console.error('Не удалось найти необходимые DOM-элементы:', {
				input: this.input,
				wrapper: this.wrapper,
				renderContainer: this.renderContainer
			});
		}
	}
	
	// Метод для генерації унікальних ID
	generateUniqueId() {
		this.idCounter++;
		return `file_${this.idCounter}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	
	init() {
		this.input.addEventListener('change', (e) => this.handleFileUpload(e));
		console.log('FileUploader initialized for input:', this.inputId);
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
		
		this.pendingImages = files.filter(file => file.type.match('image.*')).length;
		const hasImages = this.pendingImages > 0;
		
		files.forEach((file) => {
			if (file.type === 'application/pdf') {
				this.validDocuments.push({
					id: this.generateUniqueId(), // Унікальний ID
					name: file.name,
					size: file.size,
					width: null,
					height: null,
					file: file
				});
			} else if (file.type.match('image.*')) {
				this.handleImage(file);
			} else {
				this.invalidDocuments.push({
					text: `Файл "${file.name}" не является изображением или PDF.`
				});
			}
		});
		
		// Якщо немає зображень (тільки PDF), оновлюємо одразу
		if (!hasImages) {
			this.displayErrors();
			this.render();
		}
	}
	
	handleImage(file) {
		const img = new Image();
		const url = URL.createObjectURL(file);
		
		img.onload = () => {
			URL.revokeObjectURL(url);
			
			const width = img.width;
			const height = img.height;
			
			if (!this.checkImageSize || (width >= this.minWidth && height >= this.minHeight)) {
				this.validDocuments.push({
					id: this.generateUniqueId(), // Унікальний ID
					name: file.name,
					size: file.size,
					width: width,
					height: height,
					file: file
				});
			} else {
				this.invalidDocuments.push({
					text: `Изображение "${file.name}" (${width}x${height}) маловатое. Минимальный размер: ${this.minWidth}x${this.minHeight} пікселів.`
				});
			}
			
			this.pendingImages--;
			if (this.pendingImages === 0) {
				this.displayErrors();
				this.render();
			}
		};
		
		img.onerror = () => {
			URL.revokeObjectURL(url);
			this.invalidDocuments.push({
				text: `Ошибка загрузки изображения: ${file.name}`
			});
			this.pendingImages--;
			if (this.pendingImages === 0) {
				this.displayErrors();
				this.render();
			}
		};
		
		img.src = url;
	}
	
	render() {
		if (!this.renderContainer) {
			console.error('Render container not found:', this.renderContainerSelector);
			return;
		}
		
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
			const fileURL = URL.createObjectURL(item.file);
			
			documentItem.innerHTML = `
                <span>${item.name}</span>
                <button type="button" class="fancybox-button" data-fancybox data-type="${fancyboxType}" data-src="${fileURL}" aria-label="eye" data-id="${item.id}">
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
				const id = button.getAttribute('data-id'); // Не потрібно parseInt, бо ID тепер строка
				this.removeDocument(id);
			});
		});
	}
	
	removeDocument(id) {
		// Видаляємо документ з масиву
		this.validDocuments = this.validDocuments.filter(doc => doc.id !== id);
		
		// Перерендеримо список
		this.render();
	}
	
	initFancybox() {
		// Перевіряємо, чи Fancybox доступний
		if (typeof Fancybox === 'undefined') {
			console.warn('Fancybox is not available');
			return;
		}
		
		// Ініціалізація Fancybox для всіх кнопок перегляду
		Fancybox.bind("[data-fancybox]", {
			Thumbs: false,
			Toolbar: true,
			Images: {
				zoom: true,
			},
		});
	}
	
	// Додатковий метод для отримання всіх валідних файлів
	getValidFiles() {
		return this.validDocuments.map(doc => doc.file);
	}
	
	// Додатковий метод для очищення всіх файлів
	clearAllFiles() {
		this.validDocuments = [];
		this.invalidDocuments = [];
		this.pendingImages = 0;
		this.input.value = ''; // Очищаємо input
		this.clearErrors();
		this.render();
	}
	
	// Додатковий метод для перевірки, чи є файли
	hasFiles() {
		return this.validDocuments.length > 0;
	}
}
let phoneManager = null;
let select2Initialized = false;

function initPhoneInputManager() {
	if (phoneManager) return;
	
	if (document.querySelector('.btn-new-tel') && typeof PhoneInputManager !== 'undefined') {
		try {
			phoneManager = new PhoneInputManager({
				btnSelector: '.btn-new-tel',
				wrapperSelector: '.modal-row .item.phone',
				inputClass: 'tel-contact',
				maxPhones: 5,
				initialCountry: 'ua',
				utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js',
				countryMasks: {
					'ua': '(99) 999-99-99',
					'us': '(999) 999-9999',
					'gb': '9999 999999',
					'de': '999 99999999',
					'fr': '9 99-99-99-99',
					'pl': '999 999-999',
					'it': '999 999-9999',
					'es': '999 99-99-99',
					'default': '(999) 999-99-99'
				}
			});
		} catch (error) {
			console.error('Error initializing PhoneInputManager:', error);
		}
	}
}

function initSelect2() {
	if (select2Initialized) return;
	
	// Масив всіх Select2, які потрібно ініціалізувати
	const select2Configs = [
		{
			selector: '#tags-client-modal',
			options: {
				dropdownParent: $('#add-contact-modal'),
				width: '100%',
				placeholder: 'Выберите теги',
				language: { noResults: () => "Результатов не найдено" }
			}
		},
		{
			selector: '#type-contact-modal',
			options: {
				dropdownParent: $('#add-contact-modal'),
				width: '100%',
				placeholder: 'Выберите тип',
				language: { noResults: () => "Результатов не найдено" }
			}
		},
		{
			selector: '#source-contact-modal',
			options: {
				dropdownParent: $('#add-contact-modal'),
				width: '100%',
				placeholder: 'Выберите источник',
				language: { noResults: () => "Результатов не найдено" }
			}
		}
	];
	
	try {
		// Ініціалізуємо всі Select2
		select2Configs.forEach(config => {
			if ($(config.selector).length) {
				// Спочатку destroy, якщо вже ініціалізовано
				if ($(config.selector).data('select2')) {
					$(config.selector).select2('destroy');
				}
				
				$(config.selector).select2(config.options);
				
				// Додаємо обробник для фокусу
				$(config.selector).on('select2:open', function() {
					setTimeout(() => {
						const searchField = document.querySelector('.select2-search__field');
						if (searchField) {
							searchField.focus();
						}
					}, 100);
				});
			}
		});
		
		select2Initialized = true;
		console.log('All Select2 initialized successfully');
		
	} catch (error) {
		console.error('Error initializing Select2:', error);
	}
}

// Ініціалізація PhotoLoaderMini
function initPhotoLoader() {
	new PhotoLoaderMini({
		inputId: 'loading-photo',
		wrapperClass: 'photo-info-list'
	});
}

// Ініціалізація FileUploader для документів
function initFileUploaders() {
	// Перевіряємо, чи існують необхідні елементи в модалці
	const documentInput = document.querySelector('#document-contact-modal');
	const loadingDocuments = document.querySelector('.loading-documents');
	const renderContainer = document.querySelector('[data-render-document]');
	
	if (documentInput && loadingDocuments && renderContainer) {
		// Для документів (без перевірки розміру)
		new FileUploader({
			inputId: 'document-contact-modal',
			wrapperClass: 'loading-documents',
			renderContainerSelector: '.on-modals > [data-render-document]',
			checkImageSize: false,
		});
		console.log('FileUploader initialized in modal');
	} else {
		console.error('FileUploader elements not found in modal');
	}
}
function initModalComponents() {
	initPhoneInputManager();
	initSelect2();
	initPhotoLoader();
	initFileUploaders();
}

// Обробник для модалки
const modal = document.getElementById('add-contact-modal');
if (modal) {
	modal.addEventListener('shown.bs.modal', function() {
		setTimeout(initModalComponents, 300);
	});
	
	modal.addEventListener('hidden.bs.modal', function() {
		// Очищаємо PhoneInputManager
		if (phoneManager && typeof phoneManager.destroy === 'function') {
			phoneManager.destroy();
			phoneManager = null;
		}
		
		// Очищаємо всі Select2
		const select2Selectors = ['#tags-client-modal', '#type-contact-modal', '#source-contact-modal'];
		select2Selectors.forEach(selector => {
			if ($(selector).data('select2')) {
				$(selector).select2('destroy');
			}
		});
		
		select2Initialized = false;
		console.log('All components destroyed');
	});
}

$('#datapiker-contact-modal').daterangepicker({
	singleDatePicker: true,
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

$('#employee-datapiker').daterangepicker({
	autoUpdateInput: true,
	singleDatePicker: true,
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

// Додаємо CSS виправлення для Select2
const style = document.createElement('style');
style.textContent = `
    .select2-container.select2-dropdown {
        z-index: 1060 !important;
    }
    .modal .select2-container--open {
        z-index: 1060 !important;
    }
    .select2-search__field {
        width: 100% !important;
    }
`;

document.head.appendChild(style);