"use strict";
(function () {
	// $('#example').DataTable({
	// 	"searching": false,
	// 	"ordering": false,
	// 	"processing": false,
	// 	});
	// $('#example2').DataTable({
	// 	"searching": false,
	// 	"ordering": false,
	// 	"processing": false,
	// 	});
	
	$(".js-example-responsive2").select2({
		width: 'resolve',
		placeholder: 'Продаж',
		minimumResultsForSearch: -1,
	});
	$(".js-example-responsive3").select2({
		width: 'resolve',
		placeholder: 'Валюта',
		minimumResultsForSearch: -1,
	});
	
	$(document).ready(function () {
		// код який відповідає за відображення текст по кнопці еще #btn-show-text
		$('#btn-show-text').on('click', function () {
			const container = $(this).closest('.description-text');
			const moreText = container.find('.more-text');
			const mainText = container.contents().filter(function () {
				return this.nodeType === 3;
			});
			
			if (moreText.is(':visible')) {
				moreText.hide();
				mainText.show();
				$(this).text('Ещё');
			} else {
				moreText.show();
				mainText.hide();
				$(this).text('Скрыть');
			}
		});
		// код який відповідає за відображення текст по кнопці еще #btn-show-text
		
		const $cityInput = $('#city');
		const $listCountry = $('#list-country');
		const $listOblast = $('#list-oblast');
		const $listCity = $('#list-city');
		const $listStreet = $('#list-street');
		const $dropMenu = $('.drop-menu');
		
		function hideAllLists() {
			$listCountry.hide();
			$listOblast.hide();
			$listCity.hide();
			$listStreet.hide();
		}
		
		$cityInput.on('input', function () {
			if ($cityInput.val().trim() !== '') {
				$listCountry.show();
				$listOblast.hide();
				$listCity.hide();
				$listStreet.hide();
			} else {
				hideAllLists();
			}
		});
		
		$listCountry.find('input[type="radio"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listOblast.show();
				$listCity.hide();
				$listStreet.hide();
			}
		});
		
		$listOblast.find('input[type="radio"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listCity.show();
				$listStreet.hide();
			}
		});
		
		$listCity.find('input[type="checkbox"]').on('change', function () {
			if ($(this).is(':checked')) {
				$listStreet.show();
			}
		});
		
		$(document).on('click', function (event) {
			if (!$(event.target).closest($dropMenu).length && !$(event.target).is($cityInput)) {
				hideAllLists();
			}
		});
		
		$dropMenu.on('click', function (event) {
			event.stopPropagation();
		});
	});
	$('thead .my-custom-input input').on('change', function () {
		let isChecked = $(this).prop('checked');
		$('tbody .my-custom-input input').prop('checked', isChecked);
	});
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
})();