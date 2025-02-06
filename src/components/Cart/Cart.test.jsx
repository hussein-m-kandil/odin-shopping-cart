import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';

const cartMock = vi.fn(() => [
  {
    product: {
      id: 1,
      title: 'Fja No. 1 Backpack, Fits 15 Laptops',
      price: 109.75,
      description: 'Your perfect pack for everyday use and walks.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    quantity: 5,
  },
  {
    product: {
      id: 2,
      title: 'Mens Casual Premium Slim Fit T-Shirts',
      price: 40.25,
      description:
        'Slim-fitting style, long sleeve, three-button henley placket.',
      category: "men's clothing",
      image:
        'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    quantity: 3,
  },
]);

const updateCartMock = vi.fn();

afterEach(() => vi.resetAllMocks());

function AppMock() {
  return <Outlet context={{ cart: cartMock(), updateCart: updateCartMock }} />;
}

function RoutedCart() {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: '/',
            element: <AppMock />,
            children: [{ path: 'cart', element: <Cart /> }],
          },
        ],
        { initialEntries: ['/cart'], initialIndex: 0 },
      )}
    />
  );
}

describe('Cart', () => {
  it('renders a wishlist heading', () => {
    render(<RoutedCart />);
    expect(screen.getByRole('heading', { name: /cart/i })).toBeInTheDocument();
  });

  it('renders empty wishlist message if that is true', () => {
    cartMock.mockImplementationOnce(() => []);
    render(<RoutedCart />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
  });

  it('renders all products in the cart', () => {
    const cart = cartMock();
    render(<RoutedCart />);
    for (const { product, quantity } of cart) {
      expect(screen.getByText(product.title)).toBeInTheDocument();
      expect(screen.getByAltText(product.title)).toBeInTheDocument();
      expect(screen.getAllByDisplayValue(quantity).length).toBeGreaterThan(0);
      expect(
        screen.getAllByText(new RegExp(product.price * quantity)).length,
      ).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/increment/i)).toHaveLength(cart.length);
      expect(screen.getAllByLabelText(/decrement/i)).toHaveLength(cart.length);
    }
  });

  it('renders the total cost rounded to fixed 2 decimal points', () => {
    const cart = cartMock();
    const totalCost = cart
      .reduce((total, { product, quantity }) => {
        return total + product.price * quantity;
      }, 0)
      .toFixed(2);
    render(<RoutedCart />);
    expect(screen.getByText(new RegExp(`${totalCost}`))).toBeInTheDocument();
  });

  it('renders checkout button', () => {
    render(<RoutedCart />);
    expect(
      screen.getByRole('button', { name: /checkout/i }),
    ).toBeInTheDocument();
  });
});
