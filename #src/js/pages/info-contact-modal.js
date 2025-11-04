"use strict";
(()=>{
const wrapper = document.querySelector('#example');
let hoverTimeout = null;
let currentElement = null;
let hideTimeout = null;
let isModalVisible = false;

wrapper.addEventListener('mouseover', (e) => {
	const target = e.target;
	const elem = target.closest('[data-hover-contact]');
	
	if (elem) {
		// Очищуємо попередні таймери
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		
		// Запускаємо новий таймер на 300ms
		hoverTimeout = setTimeout(() => {
			// Якщо це новий елемент - прибираємо підкреслення з попереднього
			if (currentElement && currentElement !== elem) {
				currentElement.style.textDecoration = '';
			}
			
			currentElement = elem;
			
			// Додаємо підкреслення новому елементу
			elem.style.textDecoration = 'underline';
			
			// Відкриваємо модалку
			yourCustomFunction(elem);
		}, 300);
	}
});

wrapper.addEventListener('mouseout', (e) => {
	const target = e.target;
	const elem = target.closest('[data-hover-contact]');
	
	if (elem) {
		// Очищуємо таймер ховера
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
		
		// Запускаємо таймер для приховання модалки через 1000ms
		startHideTimer();
	}
});

// Додаємо обробники для модального вікна
document.addEventListener('mouseover', (e) => {
	const modal = e.target.closest('.info-agent-modal');
	if (modal) {
		// Якщо курсор над модалкою - очищуємо таймер приховання
		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}
	}
});

document.addEventListener('mouseout', (e) => {
	const modal = e.target.closest('.info-agent-modal');
	if (modal) {
		// Якщо вийшли з модалки - запускаємо таймер приховання
		startHideTimer();
	}
});

function startHideTimer() {
	if (hideTimeout) {
		clearTimeout(hideTimeout);
	}
	hideTimeout = setTimeout(() => {
		removeModal();
		removeTextDecoration();
	}, 1000);
}

function yourCustomFunction(element) {
	// Закриваємо попередню модалку перед відкриттям нової
	removeModal();
	
	const item = document.createElement('div');
	item.classList.add('modal-content');
	item.classList.add('info-agent-modal');
	item.innerHTML = `
<div class="modal-body">
<div class="modal-body-l d-flex align-items-center mb-0">
<h2 class="modal-title" id="exampleInfoContactModalLabel">
<span>Контакт</span>
</h2>
<a class="btn btn-icon ms-2 me-auto p-0 border-0" href="#">
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 10.6705H4.82667C4.9144 10.671 5.00138 10.6542 5.0826 10.621C5.16383 10.5879 5.23771 10.539 5.3 10.4772L9.91333 5.8572L11.8067 4.00387C11.8692 3.94189 11.9187 3.86816 11.9526 3.78692C11.9864 3.70568 12.0039 3.61854 12.0039 3.53053C12.0039 3.44252 11.9864 3.35539 11.9526 3.27415C11.9187 3.19291 11.8692 3.11917 11.8067 3.0572L8.98 0.197199C8.91802 0.134713 8.84429 0.0851171 8.76305 0.0512713C8.68181 0.0174255 8.59467 0 8.50667 0C8.41866 0 8.33152 0.0174255 8.25028 0.0512713C8.16904 0.0851171 8.09531 0.134713 8.03333 0.197199L6.15333 2.08387L1.52667 6.70387C1.46488 6.76616 1.416 6.84004 1.38282 6.92126C1.34964 7.00249 1.33283 7.08946 1.33333 7.1772V10.0039C1.33333 10.1807 1.40357 10.3502 1.5286 10.4753C1.65362 10.6003 1.82319 10.6705 2 10.6705ZM8.50667 1.61053L10.3933 3.4972L9.44667 4.44387L7.56 2.5572L8.50667 1.61053ZM2.66667 7.45053L6.62 3.4972L8.50667 5.38387L4.55333 9.3372H2.66667V7.45053ZM12.6667 12.0039H0.666667C0.489856 12.0039 0.320286 12.0741 0.195262 12.1991C0.0702379 12.3242 0 12.4937 0 12.6705C0 12.8473 0.0702379 13.0169 0.195262 13.1419C0.320286 13.267 0.489856 13.3372 0.666667 13.3372H12.6667C12.8435 13.3372 13.013 13.267 13.1381 13.1419C13.2631 13.0169 13.3333 12.8473 13.3333 12.6705C13.3333 12.4937 13.2631 12.3242 13.1381 12.1991C13.013 12.0741 12.8435 12.0039 12.6667 12.0039Z" fill="#AAAAAA" />
</svg>
</a>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body-l info-user">
<div class="left">
<div class="info-user-item">
<div class="left">
<img src="./img/avatar-user.jpg" alt="">
</div>
<div class="right">
<p class="info-user-name">Василий Федотов</p>
<p class="info-user-type">Продавец, Покупатель, Арендодатель</p>
<a class="info-user-chat" href="#">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
<path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
<path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
</svg>
</a>
</div>
</div>
<div class="info-user-item">
<div class="left">
<p>Телефон</p>
</div>
<div class="right">
<a class="info-user-phone" href="tel:+381231257869">+38 (123) 125 - 78 - 69</a>
<a class="info-user-phone" href="tel:+381231257869">+38 (123) 125 - 78 - 69</a>
<div class="info-user-socList">
<a href="https://wa.me/380XXXXXXXXX">
<img src="./img/icon/icon-table/cnapchat.svg" alt="">
</a>
<a href="viber://chat?number=%2B380XXXXXXXXX">
<img src="./img/icon/icon-table/viber.svg" alt="">
</a>
<a href="https://t.me/+380XXXXXXXXX">
<img src="./img/icon/icon-table/tg.svg" alt="">
</a>
<a href="#">
<img src="./img/icon/icon-table/instagram.svg" alt="">
</a>
<a href="#">
<img src="./img/icon/icon-table/facebook.svg" alt="">
</a>
<a href="#">
<img src="./img/icon/icon-table/tiktok.svg" alt="">
</a>
</div>
</div>
</div>
<div class="info-user-item">
<div class="left">
<p>Email</p>
</div>
<div class="right">
<a class="info-user-email" href="mailto:email@gmail.com">email@gmail.com</a>
</div>
</div>
<div class="info-user-tagList">
<div class="info-user-tagList-item">
Тег
</div>
<div class="info-user-tagList-item">
ТегТегТег
</div>
<div class="info-user-tagList-item">
ТегТегТе гТегТег
</div>
</div>
</div>
</div>
<div class="modal-body-l mb-0">
<a class="btn btn-primary" href="#">Создать сделку</a>
<a class="btn btn-outline-primary" href="#">Добавить задачу</a>
<a class="btn btn-outline-primary" href="#">Добавить объект</a>
</div>
</div>`;
	
	// Додаємо модалку в body для коректного позиціонування
	document.body.appendChild(item);
	
	// Розраховуємо позицію попапу
	calculatePopupPosition(item, element);
	
	// Встановлюємо прапорець, що модалка відкрита
	isModalVisible = true;
	
	// Додаємо обробник події для кнопки закриття
	const closeBtn = item.querySelector('.close-modal-btn');
	if (closeBtn) {
		closeBtn.addEventListener('click',  ()=>{
			removeTextDecoration();
			removeModal ();
		});
	}
	
	// Додаємо обробник для кнопки "Ещё"
	const showMoreBtn = item.querySelector('.btn-show-text2');
	if (showMoreBtn) {
		showMoreBtn.addEventListener('click', function() {
			const descriptionText = this.closest('.info-user-description-text');
			const moreText = descriptionText.querySelector('.more-text');
			const mainText = descriptionText.querySelector('.main-text');
			
			if (moreText.style.display === 'none') {
				moreText.style.display = 'inline';
				mainText.style.display = 'none';
				this.textContent = 'Скрыть';
			} else {
				moreText.style.display = 'none';
				mainText.style.display = 'inline';
				this.textContent = 'Ещё';
			}
		});
	}
}

function calculatePopupPosition(popup, triggerElement) {
	// Отримуємо розміри та позицію елемента
	const triggerRect = triggerElement.getBoundingClientRect();
	
	// Отримуємо розміри вікна
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;
	
	// Відстань від краю
	const offset = 20;
	
	// Скидаємо стилі
	popup.style.top = '';
	popup.style.bottom = '';
	popup.style.right = '';
	popup.style.left = '';
	popup.style.transform = '';
	
	// Встановлюємо базові стилі
	popup.style.position = 'fixed';
	popup.style.zIndex = '9999';
	popup.style.width = '340px';
	popup.style.padding = '16px';
	popup.style.boxShadow = '0 0 4px 0 #aaa';
	popup.style.borderRadius = '8px';
	popup.style.backgroundColor = 'white';
	
	// Отримуємо розміри попапу після встановлення ширини
	const popupRect = popup.getBoundingClientRect();
	
	// Визначаємо оптимальну позицію праворуч від елемента
	let leftPosition = triggerRect.right + offset;
	let topPosition = triggerRect.top;
	
	// Перевіряємо, чи поміщається праворуч
	if (leftPosition + popupRect.width > windowWidth) {
		// Якщо не поміщається праворуч - розміщуємо зліва
		leftPosition = triggerRect.left - popupRect.width;
	}
	
	// Перевіряємо вертикальне розміщення
	if (topPosition + popupRect.height > windowHeight) {
		// Якщо не поміщається знизу - зміщуємо вище
		topPosition = windowHeight - popupRect.height - offset;
	} else if (topPosition < offset) {
		// Якщо занадто високо - зміщуємо нижче
		topPosition = offset;
	}
	
	// Встановлюємо позицію
	popup.style.left = leftPosition + 'px';
	popup.style.top = topPosition + 'px';
}

function removeModal() {
	const existingModal = document.querySelector('.info-agent-modal');
	if (existingModal) {
		existingModal.remove();
	}
	
	// Скидаємо прапорець, що модалка закрита
	isModalVisible = false;
	
	// Очищуємо таймери
	if (hideTimeout) {
		clearTimeout(hideTimeout);
		hideTimeout = null;
	}
	if (hoverTimeout) {
		clearTimeout(hoverTimeout);
		hoverTimeout = null;
	}
}

function removeTextDecoration() {
	// Прибираємо підкреслення з поточного елемента при закритті модалки
	if (currentElement) {
		currentElement.style.textDecoration = '';
		currentElement = null;
	}
}

// Також додаємо обробник для глобального кліку поза модалкою
document.addEventListener('click', (e) => {
	if (!e.target.closest('.info-agent-modal') && !e.target.closest('[data-hover-contact-or-agent]')) {
		removeModal();
		removeTextDecoration();
	}
});

// Оновлюємо позицію при зміні розміру вікна
window.addEventListener('resize', () => {
	const existingModal = document.querySelector('.info-agent-modal');
	const triggerElement = currentElement;
	
	if (existingModal && triggerElement) {
		calculatePopupPosition(existingModal, triggerElement);
	}
});

// Оновлюємо позицію при скролі
window.addEventListener('scroll', () => {
	const existingModal = document.querySelector('.info-agent-modal');
	const triggerElement = currentElement;
	
	if (existingModal && triggerElement) {
		calculatePopupPosition(existingModal, triggerElement);
	}
});
})();