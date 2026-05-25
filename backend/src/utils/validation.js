const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (value) => isNonEmptyString(value) && EMAIL_REGEX.test(value.trim());

const isValidPassword = (value) => typeof value === 'string' && value.length >= 8;

const isAllowedRole = (value) => ['admin', 'librarian', 'member'].includes(value);

const validateAuthPayload = ({ name, email, password }) => {
  if (!isNonEmptyString(name)) {
    throw new Error('El nombre es obligatorio');
  }

  if (!isValidEmail(email)) {
    throw new Error('El email debe ser válido');
  }

  if (!isValidPassword(password)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }
};

const validateUserPayload = ({ name, email, password, role }) => {
  validateAuthPayload({ name, email, password });

  if (!isAllowedRole(role)) {
    throw new Error('El rol debe ser admin, librarian o member');
  }
};

const validateBookPayload = ({ title, author, totalCopies }) => {
  if (!isNonEmptyString(title)) {
    throw new Error('El título es obligatorio');
  }

  if (!isNonEmptyString(author)) {
    throw new Error('El autor es obligatorio');
  }

  if (totalCopies === undefined || totalCopies === null || Number(totalCopies) < 1) {
    throw new Error('Debe indicar al menos una copia');
  }
};

const validateArticlePayload = ({ title, author }) => {
  if (!isNonEmptyString(title)) {
    throw new Error('El título es obligatorio');
  }

  if (!isNonEmptyString(author)) {
    throw new Error('El autor es obligatorio');
  }
};

module.exports = {
  validateAuthPayload,
  validateUserPayload,
  validateBookPayload,
  validateArticlePayload
};
