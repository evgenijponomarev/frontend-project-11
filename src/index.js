import 'bootstrap/dist/css/bootstrap.min.css';

import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';

import validateFeedUrl from './validateFeedUrl';
import text from './text';
import parseRss from './parseRss';
import { FORM_STATE } from './constants';
import createRenderer from './renderer';

const formEl = document.querySelector('.rss-form');
const inputEl = formEl.querySelector('#url-input');
const feedbackEl = document.querySelector('.feedback');
const feedsEl = document.querySelector('.feeds');
const feedsListEl = feedsEl.querySelector('.list-group');
const postsEl = document.querySelector('.posts');
const postsListEl = postsEl.querySelector('.list-group');

const {
  renderFeeds,
  renderPosts,
  renderForm,
  renderMessage,
} = createRenderer({
  inputEl,
  feedbackEl,
  feedsEl,
  feedsListEl,
  postsEl,
  postsListEl,
});

const defaultState = {
  form: FORM_STATE.empty,
  message: '',
  feeds: [],
  posts: [],
};

const state = onChange(defaultState, function (path) {
  switch (path) {
    case 'form':
      renderForm(this.form);
      break;
    case 'message':
      renderMessage(this.message);
      break;
    case 'feeds':
      renderFeeds(this.feeds);
      break;
    case 'posts':
      renderPosts(this.posts);
      break;
    default:
  }
});

const loadFeed = (url) => {
  const rssUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

  axios.get(rssUrl)
    .then((response) => {
      try {
        const { title, description, posts } = parseRss(response.data);
        state.form = FORM_STATE.success;
        state.message = i18next.t('successMessage');
        state.feeds.push({ title, description, url });
        state.posts = posts.concat(state.posts);
      } catch (error) {
        state.form = FORM_STATE.error;
        state.message = i18next.t('parseError');
      }
    })
    .catch(() => {
      state.form = FORM_STATE.error;
      state.message = i18next.t('networkError');
    });
};

const onSubmit = (event) => {
  event.preventDefault();

  state.form = FORM_STATE.sending;

  const newFeedUrl = inputEl.value;

  validateFeedUrl(newFeedUrl, state.feeds.map((f) => f.url))
    .then(() => loadFeed(newFeedUrl))
    .catch((error) => {
      state.form = FORM_STATE.error;
      state.message = error.message;
    });
};

const onInput = () => {
  state.form = FORM_STATE.typing;
};

const startApp = () => {
  formEl.addEventListener('submit', onSubmit);
  inputEl.addEventListener('input', onInput);
};

i18next.init({
  lng: 'ru',
  debug: process.env.NODE_ENV !== 'production',
  resources: text,
}).then(startApp);
