import data from './data';

export default class App {
  constructor($app) {
    this.$app = $app;
    this.lang = window.localStorage.getItem('ui_lang') || 'lang1';
    this.data = data;
    this.dataObj = {};
    this.systemsButton = [17, 999, 18, 91, 93];
    this.shiftOn = false;
    this.capsLockOn = false;

    this.addAppElement = (elem = 'div', className = [], options = {}, text = '') => {
      const $elem = document.createElement(elem);
      className.forEach((item) => $elem.classList.add(item));

      Object.keys(options).forEach((item) => {
        $elem.setAttribute(item, options[item]);
      });

      if (text) $elem.innerText = text;

      return $elem;
    };

    this.init();
  }

  init() {
    this.$app.append(this.createTextarea());
    this.$app.append(this.createKeyboard());
    this.$app.append(this.createNote());
  }

  changeLang() {
    this.lang = this.lang === 'lang1' ? 'lang2' : 'lang1';
    window.localStorage.setItem('ui_lang', this.lang);
    document.dispatchEvent(new Event('changeLang'));
  }

  createTextarea() {
    this.$textarea = this.addAppElement('textarea', ['app__textarea'], { cols: 30, rows: 10 });
    const $textareaBox = this.addAppElement('div', ['app__textarea-wrapper']);

    $textareaBox.append(this.$textarea);

    return $textareaBox;
  }

  createKeyboard() {
    const $keyboardBox = this.addAppElement('div', ['app__keyboard']);

    this.data.forEach((item) => {
      const $button = this.createButton(item);
      $keyboardBox.append($button);

      this.dataObj[item.code] = item;

      this.dataObj[item.code].html = $button;
    });

    return $keyboardBox;
  }

  createButton(buttonData) {
    const self = this;
    const $button = this.addAppElement('button', ['app__button'], {
      'data-id': buttonData.id,
      'data-code': buttonData.code,
      'data-which': buttonData.which,
    });

    let $span2;

    const $span1 = this.addAppElement('span', [], {}, buttonData.firstValue[self.lang]);
    $button.append($span1);

    $button.addEventListener('mousedown', () => {
      $button.classList.add('active');
      if (!this.switchCapsOrShift(buttonData.which)) {
        this.setNewValue(buttonData);
      }
    });

    $button.addEventListener('mouseup', () => {
      $button.classList.remove('active');
      this.switchCapsOrShift(buttonData.which);
    });

    if (buttonData.secondValue) {
      $span2 = this.addAppElement('span', [], {}, buttonData.secondValue[self.lang]);
      $button.append($span2);
    }

    document.addEventListener('changeLang', () => {
      $span1.innerText = buttonData.firstValue[self.lang];
      if (buttonData.secondValue) {
        $span2.innerText = buttonData.secondValue[self.lang];
      }
    });

    return $button;
  }

  createNote() {
    return this.addAppElement('div', ['app__note'], {}, 'Клавиатура создана в операционной системе Windows\nДля переключения языка комбинация: левыe ctrl + alt');
  }

  onKeydown(event) {
    const buttonObj = this.dataObj[event.code];
    buttonObj.html.classList.add('active');

    if (event.ctrlKey && event.altKey) {
      this.changeLang();
    } else if (!this.switchCapsOrShift(buttonObj.which)) {
      this.setNewValue(buttonObj);
    }
  }

  onKeyup(event) {
    const buttonObj = this.dataObj[event.code];
    buttonObj.html.classList.remove('active');

    this.switchCapsOrShift(buttonObj.which);
  }

  setNewValue(buttonData) {
    if (this.systemsButton.includes(buttonData.which)) return;
    const textValue = this.$textarea.value;
    const cursorPosition = this.$textarea.selectionStart;
    const leftText = textValue.slice(0, cursorPosition);
    const rightText = textValue.slice(cursorPosition);

    if (buttonData.which === 8) {
      if (leftText === '') return;
      this.updateTextInTtextarea(leftText.slice(0, -1) + rightText, cursorPosition - 1);
      return;
    }

    if (buttonData.which === 46) {
      if (rightText === '') return;
      this.updateTextInTtextarea(leftText + rightText.slice(1), cursorPosition);
      return;
    }

    if (buttonData.which === 9) {
      this.updateTextInTtextarea(`${leftText}    ${rightText}`, cursorPosition + 4);
      return;
    }

    if (buttonData.which === 13) {
      this.updateTextInTtextarea(`${leftText}\n${rightText}`, cursorPosition + 1);
      return;
    }

    if (buttonData.which === 32) {
      this.updateTextInTtextarea(`${leftText} ${rightText}`, cursorPosition + 1);
      return;
    }

    let newSymbol;

    if (this.shiftOn) {
      newSymbol = buttonData.secondValue ? buttonData.secondValue[this.lang]
        : (buttonData.firstValue[this.lang]).toUpperCase();
    } else {
      newSymbol = (buttonData.firstValue[this.lang]).toLowerCase();
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
      return true;
    } if (code === 20) {
      this.capsLockOn = !this.capsLockOn;
      return true;
    }

    return false;
  }
}
