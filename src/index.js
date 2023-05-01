import App from './App.js';

const $box = document.createElement('div');
$box.classList.add('app');

const app = new App($box);

document.body.append($box);

document.addEventListener('keydown', (e) => {
	e.preventDefault();
	app.onKeydown(e);
});

document.addEventListener('keyup', (e) => {
	e.preventDefault();
	app.onKeyup(e);
});

document.querySelector('[data-code="switchLang"]').addEventListener('click', function() {
	app.changeLang();
})

// https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO28X2C9L7GNMkji7PZ-wsRA2Bk9pwyHwRtIqJiqDzjA&s - раскладка клавиатуры, которая была взята за основу