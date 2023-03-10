import sortBy from 'lodash/sortBy';
import Modal from 'bootstrap/js/dist/modal';
import i18next from 'i18next';

import { FORM_STATE } from './constants';

const createRenderer = () => {
  const formEl = document.querySelector('.rss-form');
  const inputEl = formEl.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');
  const feedsEl = document.querySelector('.feeds');
  const postsEl = document.querySelector('.posts');
  const modalEl = document.querySelector('#modal');
  const feedsListEl = feedsEl.querySelector('.list-group');
  const postsListEl = postsEl.querySelector('.list-group');
  const modalTitleEl = modalEl.querySelector('.modal-title');
  const modalBodyEl = modalEl.querySelector('.modal-body');
  const fullArticleEl = modalEl.querySelector('.full-article');

  const modal = new Modal(modalEl);

  const createListItem = (classList = []) => {
    const el = document.createElement('li');
    el.classList.add('list-group-item');
    el.classList.add('border-0');
    el.classList.add('border-end-0');
    classList.forEach((c) => el.classList.add(c));

    return el;
  };

  const createPost = (post, markAsRead) => {
    const postLink = document.createElement('a');
    postLink.classList.add(post.isRead ? 'fw-normal' : 'fw-bold');
    postLink.setAttribute('href', post.link);
    postLink.textContent = post.title;

    const postButton = document.createElement('button');
    postButton.classList.add('btn');
    postButton.classList.add('btn-sm');
    postButton.classList.add('btn-outline-primary');
    postButton.textContent = i18next.t('buttonText');

    postButton.addEventListener('click', () => {
      modalTitleEl.textContent = post.title;
      modalBodyEl.innerHTML = post.description;
      fullArticleEl.setAttribute('href', post.link);
      markAsRead(post.link);
      modal.show();
    });

    const postEl = createListItem(['d-flex', 'justify-content-between', 'align-items-start']);

    postEl.appendChild(postLink);
    postEl.appendChild(postButton);

    return postEl;
  };

  const createFeed = (feed) => {
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6');
    feedTitle.classList.add('m-0');
    feedTitle.textContent = feed.title;

    const feedDescriptionEl = document.createElement('p');
    feedDescriptionEl.classList.add('m-0');
    feedDescriptionEl.classList.add('small');
    feedDescriptionEl.classList.add('text-black-50');
    feedDescriptionEl.textContent = feed.description;

    const feedEl = createListItem();

    feedEl.appendChild(feedTitle);
    feedEl.appendChild(feedDescriptionEl);

    return feedEl;
  };

  const renderForm = (form) => {
    switch (form) {
      case FORM_STATE.empty:
        inputEl.classList.remove('is-invalid');
        inputEl.removeAttribute('disabled');
        inputEl.value = '';
        inputEl.focus();
        break;

      case FORM_STATE.typing:
        inputEl.classList.remove('is-invalid');
        inputEl.removeAttribute('disabled');
        inputEl.focus();
        break;

      case FORM_STATE.sending:
        inputEl.classList.remove('is-invalid');
        inputEl.setAttribute('disabled', true);
        break;

      case FORM_STATE.error:
        inputEl.classList.add('is-invalid');
        feedbackEl.classList.add('text-danger');
        feedbackEl.classList.remove('text-success');
        inputEl.removeAttribute('disabled');
        inputEl.focus();
        break;

      case FORM_STATE.success:
        inputEl.classList.remove('is-invalid');
        feedbackEl.classList.remove('text-danger');
        feedbackEl.classList.add('text-success');
        inputEl.removeAttribute('disabled');
        inputEl.value = '';
        inputEl.focus();
        break;

      default:
    }
  };

  const renderMessage = (message) => {
    feedbackEl.textContent = message;
  };

  const renderFeeds = (feeds) => {
    feedsListEl.innerHTML = '';

    if (feeds.length === 0) {
      feedsEl.classList.add('d-none');
    } else {
      feeds.forEach((feed) => {
        const feedEl = createFeed(feed);
        feedsListEl.appendChild(feedEl);
      });

      feedsEl.classList.remove('d-none');
    }
  };

  const renderPosts = (posts, markAsRead) => {
    postsListEl.innerHTML = '';

    if (posts.length === 0) {
      postsEl.classList.add('d-none');
    } else {
      sortBy(posts, ({ timestamp }) => -timestamp)
        .forEach((post) => {
          const postEl = createPost(post, markAsRead);
          postsListEl.appendChild(postEl);
        });

      postsEl.classList.remove('d-none');
    }
  };

  return {
    renderForm,
    renderMessage,
    renderFeeds,
    renderPosts,
    formEl,
    inputEl,
  };
};

export default createRenderer;
