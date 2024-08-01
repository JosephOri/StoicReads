import * as EmailValidator from 'email-validator';

const isEmailValidCheck = (email: string): boolean => {
  return EmailValidator.validate(email);
};

export default isEmailValidCheck;
