import 'bootstrap/dist/css/bootstrap.min.css';

import onChange from 'on-change';

import validateFeedUrl from './validateFeedUrl';
import i18nInit from './i18n';

const formEl = document.querySelector('.rss-form');
const inputEl = formEl.querySelector('#url-input');
const feedbackEl = document.querySelector('.feedback');

const defaultState = {
  feeds: [],
  input: {
    isValid: true,
    errorMessage: '',
  },
};

const state = onChange(defaultState, function () {
  const classListMethod = this.input.isValid ? 'remove' : 'add';
  inputEl.classList[classListMethod]('is-invalid');
  feedbackEl.textContent = this.input.errorMessage;
});

const onSubmit = (event) => {
  event.preventDefault();

  const newFeedUrl = inputEl.value;

  validateFeedUrl(newFeedUrl, state.feeds)
    .then(() => {
      state.input.isValid = true;
      state.input.errorMessage = '';
      state.feeds.push(newFeedUrl);
      inputEl.value = '';
    })
    .catch((error) => {
      state.input.isValid = false;
      state.input.errorMessage = error.message;
    })
    .then(() => inputEl.focus());
};

const startApp = () => {
  formEl.addEventListener('submit', onSubmit);
};

i18nInit(startApp);
