import { redirect } from 'react-router-dom';
import { SIGNIN_PATH, SIGNUP_PATH } from '../../App';
import { postSignin, postSignup } from '../../services/auth';

export const ENTRIES_NAMES = {
  fullname: 'fullname',
  username: 'username',
  password: 'password',
  confirm: 'confirm',
};

export const fieldsValidations = {
  [ENTRIES_NAMES.fullname]: {
    regex: /^.{3,}$/,
    msg: 'Your name must contain more than 3 characters',
    example: 'Superman',
  },
  [ENTRIES_NAMES.username]: {
    regex: /^.{3,}$/,
    msg: 'Your username must contain more than 3 character',
    example: 'Clark Kent / Kal-El',
  },
  [ENTRIES_NAMES.password]: {
    regex: RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    ),
    msg: [
      'Password length must be 8 or more, contain at least: ',
      '1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    ].join(''),
    example: 'Ss@12312',
  },
};

const commonEntryData = { error: '' };
const commonEntryAttrs = {
  value: '',
  autoComplete: 'on',
  'aria-invalid': false,
};

export const signinEntriesData = {
  [ENTRIES_NAMES.username]: {
    ...commonEntryData,
    attrs: {
      ...commonEntryAttrs,
      type: 'text',
      label: 'Username',
    },
  },
  [ENTRIES_NAMES.password]: {
    ...commonEntryData,
    attrs: {
      ...commonEntryAttrs,
      role: 'textbox',
      type: 'password',
      label: 'Password',
    },
  },
};

export const signupEntriesData = {
  [ENTRIES_NAMES.fullname]: {
    ...commonEntryData,
    attrs: {
      ...commonEntryAttrs,
      type: 'text',
      label: 'Name',
    },
  },
  ...signinEntriesData,
  [ENTRIES_NAMES.confirm]: {
    ...commonEntryData,
    attrs: {
      ...commonEntryAttrs,
      role: 'textbox',
      type: 'password',
      label: 'Password Confirmation',
    },
  },
};

export function validateFormData(formData) {
  const errors = {};
  formData.entries().forEach(([name, value]) => {
    if (!value) {
      errors[name] = `${signupEntriesData[name].attrs.label} is required!`;
    } else if (name === ENTRIES_NAMES.confirm) {
      if (value !== formData.get(ENTRIES_NAMES.password)) {
        errors[name] = 'Password confirmation does not match!';
      }
    } else {
      if (!fieldsValidations[name].regex.test(value)) {
        errors[name] = fieldsValidations[name].msg;
      }
    }
  });
  if (Object.keys(errors).length) {
    return errors;
  }
}

export async function authFormAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  formData.delete('intent');
  const formErrors = validateFormData(formData);
  if (formErrors) return { formErrors };
  try {
    if (intent === SIGNUP_PATH || intent === SIGNIN_PATH) {
      const { data, error } = await (intent === SIGNUP_PATH
        ? postSignup(formData)
        : postSignin(formData));
      if (error) throw error;
      return { authData: data };
    } else {
      redirect(intent);
    }
  } catch (error) {
    return { submitError: error.message };
  }
}
