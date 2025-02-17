"use strict";
(function (){
	new DataTable('#example');
	
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
	
	$(document).ready(function() {
		const $cityInput = $('#city');
		const $listCountry = $('#list-country');
		const $listOblast = $('#list-oblast');
		const $listCity = $('#list-city');
		const $listStreet = $('#list-street');
		
		$cityInput.on('input', function() {
			if ($cityInput.val().trim() !== '') {
				$listCountry.show();
				$listOblast.hide();
				$listCity.hide();
				$listStreet.hide();
			} else {
				$listCountry.hide();
			}
		});
		
		$listCountry.find('input[type="radio"]').on('change', function() {
			if ($(this).is(':checked')) {
				$listOblast.show();
				$listCity.hide();
				$listStreet.hide();
			}
		});
		
		$listOblast.find('input[type="radio"]').on('change', function() {
			if ($(this).is(':checked')) {
				$listCity.show();
				$listStreet.hide();
			}
		});
		
		$listCity.find('input[type="checkbox"]').on('change', function() {
			if ($(this).is(':checked')) {
				$listStreet.show();
			}
		});
	});
	
})();