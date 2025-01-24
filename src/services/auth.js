import axios from 'axios';

const BASE_URL = import.meta.env.VITE_AUTH_BASE;

export async function sendRequest(httpMethod, ...reqArgs) {
  if (!httpMethod || typeof httpMethod !== 'string') {
    throw new TypeError('Expect an HTTP method as 1st argument');
  } else if (reqArgs.length === 0) {
    throw new TypeError('Expect URL as 2nd argument');
  }

  const method = httpMethod.toLowerCase();

  if (
    method === 'post' &&
    (reqArgs.length === 1 || typeof reqArgs[1] !== 'object')
  ) {
    throw new TypeError(
      'Expect POST request body of type "object" as 3rd argument',
    );
  }

  try {
    return await axios[method](...reqArgs);
  } catch (error) {
    // https://axios-http.com/docs/handling_errors
    if (error.response) {
      // The status code falls out of the range of 2xx
      if (error.response.data && error.response.data.message) {
        return { error: error.response.data };
      }
      return { error: `${error.response.status}: Bad Request!` };
    }
    return {
      error: {
        message: error.request
          ? 'No response was received! Please try again later.'
          : 'Oops, something went wrong! Please try again later.',
      },
    };
  }
}

export function postSignup(formData) {
  const END_POINT = import.meta.env.VITE_AUTH_SIGN_UP;
  const url = `${BASE_URL}${END_POINT}`;
  const options = { headers: { 'Content-Type': 'application/json' } };
  return sendRequest('post', url, formData, options);
}

export function postSignin(formData) {
  const END_POINT = import.meta.env.VITE_AUTH_SIGN_IN;
  const url = `${BASE_URL}${END_POINT}`;
  const options = { headers: { 'Content-Type': 'application/json' } };
  return sendRequest('post', url, formData, options);
}

export function getSigninValidation(userToken) {
  const END_POINT = import.meta.env.VITE_AUTH_SIGN_IN_VALIDATION;
  const url = `${BASE_URL}${END_POINT}/${userToken}`;
  return sendRequest('get', url);
}

export function getSignout(userToken) {
  const END_POINT = import.meta.env.VITE_AUTH_SIGN_OUT;
  const url = `${BASE_URL}${END_POINT}`;
  const options = { headers: { 'user-token': userToken } };
  return sendRequest('get', url, options);
}

export function deleteUser(objectId) {
  const END_POINT = import.meta.env.VITE_AUTH_DELETE_USER;
  const url = `${BASE_URL}${END_POINT}/${objectId}`;
  return sendRequest('delete', url);
}
