import { sendRequest } from './helpers';

const BASE_URL = import.meta.env.VITE_AUTH_BASE;

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
