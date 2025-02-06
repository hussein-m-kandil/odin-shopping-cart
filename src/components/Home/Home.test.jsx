import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from './Home';
import { describe, expect, it, vi } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { getAllProducts } from '../../services/shop';

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

vi.mock('../../services/shop.js', () => {
  return {
    getAllProducts: vi.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: products }), 0),
        ),
    ),
  };
});

const updateCartMock = vi.fn();
const cartMock = vi.fn(() => []);

function AppMock() {
  return <Outlet context={{ cart: cartMock(), updateCart: updateCartMock }} />;
}

function RoutedHome() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <AppMock />,
          children: [{ path: '', element: <Home /> }],
        },
      ])}
    />
  );
}

describe('Home page', () => {
  it('has a loader on start', async () => {
    render(<RoutedHome />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    expect(screen.queryByLabelText(/loading/i)).toBeNull();
  });

  it('renders products', async () => {
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

  it('matches the cart state', async () => {
    const quantity = 7;
    const product = products[0];
    cartMock.mockImplementationOnce(() => [{ product, quantity }]);
    render(<RoutedHome />);
    expect(await screen.findByDisplayValue(`${quantity}`)).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(products.length - 1);
  });

  it('apologizes if an error occurred while fetching the products', async () => {
    const error = { message: 'Fetch error!' };
    getAllProducts.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ error }), 0)),
    );
    render(<RoutedHome />);
    expect(await screen.findByText(/sorry/i)).toBeInTheDocument();
  });

  it('informs that there are no products on receiving empty array', async () => {
    getAllProducts.mockImplementationOnce(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 0)),
    );
    render(<RoutedHome />);
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });
});
