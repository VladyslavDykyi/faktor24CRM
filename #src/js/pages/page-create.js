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
	
	
	// const apiKey = ``; // заміни своїм ключем
	// const url = 'https://api.openai.com/v1/chat/completions';
	
	
	const fetchGPT = (e) => {
		console.log(e);
		// fetch(url, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Authorization': `Bearer ${apiKey}`,
		// 	},
		// 	body: JSON.stringify({
		// 		model: 'gpt-3.5-turbo', // або 'gpt-4' якщо доступний
		// 		messages: [
		// 			{ role: 'system', content: 'You are a helpful assistant.' },
		// 			{ role: 'user', content: 'Привіт! Як справи?' }
		// 		]
		// 	})
		// })
		// 	.then(res => res.json())
		// 	.then(data =>  console.log(data))
		// 	.catch(error => console.error('Помилка:', error));
	}
	const btn_gpt = document.querySelector('#generation-chat-gpt');
	btn_gpt.addEventListener('click', fetchGPT)
})();