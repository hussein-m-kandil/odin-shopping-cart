import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Products from './Products';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';

const items = [
  {
    product: {
      id: 1,
      title: 'No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest.',
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
      title: 'No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest.',
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
      id: 3,
      title: 'No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    quantity: 0,
  },
];

const updateCartMock = vi.fn();

function RoutedProducts() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <Outlet context={{ updateCart: updateCartMock }} />,
          children: [
            {
              index: true,
              element: <Products items={items} />,
            },
          ],
        },
      ])}
    />
  );
}

describe('Products', () => {
  it('renders the give products', () => {
    render(<RoutedProducts />);
    const { title, price, description, category } = items[0].product;
    const len = items.length;
    expect(screen.getAllByText(title)).toHaveLength(len);
    expect(screen.getAllByText(new RegExp(price))).toHaveLength(len);
    expect(screen.getAllByText(new RegExp(description))).toHaveLength(len);
    expect(screen.getAllByText(new RegExp(category))).toHaveLength(len);
    expect(screen.getAllByAltText(title)).toHaveLength(len);
  });
});
