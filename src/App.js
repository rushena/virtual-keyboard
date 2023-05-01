import data from './data.js';

export default class App {
	constructor($app) {
		this.$app = $app;
		this.lang = window.localStorage.getItem('ui_lang') || 'lang1';
		this.data = data;
		this.dataObj = {};

		this.init();
	}

	init() {
		this.$app.append(this.createTextarea());
		this.$app.append(this.createKeyboard());
	}

	changeLang() {
		this.lang = this.lang === 'lang1' ? 'lang2' : 'lang1'
		window.localStorage.setItem('ui_lang', this.lang);
		document.dispatchEvent(new Event('changeLang'))
	}

	createTextarea () {
		this.$textarea = this.createElement('textarea', ['app__textarea'], {cols: 30, rows: 10});
		const $textareaBox = this.createElement('div', ['app__textarea-wrapper']);

		$textareaBox.append(this.$textarea);

		return $textareaBox;
	}

	createKeyboard() {
		const $keyboardBox = this.createElement('div', ['app__keyboard']);

		this.data.forEach(item => {
			const $button = this.createButton(item);
			$keyboardBox.append($button);

			this.dataObj[item.code] = item;

			this.dataObj[item.code]['html'] = $button;
		});

		console.log(this.dataObj);

		return $keyboardBox;
	}

	createButton(data) {
		const self = this;
		const $button = this.createElement('button', ['app__button'], {
			'data-id': data.id,
			'data-code': data.code,
			'data-which': data.which
		});
		let $span1, $span2;

		$span1 = this.createElement('span', [], {}, data.firstValue[self.lang]);
		$button.append($span1);

		$button.addEventListener('mousedown', (e) => {
			$button.classList.add('active')
		});

		$button.addEventListener('mouseup', (e) => {
			$button.classList.remove('active')
		});

		if (data.secondValue) {
			$span2 = this.createElement('span', [], {}, data.secondValue[self.lang]);
			$button.append($span2);
		}

		document.addEventListener('changeLang', function() {
			$span1.innerText = data.firstValue[self.lang];
			if (data.secondValue) {
				$span2.innerText = data.secondValue[self.lang]
			}
		})

		return $button;
	}

	onKeydown(data) {
		console.log(data);
		this.dataObj[data.code].html.classList.add('active');

		if (data.ctrlKey && data.altKey) {
			this.changeLang();
		}
	}

	onKeyup(data) {
		this.dataObj[data.code].html.classList.remove('active');
	}

	createElement(elem = 'div', className = [], options = {}, text) {
		const $elem = document.createElement(elem);
		className.forEach(item => $elem.classList.add(item));

		Object.keys(options).forEach(item => {
			$elem.setAttribute(item, options[item]);
		});

		if (text) $elem.innerText = text;

		return $elem;
	}
}