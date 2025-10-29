// $(document).ready(function () {
// 	// Обробник кліку на кнопку "btn-show-text2" в модальному вікні
// 	$('#info-agent-modal').on('click', '.btn-show-text2', function () {
// 		const button = $(this);
// 		const container = button.closest('.info-user-description-text');
// 		const moreText = container.find('.more-text');
// 		const mainText = container.contents().filter(function () {
// 			return this.nodeType === 3 && $.trim($(this).text()) !== '';
// 		});
//
// 		if (moreText.is(':visible')) {
// 			moreText.hide();
// 			mainText.show();
// 			button.text('Ещё');
// 		} else {
// 			moreText.show();
// 			mainText.hide();
// 			button.text('Скрыть');
// 		}
// 	});
// });

const wrapper = document.querySelector('#example');
let hoverTimeout = null;
let currentElement = null;
let hideTimeout = null;

wrapper.addEventListener('mouseover', (e) => {
	const target = e.target;
	const elem = target.closest('[data-hover-contact-or-agent]');
	
	if (elem) {
		currentElement = elem;
		
		// Очищуємо попередні таймери
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		if (hideTimeout) {
			clearTimeout(hideTimeout);
		}
		
		// Запускаємо новий таймер на 300ms
		hoverTimeout = setTimeout(() => {
			// Перевіряємо, що курсор все ще над цим елементом
			if (currentElement === elem) {
				yourCustomFunction(elem);
			}
		}, 300);
	}
});

wrapper.addEventListener('mouseout', (e) => {
	const target = e.target;
	const elem = target.closest('[data-hover-contact-or-agent]');
	
	if (elem) {
		// Якщо вийшли з елемента - очищуємо таймер і скидаємо поточний елемент
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
		currentElement = null;
		
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
	}, 1000);
}

function yourCustomFunction(element) {
	// Спочатку видаляємо існуючу модалку
	removeModal();
	
	const item = document.createElement('div');
	item.classList.add('modal-content');
	item.classList.add('info-agent-modal');
	item.innerHTML = `<div class="modal-body">
            <div class="modal-body-l d-flex align-items-center mb-0 justify-content-between">
                <h2 class="modal-title" id="exampleInfoAgentModalLabel">
                    <span>Агент</span>
                </h2>
                <button type="button" class="btn-close close-modal-btn" aria-label="Close"></button>
            </div>
            <div class="modal-body-l info-user">
                <div class="info-user-item">
                    <div class="left">
                        <img src="./img/avatar-user.jpg" alt="">
                    </div>
                    <div class="right">
                        <p class="info-user-name">Василий Федотов</p>
                        <p class="info-user-agency">Real Estate Name</p>
                        <p class="info-user-city">Manhattan</p>
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
                <img src="./img/icon/icon-table/viber.svg" alt="">
                </a>
                <a href="https://t.me/+380XXXXXXXXX">
                <img src="./img/icon/icon-table/tg.svg" alt="">
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
                <a class="info-user-email" href="#">email@gmail.com</a>
                </div>
                </div>
                <div class="info-user-item">
                <div class="left">
                <p>Обо мне</p>
                </div>
                <div class="right">
                <p class="info-user-description-text">
                <span class="main-text">Текст небольшой о себе об агенте две строки</span>
                <span class="more-text" style="display: none;">
                Текст небольшой о себе об агенте две строки
                </span>
                <button class="btn btn-show-text2" type="button">Ещё</button>
                </p>
                </div>
                </div>
            </div>
            <div class="modal-body-l mb-0">
            <a class="btn btn-primary" href="#">Открыть профиль</a>
            </div>
        </div>`;
	
	element.parentElement.prepend(item);
	
	// Додаємо обробник події для кнопки закриття
	const closeBtn = item.querySelector('.close-modal-btn');
	if (closeBtn) {
		closeBtn.addEventListener('click', removeModal);
	}
	
	// Додаємо обробник для кнопки "Ещё"
	const showMoreBtn = item.querySelector('.btn-show-text2');
	if (showMoreBtn) {
		showMoreBtn.addEventListener('click', function() {
			const moreText = this.previousElementSibling;
			const mainText = this.parentElement.querySelector('.main-text');
			
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

function removeModal() {
	const existingModal = document.querySelector('.info-agent-modal');
	if (existingModal) {
		existingModal.remove();
	}
	// Очищуємо таймери
	if (hideTimeout) {
		clearTimeout(hideTimeout);
		hideTimeout = null;
	}
	if (hoverTimeout) {
		clearTimeout(hoverTimeout);
		hoverTimeout = null;
	}
	currentElement = null;
}

// Також додаємо обробник для глобального кліку поза модалкою
document.addEventListener('click', (e) => {
	if (!e.target.closest('.info-agent-modal') && !e.target.closest('[data-hover-contact-or-agent]')) {
		removeModal();
	}
});