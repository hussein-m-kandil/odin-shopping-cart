import { sendRequest } from './helpers';

export const BASE_URL = 'https://fakestoreapi.com';
export const ALL_CATEGORIES = '/products/categories';
export const CATEGORY = '/products/category';
export const ALL_PRODUCTS = '/products';

export function get(endpoint) {
  return sendRequest('get', `${BASE_URL}${endpoint}`);
}

export function getAllProducts() {
  return get(ALL_PRODUCTS);
}

export function getAllCategories() {
  return get(ALL_CATEGORIES);
}

export function getCategory(category) {
  return get(`${CATEGORY}/${category}`);
}
