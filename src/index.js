import data from './data.js';

console.log('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO28X2C9L7GNMkji7PZ-wsRA2Bk9pwyHwRtIqJiqDzjA&s')

const $letterBox = document.querySelector('.app__keyboard');

data.forEach(item => {
	const $button = document.createElement('button');
	$button.classList.add('app__button');
	$button.dataset.id = item.id
	const $span1 = document.createElement('span');
	$span1.innerText = item.firstValue.lang1;
	$button.append($span1);

	if (item.secondValue) {
		const $span2 = document.createElement('span');
		$span2.innerText = item.secondValue.lang1;
		$button.append($span2);
	}

	$letterBox.append($button);

});