import { sendRequest } from './helpers';

const BASE_URL = import.meta.env.VITE_SHOP_BASE;

export function get(endpoint) {
  return sendRequest('get', `${BASE_URL}${endpoint}`);
}

export function getAllProducts() {
  return get(import.meta.env.VITE_SHOP_ALL_PRODUCTS);
}

export function getAllCategories() {
  return get(import.meta.env.VITE_SHOP_ALL_CATEGORIES);
}

export function getCategory(category) {
  return get(`${import.meta.env.VITE_SHOP_CATEGORY}/${category}`);
}
