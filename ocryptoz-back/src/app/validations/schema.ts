const Joi = require('joi');

// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
const regexPassword =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';
const regexEmail =
  '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$';


  /**
 * USER
 */

// Schema for the creating user form
const userSchema = Joi.object().keys({
    firstname: Joi.string().required().error(new Error('First name is required')),
    lastname: Joi.string().required().error(new Error('Last name is required')),
    email: Joi.string()
      .pattern(new RegExp(regexEmail))
      .required()
      .error(new Error('Email is required')),
  
    password: Joi.string()
      .pattern(new RegExp(regexPassword))
      .required()
      .error(new Error('Password expectation: minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')),
  
    passwordConfirmation: Joi.string()
      .required()
      .error(new Error('Password confirmation is required')),
  
    country: Joi.string().required().error(new Error('Country is required')),
  });

  export default userSchema