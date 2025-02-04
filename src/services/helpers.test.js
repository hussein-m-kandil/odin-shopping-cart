import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendRequest } from './helpers';
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
