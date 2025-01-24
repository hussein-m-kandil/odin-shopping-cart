import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  postSignin,
  postSignup,
  getSignout,
  deleteUser,
  sendRequest,
  getSigninValidation,
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

const BASE_URL = import.meta.env.VITE_AUTH_BASE;

describe('sendRequest', () => {
  it('throws with invalid args', async () => {
    await expect(() => sendRequest()).rejects.toThrowError(/method/i);
    await expect(() => sendRequest(1)).rejects.toThrowError(/method/i);
    await expect(() => sendRequest('get')).rejects.toThrowError(/url/i);
    await expect(() => sendRequest('post', 'url')).rejects.toThrowError(
      /body/i,
    );
    await expect(sendRequest('post', 'url', {})).resolves.not.toThrowError();
    await expect(sendRequest('get', 'url')).resolves.not.toThrowError();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

describe('postSignup', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_AUTH_SIGN_UP;
    const options = { headers: { 'Content-Type': 'application/json' } };
    const url = `${BASE_URL}${END_POINT}`;
    const body = new FormData();
    await expect(postSignup(body)).resolves.not.toThrowError();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(url, body, options);
  });
});

describe('postSignin', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_AUTH_SIGN_IN;
    const options = { headers: { 'Content-Type': 'application/json' } };
    const url = `${BASE_URL}${END_POINT}`;
    const body = new FormData();
    await expect(postSignin(body)).resolves.not.toThrowError();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith(url, body, options);
  });
});

describe('getSigninValidation', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_AUTH_SIGN_IN_VALIDATION;
    const TOKEN = '<token>';
    const url = `${BASE_URL}${END_POINT}/${TOKEN}`;
    await expect(getSigninValidation(TOKEN)).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenLastCalledWith(url);
  });
});

describe('getSignout', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_AUTH_SIGN_OUT;
    const url = `${BASE_URL}${END_POINT}`;
    const TOKEN = '<token>';
    const options = { headers: { 'user-token': TOKEN } };
    await expect(getSignout(TOKEN)).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenLastCalledWith(url, options);
  });
});

describe('deleteUser', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_AUTH_DELETE_USER;
    const OBJECT_ID = 'objectId';
    const url = `${BASE_URL}${END_POINT}/${OBJECT_ID}`;
    await expect(deleteUser(OBJECT_ID)).resolves.not.toThrowError();
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenLastCalledWith(url);
  });
});
