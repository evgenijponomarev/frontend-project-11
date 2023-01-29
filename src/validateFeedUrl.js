import { string } from 'yup';

const urlValidator = string().url().required();

const validateFeedUrl = (value, feeds) => (
  urlValidator.validate(value)
    .then(() => {
      const alreadyAdded = feeds.includes(value);

      return {
        isValid: !alreadyAdded,
        errorMessage: alreadyAdded ? 'RSS уже существует' : '',
      };
    })
    .catch(() => ({
      isValid: false,
      errorMessage: 'Ссылка должна быть валидным URL',
    }))
);

export default validateFeedUrl;
