import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { CATEGORY_PATH } from '../../App';
import PropTypes from 'prop-types';

const products = [
  {
    id: 1,
    title: 'Fja No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
      rate: 3.9,
      count: 120,
    },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket.',
    category: "men's clothing",
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: {
      rate: 4.1,
      count: 259,
    },
  },
];

const curriedResponse = (responseBody) => {
  return () =>
    new Promise((resolve) => setTimeout(() => resolve(responseBody), 0));
};

vi.mock('../../services/shop.js', () => {
  return {
    getAllProducts: vi.fn(curriedResponse({ data: products })),
    getCategory: vi.fn(curriedResponse({ data: products })),
  };
});

const updateCartMock = vi.fn();
const cartMock = vi.fn(() => []);

function AppMock() {
  return (
    <Outlet
      context={{ wishlist: [], cart: cartMock(), updateCart: updateCartMock }}
    />
  );
}

afterEach(() => vi.resetAllMocks());

const { getAllProducts, getCategory } = await import('../../services/shop');
const { default: Home } = await import('./Home');

function RoutedHome({
  routerOptions = {
    initialEntries: ['/'],
    initialIndex: 0,
  },
}) {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: '/',
            element: <AppMock />,
            children: [
              { path: '', element: <Home /> },
              { path: `${CATEGORY_PATH}/:category`, element: <Home /> },
            ],
          },
        ],
        routerOptions,
      )}
    />
  );
}

RoutedHome.propTypes = {
  routerOptions: PropTypes.shape({
    initialEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number,
  }),
};

const categoryRouterOptions = {
  initialEntries: [`${CATEGORY_PATH}/${products[0].category}`],
  initialIndex: 0,
};

describe('Home page', () => {
  it('has the all-categories title', () => {
    render(<RoutedHome />);
    expect(document.title).toMatch(/home/i);
  });

  it('has the category title', () => {
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(document.title).toMatch(new RegExp(products[0].category, 'i'));
  });

  it('has the all-categories headline', () => {
    const name = /all categories/i;
    render(<RoutedHome />);
    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
  });

  it('has the category name as a headline', () => {
    const name = new RegExp(products[0].category, 'i');
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
  });

  it('has a loader on start', async () => {
    render(<RoutedHome />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    expect(screen.queryByLabelText(/loading/i)).toBeNull();
  });

  it('renders all categories products', async () => {
    render(<RoutedHome />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    for (const prod of products) {
      expect(screen.getByText(prod.title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(prod.price))).toBeInTheDocument();
      expect(screen.getByAltText(prod.title)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(prod.description)),
      ).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(products.length);
  });

  it('renders a single category with multiple products', async () => {
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    for (const prod of products) {
      expect(screen.getByText(prod.title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(prod.price))).toBeInTheDocument();
      expect(screen.getByAltText(prod.title)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(prod.description)),
      ).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(products.length);
  });

  it('renders a single category with a single product', async () => {
    const product = products[0];
    getCategory.mockImplementationOnce(curriedResponse({ data: [product] }));
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price))).toBeInTheDocument();
    expect(screen.getByAltText(product.title)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(product.description)),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(1);
  });

  it('matches the cart state while rendering all categories', async () => {
    const quantity = 7;
    const product = products[0];
    cartMock.mockImplementationOnce(() => [{ product, quantity }]);
    render(<RoutedHome />);
    expect(await screen.findByDisplayValue(`${quantity}`)).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(products.length - 1);
  });

  it('matches the cart state while rendering a single category', async () => {
    const quantity = 7;
    const product = products[0];
    cartMock.mockImplementationOnce(() => [{ product, quantity }]);
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(await screen.findByDisplayValue(`${quantity}`)).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(products.length - 1);
  });

  it('apologizes if an error occurred while fetching all categories products', async () => {
    const error = { message: 'Fetch error!' };
    getAllProducts.mockImplementationOnce(curriedResponse({ error }));
    render(<RoutedHome />);
    expect(await screen.findByText(/sorry/i)).toBeInTheDocument();
  });

  it('apologizes if an error occurred while fetching single category products', async () => {
    const error = { message: 'Fetch error!' };
    getCategory.mockImplementationOnce(curriedResponse({ error }));
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(await screen.findByText(/sorry/i)).toBeInTheDocument();
  });

  it('informs that there are no products on receiving zero all categories products', async () => {
    getAllProducts.mockImplementationOnce(curriedResponse({ data: [] }));
    render(<RoutedHome />);
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it('informs that there are no products on receiving zero category products', async () => {
    getCategory.mockImplementationOnce(curriedResponse({ data: [] }));
    render(<RoutedHome routerOptions={categoryRouterOptions} />);
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });
});
