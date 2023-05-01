import data from './data.js';

export default class App {
	constructor($app) {
		this.$app = $app;
		this.lang = window.localStorage.getItem('ui_lang') || 'lang1';
		this.data = data;
		this.dataObj = {};
		this.systemsButton = [17, 999, 18, 91, 93];
		this.shiftOn = false;
		this.capsLockOn = false;

		this.init();
	}

	init() {
		this.$app.append(this.createTextarea());
		this.$app.append(this.createKeyboard());
		this.$app.append(this.createNote());
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
			$button.classList.add('active');
			if (!this.switchCapsOrShift(data.which)) {
				this.setNewValue(data);
			}
		});

		$button.addEventListener('mouseup', (e) => {
			$button.classList.remove('active');
			this.switchCapsOrShift(data.which);
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

	createNote() {
		return this.createElement('div', ['app__note'], {}, 'Клавиатура создана в операционной системе Windows\nДля переключения языка комбинация: левыe ctrl + alt')
	}

	onKeydown(data) {
		const buttonObj = this.dataObj[data.code];
		buttonObj.html.classList.add('active');

		if (data.ctrlKey && data.altKey) {
			this.changeLang();
		} else if (!this.switchCapsOrShift(buttonObj.which)) {
			this.setNewValue(buttonObj)
		}
	}

	onKeyup(data) {
		const buttonObj = this.dataObj[data.code];
		buttonObj.html.classList.remove('active');

		this.switchCapsOrShift(buttonObj.which);
	}

	setNewValue(data) {
		if (this.systemsButton.includes(data.which)) return;
		const textValue = this.$textarea.value;
		const cursorPosition = this.$textarea.selectionStart;
		let leftText = textValue.slice(0, cursorPosition);
		let rightText = textValue.slice(cursorPosition);

		if (data.which === 8) {
			if (leftText === '') return;
			this.updateTextInTtextarea(leftText.slice(0, -1) + rightText, cursorPosition - 1);
			return;
		}

		if (data.which === 46) {
			if (rightText === '') return;
			this.updateTextInTtextarea(leftText + rightText.slice(1), cursorPosition);
			return;
		}

		if (data.which === 9) {
			this.updateTextInTtextarea(leftText + '    ' + rightText, cursorPosition + 4);
			return;
		}

		if (data.which === 13) {
			this.updateTextInTtextarea(leftText + '\n' + rightText, cursorPosition + 1);
			return;
		}

		if (data.which === 32) {
			this.updateTextInTtextarea(leftText + ' ' + rightText, cursorPosition + 1);
			return;
		}

		let newSymbol;

		if (this.shiftOn) {
			newSymbol = data.secondValue ? data.secondValue[this.lang] : (data.firstValue[this.lang]).toUpperCase();
		} else {
			newSymbol = (data.firstValue[this.lang]).toLowerCase();
		}

		if (this.capsLockOn) {
			newSymbol = newSymbol.toUpperCase();
		}

		this.updateTextInTtextarea(leftText + newSymbol + rightText, cursorPosition + 1);
	}

	updateTextInTtextarea(text, newPosition) {
		this.$textarea.value = text;
		this.$textarea.focus();
		this.$textarea.selectionStart = newPosition;
		this.$textarea.selectionEnd = newPosition;
	}

	switchCapsOrShift(code) {
		if (code === 16) {
			this.shiftOn = !this.shiftOn;
			return true
		} else if (code === 20) {
			this.capsLockOn = !this.capsLockOn;
			return true;
		}

		return false;
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