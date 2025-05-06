import { sendRequest } from './helpers';

export const BASE_URL = import.meta.env.PROD
  ? 'https://potential-cordelia-kanux-c7ca4294.koyeb.app/api/v1'
  : 'http://127.0.0.1:8080/api/v1';

export const SIGN_UP_ENDPOINT = '/users';
export const DELETE_USER_ENDPOINT = '/users';
export const SIGN_IN_ENDPOINT = '/auth/signin';
export const TOKEN_VERIFICATION_ENDPOINT = '/auth/verify';

export function postSignup(formData) {
  const END_POINT = SIGN_UP_ENDPOINT;
  const url = `${BASE_URL}${END_POINT}`;
  const options = { headers: { 'Content-Type': 'application/json' } };
  return sendRequest('post', url, formData, options);
}

export function postSignin(formData) {
  const END_POINT = SIGN_IN_ENDPOINT;
  const url = `${BASE_URL}${END_POINT}`;
  const options = { headers: { 'Content-Type': 'application/json' } };
  return sendRequest('post', url, formData, options);
}

export function getSigninValidation(userToken) {
  const END_POINT = TOKEN_VERIFICATION_ENDPOINT;
  const options = { headers: { Authorization: userToken } };
  const url = `${BASE_URL}${END_POINT}`;
  return sendRequest('get', url, options);
}

export function deleteUser(id, userToken) {
  const END_POINT = DELETE_USER_ENDPOINT;
  const url = `${BASE_URL}${END_POINT}/${id}`;
  const options = { headers: { Authorization: userToken } };
  return sendRequest('delete', url, options);
}
