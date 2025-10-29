$(document).ready(function () {
	// Обробник кліку на кнопку "btn-show-text2" в модальному вікні
	$('#info-agent-modal').on('click', '.btn-show-text2', function () {
		const button = $(this);
		const container = button.closest('.info-user-description-text');
		const moreText = container.find('.more-text');
		const mainText = container.contents().filter(function () {
			return this.nodeType === 3 && $.trim($(this).text()) !== '';
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
});