import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Wishlist from './Wishlist';
import { render, screen } from '@testing-library/react';

const wishlistMock = vi.fn(() => [
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
    quantity: 0,
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

function RoutedWishlist() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <Outlet context={{ wishlist: wishlistMock() }} />,
          children: [{ index: true, element: <Wishlist /> }],
        },
      ])}
    />
  );
}

describe('Wishlist', () => {
  it('has a wishlist heading', () => {
    render(<RoutedWishlist />);
    expect(
      screen.getByRole('heading', { name: /wishlist/i }),
    ).toBeInTheDocument();
  });

  it('has the count of items', () => {
    const itemsCount = wishlistMock().length;
    render(<RoutedWishlist />);
    expect(
      screen.getByText(new RegExp(`${itemsCount}.*item`, 'i')),
    ).toBeInTheDocument();
  });

  it('has product cards that matches the cart state', () => {
    const wishlist = wishlistMock();
    render(<RoutedWishlist />);
    for (const { product, quantity } of wishlist) {
      expect(screen.getByText(new RegExp(product.title))).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(product.price * (quantity || 1))),
      ).toBeInTheDocument();
      if (quantity > 0) {
        expect(screen.getByDisplayValue(quantity)).toBeInTheDocument();
      } else {
        expect(
          screen.getByRole('button', { name: /add to cart/i }),
        ).toBeInTheDocument();
      }
    }
  });
});
