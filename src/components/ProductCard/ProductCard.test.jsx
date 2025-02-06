import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';

const itemMock = vi.fn(() => {
  return {
    product: {
      id: 1,
      title: 'No. 1 Backpack, Fits 15 Laptops',
      price: 109.9,
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
  };
});

const updateCartMock = vi.fn();

afterEach(() => vi.resetAllMocks());

function RoutedProductCard() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <Outlet context={{ updateCart: updateCartMock }} />,
          children: [
            {
              index: true,
              element: <ProductCard item={itemMock()} />,
            },
          ],
        },
      ])}
    />
  );
}

describe('ProductCart', () => {
  it('has the given details', () => {
    render(<RoutedProductCard />);
    const { title, price, category, description } = itemMock().product;
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(price.toFixed(2)))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(category))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(description))).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: title })[0]).toBeInTheDocument();
  });

  it('has the given quantity', () => {
    const quantity = 3;
    const originalItemMock = itemMock();
    itemMock.mockImplementationOnce(() => ({ ...originalItemMock, quantity }));
    render(<RoutedProductCard />);
    expect(screen.getByDisplayValue(quantity)).toBeInTheDocument();
  });

  it('has add-to-cart button', () => {
    render(<RoutedProductCard />);
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
});

describe('Add-to-Cart button', () => {
  it('gets replaced by a quantity counter on click', async () => {
    const user = userEvent.setup();
    render(<RoutedProductCard />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.queryByRole('button', { name: /add to cart/i })).toBeNull();
    const quantityInput = screen.getByRole('textbox', { name: /quantity/i });
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveValue('1');
  });

  it('changes the quantity into 1 and calls the cart updater on click', async () => {
    const user = userEvent.setup();
    render(<RoutedProductCard />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(updateCartMock).toHaveBeenCalledTimes(1);
    expect(updateCartMock).toHaveBeenCalledWith(itemMock().product, 1);
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
});

describe('Quantity counter', () => {
  it('does not accept number higher than the JavaScript max safe integer', async () => {
    const user = userEvent.setup();
    render(<RoutedProductCard />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    await user.clear(screen.getByRole('textbox', { name: /quantity/i }));
    const quantityInput = screen.getByRole('textbox', { name: /quantity/i });
    await user.type(quantityInput, `${Number.MAX_SAFE_INTEGER}1`, {
      initialSelectionStart: 0,
      initialSelectionEnd: quantityInput.value.length,
    });
    expect(screen.getByRole('textbox', { name: /quantity/i })).toHaveValue(
      `${Number.MAX_SAFE_INTEGER}`,
    );
  });

  it('calls the given add-to-cart handler with the given details and the quantity number', async () => {
    const { product } = itemMock();
    const user = userEvent.setup();
    render(<RoutedProductCard />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(updateCartMock).toHaveBeenCalledTimes(2);
    expect(updateCartMock).toHaveBeenCalledWith(product, 2);
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price * 2))).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(updateCartMock).toHaveBeenCalledTimes(3);
    expect(updateCartMock).toHaveBeenCalledWith(product, 1);
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price))).toBeInTheDocument();
    const quantityInput = screen.getByRole('textbox', { name: /quantity/i });
    await user.type(quantityInput, '3', {
      initialSelectionStart: 0,
      initialSelectionEnd: quantityInput.value.length,
    });
    expect(updateCartMock).toHaveBeenCalledTimes(4);
    expect(updateCartMock).toHaveBeenCalledWith(product, 3);
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp((product.price * 3).toFixed(2))),
    ).toBeInTheDocument();
  });

  it('replaced with add-to-cart button when gets a value of 0', async () => {
    const user = userEvent.setup();
    render(<RoutedProductCard />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.queryByRole('button', { name: /add to cart/i })).toBeNull();
    const quantityInput = screen.getByRole('textbox', { name: /quantity/i });
    await user.type(quantityInput, '0', {
      initialSelectionStart: 0,
      initialSelectionEnd: quantityInput.value.length,
    });
    expect(screen.queryByRole('textbox', { name: /quantity/i })).toBeNull();
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.queryByRole('button', { name: /add to cart/i })).toBeNull();
    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.queryByRole('button', { name: /decrement/i })).toBeNull();
    expect(screen.queryByRole('textbox', { name: /quantity/i })).toBeNull();
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
});
