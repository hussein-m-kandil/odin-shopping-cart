import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllProducts } from './shop';
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

describe('getAllProducts', () => {
  it('calls the correct Axios method with the correct arguments', async () => {
    const END_POINT = import.meta.env.VITE_SHOP_ALL_PRODUCTS;
    const url = `${BASE_URL}${END_POINT}`;
    await expect(getAllProducts()).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenLastCalledWith(url);
  });
});
