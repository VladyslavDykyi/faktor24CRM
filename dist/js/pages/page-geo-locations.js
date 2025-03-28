'use strict';
(function () {
	$('.geo-locations-header .my-custom-input input, .geo-list .my-custom-input input').on('change', function() {
		const $this = $(this);
		
		if ($this.parents('.geo-locations-header').length) {
			$('.geo-list .my-custom-input input').prop('checked', $this.prop('checked'));
		} else {
			const total = $('.geo-list .my-custom-input input').length;
			$('.geo-locations-header .my-custom-input input')
				.prop('checked', $('.geo-list .my-custom-input input:checked').length === total);
		}
	});
})();