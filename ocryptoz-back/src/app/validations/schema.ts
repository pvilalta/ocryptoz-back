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
export const userSchema = Joi.object().keys({
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

  /**
   * EVENT
   */


  export const eventSchema = Joi.object()
  .keys({
    type: Joi.string()
      .required()
      .pattern(new RegExp('(insert)|(buy)|(sell)|(transfer)|(reward)'))
      .error(new Error('This type does not exist')),

    date: Joi.date()
      .required()
      .max('now')
      .error(new Error('Date does not fit the expected format')),

    platform_sending: Joi.when('type', {
      is: 'buy',
      then: Joi.string().max(20).required().error(new Error('From has to be declared'))
    }),

    platform_receiving: Joi.string()
      .required()
      .max(20)
      .error(new Error('To has to be declared')),

    currency_asset: Joi.string()
      .required()
      .max(20)
      .error(new Error('Asset has to be declared')),

    quantity: Joi.number()
      .required()
      .min(0.000000000000001)
      .error(new Error('Quantity does not fit the expected format')),

    currency_counterparty: Joi.when('type', {
      is: 'buy',
      then: Joi.string().max(20).required().error(new Error('Purchase currency has to be declared'))
    }),
  
    total_amount: Joi.number()
      .min(0.000000000000001)
      .allow('')
      .error(new Error('Total amount does not fit the expected format')),

    unit_price: Joi.number()
      .min(0.000000000000001)
      .allow('')
      .error(new Error('Unit price does not fit the expected format')),


    fees_currency: Joi.string()
      .max(20)
      .error(new Error('Fees currency has to be declared')),

    fees: Joi.when('fees_currency', {
      is: Joi.string(),
      then: Joi.number().min(0.000000000000001)
      .allow('')
      .error(new Error('Fees does not fit the expected format')),
    }),

  })
  .unknown(true);
