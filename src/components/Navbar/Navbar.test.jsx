import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, getByRole } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar.jsx';
import PropTypes from 'prop-types';
import { SIGNIN_PATH, SIGNUP_PATH } from '../../App.jsx';

/**
 * Asynchronous function that changes the screen's width,
 * and fires 'resize' event on the window object.
 *
 * @param {number} width - The new screen width. Defaults to 300
 * @returns {function} - Asynchronous screen width resetter
 */
async function changeScreenWidth(width = 480) {
  const initScreenWidth = window.innerWidth;
  window.innerWidth = width;
  await fireEvent(window, new Event('resize'));
  return async () => await changeScreenWidth(initScreenWidth);
}

function RoutedNavbar({
  routerOptions = {
    initialEntries: ['/'],
    initialIndex: 0,
  },
  ...props
}) {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [{ path: '*', element: <Navbar {...props} /> }],
        routerOptions,
      )}
    />
  );
}

RoutedNavbar.propTypes = {
  routerOptions: PropTypes.shape({
    initialEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number.isRequired,
  }),
};

const APP_NAME = import.meta.env.VITE_APP_NAME;

describe('Navbar content', () => {
  it('contains heading with the app name', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('heading', { name: APP_NAME })).toBeInTheDocument();
  });

  it('contains the given number of cart items if less than 100', () => {
    const props = { cartItemsCount: 3 };
    render(<RoutedNavbar {...props} />);
    expect(screen.getByText(props.cartItemsCount)).toBeInTheDocument();
  });

  it('contains truncated version of the given number of cart items if not integer', () => {
    const props = { cartItemsCount: 3.234 };
    render(<RoutedNavbar {...props} />);
    expect(
      screen.getByText(props.cartItemsCount.toFixed(0)),
    ).toBeInTheDocument();
  });

  it('contains +99 if the given number of cart items is more than 99', () => {
    render(<RoutedNavbar cartItemsCount={100} />);
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

  it('does not contain the toggler on a wide screen', () => {
    render(<RoutedNavbar />);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
  });

  it('contains the toggler in place of the nav menu/links on a narrow screen', async () => {
    const resetScreenWidth = await changeScreenWidth();
    render(<RoutedNavbar />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    expect(
      screen.queryByRole('button', {
        name: 'Toggle navigation menu',
      }),
    ).toBeInTheDocument();
    await resetScreenWidth();
  });

  it('contain the toggler dynamically based on screen width', async () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
    const resetScreenWidth = await changeScreenWidth();
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeInTheDocument();
    await resetScreenWidth();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
  });

  it('Does not contain routes need authentication on unauthenticated render', () => {
    render(<RoutedNavbar authenticated={false} />);
    expect(screen.queryByRole('link', { name: 'Sign out' })).toBeNull();
  });

  it('contains only the "Sign up" link on unauthenticated render under "/signin"', () => {
    render(
      <RoutedNavbar
        authenticated={false}
        routerOptions={{ initialEntries: [SIGNIN_PATH] }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
  });

  it('contains only the "Sign in" link on unauthenticated render under "/signup"', () => {
    render(
      <RoutedNavbar
        authenticated={false}
        routerOptions={{ initialEntries: [SIGNUP_PATH] }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign up' })).toBeNull();
  });

  it('contains the appropriate nav items for an authenticated user', () => {
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Sign up' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Sign out' })).toBeInTheDocument();
  });
});

describe('Navbar menu toggler', () => {
  it('toggles the nav menu', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar />);
    const toggler = screen.queryByRole('button', {
      name: 'Toggle navigation menu',
    });
    expect(toggler.ariaExpanded).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    await user.click(toggler);
    expect(toggler.ariaExpanded).toBe('true');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(toggler.getAttribute('aria-controls')).toBe(
      screen.getByRole('list').id,
    );
    await user.click(toggler);
    expect(toggler.ariaExpanded).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    await resetScreenWidth();
  });
});

describe('Navbar menu on a small screen', () => {
  it('removed when a nav link is clicked', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('list')).toBeNull();
    const toggler = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    });
    // Click on first nav link (based on the navbar structure for an authenticated user)
    await user.click(toggler);
    expect(screen.getByRole('list')).toBeInTheDocument();
    const navItems = screen.getAllByRole('listitem');
    await user.click(getByRole(navItems[0], 'link'));
    expect(screen.queryByRole('list')).toBeNull();
    await resetScreenWidth();
  });

  it('removed on a click outside the navbar', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('list')).toBeNull();
    const toggler = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    });
    await user.click(toggler);
    expect(screen.getByRole('list')).toBeInTheDocument();
    await user.click(window.document.body);
    expect(screen.queryByRole('list')).toBeNull();
    await resetScreenWidth();
  });
});
