import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  postSignin,
  postSignup,
  deleteUser,
  getSigninValidation,
  TOKEN_VERIFICATION_ENDPOINT,
  DELETE_USER_ENDPOINT,
  SIGN_UP_ENDPOINT,
  SIGN_IN_ENDPOINT,
  BASE_URL,
} from './auth';
import axios from 'axios';

vi.mock('axios', () => {
  const axiosMock = {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };
  return { ...axiosMock, default: axiosMock };
});

afterEach(() => vi.resetAllMocks());

describe('postSignup', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const options = { headers: { 'Content-Type': 'application/json' } };
    const url = `${BASE_URL}${SIGN_UP_ENDPOINT}`;
    const body = new FormData();
    await expect(postSignup(body)).resolves.not.toThrowError();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(url, body, options);
  });
});

describe('postSignin', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const options = { headers: { 'Content-Type': 'application/json' } };
    const url = `${BASE_URL}${SIGN_IN_ENDPOINT}`;
    const body = new FormData();
    await expect(postSignin(body)).resolves.not.toThrowError();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(url, body, options);
  });
});

describe('getSigninValidation', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const TOKEN = '<token>';
    const url = `${BASE_URL}${TOKEN_VERIFICATION_ENDPOINT}`;
    const options = { headers: { Authorization: TOKEN } };
    await expect(getSigninValidation(TOKEN)).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenLastCalledWith(url, options);
  });
});

describe('deleteUser', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const TOKEN = '<token>';
    const ID = 'user-id';
    const url = `${BASE_URL}${DELETE_USER_ENDPOINT}/${ID}`;
    const options = { headers: { Authorization: TOKEN } };
    await expect(deleteUser(ID, TOKEN)).resolves.not.toThrowError();
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenLastCalledWith(url, options);
  });
});
