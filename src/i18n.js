import i18next from 'i18next';

export default (onReady) => {
  i18next.init({
    lng: 'ru',
    debug: process.env.NODE_ENV !== 'production',
    resources: {
      ru: {
        translation: {
          validationErrorIsset: 'RSS уже существует',
          validationErrorUrl: 'Ссылка должна быть валидным URL',
        },
      },
    },
  }).then(onReady);
};
