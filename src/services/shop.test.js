import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from './shop';
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

const BASE_URL = import.meta.env.VITE_SHOP_BASE;

describe('Shop Service', () => {
  it('uses valid base url', () => {
    expect(BASE_URL).toBeDefined();
  });

  it('uses valid endpoints', () => {
    expect(import.meta.env.VITE_SHOP_ALL_PRODUCTS).toBeDefined();
    expect(import.meta.env.VITE_SHOP_ALL_CATEGORIES).toBeDefined();
    expect(import.meta.env.VITE_SHOP_CATEGORY).toBeDefined();
  });

  it('has a `get` function that calls Axios `get` method with the correct arguments', async () => {
    const END_POINT = 'endpoint';
    const url = `${BASE_URL}${END_POINT}`;
    await expect(get(END_POINT)).resolves.not.toThrowError();
    expect(END_POINT).toBeDefined();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenLastCalledWith(url);
  });
});
