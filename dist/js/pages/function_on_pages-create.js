"use strict";

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
	
	initImageEditor (imageSrc, photoItem) {
		const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
		
		if ( !document.body.classList.contains('lock')) {
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
		
		const loadingDiv = document.createElement('div');
		loadingDiv.style.position = 'absolute';
		loadingDiv.style.top = '50%';
		loadingDiv.style.left = '50%';
		loadingDiv.style.transform = 'translate(-50%, -50%)';
		loadingDiv.textContent = 'Загрузка редактора...';
		editorContainer.appendChild(loadingDiv);
		
		document.body.appendChild(editorContainer);
		
		// Завантажуємо зображення для отримання розмірів
		const img = new Image();
		img.src = imageSrc;
		
		img.onload = () => {
			try {
				const imageWidth = img.naturalWidth;
				const imageHeight = img.naturalHeight;
				
				// Оптимізований розрахунок розмірів кутів
				const referenceSize = 2000; // Базовий розмір для порівняння
				const maxDimension = Math.max(imageWidth, imageHeight);

// Базові розміри для ПК та мобільних
				const baseDesktopSize = 20;  // Для ПК
				const baseMobileSize = 30;   // Для телефонів (більше, бо пальцями працювати)

// Коефіцієнт масштабування (від 0.5 до 2)
				const scaleFactor = Math.min(2, Math.max(0.5, maxDimension / referenceSize));

// Обмеження розмірів (min/max)
				const desktopLimits = {min: 25, max: 150}; // Для ПК
				const mobileLimits = {min: 55, max: 150};   // Для телефонів

// Фінальний розрахунок
				let cornerSize;
				if (isMobile) {
					cornerSize = Math.min(
						mobileLimits.max,
						Math.max(mobileLimits.min, baseMobileSize * scaleFactor)
					);
				} else {
					cornerSize = Math.min(
						desktopLimits.max,
						Math.max(desktopLimits.min, baseDesktopSize * scaleFactor)
					);
				}

// Розмір кутів для обрізки (у 3 рази більший)
				const cropCornerSize = cornerSize * 3;
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
						menu: isMobile ? ['crop', 'resize', 'rotate'] : ['crop', 'resize', 'rotate', 'filter'],
						initMenu: 'crop',
						uiSize: {
							width: '100%',
							height: '100%'
						},
						menuBarPosition: 'bottom',
					},
					cssMaxWidth: window.innerWidth,
					cssMaxHeight: window.innerHeight,
					selectionStyle: {
						cornerSize: cornerSize,
						rotatingPointOffset: 70,
						cornerStyle: 'circle',
						borderColor: '#3585F5',
						borderWidth: 5,
						cornerColor: '#3585F5',
						transparentCorners: false
					}
				};
				
				// Ініціалізація редактора
				this.imageEditor = new tui.ImageEditor(editorContainer, editorOptions);
				
				// Додаємо кнопки одразу після створення редактора
				this.addEditorButtons(editorContainer, photoItem);
				
				this.imageEditor.on('load', () => {
					editorContainer.removeChild(loadingDiv);
					
					const canvas = this.imageEditor._graphics.getCanvas();
					
					canvas.on('object:scaling', (e) => {
						const obj = e.target;
						if (obj) {
							obj.set({
								cornerSize: cornerSize,
								borderScaleFactor: 1
							});
							obj.setCoords();
						}
					});
					
					canvas.on('selection:created', (e) => {
						if (e.selected && e.selected.length > 0) {
							e.selected.forEach(obj => {
								obj.set({
									cornerSize: cornerSize,
									borderScaleFactor: 1
								});
							});
							canvas.renderAll();
						}
					});
					
					// Налаштування обрізки
					setTimeout(() => {
						this.imageEditor.startDrawingMode('CROPPER');
						
						const width = canvas.width * 0.8;
						const height = canvas.height * 0.8;
						const left = (canvas.width - width) / 2;
						const top = (canvas.height - height) / 2;
						
						this.imageEditor.setCropzoneRect({
							left: left,
							top: top,
							width: width,
							height: height
						});
						
						const cropper = this.imageEditor._graphics._cropper;
						if (cropper) {
							cropper.set({
								borderColor: '#3585F5',
								cornerColor: '#3585F5',
								cornerSize: cropCornerSize,
								transparentCorners: false,
								borderWidth: 5
							});
						}
					}, 300);
					
					
					// Приховуємо непотрібні елементи на мобільних
					if (isMobile) {
						setTimeout(() => {
							document.querySelectorAll('.tui-image-editor-header-logo, .tui-image-editor-range').forEach(el => {
								el.style.display = 'none';
							});
						}, 300);
					}
				});
				
				// Блокуємо співвідношення сторін
				setTimeout(() => {
					const $lockCheckbox = $('.tie-lock-aspect-ratio');
					if ($lockCheckbox.length) $lockCheckbox.trigger('click');
				}, 300);
				if (isMobile) {
					setTimeout(() => {
						const $lockCheckbox = $('.tie-lock-aspect-ratio');
						if ($lockCheckbox.length) {
							$lockCheckbox.trigger('change');
							$('.tie-height-range.tui-image-editor-range, .tie-width-range.tui-image-editor-range, .tie-rotate-range.tui-image-editor-range').hide();
						}
					}, 300);
					
				}
			} catch (error) {
				console.error('Помилка ініціалізації редактора:', error);
				editorContainer.innerHTML = '<div style="color:red;padding:20px;">Помилка завантаження редактора. Спробуйте ще раз.</div>';
			}
		};
		
		img.onerror = () => {
			editorContainer.innerHTML = '<div style="color:red;padding:20px;">Помилка завантаження зображення.</div>';
		};
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

class PhoneInputManager {
	constructor (options) {
		this.options = {...options};
		this.phoneCounter = 1;
		this.btnAddTel = document.querySelector(this.options.btnSelector);
		this.wrapper = document.querySelector(this.options.wrapperSelector);
		
		// Чекаємо повного завантаження DOM
		document.addEventListener('DOMContentLoaded', () => {
			this.init();
		});
	}
	
	init () {
		if ( !this.btnAddTel || !this.wrapper) return;
		
		// Рахуємо початкову кількість телефонів
		this.phoneCounter = this.wrapper.querySelectorAll('[data-phone-item]').length;
		
		this.btnAddTel.addEventListener('click', (e) => this.addPhoneField(e));
		
		// Ініціалізація всіх існуючих полів
		this.wrapper.querySelectorAll('[data-phone-item]').forEach((item, index) => {
			const input = item.querySelector(`.${this.options.inputClass}`);
			if (input) {
				this.initTelInput(input);
				
				// Додаємо кнопку видалення для всіх полів, крім першого
				if (index > 0) {
					this.addDeleteButton(item);
				}
			}
		});
		
		// Перевірка максимальної кількості телефонів
		const currentPhones = this.wrapper.querySelectorAll('[data-phone-item]').length;
		if (currentPhones >= this.options.maxPhones) {
			this.btnAddTel.style.display = 'none';
		}
	}
	
	addPhoneField (e) {
		const currentPhones = this.wrapper.querySelectorAll('[data-phone-item]').length;
		
		if (currentPhones >= this.options.maxPhones) {
			alert(`Максимальна кількість телефонів - ${this.options.maxPhones}`);
			return;
		}
		
		this.phoneCounter++;
		const newItem = this.createPhoneField();
		this.wrapper.querySelector('[data-phone-item]').appendChild(newItem);
		
		this.initTelInput(newItem.querySelector(`.${this.options.inputClass}`));
		this.addDeleteButton(newItem);
		
		if (currentPhones + 1 >= this.options.maxPhones) {
			this.btnAddTel.style.display = 'none';
		}
	}
	
	createPhoneField () {
		const newItem = document.createElement('div');
		newItem.className = 'item';
		newItem.setAttribute('data-phone-item', '');
		newItem.innerHTML = `
            <div class="add_new-tel">
                <button type="button" class="btn btn-new-tel">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.471859 5.47374C0.358138 5.36002 0.28775 5.20285 0.287749 5.0293C0.28775 4.68208 0.569081 4.40075 0.916301 4.40075L9.13847 4.40075C9.48563 4.4008 9.76697 4.68213 9.76702 5.0293C9.76702 5.3764 9.48563 5.65779 9.13853 5.65779H0.916357C0.742747 5.65785 0.585581 5.58746 0.471859 5.47374Z" fill="#3585F5" />
                        <path d="M4.583 9.58476C4.46922 9.47098 4.39889 9.31387 4.39889 9.14032L4.39889 0.918164C4.39883 0.571001 4.68022 0.289614 5.02739 0.28967C5.37449 0.28967 5.65588 0.571056 5.65588 0.918164L5.65588 9.14032C5.65583 9.48748 5.37449 9.76881 5.02733 9.76887C4.85389 9.76887 4.69678 9.69853 4.583 9.58476Z" fill="#3585F5" />
                    </svg>
                </button>
            </div>
            <label for="tel-contact${this.phoneCounter}">Телефон</label>
            <div class="item-inputText-wrapper">
                <input class="item-inputText ${this.options.inputClass}" id="tel-contact${this.phoneCounter}" type="tel" autocomplete="off">
            </div>
        `;
		return newItem;
	}
	
	addDeleteButton (item) {
		const btnContainer = item.querySelector('.add_new-tel');
		const btn = btnContainer.querySelector('.btn-new-tel');
		
		// Змінюємо іконку на "×" (знак закриття)
		btn.innerHTML = `
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.932895 9.93359C0.708205 9.93359 0.483405 9.84787 0.311951 9.67641C-0.0310669 9.3334 -0.0310669 8.77754 0.311951 8.43452L8.43461 0.311868C8.77763 -0.0310395 9.33348 -0.0310395 9.67649 0.311868C10.0194 0.654776 10.0194 1.21074 9.67649 1.55365L1.55384 9.6763C1.38239 9.84787 1.15759 9.93359 0.932895 9.93359Z" fill="#f00" />
                <path d="M9.05555 9.93348C8.83075 9.93348 8.60606 9.84776 8.43461 9.6763L0.311951 1.55365C-0.0310669 1.21074 -0.0310669 0.654776 0.311951 0.311868C0.654859 -0.0310395 1.21082 -0.0310395 1.55373 0.311868L9.67638 8.43452C10.0193 8.77754 10.0193 9.3334 9.67638 9.67641C9.50504 9.84776 9.28035 9.93348 9.05555 9.93348Z" fill="#f00" />
            </svg>
        `;
		
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			this.removePhoneField(item);
		});
	}
	
	removePhoneField (item) {
		item.remove();
		
		// Показуємо кнопку додавання, якщо кількість номерів менше максимальної
		const currentPhones = this.wrapper.querySelectorAll('[data-phones] .item').length;
		if (currentPhones < this.options.maxPhones) {
			this.btnAddTel.style.display = 'block';
		}
		
		// Оновлюємо лічильник
		this.phoneCounter = currentPhones;
	}
	
	initTelInput (inputElement) {
		const $input = $(inputElement);
		
		// Перевіряємо, чи вже ініціалізовано для цього поля
		if (inputElement._iti) {
			return;
		}
		
		const iti = window.intlTelInput(inputElement, {
			initialCountry: this.options.initialCountry,
			utilsScript: this.options.utilsScript,
			separateDialCode: true,
			nationalMode: true,
			autoPlaceholder: "aggressive",
			customPlaceholder: (placeholder, countryData) => {
				return placeholder.replace(/[0-9]/g, '_');
			}
		});
		
		const applyPhoneMask = (countryCode) => {
			const mask = this.options.countryMasks[countryCode] || this.options.countryMasks['default'];
			$input.unmask().mask(mask, {
				clearIfNotMatch: true
			});
			
			// Якщо в полі вже є значення, застосовуємо маску
			if ($input.val()) {
				$input.trigger('input');
			}
		};
		
		$input.on('countrychange', () => {
			applyPhoneMask(iti.getSelectedCountryData().iso2);
		});
		
		$input.on('keypress', (e) => {
			if ( !/[0-9]/.test(String.fromCharCode(e.which))) {
				e.preventDefault();
			}
		});
		
		$input.on('blur', () => {
			if ($input.val()) {
				const number = iti.getNumber();
				if (number) {
					$input.val(number.replace(/[^\d]/g, ''));
				}
			}
		});
		
		// Застосовуємо маску відразу при ініціалізації
		applyPhoneMask(iti.getSelectedCountryData().iso2);
		
		// Додатковий тригер для гарантії застосування маски
		setTimeout(() => {
			$input.trigger('countrychange');
		}, 100);
	}
}

class RealEstateDescriptionGenerator {
	constructor (apiKey, options) {
		// Обов'язковий API ключ
		this.apiKey = apiKey;
		
		// Об'єднання налаштувань
		this.options = {...options};
		
		// DOM елементи
		this.btnElement = document.querySelector(this.options.btnSelector);
		
		// Ініціалізація
		this.init();
	}
	
	init () {
		if ( !this.btnElement) {
			console.error('Не знайдено кнопку генерації');
			return;
		}
		
		this.btnElement.addEventListener('click', (e) => this.generateDescription(e));
	}
	
	// Генеруємо опис нерухомості
	async generateDescription (e) {
		e.preventDefault();
		
		if ( !this.apiKey) {
			console.error('API ключ не вказано');
			return;
		}
		
		try {
			const prompt = this.buildPrompt();
			const response = await this.fetchGPTResponse(prompt);
			
			if (response) {
				this.updateTextareas(response);
			}
		} catch (error) {
			console.error('Помилка генерації опису:', error);
		}
	}
	
	// Формуємо запит до GPT
	buildPrompt () {
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
		
		// Отримуємо чисті значення без міток
		const getCleanValue = (field) => {
			if ( !obj_gpt[field]) return null;
			return obj_gpt[field].split(':').slice(1).join(':').trim();
		};
		
		// Фільтруємо заповнені поля
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
		return `Згенеруй привабливий опис для оголошення нерухомості мінімум на ${this.options.minWords} слів
      українською мовою, російською, англійською. Розділи ці 3 переклади через коди мов ua,ru,en. Ось дані об'єкта:
      ${filledFields.map(([key, value]) => `- ${key}: ${value}`).join('\n')}`;
	}
	
	// Відправляємо запит до GPT API
	async fetchGPTResponse (prompt) {
		const url = 'https://api.openai.com/v1/chat/completions';
		
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				model: this.options.model,
				messages: [
					{role: 'user', content: prompt}
				],
				temperature: this.options.temperature
			})
		});
		
		if ( !response.ok) {
			throw new Error(`HTTP помилка! Статус: ${response.status}`);
		}
		
		const data = await response.json();
		return data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
	}
	
	// Оновлюємо текстові поля з перекладами
	updateTextareas (text) {
		const translations = this.parseTranslations(text);
		const textareas = document.querySelectorAll(this.options.textareaSelector);
		
		textareas.forEach(textarea => {
			const lang = textarea.dataset.textareaLang;
			if (translations[lang]) {
				textarea.value = translations[lang];
			}
		});
	}
	
	// Парсимо відповідь GPT на окремі переклади
	parseTranslations (text) {
		const splitText = text.trim().split('\n\n');
		const texts = {};
		
		splitText.forEach(block => {
			const [langPart, ...contentParts] = block.split(':');
			const lang = langPart.trim();
			const content = contentParts.join(':').trim();
			
			if (this.options.languages.includes(lang)) {
				texts[lang] = content;
			}
		});
		
		return texts;
	}
}

class GoogleMapsManager {
	constructor () {
		this.map = null;
		this.marker = null;
		this.geocoder = null;
		this.autocomplete = null;
		this.googleMapsAPILoaded = false;
		this.scriptLoaded = false;
	}
	
	// Load Google Maps API
	loadAPI () {
		return new Promise((resolve, reject) => {
			if (this.googleMapsAPILoaded) {
				resolve();
				return;
			}
			
			if (typeof google !== 'undefined' && google.maps) {
				this.googleMapsAPILoaded = true;
				resolve();
				return;
			}
			
			if (this.scriptLoaded) {
				// If script is already loaded but callback hasn't fired yet
				const checkInterval = setInterval(() => {
					if (this.googleMapsAPILoaded) {
						clearInterval(checkInterval);
						resolve();
					}
				}, 100);
				return;
			}
			
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB-JxH1yXZg7DPInjpOmGFMvCNX5vFPzkg&loading=async&libraries=places,marker&callback=onGoogleMapsAPILoaded`;
			script.async = true;
			script.defer = true;
			script.onerror = () => {
				this.scriptLoaded = false;
				reject(new Error('Failed to load Google Maps API'));
			};
			document.head.appendChild(script);
			this.scriptLoaded = true;
			
			window.onGoogleMapsAPILoaded = () => {
				this.googleMapsAPILoaded = true;
				resolve();
			};
		});
	}
	
	// Initialize the map
	initializeMap (containerId) {
		try {
			if ( !this.googleMapsAPILoaded || !google.maps || !google.maps.Map || !google.maps.marker) {
				throw new Error('Google Maps API not loaded correctly');
			}
			
			const {AdvancedMarkerElement} = google.maps.marker;
			
			// Create map
			this.map = new google.maps.Map(document.getElementById(containerId), {
				center: {lat: 50.4501, lng: 30.5234},
				zoom: 12,
				mapId: 'YOUR_MAP_ID',
				streetViewControl: false,
				mapTypeControl: false
			});
			
			this.geocoder = new google.maps.Geocoder();
			
			// Create marker
			this.marker = new AdvancedMarkerElement({
				map: this.map,
				position: this.map.getCenter(),
				gmpDraggable: false
			});
			
			// Add map center change listener
			this.map.addListener('center_changed', () => {
				const newCenter = this.map.getCenter();
				this.marker.position = newCenter;
				this.updateAddressFromLocation(newCenter);
			});
			
			// Add idle listener
			this.map.addListener('idle', () => {
				const center = this.map.getCenter();
				this.updateFormFields(center);
			});
			
			// Initialize autocomplete
			this.initAutocomplete();
		} catch (error) {
			console.error('Map initialization error:', error);
			throw error;
		}
	}
	
	// Initialize address autocomplete
	initAutocomplete () {
		try {
			this.autocomplete = new google.maps.places.Autocomplete(
				document.getElementById('address'),
				{
					types: ['geocode'],
					fields: ['geometry', 'formatted_address']
				}
			);
			
			this.autocomplete.addListener('place_changed', () => {
				const place = this.autocomplete.getPlace();
				if ( !place.geometry) {
					alert("Place not found: '" + place.name + "'");
					return;
				}
				
				this.map.setCenter(place.geometry.location);
				if (place.geometry.viewport) {
					this.map.fitBounds(place.geometry.viewport);
				} else {
					this.map.setZoom(17);
				}
			});
		} catch (error) {
			console.error('Autocomplete initialization error:', error);
			throw error;
		}
	}
	
	// Update address from location
	updateAddressFromLocation (location) {
		this.geocoder.geocode({'location': location}, (results, status) => {
			if (status === 'OK' && results[0]) {
				$('#address').val(results[0].formatted_address);
			}
		});
	}
	
	// Update form fields with coordinates
	updateFormFields (latLng) {
		$('#latitude').val(latLng.lat().toFixed(6));
		$('#longitude').val(latLng.lng().toFixed(6));
		this.updateAddressFromLocation(latLng);
	}
	
	// Clear form fields
	clearFields () {
		$('#address, #latitude, #longitude').val('');
	}
}

class RowManager {
	constructor (options) {
		this.options = {
			addBtnSelector: '.btn-primary',
			rowSelector: '.create-filter-row',
			rowContainerSelector: '.create-filter-container', // Додайте цей контейнер у ваш HTML
			...options
		};
		this.rowCounter = 1;
		this.init();
	}
	
	init () {
		// Знаходимо всі існуючі рядки для підрахунку
		const existingRows = document.querySelectorAll(this.options.rowSelector);
		this.rowCounter = existingRows.length;
		
		// Додаємо обробник кліку на кнопку додавання у першому рядку
		const addBtn = document.querySelector(this.options.addBtnSelector);
		if (addBtn) {
			addBtn.addEventListener('click', () => this.addNewRow());
		}
		
		// Додаємо кнопки видалення до всіх рядків, крім першого
		existingRows.forEach((row, index) => {
			if (index > 0) {
				this.addDeleteButton(row);
			}
		});
	}
	
	addNewRow () {
		this.rowCounter++;
		const newRow = this.createNewRow();
		const container = document.querySelector(this.options.rowContainerSelector) ||
			(document.querySelector(this.options.rowSelector) &&
				document.querySelector(this.options.rowSelector).parentElement);
		
		if (container) {
			container.appendChild(newRow);
			this.initSelect2(newRow);
		}
	}
	
	createNewRow () {
		const newRow = document.createElement('div');
		newRow.className = 'create-filter-row row2';
		newRow.innerHTML = `
      <div class="item size-btn">
        <button class="btn btn-danger btn-remove" type="button">
         <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		   <path d="M2.62231 9.62222C2.4631 9.46301 2.36455 9.24298 2.36455 9C2.36455 8.51389 2.75842 8.12003 3.24453 8.12003L14.7556 8.12003C15.2416 8.12011 15.6355 8.51397 15.6356 9C15.6356 9.48595 15.2416 9.87989 14.7557 9.87989L3.24461 9.87989C3.00155 9.87997 2.78152 9.78143 2.62231 9.62222Z" fill="#fff" />
		 </svg>
        </button>
      </div>
      <div class="item size-1-2">
        <span>
          <label class="item-label" for="counter-section-${this.rowCounter}">Секция</label>
        </span>
        <input class="item-inputText" id="counter-section-${this.rowCounter}" type="text" autocomplete="off">
      </div>
      <div class="item selects">
        <label class="item-label" for="counter-street-${this.rowCounter}">Улица</label>
        <select id="counter-street-${this.rowCounter}" class="js-example-responsive3 my-select2" autocomplete="off">
          <option value=""></option>
          <option value="company">Тенистая</option>
        </select>
      </div>
      <div class="item size0-5">
        <span>
          <label class="item-label" for="counter-number-house-${this.rowCounter}">№ Дом</label>
        </span>
        <input class="item-inputText" id="counter-number-house-${this.rowCounter}" type="text" autocomplete="off">
      </div>
      <div class="item size0-5">
        <span>
          <label class="item-label" for="counter-floor-${this.rowCounter}">Этажн.</label>
        </span>
        <input class="item-inputText" id="counter-floor-${this.rowCounter}" type="text" autocomplete="off">
      </div>
      <div class="item selects size0-5">
        <label class="item-label" for="years-building-${this.rowCounter}">Год</label>
        <select id="years-building-${this.rowCounter}" class="js-example-responsive3 my-select2" autocomplete="off">
          <option value=""></option>
          <option value="brick">2030</option>
        </select>
      </div>
      <div class="item selects">
        <label class="item-label" for="heating-${this.rowCounter}">Отопление</label>
        <select id="heating-${this.rowCounter}" class="js-example-responsive3 my-select2" autocomplete="off">
          <option value=""></option>
          <option value="brick">Централизованное</option>
        </select>
      </div>
      <div class="item selects">
        <label class="item-label" for="wall-type-${this.rowCounter}">Тип стен</label>
        <select id="wall-type-${this.rowCounter}" class="js-example-responsive3 my-select2" autocomplete="off">
          <option value=""></option>
          <option value="brick">Кирпич</option>
        </select>
      </div>
    `;
		
		this.addDeleteButton(newRow);
		return newRow;
	}
	
	addDeleteButton (row) {
		const btn = row.querySelector('.btn-remove');
		if (btn) {
			btn.addEventListener('click', () => {
				row.remove();
				this.rowCounter--;
			});
		}
	}
	
	initSelect2 (row) {
		if (typeof jQuery !== 'undefined' && jQuery.fn.select2) {
			row.querySelectorAll('.my-select2').forEach(select => {
				if ( !jQuery(select).data('select2')) {
					jQuery(select).select2({
						width: 'resolve',
					});
				}
			});
		}
	}
}

export {FileUploader, PhotoLoader, PhoneInputManager, RealEstateDescriptionGenerator, GoogleMapsManager, RowManager};