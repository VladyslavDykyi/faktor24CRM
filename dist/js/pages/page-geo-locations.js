'use strict';
(function () {
	$('.geo-locations-header .my-custom-input input').on('change', function() {
		const isChecked = $(this).prop('checked');
		$('.geo-list .my-custom-input input').prop('checked', isChecked);
	});
})();