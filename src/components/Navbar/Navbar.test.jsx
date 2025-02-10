import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function RoutedNavbar(props) {
  return (
    <RouterProvider
      router={createMemoryRouter([
        { path: '/', element: <Navbar {...props} /> },
      ])}
    />
  );
}

const APP_NAME = import.meta.env.VITE_APP_NAME;

describe('Navbar content', () => {
  it('contains heading with the app name', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('heading', { name: APP_NAME })).toBeInTheDocument();
  });

  it('contains the given number of cart items if less than 100', () => {
    const props = { cartLength: 3 };
    render(<RoutedNavbar {...props} />);
    expect(screen.getByText(props.cartLength)).toBeInTheDocument();
  });

  it('contains truncated version of the given number of cart items if not integer', () => {
    const props = { cartLength: 3.234 };
    render(<RoutedNavbar {...props} />);
    expect(screen.getByText(props.cartLength.toFixed(0))).toBeInTheDocument();
  });

  it('contains +99 if the given number of cart items is more than 99', () => {
    render(<RoutedNavbar cartLength={100} />);
    expect(screen.getByText('+99')).toBeInTheDocument();
  });

  it('contains at least one nav menu', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('contains at least one nav items', () => {
    render(<RoutedNavbar />);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('contains nav link to sign-in page for an unauthenticated user', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('contains nav link to profile page for an authenticated user', () => {
    render(<RoutedNavbar authData={{ name: 'H' }} />);
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
  });
});
