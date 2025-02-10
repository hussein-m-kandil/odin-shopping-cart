import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getAllCategories } from '../../services/shop';
import Categories from './Categories';

const categoriesRespMock = vi.fn(() => ({ data: ['dogs', 'cats'] }));

vi.mock('../../services/shop', () => {
  return {
    getAllCategories: vi.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(categoriesRespMock()), 0),
        ),
    ),
  };
});

afterAll(() => vi.resetAllMocks());

function RoutedCategories() {
  return (
    <RouterProvider
      router={createBrowserRouter([{ path: '/', element: <Categories /> }])}
    />
  );
}

describe('Categories', () => {
  it('has loader on initial render', () => {
    render(<RoutedCategories />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it('renders the given Categories', async () => {
    const categories = categoriesRespMock().data;
    render(<RoutedCategories />);
    expect(
      await screen.findByRole('link', { name: categories[0] }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: categories[1] }),
    ).toBeInTheDocument();
  });

  it('renders a failure message on reject', async () => {
    getAllCategories.mockImplementationOnce(() => {
      return new Promise((_, reject) =>
        setTimeout(() => reject('Test Error'), 0),
      );
    });
    render(<RoutedCategories />);
    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
  });

  it('renders a no-categories message on error', async () => {
    categoriesRespMock.mockImplementationOnce(() => ({ error: 'Test Error' }));
    render(<RoutedCategories />);
    expect(await screen.findByText(/no categories/i)).toBeInTheDocument();
  });

  it('renders a no-categories message on empty categories', async () => {
    categoriesRespMock.mockImplementationOnce(() => ({ data: [] }));
    render(<RoutedCategories />);
    expect(await screen.findByText(/no categories/i)).toBeInTheDocument();
  });
});
