import { sendRequest } from './helpers';

const BASE_URL = import.meta.env.VITE_SHOP_BASE;

export function getAllProducts() {
  const END_POINT = import.meta.env.VITE_SHOP_ALL_PRODUCTS;
  const url = `${BASE_URL}${END_POINT}`;
  return sendRequest('get', url);
}
