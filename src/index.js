import './styles.css';
import './normalize.css';
import App from './App';

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

document.querySelector('[data-code="switchLang"]').addEventListener('click', () => {
  app.changeLang();
});
