import { string } from 'yup';
import i18next from 'i18next';

const validateFeedUrl = (value, feeds) => (
  string()
    .test('uniq', i18next.t('validationErrorIsset'), function () {
      return !feeds.includes(value) || this.createError();
    })
    .url(i18next.t('validationErrorUrl'))
    .required()
    .validate(value)
);

export default validateFeedUrl;
