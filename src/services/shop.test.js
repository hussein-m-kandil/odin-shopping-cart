import { afterEach, describe, expect, it, vi } from 'vitest';
import * as shopService from './shop';
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

const BASE_URL = shopService.BASE_URL;

describe('Shop Service', () => {
  it('uses valid base url', () => {
    expect(BASE_URL).toBeDefined();
  });

  it('uses valid endpoints', () => {
    expect(shopService.ALL_PRODUCTS).toBeDefined();
    expect(shopService.ALL_CATEGORIES).toBeDefined();
    expect(shopService.CATEGORY).toBeDefined();
  });

  it('has a `get` function that calls Axios `get` method with the correct arguments', async () => {
    const END_POINT = '/endpoint';
    const url = `${BASE_URL}${END_POINT}`;
    await expect(shopService.get(END_POINT)).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(url);
  });

  it('has a `getAllProducts` function that calls Axios `get` method with correct URL', async () => {
    const END_POINT = shopService.ALL_PRODUCTS;
    await expect(shopService.getAllProducts()).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}${END_POINT}`);
  });

  it('has a `getAllCategories` function that calls Axios `get` method with correct URL', async () => {
    const END_POINT = shopService.ALL_CATEGORIES;
    await expect(shopService.getAllCategories()).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}${END_POINT}`);
  });

  it('has a `getCategory` function that calls Axios `get` method with the given category', async () => {
    const END_POINT = shopService.CATEGORY;
    const CATEGORY = 'cat';
    await expect(shopService.getCategory(CATEGORY)).resolves.not.toThrowError();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${BASE_URL}${END_POINT}/${CATEGORY}`,
    );
  });
});
